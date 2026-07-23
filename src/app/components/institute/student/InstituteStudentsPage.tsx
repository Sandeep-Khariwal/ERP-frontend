//    "use client";

// import {
//   Flex,
//   LoadingOverlay,
//   Select,
//   SimpleGrid,
//   Stack,
//   Text,
//   TextInput,
// } from "@mantine/core";
// import { IconSearch } from "@tabler/icons-react";
// import { useEffect, useState } from "react";
// import { useMediaQuery } from "@mantine/hooks";
// import { GetAllInstituteStudents } from "@/axios/student/StudentGetApi";
// import { GetInstituteBatches } from "@/axios/institute/instituteSlice";
// import { StudentCard } from "./Studentcard";
// import { ManageStudentBatchesModal } from "./ManageStudentBatchesModal";
// import { ErrorNotification } from "@/app/helperFunction/Notification";

// export interface StudentListItem {
//   _id: string;
//   name: string;
//   phoneNumber?: string[];
//   profilePic?: string;
//   rollNumber?: string;
//   batchId?: { _id: string; name: string } | string | null;
//   batchIds?: { _id: string; name: string }[];
// }

// export interface BatchOption {
//   id: string;
//   name: string;
// }

// export const InstituteStudentsPage = (props: { instituteId: string }) => {
//   const isMd = useMediaQuery(`(max-width: 968px)`);
//   const [isLoading, setIsLoading] = useState(false);
//   const [students, setStudents] = useState<StudentListItem[]>([]);
//   const [batches, setBatches] = useState<BatchOption[]>([]);
//   const [selectedBatchId, setSelectedBatchId] = useState<string>("");
//   const [search, setSearch] = useState<string>("");
//   const [selectedStudent, setSelectedStudent] =
//     useState<StudentListItem | null>(null);

//   const fetchBatches = () => {
//     GetInstituteBatches(props.instituteId)
//       .then((x: any) => {
//         const { batches } = x;
//         setBatches(
//           (batches || []).map((b: any) => ({ id: b._id, name: b.name })),
//         );
//       })
//       .catch((e) => console.log(e));
//   };

//   const fetchStudents = () => {
//     if (!props.instituteId) return;
//     setIsLoading(true);
//     // instituteId is resolved server-side from the logged-in user's token,
//     // so we only pass the batch filter + search term here.
//     GetAllInstituteStudents(selectedBatchId, search)
//       .then((x: any) => {
//         setStudents(x.students || []);
//         setIsLoading(false);
//       })
//       .catch((e) => {
//         console.log(e);
//         setIsLoading(false);
//         ErrorNotification("Failed to load students");
//       });
//   };

//   useEffect(() => {
//     if (props.instituteId) {
//       fetchBatches();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [props.instituteId]);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       fetchStudents();
//     }, 300);
//     return () => clearTimeout(timeout);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [props.instituteId, selectedBatchId, search]);

//   return (
//     <Stack w={"100%"} mih={"100%"} py={20} pos="relative">
//       <LoadingOverlay visible={isLoading} />

//       <Flex
//         w={isMd ? "95%" : "80%"}
//         mx={"auto"}
//         justify={"space-between"}
//         align={isMd ? "flex-start" : "center"}
//         direction={isMd ? "column" : "row"}
//         gap={15}
//       >
//         <Text
//           fz={22}
//           fw={700}
//           c={"#1B1212"}
//           style={{ fontFamily: "sans-serif" }}
//         >
//           All Students
//         </Text>

//         <Flex gap={15} wrap="wrap" w={isMd ? "100%" : "auto"}>
//           <Select
//             placeholder="Filter by batch"
//             data={[
//               { value: "", label: "All Batches" },
//               ...batches.map((b) => ({ value: b.id, label: b.name })),
//             ]}
//             value={selectedBatchId}
//             onChange={(val) => setSelectedBatchId(val || "")}
//             clearable
//             w={isMd ? "100%" : 220}
//             radius="xl"
//           />
//           <TextInput
//             placeholder="Search by name"
//             leftSection={<IconSearch size={16} />}
//             value={search}
//             onChange={(e) => setSearch(e.currentTarget.value)}
//             w={isMd ? "100%" : 260}
//             radius="xl"
//           />
//         </Flex>
//       </Flex>

//       <SimpleGrid
//         cols={isMd ? 1 : 3}
//         w={isMd ? "95%" : "80%"}
//         mx={"auto"}
//         spacing={20}
//         verticalSpacing={20}
//       >
//         {students.map((student) => (
//           <StudentCard
//             key={student._id}
//             student={student}
//             onManageBatches={() => setSelectedStudent(student)}
//           />
//         ))}
//       </SimpleGrid>

//       {!isLoading && students.length === 0 && (
//         <Text ta="center" c="dimmed" mt={20}>
//           No students found.
//         </Text>
//       )}

//       {selectedStudent && (
//         <ManageStudentBatchesModal
//           opened={!!selectedStudent}
//           student={selectedStudent}
//           allBatches={batches}
//           onClose={() => setSelectedStudent(null)}
//           onUpdated={() => {
//             fetchStudents();
//           }}
//         />
//       )}
//     </Stack>
//   );
// };

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
import { useEffect, useState } from "react";
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

export const InstituteStudentsPage = (props: { instituteId: string }) => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentListItem | null>(null);

  // pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0); // NEW: total students matching current filter (across all pages)
  const limit = 10;

  // multi-select for bulk batch assignment
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // NEW: true once the person clicks "Select all N students matching this filter"
  const [selectedAllMatchingFilter, setSelectedAllMatchingFilter] = useState(false);
  const [isSelectingAll, setIsSelectingAll] = useState(false); // NEW: loading state for that fetch
  const [bulkModalOpened, setBulkModalOpened] = useState(false);

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

  const fetchStudents = () => {
    if (!props.instituteId) return;
    setIsLoading(true);
    GetAllInstituteStudents(selectedBatchId, search, page, limit)
      .then((x: any) => {
        setStudents(x.students || []);
        setTotalPages(x.totalPages || 1);
        setTotal(x.total || 0); // NEW
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
        ErrorNotification("Failed to load students");
      });
  };

  useEffect(() => {
    if (props.instituteId) {
      fetchBatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.instituteId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.instituteId, selectedBatchId, search, page]);

  useEffect(() => {
    setPage(1);
    // NEW: changing filters invalidates any "select all matching filter" state
    setSelectedIds([]);
    setSelectedAllMatchingFilter(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBatchId, search]);

  const toggleSelect = (id: string) => {
    setSelectedAllMatchingFilter(false); // manual tweak breaks the "all matching" guarantee
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

  // NEW: fetch every student ID matching the current filter (all pages combined)
  // by requesting a single page with limit = total, then select them all.
  const selectAllMatchingFilter = () => {
    if (!props.instituteId || total === 0) return;
    setIsSelectingAll(true);
    GetAllInstituteStudents(selectedBatchId, search, 1, total)
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

      {/* NEW: "select all matching filter" banner — shows once every row on the
          current page is checked, and there are more matching students on
          other pages than are currently selected. */}
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
            Clear selection
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
            fetchStudents();
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
          fetchStudents();
        }}
      />
    </Stack>
  );
};