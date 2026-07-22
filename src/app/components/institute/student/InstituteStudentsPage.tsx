   "use client";

import {
  Flex,
  LoadingOverlay,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { GetAllInstituteStudents } from "@/axios/student/StudentGetApi";
import { GetInstituteBatches } from "@/axios/institute/instituteSlice";
import { StudentCard } from "./Studentcard";
import { ManageStudentBatchesModal } from "./ManageStudentBatchesModal";
import { ErrorNotification } from "@/app/helperFunction/Notification";

export interface StudentListItem {
  _id: string;
  name: string;
  phoneNumber?: string[];
  profilePic?: string;
  rollNumber?: string;
  batchId?: { _id: string; name: string } | string | null;
  batchIds?: { _id: string; name: string }[];
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
    // instituteId is resolved server-side from the logged-in user's token,
    // so we only pass the batch filter + search term here.
    GetAllInstituteStudents(selectedBatchId, search)
      .then((x: any) => {
        setStudents(x.students || []);
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
  }, [props.instituteId, selectedBatchId, search]);

  return (
    <Stack w={"100%"} mih={"100%"} py={20} pos="relative">
      <LoadingOverlay visible={isLoading} />

      <Flex
        w={isMd ? "95%" : "80%"}
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

      <SimpleGrid
        cols={isMd ? 1 : 3}
        w={isMd ? "95%" : "80%"}
        mx={"auto"}
        spacing={20}
        verticalSpacing={20}
      >
        {students.map((student) => (
          <StudentCard
            key={student._id}
            student={student}
            onManageBatches={() => setSelectedStudent(student)}
          />
        ))}
      </SimpleGrid>

      {!isLoading && students.length === 0 && (
        <Text ta="center" c="dimmed" mt={20}>
          No students found.
        </Text>
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
    </Stack>
  );
};