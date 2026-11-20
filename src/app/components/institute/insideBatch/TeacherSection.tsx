"use client";

import {
  GetAllStudentsFromBatch,
  GetAllTeachersFromBatch,
} from "@/axios/institute/InstituteGetApi";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Menu,
  Modal,
  MultiSelect,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconDotsVertical, IconMessage, IconChalkboard, IconUserCircle, IconUserMinus, IconEdit } from "@tabler/icons-react";
import React, { useEffect, useMemo, useState } from "react";
import { RemoveStudentFromBatch } from "@/axios/student/StudentDeleteApi";
import {
  containsOnlyDigits,
  SuccessNotification,
  ErrorNotification,
} from "@/app/helperFunction/Notification";
import { GetAllSubjectsFromBatch } from "@/axios/batch/BatchGetApi";
import {
  DeleteTeacher,
  RemoveTeacherFromBatch,
  UpdateTeacher,
} from "@/axios/teacher/TeacherPutApi";
import Image from "next/image";
import { GetAllTeacherStaff } from "@/axios/teacher/TeacherGetApi";
import { Notifications } from "@mantine/notifications";
import { FaUserCircle } from "react-icons/fa";
import { UserType } from "../../dashboard/InstituteBatchesSection";
import { TeacherData } from "@/interfaces/batchInterface";
import { subjectBadge } from "../../dashboard/subjectColorMap";

const ROWS_PER_PAGE = 6;

