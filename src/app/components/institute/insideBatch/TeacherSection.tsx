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
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconDotsVertical, IconMessage, IconChalkboard } from "@tabler/icons-react";
import React, { useEffect, useMemo, useState } from "react";
import { RemoveStudentFromBatch } from "@/axios/student/StudentDeleteApi";
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
    subjects: { _id: string; name: string }[];
  }>({
    _id: "",
    name: "",
    phoneNumber: "",
    subjects: [],
  });
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
  }, [props.teachers]);

  useEffect(() => {
    if (props.batchId) {
      setIsLoading(true);
      GetAllTeachersFromBatch(props.batchId)
        .then((x: any) => {
          GetAllSubjectsFromBatch(props.batchId || "")
            .then((x: any) => {
              const { subjects } = x.subjects;
              setSubjects(subjects);
              setIsLoading(false);
            })
            .catch((e) => {
              console.log(e);
              setIsLoading(false);
            });

          const { teachers } = x;
          const teachersData = teachers.map((s: any) => {
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
  }, [props.batchId]);

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
    setIsLoading(true);
    UpdateTeacher(editTeacherId._id, {
      name: editTeacherId.name,
      phoneNumber: editTeacherId.phoneNumber,
      subjects: selectedSubjectIds,
    })
      .then(() => {
        SuccessNotification("Teacher updated!!");
        setIsLoading(false);
        setEditTeacher(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
        setEditTeacher(false);
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
                    <Menu>
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
                      <Menu.Dropdown>
                        {!props.fromInstituteTeacherSection && (
                          <Menu.Item
                            onClick={() => {
                              props.setSelectTeacherId &&
                                props.setSelectTeacherId(item._id);
                              //   props.setShowSelectedScreen(Screen.VIEWPROFILE);
                            }}
                          >
                            <Flex align={"center"} gap={10}>
                              <FaUserCircle size={20} />
                              <Text>View Profile</Text>
                            </Flex>
                          </Menu.Item>
                        )}
                        {/* <Menu.Item
                        onClick={() => {
                        //   props.setSelectedStudentId(item._id);
                        //   props.setEditStudentDetails(true);
                        //   props.setShowSelectedScreen(Screen.ADDMORESCREEN);
                          // setSelectedStudent(item);
                          // setEditStudentFee(true);
                        }}
                      >
                        {" "}
                        Edit Profile
                      </Menu.Item> */}

                        <Menu.Item
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
                        </Menu.Item>
                        {props.batchId && (
                          <Menu.Item
                            onClick={() => {
                              setEditTeacher(true);
                              setEditTeacherId(item);
                              console.log(
                                "batchId : ",
                                item.subjects,
                                props.batchId
                              );
                              const alreadyBatchAssigned = item.subjects.filter(
                                (s: any) => s.batchId === props.batchId
                              );
                              setSelectedSubjectIds(
                                alreadyBatchAssigned.map((s: any) => s._id)
                              );
                            }}
                          >
                            <Flex align="center">
                              <Flex align="center">
                                <Box mr={2}>
                                  <Image
                                    src={"/editImg.png"}
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
          value={editTeacherId.phoneNumber}
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
        <MultiSelect
          data={subjects.map((subject) => ({
            label: subject.name,
            value: subject._id,
          }))}
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
