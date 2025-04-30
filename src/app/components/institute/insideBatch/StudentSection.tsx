"use client";

import { GetAllStudentsFromBatch } from "@/api/institute/InstituteGetApi";
import {
  Badge,
  Button,
  Flex,
  LoadingOverlay,
  Menu,
  Modal,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconDotsVertical, IconMessage } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { Screen } from "./InstituteInsideBatch";
import { RemoveStudentFromBatch } from "@/api/student/StudentDeleteApi";
import { SuccessNotification } from "@/app/helperFunction/Notification";
import { StudentsDataWithBatch } from "@/interface/student.interface";

const StudentSection = (props: {
  batchId: string;
  batchName: string;
  setEditStudentDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSelectedScreen: React.Dispatch<React.SetStateAction<Screen>>;
  setSelectedStudentId: React.Dispatch<React.SetStateAction<string>>;
  setStudents: React.Dispatch<React.SetStateAction<StudentsDataWithBatch[]>>;
}) => {
  const [students, setStudents] = useState<
    {
      _id: string;
      name: string;
      phoneNumber: string;
      parentName: string;
      feeStatus: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (props.batchId) {
      setIsLoading(true);
      GetAllStudentsFromBatch(props.batchId)
        .then((x: any) => {
          setIsLoading(false);
          const { students } = x.students;
          const studentData = students.map((s: any) => {
            return {
              _id: s._id,
              name: s.name,
              phoneNumber: s.phoneNumber,
              parentName: s.parentName,
              feeStatus: "Paid",
            };
          });
          // const studentD = students.map((s: any) => {
          //   return {
          //     value: s._id,
          //     label: s.name,
          //   };
          // });
          props.setStudents(students);
          setStudents(studentData);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [props.batchId]);

  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string>("");

  const removeStudentFromBatch = () => {
    RemoveStudentFromBatch(deletingStudentId, props.batchId)
      .then((x) => {
        setStudents((prev) => prev.filter((s) => s._id !== deletingStudentId));
        SuccessNotification("Student removed from batch");
        setShowWarning(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const isMd = useMediaQuery(`(max-width: 968px)`);
  return (
    <Stack>
      <LoadingOverlay visible={isLoading} />
      <Table
        mt={8}
        verticalSpacing="md"
        horizontalSpacing="xl"
        bg={"white"}
        fz={18}
      >
        <Table.Thead bg={"linear-gradient(135deg, #D28BD9, #7585D8)"}>
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
            {!isMd ? (
              <Table.Th
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 700,
                  color: "#2F4F4F",
                  fontSize: 18,
                }}
              >
                Parent's Name
              </Table.Th>
            ) : (
              <></>
            )}
            {!isMd && (
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
            )}
            <Table.Th
              style={{
                fontFamily: "Roboto",
                fontWeight: 600,
                color: "#2F4F4F",
                fontSize: 18,
                whiteSpace: "nowrap",
              }}
            >
              Fee Status
            </Table.Th>
            {!isMd ? (
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
            ) : (
              <></>
            )}
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
          </Table.Tr>
        </Table.Thead>
        <tbody>
          {students.map((item: any, index: number) => {
            return (
              <Table.Tr
                style={
                  item.isInActive
                    ? {
                        backgroundColor: "#FAFCFF",
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
                >
                  {item.name}
                </Table.Td>
                {!isMd ? (
                  <Table.Td
                    style={{
                      color: item.isInActive ? "#bebebe" : "#7D7D7D",
                      fontWeight: 500,
                    }}
                  >
                    {item.parentName}
                  </Table.Td>
                ) : (
                  <></>
                )}
                {!isMd && (
                  <Table.Td
                    style={{
                      color: item.isInActive ? "#bebebe" : "#7D7D7D",
                      fontWeight: 500,
                    }}
                  >
                    {item.phoneNumber[0]}
                  </Table.Td>
                )}
                <Table.Td>
                  {" "}
                  <Badge
                    // c={
                    //   getColor(
                    //     getStatus(
                    //       findCurrentBatchFeeTotalFees(
                    //         item.feeRecords
                    //       ) ?? 0,
                    //       findCurrentBatchFeePaidAmount(
                    //         item.feeRecords
                    //       ) ?? 0
                    //     )
                    //   )?.color
                    // }
                    // bg={
                    //   getColor(
                    //     getStatus(
                    //       findCurrentBatchFeeTotalFees(
                    //         item.feeRecords
                    //       ) ?? 0,
                    //       findCurrentBatchFeePaidAmount(
                    //         item.feeRecords
                    //       ) ?? 0
                    //     )
                    //   )?.backgroundColor
                    // }
                    size="lg"
                    radius="xs"
                  >
                    {item.feeStatus}
                  </Badge>
                </Table.Td>
                {!isMd ? (
                  <Table.Td>
                    <a href={`sms:${item.phoneNumber[0]}?body=Hello!, `}>
                      <div>
                        <IconMessage cursor="pointer" color="#7D7D7D" />
                      </div>
                    </a>
                  </Table.Td>
                ) : (
                  <></>
                )}
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
                          props.setSelectedStudentId(item._id);
                          props.setShowSelectedScreen(Screen.VIEWPROFILE);
                        }}
                      >
                        {" "}
                        View Profile
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          props.setSelectedStudentId(item._id);
                          props.setEditStudentDetails(true);
                          props.setShowSelectedScreen(Screen.ADDMORESCREEN);
                          // setSelectedStudent(item);
                          // setEditStudentFee(true);
                        }}
                      >
                        {" "}
                        Edit Profile
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          // setSelectedStudent(item);
                          // setStudentActiveTab("Fee Records");
                          // setEditStudentFee(false);
                          props.setSelectedStudentId(item._id);
                          props.setShowSelectedScreen(Screen.VIEWFEEDETAILS);
                        }}
                      >
                        {" "}
                        View Fee Details
                      </Menu.Item>
                      {/* <Menu.Item
                                      onClick={() => {
                                        downloadBatchCombineFee(
                                          item._id,
                                          item.feeRecords,
                                          item
                                        );
                                      }}
                                    >
                                      Download Receipt
                                    </Menu.Item> */}
                      <Menu.Item
                        onClick={() => {
                          setShowWarning(true);
                          setDeletingStudentId(item._id);
                        }}
                      >
                        Remove Student
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
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
        <Text>Are you sure?. you want to delete this student</Text>
        <Flex w={"100%"} align={"center"} justify={"end"} gap={10} pt={20}>
          <Button variant="outline" onClick={() => setShowWarning(false)}>
            Cancel
          </Button>
          <Button variant="filled" bg={"red"} onClick={removeStudentFromBatch}>
            Yes
          </Button>
        </Flex>
      </Modal>
    </Stack>
  );
};

export default StudentSection;