const TeachersSection = (props: {
  batchId?: string;
  batchName?: string;
  isTeacherDashboard?: boolean;
  fromInstituteTeacherSection?: boolean;
  teachers?: {
    _id: string;
    name: string;
    phoneNumber: string;
    subjects: { _id: string; name: string; batchId: string }[];
  }[];
  userType: UserType;
  setOriginalArrayOfTeachers?: React.Dispatch<
    React.SetStateAction<
      {
        _id: string;
        name: string;
        phoneNumber: string;
        instituteBatches: string[];
        subjects: { _id: string; name: string; batchId: string }[];
      }[]
    >
  >;
  setTeachersInDashboard?: React.Dispatch<
    React.SetStateAction<
      {
        _id: string;
        name: string;
        phoneNumber: string;
        instituteBatches: string[];
        subjects: { _id: string; name: string; batchId: string }[];
      }[]
    >
  >;
  setSelectTeacherId?: React.Dispatch<React.SetStateAction<string>>;
  // Optional batchId -> batch name lookup, used to render a "Classes"
  // column in the main Teacher Directory table.
  batchMap?: Map<string, string>;
  batches?: { _id: string; name: string }[];
  onRefreshTeachers?: () => void;

  //   setEditStudentDetails: React.Dispatch<React.SetStateAction<boolean>>;
  //   setShowSelectedScreen: React.Dispatch<React.SetStateAction<Screen>>;
  //   setStudents: React.Dispatch<React.SetStateAction<StudentsDataWithBatch[]>>;
}) => {
  const [teachers, setTeachers] = useState<
    {
      _id: string;
      name: string;
      phoneNumber: string;
      subjects: { _id: string; name: string; batchId: string }[];
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editTeacher, setEditTeacher] = useState<boolean>(false);
  const [editTeacherId, setEditTeacherId] = useState<{
    _id: string;
    name: string;
    phoneNumber: string;
    subjects: any[];
    instituteBatches?: string[];
  }>({
    _id: "",
    name: "",
    phoneNumber: "",
    subjects: [],
    instituteBatches: [],
  });
  const [selectedModalBatchId, setSelectedModalBatchId] = useState<string>("");
  const [modalBatchSubjects, setModalBatchSubjects] = useState<
    { name: string; _id: string }[]
  >([]);
  const [isLoadingModalSubjects, setIsLoadingModalSubjects] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<{ name: string; _id: string }[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [teacherForm, setTeacherForm] = useState<{
    name: string;
    phone: string;
  }>({ name: "", phone: "" });
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    setActivePage(1);
  }, [teachers]);

  const pagedTeachers = useMemo(() => {
    const start = (activePage - 1) * ROWS_PER_PAGE;
    return teachers.slice(start, start + ROWS_PER_PAGE);
  }, [teachers, activePage]);

  const totalPages = Math.max(1, Math.ceil(teachers.length / ROWS_PER_PAGE));

  useEffect(() => {
    if (props.isTeacherDashboard) {
      setTeachers(props.teachers || []);
    }
  }, [props.teachers, props.isTeacherDashboard]);

  // Load batch subjects dynamically inside the Edit Teacher modal whenever selected class/batch changes
  useEffect(() => {
    if (!editTeacher || !selectedModalBatchId) {
      setModalBatchSubjects([]);
      setSelectedSubjectIds([]);
      return;
    }

    setIsLoadingModalSubjects(true);
    GetAllSubjectsFromBatch(selectedModalBatchId)
      .then((res: any) => {
        const rawRegular =
          res?.subjects?.subjects ||
          (Array.isArray(res?.subjects) ? res.subjects : []);
        const rawOptional = res?.subjects?.optionalSubjects || [];
        const combined = [...rawRegular, ...rawOptional];

        const unique = new Map<string, { _id: string; name: string }>();
        combined.forEach((s: any) => {
          if (s && s._id && s.name && !unique.has(s._id)) {
            unique.set(s._id, { _id: s._id, name: s.name });
          }
        });
        const list = Array.from(unique.values());
        setModalBatchSubjects(list);

        // Preselect valid existing subjects for this teacher in this batch
        const batchSubIds = new Set(list.map((s) => s._id));
        const teacherSubs = (editTeacherId?.subjects || []).map((s: any) =>
          typeof s === "object" ? s._id : s
        );
        const matchingSubs = teacherSubs.filter((id: string) =>
          batchSubIds.has(id)
        );
        setSelectedSubjectIds(matchingSubs);
        setIsLoadingModalSubjects(false);
      })
      .catch((e) => {
        console.error("Error fetching modal batch subjects:", e);
        setModalBatchSubjects([]);
        setSelectedSubjectIds([]);
        setIsLoadingModalSubjects(false);
      });
  }, [editTeacher, selectedModalBatchId]);

  useEffect(() => {
    if (props.batchId && !props.isTeacherDashboard) {
      setIsLoading(true);
      GetAllTeachersFromBatch(props.batchId)
        .then((x: any) => {
          GetAllSubjectsFromBatch(props.batchId || "")
            .then((res: any) => {
              const rawRegular =
                res?.subjects?.subjects ||
                (Array.isArray(res?.subjects) ? res.subjects : []);
              const rawOptional = res?.subjects?.optionalSubjects || [];
              const combined = [...rawRegular, ...rawOptional];

              const unique = new Map<string, { _id: string; name: string }>();
              combined.forEach((s: any) => {
                if (s && s._id && s.name && !unique.has(s._id)) {
                  unique.set(s._id, { _id: s._id, name: s.name });
                }
              });
              const subList = Array.from(unique.values());
              setSubjects(subList);
              setIsLoading(false);
            })
            .catch((e) => {
              console.log(e);
              setIsLoading(false);
            });

          const { teachers } = x;
          const teachersData = (Array.isArray(teachers) ? teachers : []).map((s: any) => {
            return {
              _id: s._id,
              name: s.name,
              phoneNumber: s.phoneNumber,
              subjects: s.subjects,
            };
          });

          setTeachers(teachersData);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    }
  }, [props.batchId, props.isTeacherDashboard]);

  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [deletingTeacherId, setDeletingTeacherId] = useState<string>("");

  const removeTeacherFromBatch = () => {
    RemoveTeacherFromBatch(deletingTeacherId, props.batchId || "")
      .then((x) => {
        setTeachers((prev) => prev.filter((s) => s._id !== deletingTeacherId));
        SuccessNotification("Teacher removed from batch");
        setShowWarning(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteTeacher = () => {
    setIsLoading(true);
    DeleteTeacher(deletingTeacherId)
      .then((x: any) => {
        props.setOriginalArrayOfTeachers &&
          props.setOriginalArrayOfTeachers((prev) => {
            const filteredData = prev.filter(
              (teach) => teach._id !== deletingTeacherId
            );
            return filteredData;
          });
        props.setTeachersInDashboard &&
          props.setTeachersInDashboard((prev) => {
            const filteredData = prev.filter(
              (teach) => teach._id !== deletingTeacherId
            );
            return filteredData;
          });
        SuccessNotification("Teachere deleted!!");
        setShowWarning(false);
        setIsLoading(false);
      })
      .catch((e: any) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const editTeacherData = () => {
    if (!editTeacherId._id) return;
    setIsLoading(true);

    const phoneValue = Array.isArray(editTeacherId.phoneNumber)
      ? editTeacherId.phoneNumber[0] || ""
      : editTeacherId.phoneNumber;

    UpdateTeacher(editTeacherId._id, {
      name: editTeacherId.name,
      phoneNumber: phoneValue,
      subjects: selectedSubjectIds,
      batchId: selectedModalBatchId || undefined,
    })
      .then((res: any) => {
        SuccessNotification("Teacher updated successfully!");
        setIsLoading(false);
        setEditTeacher(false);

        if (props.onRefreshTeachers) {
          props.onRefreshTeachers();
        }

        const updatedTeacher = res?.teacher;
        if (updatedTeacher) {
          if (props.setOriginalArrayOfTeachers) {
            props.setOriginalArrayOfTeachers((prev) =>
              prev.map((t) =>
                t._id === updatedTeacher._id
                  ? {
                      ...t,
                      name: updatedTeacher.name,
                      phoneNumber: updatedTeacher.phoneNumber,
                      instituteBatches:
                        updatedTeacher.instituteBatches || t.instituteBatches,
                      subjects: updatedTeacher.subjects || t.subjects,
                    }
                  : t
              )
            );
          }
          if (props.setTeachersInDashboard) {
            props.setTeachersInDashboard((prev) =>
              prev.map((t) =>
                t._id === updatedTeacher._id
                  ? {
                      ...t,
                      name: updatedTeacher.name,
                      phoneNumber: updatedTeacher.phoneNumber,
                      instituteBatches:
                        updatedTeacher.instituteBatches || t.instituteBatches,
                      subjects: updatedTeacher.subjects || t.subjects,
                    }
                  : t
              )
            );
          }
          setTeachers((prev) =>
            prev.map((t) =>
              t._id === updatedTeacher._id
                ? {
                    ...t,
                    name: updatedTeacher.name,
                    phoneNumber: updatedTeacher.phoneNumber,
                    subjects: updatedTeacher.subjects || t.subjects,
                  }
                : t
            )
          );
        }
      })
      .catch((e: any) => {
        console.error("Update teacher failed:", e);
        setIsLoading(false);
        ErrorNotification(
          e?.response?.data?.message || "Failed to update teacher"
        );
      });
  };

  // const isMd = useMediaQuery(`(max-width: 968px)`);
  return (
    <Stack style={{ overflowY: "visible" }}>
      <Notifications />
      <LoadingOverlay visible={isLoading} />
      {/* Header styled to match the Test section's master container. */}
      <Box
        p={20}
        style={{
          borderRadius: "16px",
          background: "#EEF3FF",
          border: "1px solid #DCE7FF",
        }}
      >
        <Flex align="center" gap={14}>
          <Flex
            align="center"
            justify="center"
            style={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              background: "#FFFFFF",
              flexShrink: 0,
            }}
          >
            <IconChalkboard size={22} color="#2F6FED" />
          </Flex>
          <Stack gap={2} style={{ minWidth: 0 }}>
            <Text fz={22} fw={700} c="#1B2559">
              Teachers
            </Text>
            <Text fz={13} c="#5B6B8C">
              Manage teachers assigned to this batch.
            </Text>
          </Stack>
        </Flex>
      </Box>
      <Box
        style={{
          borderRadius: "16px",
          border: "1px solid #F1F4F9",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Table
          verticalSpacing="md"
          horizontalSpacing="xl"
          bg={"white"}
          fz={15}
          style={{ minWidth: 640 }}
        >
        <Table.Thead
          bg={"#F7F9FC"}
        >
          <Table.Tr>
            <Table.Th
              style={{
                fontFamily: "Roboto",
                fontWeight: 600,
                color: "#64748B",
                fontSize: 13,
              }}
            >
              Name
            </Table.Th>
            <Table.Th
              style={{
                fontFamily: "Roboto",
                fontWeight: 600,
                color: "#64748B",
                fontSize: 13,
              }}
            >
              Phone Number
            </Table.Th>
            {props.batchMap && (
              <Table.Th
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 600,
                  color: "#64748B",
                  fontSize: 13,
                }}
              >
                Subject
              </Table.Th>
            )}
            {props.batchMap && (
              <Table.Th
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 600,
                  color: "#64748B",
                  fontSize: 13,
                }}
              >
                Classes
              </Table.Th>
            )}
            <Table.Th
              style={{
                fontFamily: "Roboto",
                fontWeight: 600,
                color: "#64748B",
                fontSize: 13,
              }}
            >
              Message
            </Table.Th>
            {props.userType === UserType.OTHERS && (
              <Table.Th
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 600,
                  color: "#64748B",
                  fontSize: 13,

                }}
              >
                Action
              </Table.Th>
            )}
          </Table.Tr>
        </Table.Thead>
        <tbody>
          {pagedTeachers.map((item: any, index: number) => {
            return (
              <Table.Tr
                key={index}
                style={{
                  fontFamily: "Nunito",
                  borderBottom: "1px solid #F1F5F9",
                }}
              >
                <Table.Td
                  style={{
                    color: item.isInActive ? "#bebebe" : "#33415C",
                    fontWeight: 600,
                    padding: "1rem",
                  }}
                  ta={"start"}
                >
                  <Flex align="center" gap={10}>
                    <Avatar radius="xl" size={36} color="blue">
                      {(item.name || "?").charAt(0).toUpperCase()}
                    </Avatar>
                    {item.name}
                  </Flex>
                </Table.Td>
                <Table.Td
                  style={{
                    color: item.isInActive ? "#bebebe" : "#5B6B8C",
                    fontWeight: 500,
                  }}
                  ta={"start"}
                >
                  {item.phoneNumber[0]}
                </Table.Td>
                {props.batchMap && (
                  <Table.Td ta={"start"}>
                    <Flex gap={6} wrap="wrap">
                      {(item.subjects || []).slice(0, 2).map((sub: any, i: number) => {
                        const style = subjectBadge(sub.name);
                        return (
                          <Badge
                            key={i}
                            variant="light"
                            radius="sm"
                            styles={{
                              root: {
                                backgroundColor: style.bg,
                                color: style.fg,
                              },
                            }}
                          >
                            {sub.name}
                          </Badge>
                        );
                      })}
                    </Flex>
                  </Table.Td>
                )}
                {props.batchMap && (
                  <Table.Td ta={"start"} c={"#5B6B8C"} fz={13}>
                    {(item.instituteBatches || [])
                      .map((id: string) => props.batchMap!.get(id))
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </Table.Td>
                )}
                <Table.Td ta={"start"}>
                  <a href={`sms:${item.phoneNumber[0]}?body=Hello!, `}>
                    <Flex
                      align="center"
                      justify="center"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "10px",
                        background: "#EAF1FF",
                      }}
                    >
                      <IconMessage size={17} cursor="pointer" color="#2F6FED" />
                    </Flex>
                  </a>
                </Table.Td>
                {props.userType === UserType.OTHERS && (
                  <Table.Td style={{ cursor: "pointer" }}>
                    {/* <Menu> */}
<Menu
  shadow="md"
  width={210}
  position="bottom-end"
  withArrow={false}
  radius="md"
>
                      <Menu.Target>
                        <Flex
                          align={"center"}
                          justify={"center"}
                          w={"2rem"}
                          py={3}
                          bg="#FFFFFF"
                        >
                          <IconDotsVertical />
                        </Flex>
                      </Menu.Target>
                      {/* <Menu.Dropdown> */}
                      <Menu.Dropdown
  styles={{
    dropdown: {
      padding: "6px",
      border: "1px solid #E2E8F0",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.10)",
      fontFamily: "Roboto, sans-serif",
    },
  }}
>
                        {!props.fromInstituteTeacherSection && (
                          <Menu.Item
                            leftSection={<IconUserCircle size={18} stroke={1.7} />}
  styles={{
    item: {
      fontFamily: "Roboto, sans-serif",
      fontSize: "14px",
      fontWeight: 500,
      color: "#334155",
      borderRadius: "8px",
      padding: "10px 12px",
    },
    itemLabel: {
      fontFamily: "Roboto, sans-serif",
    },
  }}

                            onClick={() => {
                              props.setSelectTeacherId &&
                                props.setSelectTeacherId(item._id);
                              //   props.setShowSelectedScreen(Screen.VIEWPROFILE);
                            }}
                          >
                            <Flex align={"center"} gap={10}>
                              {/* <FaUserCircle size={20} /> */}
                              <Text>View Profile</Text>
                            </Flex>
                          </Menu.Item>
                        )}
                       

                        {/* <Menu.Item
                          onClick={() => {
                            setShowWarning(true);
                            setDeletingTeacherId(item._id);
                          }}
                        >
                          <Flex align="center">
                            <Flex align="center">
                              <Box mr={2}>
                                <Image
                                  src={"/deleteImg.png"}
                                  alt="profile"
                                  width={20}
                                  height={20}
                                />
                              </Box>
                            </Flex>
                            <Text
                              // fz={16}
                              ml={10}
                              style={{ fontFamily: "Roboto" }}
                            >
                              Remove Teacher
                            </Text>
                          </Flex>
                        </Menu.Item> */}
                        <Menu.Item
  color="red"
  leftSection={<IconUserMinus size={18} stroke={1.7} />}
  styles={{
    item: {
      fontFamily: "Roboto, sans-serif",
      fontSize: "14px",
      fontWeight: 500,
      borderRadius: "8px",
      padding: "10px 12px",
    },
    itemLabel: {
      fontFamily: "Roboto, sans-serif",
    },
  }}
  onClick={() => {
    setShowWarning(true);
    setDeletingTeacherId(item._id);
  }}
>
  Remove Teacher
</Menu.Item>
                        <Menu.Item
  leftSection={<IconEdit size={18} stroke={1.7} />}
  styles={{
    item: {
      fontFamily: "Roboto, sans-serif",
      fontSize: "14px",
      fontWeight: 500,
      color: "#334155",
      borderRadius: "8px",
      padding: "10px 12px",
    },
    itemLabel: {
      fontFamily: "Roboto, sans-serif",
    },
  }}
  onClick={() => {
    const defaultBatch =
      props.batchId ||
      (item.instituteBatches && item.instituteBatches[0]) ||
      (props.batches && props.batches[0]?._id) ||
      "";
    setEditTeacherId(item);
    setSelectedModalBatchId(defaultBatch);
    setEditTeacher(true);
  }}
>
  Edit Teacher
</Menu.Item>
                      </Menu.Dropdown>
                      
                    </Menu>
                  </Table.Td>
                )}
              </Table.Tr>
            );
          })}
        </tbody>
      </Table>
      </Box>
      {teachers.length > ROWS_PER_PAGE && (
        <Flex justify="flex-end" mt={14}>
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={setActivePage}
            color="blue"
            radius="md"
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
          Are you sure?. you want to{" "}
          {props.isTeacherDashboard
            ? "delete teacher"
            : `remove teacher from ${props.batchName}`}
        </Text>
        <Flex w={"100%"} align={"center"} justify={"end"} gap={10} pt={20}>
          <Button variant="outline" onClick={() => setShowWarning(false)}>
            Cancel
          </Button>
          <Button
            variant="filled"
            bg={"red"}
            onClick={
              props.isTeacherDashboard ? deleteTeacher : removeTeacherFromBatch
            }
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
          onChange={(e) =>
            setEditTeacherId({ ...editTeacherId, name: e.target.value })
          }
          required
          mt={10}
        />
        <TextInput
          title="Phone Number"
          label="Phone Number"
          placeholder="Enter Phone Number"
          maxLength={10}
          mt={10}
          value={
            Array.isArray(editTeacherId.phoneNumber)
              ? editTeacherId.phoneNumber[0] || ""
              : editTeacherId.phoneNumber
          }
          onChange={(e) => {
            if (containsOnlyDigits(e.currentTarget.value)) {
              setEditTeacherId({
                ...editTeacherId,
                phoneNumber: e.target.value,
              });
            }
          }}
          required
        />
        <Select
          label="Select Class / Batch"
          placeholder="Select Class"
          data={
            props.batches && props.batches.length > 0
              ? props.batches.map((b) => ({ value: b._id, label: b.name }))
              : props.batchId
              ? [
                  {
                    value: props.batchId,
                    label: props.batchName || "Current Batch",
                  },
                ]
              : []
          }
          value={selectedModalBatchId}
          onChange={(val) => setSelectedModalBatchId(val || "")}
          mt={10}
          searchable
          disabled={!props.isTeacherDashboard && !!props.batchId}
        />
        <MultiSelect
          data={modalBatchSubjects.map((subject) => ({
            label: subject.name,
            value: subject._id,
          }))}
          mt={10}
          value={selectedSubjectIds || []}
          onChange={(value: string[]) => setSelectedSubjectIds(value)}
          placeholder={
            !selectedModalBatchId
              ? "Select class first"
              : isLoadingModalSubjects
              ? "Loading subjects..."
              : modalBatchSubjects.length === 0
              ? "No subjects in this batch"
              : "Select Subjects"
          }
          label="Select Subjects"
          disabled={!selectedModalBatchId || isLoadingModalSubjects}
          searchable
          clearable
        />
        <Button
          mt={16}
          fullWidth
          variant="outline"
          onClick={editTeacherData}
          loading={isLoading}
        >
          Submit
        </Button>
      </Modal>
    </Stack>
  );
};

export default TeachersSection;
