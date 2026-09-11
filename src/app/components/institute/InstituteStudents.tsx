"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconSearch,
  IconArrowLeft,
  IconDownload,
} from "@tabler/icons-react";
import StudentProfilePage from "./student/components/StudentProfilePage";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/app/redux/redux.hooks";
import StudentPage from "../student/StudentPage";
import { GetInstituteBatches } from "@/axios/institute/instituteSlice";
import {
  GetAllStudentsFromBatch,
  GetStudentsPendingFee,
} from "@/axios/institute/InstituteGetApi";
import { UserType } from "../dashboard/InstituteBatchesSection";
import * as XLSX from "xlsx";
import PassOutStudents from "./student/components/PassoutStudents";
import { PayRecordWithNumber } from "@/axios/student/StudentGetApi";

export interface StudentList {
  _id: string;
  name: string;
  profilePic: string;
  dateOfJoining: string;
  uniqueRoll: string;
  batchId: {
    _id: string;
    name: string;
  };
}

export enum StudentTabs {
  OVERVIEW = "Overview",
  FEES = "Fees Records",
  ATTENDANCE = "Attendance",
  TEST = "TEST",
  OTHER = "Other",
  MEETNGS = "Meetings"

}

export const InstituteStudents = () => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [students, setStudents] = useState<StudentList[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentList[]>([]);
  const [batchMap, setBatchMap] = useState<Map<string, string>>(new Map());
  const [activeTab, setActiveTab] = useState<StudentTabs>(StudentTabs.OTHER);
  const [search, setSearch] = useState<string>("");

  const FileSaver = require("file-saver");

  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails,
  );

  const [showPendingFeeScreen, setShowPendingFeeScreen] =
    useState<boolean>(false);
  const [showPassoutScreen, setShowPassoutScreen] = useState<boolean>(false);
  const [showAddPayment, setAddPayment] = useState<boolean>(false);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [fees, setFees] = useState<number>(0);

  const [pendingFilters, setPendingFilters] = useState({
    address: "",
    studentName: "",
    phoneNumber: "",
    batchId: "",
  });
  const ROWS_PER_PAGE = 6;
  const [activePage, setActivePage] = useState(1);
  useEffect(() => {
    setActivePage(1);
  }, [filteredStudents]);

  const HandleSearchPendingFees = () => {
    if (!institute?._id) return;
    setIsLoading(true);

    GetStudentsPendingFee(
      pendingFilters.address,
      pendingFilters.studentName,
      pendingFilters.phoneNumber,
      pendingFilters.batchId,
      institute._id,
    )
      .then((res: any) => {
        setPendingStudents(res?.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("API ERROR => ", err);
        setIsLoading(false);
      });
  };

  const HandleDownloadExcel = () => {
    const excelData = pendingStudents.map((s: any) => ({
      Name: s.Name || "",
      Address: s.address || "",
      Phone: String(s.phoneNumber || ""),
      Batch: s.batch?.name || "N/A",
      PaidFees: s.paidFees || 0,
      PendingFees: s.pendingFees || 0,
      TotalFees: s.totalFees || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pending Fees");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    FileSaver.saveAs(data, "PendingFeesStudents.xlsx");
  };

  useEffect(() => {
    if (search) {
      const filteredData = students.filter((s) =>
        s.name.trim().toLowerCase().startsWith(search.trim().toLowerCase()),
      );
      setFilteredStudents(filteredData);
    } else {
      setFilteredStudents(students);
    }
  }, [search, students]);

  useEffect(() => {
    if (institute?._id) {
      setIsLoading(true);
      GetInstituteBatches(institute._id)
        .then((x: any) => {
          const { batches } = x;
          const newMap = new Map(batchMap);
          batches.forEach((b: any) => {
            if (!newMap.has(b._id)) {
              newMap.set(b._id, b.name);
            }
            if (!selectedBatchId) {
              setSelectedBatchId(b._id);
            }
          });
          setBatchMap(newMap);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    }
  }, [institute]);

  useEffect(() => {
    if (selectedBatchId) {
      setIsLoading(true);
      GetAllStudentsFromBatch(selectedBatchId)
        .then((x: any) => {
          const { students } = x.students;
          const studentData = students.map((s: any) => {
            const yearOfJoining = new Date(s.dateOfJoining).getFullYear();
            return {
              _id: s._id,
              name: s.name,
              profilePic: s.profilePic,
              uniqueRoll: s.uniqueRoll,
              dateOfJoining: yearOfJoining.toString(),
              batchId: {
                _id: s.batchId._id,
                name: s.batchId.name,
              },
            };
          });
          setStudents(studentData);
          setFilteredStudents(studentData);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    }
  }, [selectedBatchId]);

  const addPayment = () => {
    const studentIds = pendingStudents.map((stud: any) => stud.studentId);
    setIsLoading(true);
    PayRecordWithNumber(institute._id, {
      fees,
      phoneNumber: pendingFilters.phoneNumber,
      studentIds,
    })
      .then((res: any) => {
        setAddPayment(false);
        console.log("res : ", res);
        setIsLoading(false);
      })
      .catch((e: any) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const tableHeaderStyle = {
    padding: "16px",
    textAlign: "left" as const,
    fontWeight: 700,
    fontSize: "15px",
    color: "white",
  };

  const tableCellStyle = {
    padding: "14px",
    fontSize: "14px",
    color: "#4B5563",
  };

  // ----------------------------------------------------
  // CONDITIONAL ROUTING RENDERS (Prevents Layer Bleeding)
  // ----------------------------------------------------

  // View Mode 1: Individual Tab View Mode Active
  if (StudentTabs.OTHER !== activeTab) {
    return (
      <Stack
        w={isMd ? "95%" : "92%"}
        mih={"100vh"}
        mx={"auto"}
        bg={"transparent"}
        mb={isMd ? 100 : 0}
      >
        <LoadingOverlay visible={isLoading} />
        <Stack
          w={"100%"}
          style={{ borderRadius: "1rem", border: "1px solid #F1F4F9", boxShadow: "0px 6px 20px rgba(15,23,42,0.05)" }}
          bg={"white"}
          align={"center"}
          justify={"space-between"}
          p={10}
          py={20}
          mt={10}
        >
          <StudentPage
            studentId={selectedStudentId}
            userType={UserType.OTHERS}
            activeTab={activeTab}
            onClickBack={() => setActiveTab(StudentTabs.OTHER)}
          />
        </Stack>
      </Stack>
    );
  }

  // View Mode 2: Passout Students Screen
  // console.log("showPassoutScreen : ", showPassoutScreen);
  if (showPassoutScreen) {
    return (
      <Stack
        w={isMd ? "95%" : "92%"}
        mih={"100vh"}
        mx={"auto"}
        bg={"transparent"}
        pt={20}
        mb={isMd ? 100 : 0}
      >
        <LoadingOverlay visible={isLoading} />
        <Flex justify="flex-start" px={10}>
          <Button
            leftSection={<IconArrowLeft size={16} />}
            variant="subtle"
            color="indigo"
            onClick={() => setShowPassoutScreen(false)}
          >
            Back to Directory 
          </Button>
        </Flex>
        <PassOutStudents />
      </Stack>
    );
  }

  // View Mode 3: Pending Fee Management Screen
  if (showPendingFeeScreen) {
    return (
      <Stack
        w={isMd ? "95%" : "92%"}
        mih={"100vh"}
        mx={"auto"}
        bg={"transparent"}
        mb={isMd ? 100 : 0}
      >
        <LoadingOverlay visible={isLoading} />
        <Stack
          w={"100%"}
          bg={"white"}
          p={15}
          mt={10}
          style={{ borderRadius: "1rem", border: "1px solid #F1F4F9", boxShadow: "0px 6px 20px rgba(15,23,42,0.05)" }}
        >
          <Flex
            w={"100%"}
            justify={"space-between"}
            align={"center"}
            mb={25}
            wrap="wrap"
            gap={10}
          >
            <Text
              fw={700}
              fz={32}
              style={{ fontFamily: "sans-serif", lineHeight: 1 }}
            >
              Pending Fees Students
            </Text>

            <Flex gap={14} align={"center"}>
              <Button
                leftSection={<IconDownload size={16} />}
                onClick={HandleDownloadExcel}
                styles={{
                  root: {
                    background: "linear-gradient(135deg, #34D399, #059669)",
                    border: 0,
                    height: "44px",
                    borderRadius: "10px",
                  },
                }}
              >
                Download Excel
              </Button>
              <Button
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => setShowPendingFeeScreen(false)}
                styles={{
                  root: {
                    background: "linear-gradient(135deg, #F87171, #DC2626)",
                    border: 0,
                    height: "44px",
                    borderRadius: "10px",
                  },
                }}
              >
                Back
              </Button>
            </Flex>
          </Flex>

          <Flex gap={18} align={"center"} wrap={"wrap"} mt={15} mb={20}>
            <TextInput
              placeholder="Search Address"
              value={pendingFilters.address}
              onChange={(e) =>
                setPendingFilters({
                  ...pendingFilters,
                  address: e.target.value,
                })
              }
            />
            <TextInput
              placeholder="Student Name"
              value={pendingFilters.studentName}
              onChange={(e) =>
                setPendingFilters({
                  ...pendingFilters,
                  studentName: e.target.value,
                })
              }
            />
            <TextInput
              placeholder="Phone Number"
              value={pendingFilters.phoneNumber}
              maxLength={10}
              onChange={(e) =>
                setPendingFilters({
                  ...pendingFilters,
                  phoneNumber: e.target.value,
                })
              }
            />
            <Select
              placeholder="Select Batch"
              data={[
                { label: "All", value: "" },
                ...Array.from(batchMap.entries()).map(([key, value]) => ({
                  label: value,
                  value: key,
                })),
              ]}
              value={pendingFilters.batchId}
              onChange={(value: any) =>
                setPendingFilters({ ...pendingFilters, batchId: value || "" })
              }
            />
            <Button
              onClick={HandleSearchPendingFees}
              styles={{
                root: {
                  background: "linear-gradient(135deg, #4F7CFB 0%, #2F6FED 100%)",
                  border: 0,
                  borderRadius: "10px",
                  height: "44px",
                  minWidth: "120px",
                },
              }}
            >
              Search
            </Button>
            {pendingStudents.length && (
              <Button
                onClick={() => setAddPayment(true)}
                styles={{
                  root: {
                    background: "linear-gradient(135deg, #4F7CFB 0%, #2F6FED 100%)",
                    border: 0,
                    borderRadius: "10px",
                    height: "44px",
                    minWidth: "120px",
                  },
                }}
              >
                Add Payment
              </Button>
            )}
          </Flex>

          <Modal
            title={"Pay Fees"}
            opened={showAddPayment}
            onClose={() => setAddPayment(false)}
          >
            <Flex w={"100%"} align={"center"} justify={"space-between"}>
              <TextInput
                placeholder="Add Fees"
                value={fees}
                maxLength={10}
                onChange={(e) => setFees(Number(e.target.value))}
              />

              <Button
                onClick={addPayment}
                styles={{
                  root: {
                    background: "linear-gradient(135deg, #4F7CFB 0%, #2F6FED 100%)",
                    border: 0,
                    borderRadius: "10px",
                    height: "44px",
                    minWidth: "120px",
                  },
                }}
              >
                Submit
              </Button>
            </Flex>
          </Modal>

          <Stack mt={25}>
            {pendingStudents.length > 0 ? (
              <div
                style={{
                  overflowX: "auto",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "white",
                  }}
                >
                  <thead
                    style={{
                      background: "linear-gradient(135deg, #4F7CFB 0%, #2F6FED 100%)",
                      color: "white",
                    }}
                  >
                    <tr>
                      <th style={tableHeaderStyle}>Name</th>
                      <th style={tableHeaderStyle}>Address</th>
                      <th style={tableHeaderStyle}>Phone</th>
                      <th style={tableHeaderStyle}>Batch</th>
                      <th style={tableHeaderStyle}>Paid Fees</th>
                      <th style={tableHeaderStyle}>Pending Fees</th>
                      <th style={tableHeaderStyle}>Total Fees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingStudents.map((s: any, index: number) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: "1px solid #ECECEC",
                          height: "65px",
                        }}
                      >
                        <td style={tableCellStyle}>{s.name}</td>
                        <td style={tableCellStyle}>{s.address || "N/A"}</td>
                        <td style={tableCellStyle}>{s.phoneNumber || "N/A"}</td>
                        <td style={tableCellStyle}>{s.batch?.name || "N/A"}</td>
                        <td
                          style={{
                            ...tableCellStyle,
                            color: "green",
                            fontWeight: 700,
                          }}
                        >
                          ₹{s.paidFees}
                        </td>
                        <td
                          style={{
                            ...tableCellStyle,
                            color: "red",
                            fontWeight: 700,
                          }}
                        >
                          ₹{s.pendingFees}
                        </td>
                        <td style={tableCellStyle}>₹{s.totalFees}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Stack align="center" py={40}>
                <Text fw={600} c="dimmed">
                  No Students Found
                </Text>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }

  // View Mode 4: Main Active Students Directory Default Screen
  const pagedStudents = filteredStudents.slice(
    (activePage - 1) * ROWS_PER_PAGE,
    activePage * ROWS_PER_PAGE,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / ROWS_PER_PAGE),
  );

  return (
    <Stack
      w={isMd ? "95%" : "92%"}
      mih={"100vh"}
      mx={"auto"}
      bg={"transparent"}
      mb={isMd ? 100 : 0}
      py={20}
    >
      <LoadingOverlay visible={isLoading} />

      {!selectedStudentId && (
        <Flex
          w={"100%"}
          align={isMd ? "flex-start" : "center"}
          justify="space-between"
          direction={isMd ? "column" : "row"}
          gap={16}
        >
          <Stack gap={2}>
            <Text fz={26} fw={700} c="#1B2559" style={{ fontFamily: "sans-serif" }}>
              Students Directory
            </Text>
            <Text fz={13} c="#8B96AD">
              View and manage all your students in one place
            </Text>
          </Stack>

          <Flex align={"center"} gap={10} wrap="wrap">
            {institute?.isAcadmy && (
              <Button
                onClick={() => setShowPassoutScreen(true)}
                radius={10}
                styles={{
                  root: {
                    background: "linear-gradient(135deg, #4F7CFB 0%, #2F6FED 100%)",
                    border: 0,
                  },
                }}
              >
                Passout Students
              </Button>
            )}
            <Button
              onClick={() => setShowPendingFeeScreen(true)}
              radius={10}
              styles={{
                root: {
                  background: "linear-gradient(135deg, #4F7CFB 0%, #2F6FED 100%)",
                  border: 0,
                },
              }}
            >
              Pending Fees
            </Button>
          </Flex>
        </Flex>
      )}

      {!selectedStudentId ? (
        <Stack
          w={"100%"}
          bg={"white"}
          style={{
            borderRadius: "1rem",
            border: "1px solid #F1F4F9",
            boxShadow: "0px 6px 20px rgba(15,23,42,0.05)",
          }}
          p={16}
          py={20}
        >
          <Flex w={"100%"} align={"end"} gap={20} wrap="wrap">
            <TextInput
              label="Search students"
              placeholder="search by name"
              leftSection={<IconSearch size={16} color="#8B96AD" />}
              onChange={(e) => setSearch(e.target.value)}
              radius={10}
              w={isMd ? "100%" : 280}
              styles={{
                input: {
                  border: "1px solid #E2E8F0",
                  boxShadow: "0px 2px 8px rgba(15,23,42,0.05)",
                },
              }}
            />
            <Select
              label="Batch"
              placeholder="Filter with batch"
              w={isMd ? "100%" : 220}
              radius={10}
              data={Array.from(batchMap.entries()).map(([key, value]) => ({
                label: value,
                value: key,
              }))}
              value={selectedBatchId}
              onChange={(value: any) => setSelectedBatchId(value)}
            />
          </Flex>

          <Box
            style={{
              borderRadius: "16px",
              border: "1px solid #F1F4F9",
              overflow: "hidden",
              marginTop: 10,
            }}
          >
            <Table verticalSpacing="md" horizontalSpacing="xl" bg={"white"} fz={15}>
              <Table.Thead bg={"#EEF3FF"}>
                <Table.Tr>
                  <Table.Th style={{ color: "#33415C", fontWeight: 700, fontSize: 14 }}>
                    Student
                  </Table.Th>
                  <Table.Th style={{ color: "#33415C", fontWeight: 700, fontSize: 14 }}>
                    Roll No.
                  </Table.Th>
                  <Table.Th style={{ color: "#33415C", fontWeight: 700, fontSize: 14 }}>
                    Batch
                  </Table.Th>
                  <Table.Th style={{ color: "#33415C", fontWeight: 700, fontSize: 14 }}>
                    Year Joined
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <tbody>
                {pagedStudents.map((s: StudentList) => (
                  <Table.Tr
                    key={s._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedStudentId(s._id)}
                  >
                    <Table.Td>
                      <Flex align="center" gap={10}>
                        <Avatar src={s.profilePic} radius="xl" size={36} color="blue">
                          {(s.name || "?").charAt(0).toUpperCase()}
                        </Avatar>
                        <Text fw={600} c="#1B2559" fz={14}>
                          {s.name}
                        </Text>
                      </Flex>
                    </Table.Td>
                    <Table.Td c="#5B6B8C" fz={14}>
                      {s.uniqueRoll}
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="blue" radius="sm">
                        {s.batchId?.name}
                      </Badge>
                    </Table.Td>
                    <Table.Td c="#5B6B8C" fz={14}>
                      {s.dateOfJoining}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </tbody>
            </Table>
          </Box>

          {filteredStudents.length === 0 && (
            <Stack align="center" py={40}>
              <Image src={"/empty.png"} alt="empty image" width={120} height={110} />
              <Text fw={600} c={"#8B96AD"}>
                No students found
              </Text>
            </Stack>
          )}

          {filteredStudents.length > ROWS_PER_PAGE && (
            <Flex justify="flex-end" mt={6}>
              <Pagination
                total={totalPages}
                value={activePage}
                onChange={setActivePage}
                color="blue"
                radius="md"
              />
            </Flex>
          )}
        </Stack>
      ) : (
        <Stack
          w={"100%"}
          bg={"white"}
          style={{
            borderRadius: "1rem",
            border: "1px solid #F1F4F9",
            boxShadow: "0px 6px 20px rgba(15,23,42,0.05)",
          }}
        >
          <Button
            variant="subtle"
            color="gray"
            onClick={() => setSelectedStudentId("")}
            m={10}
            w={140}
            leftSection={<IconArrowLeft size={14} />}
          >
            Back to Directory
          </Button>
          <StudentProfilePage
            selectedStudentId={selectedStudentId}
            onClickAction={(val: StudentTabs) => setActiveTab(val)}
          />
        </Stack>
      )}
    </Stack>
  );
};

