"use client";

import { GetAllStudentsFromBatch } from "@/app/api/institute/InstituteGetApi";
import { Badge, Flex, LoadingOverlay, Menu, Stack, Table } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconDotsVertical, IconMessage } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { Screen } from "./InstituteInsideBatch";
import { RemoveStudentFromBatch } from "@/app/api/student/StudentDeleteApi";
import { SuccessNotification } from "@/app/helperFunction/Notification";

const StudentSection = (props: {
  batchId: string;
  batchName: string;
  setEditStudentDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSelectedScreen: React.Dispatch<React.SetStateAction<Screen>>;
  setSelectedStudentId: React.Dispatch<React.SetStateAction<string>>;
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
          setStudents(studentData);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [props.batchId]);

  const removeStudentFromBatch = (id: string) => {
    RemoveStudentFromBatch(id)
      .then((x) => {
        setStudents((prev) => prev.filter((s) => s._id !== id));
        SuccessNotification("Student removed from batch");
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
        <Table.Thead style={{ fontFamily: "Poppins", fontWeight: 600 }}>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            {!isMd ? <Table.Th>Parent's Name</Table.Th> : <></>}
            {!isMd && <Table.Th>Phone Number</Table.Th>}
            <Table.Th style={{ whiteSpace: "nowrap" }}>Fee Status</Table.Th>
            {!isMd ? <Table.Th>Message</Table.Th> : <></>}
            <Table.Th>Action</Table.Th>
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
                      //   onClick={() => {
                      //     setSelectedStudent(item);
                      //     setStudentActiveTab("Overview");
                      //   }}
                      >
                        {" "}
                        View Profile
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          console.log("item._id : ", item._id);

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
                          removeStudentFromBatch(item._id);
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
    </Stack>
  );
};

export default StudentSection;
