"use client";

import {
  GetAllStudentsFromBatch,
  GetAllTeachersFromBatch,
} from "@/axios/institute/InstituteGetApi";
import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Menu,
  Modal,
  MultiSelect,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconDotsVertical, IconMessage } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
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

const TeachersSection = (props: {
  batchId?: string;
  batchName?: string;
  isTeacherDashboard?: boolean;
  teachers?: {
    _id: string;
    name: string;
    phoneNumber: string;
    subjects: { _id: string; name: string }[];
  }[];
  userType: UserType;
  setOriginalArrayOfTeachers?: React.Dispatch<
    React.SetStateAction<
      {
        _id: string;
        name: string;
        phoneNumber: string;
        instituteBatches: string[];
        subjects: { _id: string; name: string }[];
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
        subjects: { _id: string; name: string }[];
      }[]
    >
  >;
  setSelectTeacherId?: React.Dispatch<React.SetStateAction<string>>;

  //   setEditStudentDetails: React.Dispatch<React.SetStateAction<boolean>>;
  //   setShowSelectedScreen: React.Dispatch<React.SetStateAction<Screen>>;
  //   setStudents: React.Dispatch<React.SetStateAction<StudentsDataWithBatch[]>>;
}) => {
  const [teachers, setTeachers] = useState<
    {
      _id: string;
      name: string;
      phoneNumber: string;
      subjects: { _id: string; name: string }[];
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
              subjects:s.subjects
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
    <Stack mah={"70vh"} style={{ overflowY: "scroll" }}>
      <Notifications />
      <LoadingOverlay visible={isLoading} />
      <Table
        mt={8}
        verticalSpacing="md"
        horizontalSpacing="xl"
        bg={"white"}
        fz={18}
      >
        <Table.Thead
          bg={"linear-gradient(135deg, #D28BD9, #7585D8)"}
          style={{ position: "sticky", top: 0 }}
        >
          <Table.Tr>
            <Table.Th
              style={{
                fontFamily: "Roboto",
                fontWeight: 700,
                color: "#2F4F4F",
                fontSize: 18,
              }}
            >
              Name
            </Table.Th>
            <Table.Th
              style={{
                fontFamily: "Roboto",
                fontWeight: 600,
                color: "#2F4F4F",
                fontSize: 18,
              }}
            >
              Phone Number
            </Table.Th>
            <Table.Th
              style={{
                fontFamily: "Roboto",
                fontWeight: 600,
                color: "#2F4F4F",
                fontSize: 18,
              }}
            >
              Message
            </Table.Th>
            {props.userType === UserType.OTHERS && (
              <Table.Th
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 600,
                  color: "#2F4F4F",
                  fontSize: 18,
                }}
              >
                Action
              </Table.Th>
            )}
          </Table.Tr>
        </Table.Thead>
        <tbody>
          {teachers.map((item: any, index: number) => {
            return (
              <Table.Tr
                key={index}
                style={
                  item.isInActive
                    ? {
                        textAlign: "center",
                        fontFamily: "Nunito",
                        padding: "1rem",
                      }
                    : {
                        textAlign: "center",
                        fontFamily: "Nunito",
                        padding: "1rem",
                      }
                }
              >
                <Table.Td
                  style={{
                    color: item.isInActive ? "#bebebe" : "#7D7D7D",
                    fontWeight: 500,
                    padding: "1rem",
                  }}
                  ta={"start"}
                >
                  {item.name}
                </Table.Td>
                <Table.Td
                  style={{
                    color: item.isInActive ? "#bebebe" : "#7D7D7D",
                    fontWeight: 500,
                  }}
                  ta={"start"}
                >
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

                              setSelectedSubjectIds(
                                item.subjects.map((s: any) => s._id)
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
