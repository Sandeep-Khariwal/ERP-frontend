"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  Select,
  Badge,
  Menu,
  ActionIcon,
  Loader,
  Text,
  Paper,
  Title,
  Group,
  Card,
  rem,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconDownload,
  IconEye,
  IconUser,
  IconFilter,
} from "@tabler/icons-react";
import { generateCertificateHTML } from "@/html/geneRateCertificate";
import {
  GetPassout,
  GetStudent,
  GetStudentDetail,
  GetStudentMarksheets,
} from "@/axios/institute/InstituteGetApi";
import { getBase64Image } from "@/app/helperFunction/Notification";
import QRCode from "qrcode";
import { formatDate } from "@/app/components/marketing/utility/utils";
import { createAcadmyMarksheetPdf } from "../../insideBatch/CreateMarksheetPdf";
import { useAppSelector } from "@/app/redux/redux.hooks";

// --- Interfaces for Type Safety ---
interface FeeRecord {
  _id: string;
  name: string;
  dueDate: string;
  totalAmount: number;
  status: string;
  amountPaid: number;
}

interface BatchId {
  _id: string;
  name: string;
}

interface Student {
  _id: string;
  name: string;
  phoneNumber: string[];
  profilePic: string;
  batchId: BatchId;
  parentName: string;
  dateOfJoining: string;
  feeRecords: FeeRecord[];
}

interface ApiResponse {
  students: {
    _id: string;
    name: string;
    students: Student[];
  };
}

