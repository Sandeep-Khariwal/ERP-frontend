import { GetInstituteSubjects } from "@/axios/institute/InstituteGetApi";
import { AddSubjects } from "@/axios/institute/InstitutePostApi";
import { DeleteSubject } from "@/axios/institute/InstitutePutApi";
import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
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
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState<
    {
      _id: string;
      value: string;
      label: string;
    }[]
  >([]);

  const [isEditing, setIsEditing] = useState(false); // editing krne ke liye
  const [selectedSubject, setSelectedSubject] = useState<{
    _id: string;
    value: string;
    label: string;
  }>({
    _id: "",
    value: "",
    label: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);

  const createSubjects = () => {
    if (!subjectInput) return;
    setIsLoading(true);
    AddSubjects({
      _id: isEditing ? selectedSubject._id : "",
      value: subjectInput,
      label: subjectInput,
      instituteId: institute._id,
    })
      .then((x: any) => {
        if (isEditing) {
          // subject with updated subject
          // update existing subject in state
          setSubjects((prev) =>
            prev.map((item) =>
              item._id === selectedSubject._id
                ? { ...item, value: subjectInput, label: subjectInput }
                : item,
            ),
          );
          setIsEditing(false);
          setSelectedSubject({ _id: "", value: "", label: "" });
        } else {
          //
          // push new subject into
          const newSubject = {
            _id: x._id || Math.random().toString(), // API se id aaye toh better
            value: subjectInput,
            label: subjectInput,
          };

          setSubjects((prev) => [...prev, newSubject]);
        }
        //   getSubjects()
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });

    setSubjectInput("");
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

  const getSubjects = () => {
    if (!Props.isOpen) return;
    setIsLoading(true);

    GetInstituteSubjects(institute._id)
      .then((x: any) => {
        // assuming res.data me array aa rha hai
        setSubjects(x.subjects || []);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
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
          <Stack mt={15} gap={8}>
            <Text fw={600}>Subjects List</Text>

            {subjects.map((sub, index) => {
              return (
                <Flex
                  key={index}
                  justify="space-between"
                  align="center"
                  p={8}
                  style={{
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                  }}
                >
                  <Text>{sub.value}</Text>

                  <Group gap={8}>
                    <FaEdit
                      size={18}
                      color="#87CEFA"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSubjectInput(sub.value);
                        setIsEditing(true);
                        setSelectedSubject(sub);
                      }}
                    />

                    <IoTrashOutline
                      size={18}
                      color="red"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        //    deleteSubject(sub._id);

                        setDeleteModalOpen(true);
                        setSubjectToDelete(sub._id);
                      }}
                    />
                  </Group>
                </Flex>
              );
            })}
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
