"use client";

import { GetAllTeachersFromBatch } from "@/axios/institute/InstituteGetApi";
import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Menu,
  Modal,
  MultiSelect,
  Pagination,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconDotsVertical, IconMessage } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import {
  containsOnlyDigits,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import { GetAllSubjectsFromBatch } from "@/axios/batch/BatchGetApi";
import {
  DeleteTeacher,
  RemoveTeacherFromBatch,
  UpdateTeacher,
} from "@/axios/teacher/TeacherPutApi";
import Image from "next/image";
import { Notifications } from "@mantine/notifications";
import { FaUserCircle } from "react-icons/fa";
import { UserType } from "../../dashboard/InstituteBatchesSection";

// ---- Types --------------------------------------------------------

interface SubjectRef {
  _id: string;
  name: string;
  batchId: string;
}

interface TeacherRow {
  _id: string;
  name: string;
phoneNumber: string;
  subjects: SubjectRef[];
  isInActive?: boolean;
}

interface FullTeacher {
  _id: string;
  name: string;
  phoneNumber: string;
  instituteBatches: string[];
  subjects: SubjectRef[];
}

interface TeachersApiResponse {
  teachers: TeacherRow[];
  // ASSUMPTION: mirrors GetAllStudentsFromBatch's pagination shape.
  // Confirm against the actual backend contract — see accompanying notes.
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalTeachers: number;
    limit: number;
  };
}

interface SubjectOption {
  _id: string;
  name: string;
}

interface TeachersSectionProps {
  batchId?: string;
  batchName?: string;
  isTeacherDashboard?: boolean;
  fromInstituteTeacherSection?: boolean;
  teachers?: TeacherRow[];
  userType: UserType;
  setOriginalArrayOfTeachers?: React.Dispatch<React.SetStateAction<FullTeacher[]>>;
  setTeachersInDashboard?: React.Dispatch<React.SetStateAction<FullTeacher[]>>;
  setSelectTeacherId?: React.Dispatch<React.SetStateAction<string>>;
}

const PAGE_SIZE = 10;