export default function PassOutStudents() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>("All");
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails,
  );

  console.log("data : ",data);
  

  // --- Fetch API Data ---
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    GetPassout(institute._id!)
      .then((res: any) => {
        console.log("res : ", res.students);

        setData(res);
        setLoading(false);
      })
      .catch((e: any) => {
        console.log(e);
        setLoading(false);
      });
  };
  // --- Extract Unique Classes for the Filter Dropdown ---
  const classOptions = useMemo(() => {
    if (!data?.students?.students)
      return [{ value: "All", label: "All Classes" }];

    const uniqueClasses = new Set<string>();
    data.students.students.forEach((student) => {
      if (student.batchId?.name) {
        uniqueClasses.add(student.batchId.name);
      }
    });

    return [
      { value: "All", label: "All Classes" },
      ...Array.from(uniqueClasses).map((className) => ({
        value: className,
        label: className.toUpperCase(),
      })),
    ];
  }, [data]);

  // --- Helper to Calculate Remaining Fees ---
  const calculatePendingFees = (feeRecords: FeeRecord[]): number => {
    if (!feeRecords || feeRecords.length === 0) return 0;
    return feeRecords.reduce((acc, current) => {
      const remaining = current.totalAmount - current.amountPaid;
      return acc + (remaining > 0 ? remaining : 0);
    }, 0);
  };

  // --- Filter and Prepare Data ---
  const filteredStudents = useMemo(() => {
    const allStudents = data?.students?.students || [];
    if (!selectedClass || selectedClass === "All") return allStudents;
    return allStudents.filter(
      (student) =>
        student.batchId?.name?.toLowerCase() === selectedClass.toLowerCase(),
    );
  }, [data, selectedClass]);

  // --- Placeholder Action Handlers ---
  const handleDownloadCertificate = async (studentId: string) => {
    // 1. Fetch data from API using the provided student ID
    const response: any = await GetStudentMarksheets(studentId);
    // console.log("response : ",response);
    
    const marksheet = response.marksheet[0];

    GetStudentDetail(studentId)
      .then(async (res: any) => {
        const student = res.student;

        // Note: Assuming 'item' and 'marksheet' are available from your component's context/state scope.
        // 2. Generate the verification URL and convert it to a DataURL Base64 string
        // console.log("marksheet : ",marksheet);
        
        const url = `https://shikshapay.cloud/marksheet/${marksheet?._id}`;
        const qr = await QRCode.toDataURL(url);

        console.log("add these images profilepic,logo and signature : ",student.profilePic,student.instituteId.logo, student.instituteId.signature);
        

        // 3. Resolve all image assets to Base64 to guarantee they remain intact during download
        const base64Photo = await getBase64Image(student.profilePic);
        const base64Logo = await getBase64Image(student.instituteId.logo);
        const base64Signature = await getBase64Image(
          student.instituteId.signature,
        );

        // 4. Map the API payload values to match the keys required by generateCertificateHTML
        const certificateArgs = {
          recipientName: student.name || "John Doe",
          profilePic: base64Photo || "John Doe",
          courseName: student.batchId?.name || "ADCA", // Using batchName as course code fallback
          courseFullName:
            student.batch?.name || "(Advance Diploma In Computer Application)", // Using examName as descriptive text fallback
          issueDate: student?.createdAt?.date
            ? new Date(student?.createdAt.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
          authorizedSignatureName: base64Signature || "Authorized Signatory",
          logo: base64Logo || "Authorized Signatory",
          qrCodeUrl: qr,
          instituteName: student.instituteId?.name || "INSTITUTE",
          instituteSubText:
            student.instituteId?.address ||
            "Vocational Training Institute Private Limited",
          instituteContact:
            student.instituteId?.institutePhoneNumber || "+919416059799",
        };


        // 5. Generate the finalized, print-ready HTML template string
        const htmlContent = generateCertificateHTML(certificateArgs);

        // 6. Execute download using a hidden print frame context to preserve styles perfectly
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();

          // Wait for fonts and base64 assets to initialize in target context window, then trigger print/save
          printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            // Optional: printWindow.close(); // Automatically clean up window frame after completion
          };
        }
      })
      .catch((err) => {
        console.error("Failed to generate and download certificate:", err);
      });
  };

  const downloadMarksheet = async (studentId: string) => {
    const response: any = await GetStudentMarksheets(studentId);
    const marksheet = response.marksheet[0];
    const url = `https://shikshapay.cloud/marksheet/${marksheet._id}`;

    const qr = await QRCode.toDataURL(url);

    GetStudentDetail(studentId)
      .then(async (res: any) => {
        const student = res.student;
        console.log("marksheet : ", marksheet, student);
        const base64Photo = await getBase64Image(student.profilePic);

        const base64Logo = await getBase64Image(student.instituteId.logo);

        const base64Signature = await getBase64Image(
          student.instituteId.signature,
        );

        const term1 = {
          instituteName: student.instituteId?.name,
          examName: marksheet.name,
          batchName: marksheet.batch.name,
          studentName: student?.name,
          rollNumber: student?.rollNumber,
          enrolment: student?.enrollmentNo,
          marks: marksheet.marks,
          totalMarks: marksheet.totalMarks,
          percentage: marksheet.percentage,
          overallGrade: marksheet.overallGrade,
          status: marksheet.status,
          allsubjecttotal: marksheet.marks.length * 100,
          date: new Date(marksheet.date).toLocaleDateString("en-GB"),
          session: marksheet.session,
          fName: student.parentName,
          address: student.address,
          parentNumber: student.parentNumber,
          dob: formatDate(student.dateOfBirth),

          // ✅ Base64 images
          photo: base64Photo,
          instituteLogo: base64Logo,
          principalSignature: base64Signature,

          instituteAdress: student.instituteId.address,
          institutePhone: student.instituteId.institutePhoneNumber,

          qr,
        };

        const html = createAcadmyMarksheetPdf(term1);

        const printWindow = window.open("", "_blank");

        if (printWindow) {
          printWindow.document.open();

          printWindow.document.write(html);

          printWindow.document.close();

          setTimeout(() => {
            printWindow.focus();

            printWindow.print();

            printWindow.onafterprint = () => {
              printWindow.close();
            };
          }, 500);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // --- Loader State ---
  if (loading) {
    return (
      <Group justify="center" align="center" style={{ minHeight: "300px" }}>
        <Loader color="blue" size="xl" type="dots" />
        <Text size="sm" c="dimmed">
          Loading Student Records...
        </Text>
      </Group>
    );
  }

  if (error) {
    return (
      <Card
        withBorder
        padding="xl"
        radius="md"
        bg="red.0"
        style={{ borderColor: "var(--mantine-color-red-3)" }}
      >
        <Text c="red.7" fw={600}>
          Error Loading Component
        </Text>
        <Text size="sm" c="red.6" mt={4}>
          {error}
        </Text>
      </Card>
    );
  }

  return (
    <Paper radius="md" p="xl" withBorder style={{ backgroundColor: "#fafafa" }}>
      {/* Top Heading & Filter controls Grid */}
      <Group justify="space-between" mb="xl" wrap="wrap">
        <div>
          <Title
            order={2}
            c="dark.4"
            style={{ fontFamily: "var(--mantine-font-family)" }}
          >
            Passout Students Directory
          </Title>
          <Text
            size="xs"
            c="dimmed"
            mt={2}
            style={{ textTransform: "uppercase", letterSpacing: rem(1) }}
          >
            Institute: {data?.students?.name || "N/A"}
          </Text>
        </div>

        {/* Dynamic Class Filter Dropdown */}
        <Select
          label="Filter by Batch/Class"
          placeholder="Select Class"
          leftSection={
            <IconFilter
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          data={classOptions}
          value={selectedClass}
          onChange={setSelectedClass}
          style={{ width: 240 }}
          comboboxProps={{
            shadow: "md",
            transitionProps: { transition: "pop-top-left", duration: 200 },
          }}
        />
      </Group>

      {/* Modern Table Layout */}
      <Paper
        radius="sm"
        withBorder
        style={{ overflow: "hidden", background: "#fff" }}
      >
        <Table highlightOnHover verticalSpacing="md" horizontalSpacing="md">
          <Table.Thead style={{ backgroundColor: "#f1f3f5" }}>
            <Table.Tr>
              <Table.Th>
                <Text size="sm" fw={600} c="dimmed">
                  Student Name
                </Text>
              </Table.Th>
              <Table.Th>
                <Text size="sm" fw={600} c="dimmed">
                  Batch Name
                </Text>
              </Table.Th>
              <Table.Th>
                <Text size="sm" fw={600} c="dimmed">
                  Pending Fees
                </Text>
              </Table.Th>
              <Table.Th>
                <Text size="sm" fw={600} c="dimmed">
                  Status
                </Text>
              </Table.Th>
              <Table.Th>
                <Text size="sm" fw={600} c="dimmed">
                  Actions
                </Text>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const pendingAmount = calculatePendingFees(student.feeRecords);

                return (
                  <Table.Tr key={student._id}>
                    {/* Name */}
                    <Table.Td>
                      <Text
                        size="sm"
                        fw={600}
                        style={{ textTransform: "capitalize" }}
                      >
                        {student.name}
                      </Text>
                    </Table.Td>

                    {/* Batch Name */}
                    <Table.Td>
                      <Badge variant="light" color="blue" radius="sm">
                        {student.batchId?.name || "N/A"}
                      </Badge>
                    </Table.Td>

                    {/* Calculated Pending Fees */}
                    <Table.Td>
                      <Text
                        size="sm"
                        fw={600}
                        c={pendingAmount > 0 ? "red.6" : "teal.7"}
                      >
                        {pendingAmount > 0
                          ? `₹${pendingAmount.toLocaleString()}`
                          : "Fully Paid"}
                      </Text>
                    </Table.Td>

                    {/* Hardcoded Passout Status */}
                    <Table.Td>
                      <Badge
                        variant="filled"
                        color="grape"
                        radius="xl"
                        size="sm"
                      >
                        Passout
                      </Badge>
                    </Table.Td>

                    {/* Action Dropdown Menu */}
                    <Table.Td>
                      <Menu
                        shadow="md"
                        width={200}
                        position="bottom-end"
                        transitionProps={{ transition: "pop" }}
                      >
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical
                              style={{ width: rem(18), height: rem(18) }}
                              stroke={1.5}
                            />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>Actions Available</Menu.Label>
                          <Menu.Item
                            leftSection={
                              <IconDownload
                                style={{ width: rem(14), height: rem(14) }}
                              />
                            }
                            onClick={() =>
                              handleDownloadCertificate(student._id)
                            }
                          >
                            Certificate
                          </Menu.Item>
                          <Menu.Item
                            leftSection={
                              <IconDownload
                                style={{ width: rem(14), height: rem(14) }}
                              />
                            }
                            onClick={() => downloadMarksheet(student._id)}
                          >
                            Marksheet
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            ) : (
              <Table.Tr>
                <Table.Td
                  colSpan={5}
                  style={{ textAlign: "center", padding: rem(40) }}
                >
                  <Text size="sm" c="dimmed" fw={500}>
                    No passout students found matching the filters.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Paper>
  );
}
