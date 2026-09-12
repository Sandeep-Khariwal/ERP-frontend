"use client";

import {
  Button,
  Flex,
  LoadingOverlay,
  Pagination,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { GetAllInstituteStudents } from "@/axios/student/StudentGetApi";
import { GetInstituteBatches } from "@/axios/institute/instituteSlice";
import { StudentTable } from "./StudentTable";
import { ManageStudentBatchesModal } from "./ManageStudentBatchesModal";
import { BulkManageStudentBatchModal } from "./BulkManageStudentBatchModal";
import { ErrorNotification } from "@/app/helperFunction/Notification";

export interface StudentListItem {
  _id: string;
  name: string;
  phoneNumber?: string[];
  profilePic?: string;
  rollNumber?: string;
  batchId?: { _id: string; name: string } | string | null;
  batchIds?: { _id: string; name: string }[];

  email?: string;
  address?: string;
  parentName?: string;
  parentNumber?: string;
  motherName?: string;
  gender?: string;
  dateOfBirth?: Date | string;
  dateOfJoining?: Date | string;
  admissionNumber?: string;
  enrollmentNo?: string;
  createdAt?: Date | string;
}

export interface BatchOption {
  id: string;
  name: string;
}

const PAGE_SIZE = 10;

export const InstituteStudentsPage = (props: { instituteId: string }) => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");

  // `search` is the raw input value bound to the TextInput (updates instantly
  // for a responsive UI). `debouncedSearch` is the value actually used to
  // trigger a fetch, 300ms after the user stops typing.
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [selectedStudent, setSelectedStudent] =
    useState<StudentListItem | null>(null);

  // pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // multi-select for bulk batch assignment
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedAllMatchingFilter, setSelectedAllMatchingFilter] = useState(false);
  const [isSelectingAll, setIsSelectingAll] = useState(false);
  const [bulkModalOpened, setBulkModalOpened] = useState(false);

  // Guards against the two classes of duplicate calls that existed before:
  // 1) `skipPageFetchRef` — when a filter/search change resets `page` to 1,
  //    that state change alone must NOT trigger a second fetch from the
  //    page-change effect (the filter effect already fetches with page=1).
  // 2) `isFirstPageRunRef` — on mount, every effect fires once; without this
  //    the page-change effect would fire its own initial fetch in addition
  //    to the one already made by the filter effect below.
  const skipPageFetchRef = useRef(false);
  const isFirstPageRunRef = useRef(true);

  // Tracks the most recently issued students request so that a slow, stale
  // response (e.g. from before the user finished typing) can never overwrite
  // the result of a newer request that resolved first — the classic race
  // condition with debounced search.
  const requestIdRef = useRef(0);

  const fetchBatches = () => {
    GetInstituteBatches(props.instituteId)
      .then((x: any) => {
        const { batches } = x;
        setBatches(
          (batches || []).map((b: any) => ({ id: b._id, name: b.name })),
        );
      })
      .catch((e) => console.log(e));
  };

  const fetchStudents = (
    pageArg: number,
    batchArg: string,
    searchArg: string,
  ) => {
    if (!props.instituteId) return;
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    GetAllInstituteStudents(batchArg, searchArg, pageArg, PAGE_SIZE)
      .then((x: any) => {
        if (requestId !== requestIdRef.current) return; // stale response, ignore
        setStudents(x.students || []);
        setTotalPages(x.totalPages || 1);
        setTotal(x.total || 0);
        setIsLoading(false);
      })
      .catch((e) => {
        if (requestId !== requestIdRef.current) return; // stale response, ignore
        console.log(e);
        setIsLoading(false);
        ErrorNotification("Failed to load students");
      });
  };

  // Fetch the batch list once we know the institute.
  useEffect(() => {
    if (props.instituteId) {
      fetchBatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.instituteId]);

  // Debounce raw search input -> debouncedSearch (300ms), as before.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // Single source of truth for "the filter changed": institute, batch, or
  // the debounced search term. Resets pagination/selection and fetches page
  // 1 directly — this is the ONLY place that reacts to a filter change, so
  // there is no second effect racing it to make the same call.
  useEffect(() => {
    if (!props.instituteId) return;

    setSelectedIds([]);
    setSelectedAllMatchingFilter(false);

    setPage((prevPage) => {
      if (prevPage !== 1) {
        // page is actually about to change, which will fire the page-change
        // effect below — tell it to skip, since we're fetching here already.
        skipPageFetchRef.current = true;
      }
      return 1;
    });

    fetchStudents(1, selectedBatchId, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.instituteId, selectedBatchId, debouncedSearch]);

  // Fires only for genuine pagination (page button clicks). Skips the very
  // first render (handled by the effect above) and skips whenever the page
  // change was caused by a filter reset rather than a user page click.
  useEffect(() => {
    if (isFirstPageRunRef.current) {
      isFirstPageRunRef.current = false;
      return;
    }
    if (skipPageFetchRef.current) {
      skipPageFetchRef.current = false;
      return;
    }
    if (!props.instituteId) return;

    fetchStudents(page, selectedBatchId, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const toggleSelect = (id: string) => {
    setSelectedAllMatchingFilter(false);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const allOnPageSelected =
    students.length > 0 && students.every((s) => selectedIds.includes(s._id));

  const toggleSelectAllOnPage = () => {
    setSelectedAllMatchingFilter(false);
    if (allOnPageSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !students.some((s) => s._id === id)),
      );
    } else {
      const idsOnPage = students.map((s) => s._id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...idsOnPage])));
    }
  };

  // Fetch every student ID matching the current filter (all pages combined)
  // by requesting a single page with limit = total, then select them all.
  // Guarded against being fired twice while already in flight.
  const selectAllMatchingFilter = () => {
    if (!props.instituteId || total === 0 || isSelectingAll) return;
    setIsSelectingAll(true);
    GetAllInstituteStudents(selectedBatchId, debouncedSearch, 1, total)
      .then((x: any) => {
        const allIds = (x.students || []).map((s: any) => s._id);
        setSelectedIds(allIds);
        setSelectedAllMatchingFilter(true);
        setIsSelectingAll(false);
      })
      .catch((e) => {
        console.log(e);
        setIsSelectingAll(false);
        ErrorNotification("Failed to select all students");
      });
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setSelectedAllMatchingFilter(false);
  };

  // Single refresh after a mutation — keeps the current page/filters instead
  // of resetting to page 1, and issues exactly one request.
  const refreshCurrentPage = () => {
    fetchStudents(page, selectedBatchId, debouncedSearch);
  };

  return (
    <Stack w={"100%"} mih={"100%"} py={20} pos="relative">
      <LoadingOverlay visible={isLoading} />

      <Flex
        w={isMd ? "95%" : "90%"}
        mx={"auto"}
        justify={"space-between"}
        align={isMd ? "flex-start" : "center"}
        direction={isMd ? "column" : "row"}
        gap={15}
      >
        <Text
          fz={22}
          fw={700}
          c={"#1B1212"}
          style={{ fontFamily: "sans-serif" }}
        >
          All Students
        </Text>

        <Flex gap={15} wrap="wrap" w={isMd ? "100%" : "auto"}>
          <Select
            placeholder="Filter by batch"
            data={[
              { value: "", label: "All Batches" },
              ...batches.map((b) => ({ value: b.id, label: b.name })),
            ]}
            value={selectedBatchId}
            onChange={(val) => setSelectedBatchId(val || "")}
            clearable
            w={isMd ? "100%" : 220}
            radius="xl"
          />
          <TextInput
            placeholder="Search by name"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={isMd ? "100%" : 260}
            radius="xl"
          />
        </Flex>
      </Flex>

      {allOnPageSelected && !selectedAllMatchingFilter && total > students.length && (
        <Flex
          w={isMd ? "95%" : "90%"}
          mx={"auto"}
          justify={"center"}
          align={"center"}
          gap={8}
          p={10}
          style={{ background: "#F3F0FF", borderRadius: 10 }}
        >
          <Text fz={13}>
            All {students.length} students on this page are selected.
          </Text>
          <Button
            variant="subtle"
            size="compact-sm"
            loading={isSelectingAll}
            onClick={selectAllMatchingFilter}
          >
            Select all {total} students matching current filter
          </Button>
        </Flex>
      )}

      {selectedAllMatchingFilter && (
        <Flex
          w={isMd ? "95%" : "90%"}
          mx={"auto"}
          justify={"center"}
          align={"center"}
          gap={8}
          p={10}
          style={{ background: "#F3F0FF", borderRadius: 10 }}
        >
          <Text fz={13} fw={600}>
            All {total} students matching the current filter are selected.
          </Text>
          <Button variant="subtle" size="compact-sm" onClick={clearSelection}>
            Clear selectio
          </Button>
        </Flex>
      )}

      {selectedIds.length > 0 && (
        <Flex w={isMd ? "95%" : "90%"} mx={"auto"} justify={"flex-end"} gap={10}>
          <Button variant="light" color="gray" radius="xl" onClick={clearSelection}>
            Clear ({selectedIds.length})
          </Button>
          <Button radius="xl" onClick={() => setBulkModalOpened(true)}>
            Manage Batch ({selectedIds.length} selected)
          </Button>
        </Flex>
      )}

      <Stack w={isMd ? "95%" : "90%"} mx={"auto"}>
        <StudentTable
          students={students}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAllOnPage}
          onManageBatch={(student) => setSelectedStudent(student)}
        />
      </Stack>

      {totalPages > 1 && (
        <Flex justify="center" mt={10}>
          <Pagination value={page} onChange={setPage} total={totalPages} />
        </Flex>
      )}

      {selectedStudent && (
        <ManageStudentBatchesModal
          opened={!!selectedStudent}
          student={selectedStudent}
          allBatches={batches}
          onClose={() => setSelectedStudent(null)}
          onUpdated={() => {
            refreshCurrentPage();
          }}
        />
      )}

      <BulkManageStudentBatchModal
        opened={bulkModalOpened}
        selectedStudentIds={selectedIds}
        allBatches={batches}
        onClose={() => setBulkModalOpened(false)}
        onCompleted={() => {
          clearSelection();
          refreshCurrentPage();
        }}
      />
    </Stack>
  );
};