const TeachersSection = (props: TeachersSectionProps) => {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [editTeacher, setEditTeacher] = useState<boolean>(false);
  const [editTeacherId, setEditTeacherId] = useState<{
    _id: string;
    name: string;
    phoneNumber: string;
    subjects: SubjectRef[];
  }>({ _id: "", name: "", phoneNumber: "", subjects: [] });

  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  // Pagination state (required)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalTeachers, setTotalTeachers] = useState<number>(0);

  // Bumped after a mutation that needs the current page re-verified
  // against the server (e.g. remove), without duplicating fetch logic.
  const [refreshToken, setRefreshToken] = useState<number>(0);

  const prevBatchIdRef = useRef<string>("");
  const lastRequestKeyRef = useRef<string>("");

  // Dashboard mode: parent is the source of truth, this just mirrors it
  // into local display state. Distinct from batch-fetch mode below —
  // do not merge these effects.
  useEffect(() => {
    if (props.isTeacherDashboard) {
      setTeachers(props.teachers || []);
    }
  }, [props.teachers, props.isTeacherDashboard]);

  // Batch mode: fetch teachers + subjects for the given batch/page.
  useEffect(() => {
    if (!props.batchId) return;

    const isNewBatch = prevBatchIdRef.current !== props.batchId;
    const pageToFetch = isNewBatch ? 1 : currentPage;
    prevBatchIdRef.current = props.batchId;

    if (isNewBatch && currentPage !== 1) {
      setCurrentPage(1); // will retrigger this effect; guarded below
    }

    const requestKey = `${props.batchId}:${pageToFetch}:${refreshToken}`;
    if (lastRequestKeyRef.current === requestKey) return;
    lastRequestKeyRef.current = requestKey;

    let isCurrent = true;
    setIsLoading(true);

    Promise.all([
      // ASSUMPTION: accepts (batchId, page, limit) like GetAllStudentsFromBatch.
      // If the real signature differs, drop the extra args here and see
      // Section H for the backend change needed to support this.
      (GetAllTeachersFromBatch as any)(props.batchId, pageToFetch, PAGE_SIZE),
      GetAllSubjectsFromBatch(props.batchId || ""),
    ])
      .then(([teacherRes, subjectRes]) => {
        if (!isCurrent) return; // stale batch/page response — ignore

        const data = teacherRes as TeachersApiResponse;
        const rawTeachers = data?.teachers ?? [];
        const pagination = data?.pagination;

        if (pagination) {
          setCurrentPage(pagination.currentPage);
          setTotalPages(pagination.totalPages);
          setTotalTeachers(pagination.totalTeachers);
        } else {
          // Backend hasn't returned pagination metadata yet — surface
          // what we can without fabricating totals.
          setTotalPages(1);
          setTotalTeachers(rawTeachers.length);
        }

        setTeachers(rawTeachers);

        const subjectData = (subjectRes as any)?.subjects?.subjects ?? [];
        setSubjects(subjectData);
      })
      .catch((e) => {
        if (isCurrent) console.log(e);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.batchId, currentPage, refreshToken]);

  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [deletingTeacherId, setDeletingTeacherId] = useState<string>("");

  const removeTeacherFromBatch = () => {
    setIsLoading(true);
    RemoveTeacherFromBatch(deletingTeacherId, props.batchId || "")
      .then(() => {
        SuccessNotification("Teacher removed from batch");
        setShowWarning(false);

        setTeachers((prev) => {
          const updated = prev.filter((s) => s._id !== deletingTeacherId);

          if (updated.length === 0 && currentPage > 1) {
            setCurrentPage((p) => p - 1); // triggers refetch of previous page
          } else {
            setRefreshToken((t) => t + 1); // re-verify totals from server
          }

          return updated;
        });
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        // isLoading is also cleared by the fetch effect once its
        // follow-up request completes; this covers the failure path.
        setIsLoading(false);
      });
  };

  const deleteTeacher = () => {
    setIsLoading(true);
    DeleteTeacher(deletingTeacherId)
      .then(() => {
        props.setOriginalArrayOfTeachers?.((prev) =>
          prev.filter((teach) => teach._id !== deletingTeacherId),
        );
        props.setTeachersInDashboard?.((prev) =>
          prev.filter((teach) => teach._id !== deletingTeacherId),
        );
        setTeachers((prev) => prev.filter((s) => s._id !== deletingTeacherId));
        SuccessNotification("Teacher deleted!");
        setShowWarning(false);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const editTeacherData = () => {
    setIsLoading(true);
    UpdateTeacher(editTeacherId._id, {
      name: editTeacherId.name,
      phoneNumber: editTeacherId.phoneNumber,
      subjects: selectedSubjectIds,
    })
      .then(() => {
        SuccessNotification("Teacher updated!");

        // Patch the row locally instead of refetching the whole list.
       setTeachers((prev) =>
  prev.map((t) =>
    t._id === editTeacherId._id
      ? {
          ...t,
          name: editTeacherId.name,
          phoneNumber: editTeacherId.phoneNumber,
          subjects: t.subjects.map((s) =>
            selectedSubjectIds.includes(s._id)
              ? s
              : s.batchId === props.batchId
                ? { ...s, batchId: "" }
                : s,
          ),
        }
      : t,
  ),
);

        setEditTeacher(false);
      })
      .catch((e) => {
        console.log(e);
        setEditTeacher(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Stack mah={"70vh"} style={{ overflowY: "scroll" }}>
      <Notifications />
      <LoadingOverlay visible={isLoading} />
      <Table mt={8} verticalSpacing="md" horizontalSpacing="xl" bg={"white"} fz={18}>
        <Table.Thead
          bg={"linear-gradient(135deg, #D28BD9, #7585D8)"}
          style={{ position: "sticky", top: 0 }}
        >
          <Table.Tr>
            <Table.Th style={{ fontFamily: "Roboto", fontWeight: 700, color: "#2F4F4F", fontSize: 18 }}>
              Name
            </Table.Th>
            <Table.Th style={{ fontFamily: "Roboto", fontWeight: 600, color: "#2F4F4F", fontSize: 18 }}>
              Phone Number
            </Table.Th>
            <Table.Th style={{ fontFamily: "Roboto", fontWeight: 600, color: "#2F4F4F", fontSize: 18 }}>
              Message
            </Table.Th>
            {props.userType === UserType.OTHERS && (
              <Table.Th style={{ fontFamily: "Roboto", fontWeight: 600, color: "#2F4F4F", fontSize: 18 }}>
                Action
              </Table.Th>
            )}
          </Table.Tr>
        </Table.Thead>
        <tbody>
          {teachers.map((item) => {
            const rowColor = item.isInActive ? "#bebebe" : "#7D7D7D";
            return (
              <Table.Tr
                key={item._id}
                style={{ textAlign: "center", fontFamily: "Nunito", padding: "1rem" }}
              >
                <Table.Td style={{ color: rowColor, fontWeight: 500, padding: "1rem" }} ta={"start"}>
                  {item.name}
                </Table.Td>
                <Table.Td style={{ color: rowColor, fontWeight: 500 }} ta={"start"}>
                  {item.phoneNumber[0]}
                </Table.Td>
                <Table.Td ta={"start"}>
                  <a href={`sms:${item.phoneNumber[0]}?body=Hello!, `}>
                    <div>
                      <IconMessage cursor="pointer" color="#7D7D7D" />
                    </div>
                  </a>
                </Table.Td>
                {props.userType === UserType.OTHERS && (
                  <Table.Td style={{ cursor: "pointer" }}>
                    <Menu>
                      <Menu.Target>
                        <Flex align={"center"} justify={"center"} w={"2rem"} py={3} bg="#FFFFFF">
                          <IconDotsVertical />
                        </Flex>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {!props.fromInstituteTeacherSection && (
                          <Menu.Item
                            onClick={() => {
                              props.setSelectTeacherId?.(item._id);
                            }}
                          >
                            <Flex align={"center"} gap={10}>
                              <FaUserCircle size={20} />
                              <Text>View Profile</Text>
                            </Flex>
                          </Menu.Item>
                        )}
                        <Menu.Item
                          onClick={() => {
                            setShowWarning(true);
                            setDeletingTeacherId(item._id);
                          }}
                        >
                          <Flex align="center">
                            <Box mr={2}>
                              <Image src={"/deleteImg.png"} alt="profile" width={20} height={20} />
                            </Box>
                            <Text ml={10} style={{ fontFamily: "Roboto" }}>
                              Remove Teacher
                            </Text>
                          </Flex>
                        </Menu.Item>
                        {props.batchId && (
                          <Menu.Item
                            onClick={() => {
                              setEditTeacher(true);
                              setEditTeacherId({
                                _id: item._id,
                                name: item.name,
                                phoneNumber: item.phoneNumber[0] ?? "",
                                subjects: item.subjects,
                              });
                              const alreadyBatchAssigned = item.subjects.filter(
                                (s) => s.batchId === props.batchId,
                              );
                              setSelectedSubjectIds(alreadyBatchAssigned.map((s) => s._id));
                            }}
                          >
                            <Flex align="center">
                              <Box mr={2}>
                                <Image src={"/editImg.png"} alt="profile" width={20} height={20} />
                              </Box>
                              <Text ml={10} style={{ fontFamily: "Roboto" }}>
                                Edit Teacher
                              </Text>
                            </Flex>
                          </Menu.Item>
                        )}
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                )}
              </Table.Tr>
            );
          })}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Flex justify="center" align="center" mt={20} gap={10}>
          <Text fz={14} c="#7D7D7D">
            Showing {teachers.length} of {totalTeachers} teachers
          </Text>
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
            color="violet"
            size="sm"
          />
        </Flex>
      )}

      <Modal
        centered
        title="Warning"
        style={{ fontFamily: "sans-serif" }}
        opened={showWarning}
        onClose={() => setShowWarning(false)}
      >
        <Text>
          Are you sure you want to{" "}
          {props.isTeacherDashboard ? "delete this teacher" : `remove this teacher from ${props.batchName}`}?
        </Text>
        <Flex w={"100%"} align={"center"} justify={"end"} gap={10} pt={20}>
          <Button variant="outline" onClick={() => setShowWarning(false)}>
            Cancel
          </Button>
          <Button
            variant="filled"
            bg={"red"}
            onClick={props.isTeacherDashboard ? deleteTeacher : removeTeacherFromBatch}
          >
            Yes
          </Button>
        </Flex>
      </Modal>

      <Modal
        centered
        title="Edit Teacher"
        style={{ fontFamily: "sans-serif" }}
        opened={editTeacher}
        onClose={() => setEditTeacher(false)}
      >
        <TextInput
          placeholder="Name"
          title="Name"
          label="Name"
          value={editTeacherId.name}
          onChange={(e) => setEditTeacherId({ ...editTeacherId, name: e.target.value })}
          required
          mt={10}
        />
        <TextInput
          title="Phone Number"
          label="Phone Number"
          placeholder="Enter Phone Number"
          maxLength={10}
          mt={10}
          value={editTeacherId.phoneNumber}
          onChange={(e) => {
            if (containsOnlyDigits(e.currentTarget.value)) {
              setEditTeacherId({ ...editTeacherId, phoneNumber: e.target.value });
            }
          }}
          required
        />
        <MultiSelect
          data={subjects.map((subject) => ({ label: subject.name, value: subject._id }))}
          mt={10}
          value={selectedSubjectIds || []}
          onChange={(value: string[]) => setSelectedSubjectIds(value)}
          placeholder="Select Subjects"
          label="Select Subjects"
        />
        <Button mt={10} variant="outline" onClick={editTeacherData}>
          Submit
        </Button>
      </Modal>
    </Stack>
  );
};

export default TeachersSection;