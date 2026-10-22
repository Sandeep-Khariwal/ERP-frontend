import { GetInstituteSubjects } from "@/axios/institute/InstituteGetApi";
import { AddSubjects } from "@/axios/institute/InstitutePostApi";
import { DeleteSubject } from "@/axios/institute/InstitutePutApi";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

export function AddInstituteSubjects(Props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const institute = useSelector(
    (state: any) => state.instituteSlice.instituteDetails,
  );
  type SubjectType = "scholastic" | "co-scholastic";

const [subjectType, setSubjectType] =
  useState<SubjectType>("scholastic");
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState<
    {
      _id: string;
      value: string;
      label: string;
       type: SubjectType;
    }[]
  >([]);

  const [isEditing, setIsEditing] = useState(false); // editing krne ke liye
  const [selectedSubject, setSelectedSubject] = useState<{
    _id: string;
    value: string;
    label: string;
      type: SubjectType;
  }>({
    _id: "",
    value: "",
    label: "",
      type: "scholastic",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);

  
  const createSubjects = async () => {
  const trimmedSubject = subjectInput.trim();

  if (!trimmedSubject) {
    return;
  }

  if (!institute?._id) {
    console.error("Institute ID is missing");
    return;
  }

  setIsLoading(true);

  try {
    const response: any = await AddSubjects({
      _id: isEditing ? selectedSubject._id : "",
      value: trimmedSubject,
      label: trimmedSubject,
      instituteId: institute._id,

      // Backend mein subject type save karne ke liye
      type: subjectType,
    } as any);

    const result = response?.data ?? response;

    if (isEditing) {
      setSubjects((prev) =>
        prev.map((item) =>
          item._id === selectedSubject._id
            ? {
                ...item,
                value: trimmedSubject,
                label: trimmedSubject,
                type: subjectType,
              }
            : item,
        ),
      );

      setIsEditing(false);

      setSelectedSubject({
        _id: "",
        value: "",
        label: "",
        type: "scholastic",
      });
    } else {
      const newSubject = {
        _id: result?._id ?? result?.subject?._id,
        value: trimmedSubject,
        label: trimmedSubject,
        type: subjectType,
      };

      // API response mein ID honi chahiye
      if (newSubject._id) {
        setSubjects((prev) => [...prev, newSubject]);
      } else {
        await getSubjects();
      }
    }

    setSubjectInput("");
    setSubjectType("scholastic");
  } catch (error) {
    console.error("Failed to save subject:", error);
  } finally {
    setIsLoading(false);
  }
};
  //delete api function
  const deleteSubject = (id: string) => {
    setIsLoading(true);

    DeleteSubject(id)
      .then(() => {
        // UI se subject remove kar do
        setSubjects((prev) => prev.filter((item) => item._id !== id));
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getSubjects();
  }, [Props.isOpen]);

  // const getSubjects = () => {
  //   if (!Props.isOpen) return;
  //   setIsLoading(true);

  //   GetInstituteSubjects()
  //     .then((x: any) => {
  //       // assuming res.data me array aa rha hai
  //       setSubjects(x.subjects || []);
  //       setIsLoading(false);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //       setIsLoading(false);
  //     });
  // };

  const getSubjects = async () => {
  if (!Props.isOpen) return;

  setIsLoading(true);

  try {
    const response: any = await GetInstituteSubjects();
    const result = response?.data ?? response;

    setSubjects(
      (result?.subjects ?? []).map((sub: any) => ({
        ...sub,
        type:
          sub.type === "co-scholastic"
            ? "co-scholastic"
            : "scholastic",
      })),
    );
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <Modal
        opened={Props.isOpen}
        onClose={() => Props.onClose()}
        
        title={
          <Text fz={20} fw={700}>
            Add Subject
          </Text>
        }
        centered
      >
        <Stack>
          <LoadingOverlay visible={isLoading} />
          <Flex gap={10} align="end">
            <TextInput
              label="Enter Subject"
              placeholder="Enter subject name"
              value={subjectInput}
              required
              onChange={(e) => setSubjectInput(e.target.value)}
              style={{ flex: 1 }}
            />
             <Select
    label="Subject Type"
    placeholder="Select type"
    value={subjectType}
    onChange={(value) => {
      if (value) {
        setSubjectType(value as SubjectType);
      }
    }}
    data={[
      {
        value: "scholastic",
        label: "Scholastic",
      },
      {
        value: "co-scholastic",
        label: "Co-Scholastic",
      },
    ]}
    allowDeselect={false}
    w={170}
    required
  />
            {!isEditing && (
              <Button
                size="sm"
                mb={0}
                onClick={() => createSubjects()}
                style={{
                  borderRadius: "20px",

                  cursor: "pointer",
                }}
              >
                Add
              </Button>
            )}
            {isEditing && (
              <Button size="sm" color="green" onClick={() => createSubjects()}>
                Save
              </Button>
            )}
          </Flex>
        
          <Stack mt={20} gap={12}>
  <Group justify="space-between">
    <Box>
      <Text fw={700} fz="md">
        Subjects List
      </Text>
      <Text size="xs" c="dimmed">
        Manage your institute subjects
      </Text>
    </Box>

    <Badge variant="light" color="gray" size="lg">
      {subjects.length} Subjects
    </Badge>
  </Group>

  <Divider />

  {subjects.map((sub) => (
    <Paper
      key={sub._id}
      p="sm"
      radius="md"
      withBorder
      shadow="xs"
    >
      <Flex justify="space-between" align="center" gap="sm">
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Text fw={600} size="sm" truncate>
            {sub.value}
          </Text>

          <Badge
            variant="light"
            color={
              sub.type === "co-scholastic" ? "teal" : "blue"
            }
            size="sm"
            radius="sm"
            style={{ alignSelf: "flex-start" }}
          >
            {sub.type === "co-scholastic"
              ? "Co-Scholastic"
              : "Scholastic"}
          </Badge>
        </Stack>

        <Group gap={12} wrap="nowrap">
          <Button
            variant="subtle"
            color="blue"
            size="compact-sm"
            aria-label={`Edit ${sub.value}`}
            onClick={() => {
              setSubjectInput(sub.value);
              setSubjectType(sub.type ?? "scholastic");
              setIsEditing(true);
              setSelectedSubject(sub);
            }}
          >
            <FaEdit size={17} />
          </Button>

          <Button
            variant="subtle"
            color="red"
            size="compact-sm"
            aria-label={`Delete ${sub.value}`}
            onClick={() => {
              setDeleteModalOpen(true);
              setSubjectToDelete(sub._id);
            }}
          >
            <IoTrashOutline size={17} />
          </Button>
        </Group>
      </Flex>
    </Paper>
  ))}

  {subjects.length === 0 && !isLoading && (
    <Text c="dimmed" ta="center" py="xl" size="sm">
      No subjects added yet.
    </Text>
  )}
</Stack>
        </Stack>
      </Modal>
      <Modal
        opened={deleteModalOpen}
        withCloseButton={false}
        onClose={() => setDeleteModalOpen(false)}
        title={
          <Text fz={20} fw={700}>
            Remove Subject
          </Text>
        }
        centered
      >
        <Stack>
          <Text>Are you sure you want to delete this subject?</Text>

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDeleteModalOpen(false)}>
              No
            </Button>

            <Button
              color="red"
              onClick={() => {
                if (subjectToDelete) {
                  deleteSubject(subjectToDelete);
                }
                setDeleteModalOpen(false);
                setSubjectToDelete(null);
              }}
            >
              Yes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
