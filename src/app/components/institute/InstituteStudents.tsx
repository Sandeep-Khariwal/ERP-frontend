"use client";

import {
  Button,
  Divider,
  Flex,
  LoadingOverlay,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconSearch,
  IconUserSquareRounded,
  IconArrowLeft,
  IconDownload,
} from "@tabler/icons-react";
import StudentListCard from "./student/components/StudentListCard";
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
    console.log(
      "adding payment : ",
      fees,
      pendingFilters.phoneNumber,
      studentIds,
    );
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
        w={isMd ? "95%" : "90%"}
        mih={"100vh"}
        mx={"auto"}
        bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
        mb={isMd ? 100 : 0}
      >
        <LoadingOverlay visible={isLoading} />
        <Stack
          w={"100%"}
          style={{ borderRadius: "1rem" }}
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
  if (showPassoutScreen) {
    return (
      <Stack
        w={isMd ? "95%" : "90%"}
        mih={"100vh"}
        mx={"auto"}
        bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
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
        w={isMd ? "95%" : "90%"}
        mih={"100vh"}
        mx={"auto"}
        bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
        mb={isMd ? 100 : 0}
      >
        <LoadingOverlay visible={isLoading} />
        <Stack
          w={"100%"}
          bg={"white"}
          p={15}
          mt={10}
          style={{ borderRadius: "1rem" }}
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
                  background: "linear-gradient(135deg, #C850C0, #4158D0)",
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
                    background: "linear-gradient(135deg, #C850C0, #4158D0)",
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
                    background: "linear-gradient(135deg, #C850C0, #4158D0)",
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
                      background: "linear-gradient(135deg, #C850C0, #4158D0)",
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
  return (
    <Stack
      w={isMd ? "95%" : "90%"}
      mih={"100vh"}
      mx={"auto"}
      bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
      mb={isMd ? 100 : 0}
    >
      <LoadingOverlay visible={isLoading} />

      <Flex
        w={"100%"}
        style={{ borderRadius: "1rem" }}
        bg={"white"}
        align={"center"}
        justify={"space-between"}
        p={10}
        py={20}
        mt={10}
      >
        <Text fw={600} style={{ fontFamily: "sans-serif" }} fz={22}>
          Students Directory
        </Text>
        <Flex align={"center"} gap={10}>
          {institute.isAcadmy && (
            <Button
              onClick={() => setShowPassoutScreen(true)}
              styles={{
                root: {
                  background: "linear-gradient(135deg, #C850C0, #4158D0)",
                  border: 0,
                  borderRadius: "8px",
                },
              }}
            >
              Passout Students
            </Button>
          )}
          <Button
            onClick={() => setShowPendingFeeScreen(true)}
            styles={{
              root: {
                background: "linear-gradient(135deg, #C850C0, #4158D0)",
                border: 0,
                borderRadius: "8px",
              },
            }}
          >
            Pending Fees
          </Button>
          <IconUserSquareRounded />
        </Flex>
      </Flex>

      <Flex w={"100%"} h={"100%"} gap={10} mt={10}>
        {isMd ? (
          /* Mobile Single Column Layout Toggle */
          !selectedStudentId ? (
            <Stack
              w={"100%"}
              bg={"white"}
              h={"100%"}
              style={{ borderRadius: "0.5rem" }}
              p={10}
            >
              <Text fw={600} style={{ fontFamily: "sans-serif" }} fz={22}>
                Students
              </Text>
              <TextInput
                placeholder="search name or phone"
                leftSection={<IconSearch />}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select
                my={10}
                w={"80%"}
                label="Filter with Batch"
                placeholder="Filter with batch"
                data={Array.from(batchMap.entries()).map(([key, value]) => ({
                  label: value,
                  value: key,
                }))}
                value={selectedBatchId}
                onChange={(value: any) => setSelectedBatchId(value)}
              />
              <Divider c={"gray"} w={"100%"} />
              {/* Header List Meta Row */}
              <Flex w={"100%"} px={5} py={10}>
                <Flex w={"10%"}>
                  <Text fz={14} c={"#4F4F4F"}>
                    Pic
                  </Text>
                </Flex>
                <Flex w={"50%"}>
                  <Text fz={14} c={"#4F4F4F"}>
                    Name
                  </Text>
                </Flex>
                <Flex w={"20%"} justify="center">
                  <Text fz={14} c={"#4F4F4F"}>
                    Roll No.
                  </Text>
                </Flex>
                <Flex w={"20%"} justify="center">
                  <Text fz={14} c={"#4F4F4F"}>
                    Year
                  </Text>
                </Flex>
              </Flex>
              {filteredStudents.map((s: StudentList) => (
                <StudentListCard
                  key={s._id}
                  student={s}
                  onClickStudent={(id: string) => setSelectedStudentId(id)}
                  id={selectedStudentId}
                  selectedStudentId={selectedStudentId}
                />
              ))}
            </Stack>
          ) : (
            <Stack
              w={"100%"}
              h={"100%"}
              bg={"white"}
              style={{ borderRadius: "0.5rem" }}
            >
              <Button
                variant="subtle"
                color="gray"
                onClick={() => setSelectedStudentId("")}
                m={10}
                w={100}
                leftSection={<IconArrowLeft size={14} />}
              >
                Back
              </Button>
              <StudentProfilePage
                selectedStudentId={selectedStudentId}
                onClickAction={(val: StudentTabs) => setActiveTab(val)}
              />
            </Stack>
          )
        ) : (
          /* Desktop Split View Column Layout Layout */
          <>
            <Stack
              w={"30%"}
              bg={"white"}
              h={"100%"}
              style={{ borderRadius: "0.5rem" }}
              p={10}
            >
              <Text fw={600} style={{ fontFamily: "sans-serif" }} fz={22}>
                Students
              </Text>
              <TextInput
                placeholder="search name or phone"
                leftSection={<IconSearch />}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select
                my={10}
                w={"50%"}
                label="Filter with Batch"
                placeholder="Filter with batch"
                data={Array.from(batchMap.entries()).map(([key, value]) => ({
                  label: value,
                  value: key,
                }))}
                value={selectedBatchId}
                onChange={(e: any) => setSelectedBatchId(e)}
              />
              <Divider c={"gray"} w={"100%"} />
              <Flex w={"100%"} px={5} py={10}>
                <Flex w={"10%"}>
                  <Text fz={14} c={"#4F4F4F"}>
                    Pic
                  </Text>
                </Flex>
                <Flex w={"50%"}>
                  <Text fz={14} c={"#4F4F4F"}>
                    Name
                  </Text>
                </Flex>
                <Flex w={"20%"} justify="center">
                  <Text fz={14} c={"#4F4F4F"}>
                    Roll No.
                  </Text>
                </Flex>
                <Flex w={"20%"} justify="center">
                  <Text fz={14} c={"#4F4F4F"}>
                    Year
                  </Text>
                </Flex>
              </Flex>
              {filteredStudents.map((s: StudentList) => (
                <StudentListCard
                  key={s._id}
                  student={s}
                  onClickStudent={(id: string) => setSelectedStudentId(id)}
                  id={selectedStudentId}
                  selectedStudentId={selectedStudentId}
                />
              ))}
            </Stack>

            <Stack
              w={"70%"}
              bg={"white"}
              h={"100%"}
              style={{ borderRadius: "0.5rem" }}
              p={10}
            >
              {selectedStudentId ? (
                <StudentProfilePage
                  selectedStudentId={selectedStudentId}
                  onClickAction={(val: StudentTabs) => setActiveTab(val)}
                />
              ) : (
                <Stack
                  w={"100%"}
                  h={"100%"}
                  m={"auto"}
                  align={"center"}
                  justify={"center"}
                >
                  <Image
                    src={"/empty.png"}
                    alt="empty image"
                    width={150}
                    height={140}
                  />
                  <Text fw={600} c={"#4F4F4F"}>
                    Select a student
                  </Text>
                </Stack>
              )}
            </Stack>
          </>
        )}
      </Flex>
    </Stack>
  );
};
