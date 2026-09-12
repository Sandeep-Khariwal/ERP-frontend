"use client";

import { GetAllStudentsFromBatch } from "@/axios/institute/InstituteGetApi";
import {
  Badge,
  Button,
  Flex,
  LoadingOverlay,
  Menu,
  Modal,
  Pagination,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconDownload,
  IconMessage,
} from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import { Screen } from "./InstituteInsideBatch";
import { RemoveStudentFromBatch } from "@/axios/student/StudentDeleteApi";
import {
  getBase64Image,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import { StudentsDataWithBatch } from "@/interfaces/student.interface";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { UserType } from "../../dashboard/InstituteBatchesSection";
import { generateIdCardHTML } from "./IDCardHtml";
import { GetStudentForIdCard } from "@/axios/student/StudentGetApi";
import { formatDate } from "../../marketing/utility/utils";

// ---- Types ----------------------------------------------------------

interface FeeRecord {
  status: string;
  amountPaid: number;
  totalAmount: number;
}

interface RawStudent extends StudentsDataWithBatch {
  _id: string;
  name: string;
  phoneNumber: string[];
  parentName: string;
  feeRecords?: FeeRecord[];
  isInActive?: boolean;
}

interface StudentsApiResponse {
  // NOTE: this shape is assumed based on GetAllStudentsFromBatch's observed
  // behavior. If the function's own return type is (or becomes) properly
  // typed at the source, this interface + cast can be removed entirely.
  students: {
    students: RawStudent[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalStudents: number;
      limit: number;
    };
  };
}

interface StudentIdCardApiResponse {
  student: {
    profilePic: string;
    instituteId: {
      name: string;
      logo: string;
      address: string;
      institutePhoneNumber: string;
      signature: string;
    };
    name: string;
    batchId: { name: string };
    rollNumber: string | number;
    enrollmentNo: string | number;
    dateOfBirth: string;
    phoneNumber: string;
    address: string;
  };
}

interface DisplayStudent {
  _id: string;
  name: string;
  phoneNumber: string;
  parentName: string;
  feeStatus: string;
  isInActive?: boolean;
}

interface StudentSectionProps {
  batchId: string;
  batchName: string;
  userType: UserType;
  setEditStudentDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSelectedScreen: React.Dispatch<React.SetStateAction<Screen>>;
  setSelectedStudentId: React.Dispatch<React.SetStateAction<string>>;
  setStudents: React.Dispatch<React.SetStateAction<StudentsDataWithBatch[]>>;
  students: DisplayStudent[];
}

// ---- Helpers ----------------------------------------------------------

const DEFAULT_PAGE_LIMIT = 10;

const computeFeeStatus = (feeRecords: FeeRecord[] = []): string => {
  if (feeRecords.length === 0) return "Not Paid";

  const totals = feeRecords.reduce(
    (acc, record) => {
      acc.totalAmount += record.totalAmount;
      acc.amountPaid += record.amountPaid;
      return acc;
    },
    { totalAmount: 0, amountPaid: 0 },
  );

  if (totals.amountPaid === 0) return "Not Paid";
  if (totals.totalAmount === totals.amountPaid) return "Paid";
  return "Partial Paid";
};

const toDisplayStudent = (s: RawStudent): DisplayStudent => ({
  _id: s._id,
  name: s.name,
  phoneNumber: s.phoneNumber?.[0] ?? "",
  parentName: s.parentName ?? "",
  feeStatus: computeFeeStatus(s.feeRecords),
  isInActive: Boolean(s.isInActive),
});

const StudentSection = (props: StudentSectionProps) => {
  const [students, setStudents] = useState<DisplayStudent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Pagination state (required)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalStudents, setTotalStudents] = useState<number>(0);

  // Tracks batch identity across renders so a batch switch can jump
  // straight to page 1 without fetching the (soon-to-be-discarded)
  // old page number first.
  const prevBatchIdRef = useRef<string>("");

  // Captures the server's page size from the last successful fetch so
  // post-delete totals can be recomputed locally instead of refetching.
  // Falls back to DEFAULT_PAGE_LIMIT until the first response arrives;
  // see the Backend Recommendations note about confirming this field.
  const limitRef = useRef<number>(DEFAULT_PAGE_LIMIT);

  // Guards against duplicate ID-card requests from rapid repeat clicks.
  const downloadingIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!props.batchId) return;

    const isNewBatch = prevBatchIdRef.current !== props.batchId;
    prevBatchIdRef.current = props.batchId;

    if (isNewBatch && currentPage !== 1) {
      // Don't fetch the old page for the new batch — reset to page 1 and
      // let the effect re-run with currentPage === 1 handle the fetch.
      setIsLoading(true);
      setCurrentPage(1);
      return;
    }

    let isCurrent = true;
    setIsLoading(true);

    GetAllStudentsFromBatch(props.batchId, currentPage)
      .then((response: unknown) => {
        if (!isCurrent) return; // stale response from a batch/page we've left — ignore

        const data = response as StudentsApiResponse;
        const rawStudents = data?.students?.students ?? [];
        const pagination = data?.students?.pagination;

        if (pagination) {
          limitRef.current = pagination.limit || limitRef.current;
          setTotalPages(pagination.totalPages);
          setTotalStudents(pagination.totalStudents);

          if (pagination.currentPage !== currentPage) {
            setCurrentPage(pagination.currentPage);
          }
        }

        props.setStudents(rawStudents);
        setStudents(rawStudents.map(toDisplayStudent));
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
  }, [props.batchId, currentPage]);

  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string>("");

  const removeStudentFromBatch = () => {
    setIsLoading(true);
    RemoveStudentFromBatch(deletingStudentId, props.batchId)
      .then(() => {
        SuccessNotification("Student removed from batch");
        setShowWarning(false);

        const updated = students.filter((s) => s._id !== deletingStudentId);
        setStudents(updated);

        if (updated.length === 0 && currentPage > 1) {
          // Page just became empty — step back a page; the fetch effect
          // will pick this up and refetch with a fresh, accurate response.
          setCurrentPage((p) => p - 1);
        } else {
          // Page still has content (or was already page 1 and is now
          // empty) — update totals locally using the known page size
          // instead of round-tripping to the server.
          const newTotal = Math.max(0, totalStudents - 1);
          setTotalStudents(newTotal);
          setTotalPages(Math.max(1, Math.ceil(newTotal / limitRef.current)));
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const downloadIdCard = (id: string) => {
    if (downloadingIdsRef.current.has(id)) return; // ignore duplicate clicks in flight
    downloadingIdsRef.current.add(id);

    GetStudentForIdCard(id)
      .then(async (res: unknown) => {
        const data = res as StudentIdCardApiResponse;
        const studentInfo = data.student;

        const base64Profile = await getBase64Image(studentInfo.profilePic);
        const base64Logo = await getBase64Image(studentInfo.instituteId.logo);

        const idCardhtml = generateIdCardHTML({
          schoolName: studentInfo.instituteId.name,
          schoolLogo: base64Logo,
          schoolAddress: studentInfo.instituteId.address,
          institutePhoneNumber: studentInfo.instituteId.institutePhoneNumber,

          studentName: studentInfo.name,
          studentPhoto: base64Profile,
          className: studentInfo.batchId.name,
rollNo: String(studentInfo.rollNumber),    
entrollmentNum: String(studentInfo.enrollmentNo),

          dob: formatDate(studentInfo.dateOfBirth),
          phone: studentInfo.phoneNumber,
          address: studentInfo.address,
          principalSignature: studentInfo.instituteId.signature,
        });

        const printWindow = window.open("", "_blank");

        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(idCardhtml);
          printWindow.document.close();

          setTimeout(() => {
            printWindow.print();
          }, 1000);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        downloadingIdsRef.current.delete(id);
      });
  };

  const isMd = useMediaQuery(`(max-width: 968px)`);

  return (
    <Stack w={"100%"} pb={100}>
      <LoadingOverlay visible={isLoading} />
      {students.length > 0 ? (
        <Table
          w={"100%"}
          mt={8}
          verticalSpacing="md"
          horizontalSpacing="xl"
          bg={"white"}
          fz={18}
        >
          <Table.Thead
            bg={"linear-gradient(135deg, #D28BD9, #7585D8)"}
            style={{
              border: "2px solid transparent",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
            }}
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
              {!isMd && (
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
              {!isMd && (
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
          <tbody style={{ width: "100%" }}>
            {students.map((item) => {
              const rowColor = item.isInActive ? "#bebebe" : "#7D7D7D";
              return (
                <Table.Tr
                  key={item._id}
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
                    style={{ color: rowColor, fontWeight: 500, padding: "1rem" }}
                  >
                    {item.name}
                  </Table.Td>
                  {!isMd && (
                    <Table.Td style={{ color: rowColor, fontWeight: 500 }}>
                      {item.parentName}
                    </Table.Td>
                  )}
                  {!isMd && (
                    <Table.Td style={{ color: rowColor, fontWeight: 500 }}>
                      {item.phoneNumber}
                    </Table.Td>
                  )}
                  <Table.Td>
                    <Badge
                      bg={
                        item.feeStatus === "Paid"
                          ? "green"
                          : item.feeStatus === "Partial Paid"
                            ? "blue"
                            : "red"
                      }
                      size="lg"
                      radius="xs"
                    >
                      {item.feeStatus}
                    </Badge>
                  </Table.Td>
                  {!isMd && (
                    <Table.Td>
                      <a href={`sms:${item.phoneNumber}?body=Hello!, `}>
                        <div>
                          <IconMessage cursor="pointer" color="#7D7D7D" />
                        </div>
                      </a>
                    </Table.Td>
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
                          <Flex align={"center"} gap={10}>
                            <FaUserCircle size={20} />
                            <Text>View Profile</Text>
                          </Flex>
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => {
                            props.setSelectedStudentId(item._id);
                            props.setEditStudentDetails(true);
                            props.setShowSelectedScreen(Screen.ADDMORESCREEN);
                          }}
                        >
                          <Flex align="center">
                            <Image
                              src={"/editImg.png"}
                              alt="edit"
                              width={20}
                              height={20}
                            />
                            <Text ml={10} style={{ fontFamily: "Roboto" }}>
                              Edit Profile
                            </Text>
                          </Flex>
                        </Menu.Item>
                        <Menu.Item onClick={() => downloadIdCard(item._id)}>
                          <Flex align="center" gap={10}>
                            <IconDownload size={20} color="#7D7D7D" />
                            <Text style={{ fontFamily: "Roboto" }}>
                              Download ID Card
                            </Text>
                          </Flex>
                        </Menu.Item>
                        {props.userType !== UserType.TEACHER && (
                          <Menu.Item
                            onClick={() => {
                              props.setSelectedStudentId(item._id);
                              props.setShowSelectedScreen(
                                Screen.VIEWFEEDETAILS,
                              );
                            }}
                          >
                            <Flex align="center">
                              <Image
                                src={"/feeImg.png"}
                                alt="fee"
                                width={20}
                                height={20}
                              />
                              <Text ml={10} style={{ fontFamily: "Roboto" }}>
                                View Fee Details
                              </Text>
                            </Flex>
                          </Menu.Item>
                        )}
                        <Menu.Item
                          onClick={() => {
                            setShowWarning(true);
                            setDeletingStudentId(item._id);
                          }}
                        >
                          <Flex align="center">
                            <Image
                              src={"/deleteImg.png"}
                              alt="delete"
                              width={20}
                              height={20}
                            />
                            <Text ml={10} style={{ fontFamily: "Roboto" }}>
                              Remove Student
                            </Text>
                          </Flex>
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <Flex w={"100%"} bg={"white"} mih={"60vh"} align={"center"}>
          <Stack w={"auto"} h={"100%"} m={"auto"} align={"center"} justify={"center"}>
            <Image src={"/empty.png"} alt="empty image" width={150} height={140} />
            <Text fw={600} c={"#4F4F4F"}>
              No student found
            </Text>
          </Stack>
        </Flex>
      )}

      {totalPages > 1 && (
        <Flex justify="center" align="center" mt={20} gap={10}>
          <Text fz={14} c="#7D7D7D">
            Showing {students.length} of {totalStudents} students
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
          Are you sure you want to remove this student from {props.batchName}?
        </Text>
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