"use client";

import { useState, useCallback, useEffect } from "react";

import {
  Box,
  Button,
  TextInput,
  Text,
  Title,
  Group,
  Stack,
  Drawer,
  Paper,
  Pagination,
  ThemeIcon,
  Flex,
  FileInput,
  Grid,
  Loader,
  Avatar,
} from "@mantine/core";

import { useMediaQuery, useDisclosure } from "@mantine/hooks";

import {
  IconPlus,
  IconBook,
  IconCheck,
  IconX,
  IconUpload,
  IconSparkles,
  IconDownload,
  IconUser,
  IconPhone,
} from "@tabler/icons-react";

import { notifications } from "@mantine/notifications";

import { CreateExamination } from "@/axios/institute/InstitutePostApi";
import {
  GetAllStudentsFromBatch,
  GetExamination,
} from "@/axios/institute/InstituteGetApi";
import { UploadExamination } from "@/axios/institute/InstitutePutApi";
import {
  getBase64Image,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import { formatDate } from "../../marketing/utility/utils";
import { GenerateAdmitCard } from "./htmlContent/AdmitCard";
import { GetStudentForIdCard } from "@/axios/student/StudentGetApi";
import { GetUpCommingExams } from "@/axios/batch/BatchGetApi";

// ───────────────── TYPES ─────────────────

interface ExaminationItem {
  _id: string;
  title: string;
  url: string;
}

export interface UpcomingExaminationData {
  _id: string;
  name: string;
  subjectId: { _id: string; name: string };
  batchId: { _id: string; name: string };
  totalTime: number;
  startTime: Date;
}

interface EntryFormProps {
  onCancel: () => void;
  batchId: string;
  fetchNotes: () => void;
  isLoading?: boolean;
  setIsLoading?: (v: boolean) => void;
}

// ───────────────── FORM ─────────────────

function EntryForm({
  onCancel,
  batchId,
  fetchNotes,
  isLoading,
  setIsLoading,
}: EntryFormProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSave = async () => {
    if (!title || !file) {
      notifications.show({
        title: "Validation Error",
        message: "Please fill all required fields",
        color: "red",
        icon: <IconX size={16} />,
      });
      return;
    }

    try {
      setIsLoading?.(true);

      const formData = new FormData();
      formData.append("examination", file);

      // STEP 1 → Upload
      const uploadRes: any = await UploadExamination(formData);
      const uploadedUrl =
        uploadRes?.url || uploadRes?.data?.url || uploadRes?.response?.url;

      await CreateExamination({
        batchId,
        title,
        url: uploadedUrl,
      });

      SuccessNotification("Examination Added!");
      fetchNotes();
      onCancel();
      setTitle("");
      setFile(null);
    } catch (e) {
      console.log(e);
      notifications.show({
        title: "Upload Failed",
        message: "Unable to upload study material right now. Please try again.",
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setIsLoading?.(false);
    }
  };

  return (
    <Stack gap="lg">
      <TextInput
        label="Examination Title"
        placeholder="Enter examination title"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        radius="xl"
        size="md"
        styles={{
          input: {
            border: "1px solid #e5dbff",
            background: "#faf7ff",
          },
        }}
      />

      <FileInput
        label="Examination File"
        placeholder="Choose file"
        value={file}
        onChange={setFile}
        radius="xl"
        size="md"
        leftSection={<IconUpload size={18} />}
        styles={{
          input: {
            border: "1px solid #e5dbff",
            background: "#faf7ff",
          },
        }}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="default" radius="xl" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          radius="xl"
          loading={isLoading}
          disabled={isLoading}
          onClick={handleSave}
          leftSection={<IconCheck size={18} />}
          style={{
            background: "linear-gradient(135deg, #5c3de8, #7b5ef8)",
          }}
        >
          Create Examination
        </Button>
      </Group>
    </Stack>
  );
}

// ───────────────── MAIN COMPONENT ─────────────────

export default function ExaminationPage(props: { batchId: string }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isLoading, setIsLoading] = useState(false);
  const [addDrawerOpen, { open: openAdd, close: closeAdd }] =
    useDisclosure(false);

  // States for Examination Collection
  const [entries, setEntries] = useState<ExaminationItem[]>([]);
  const [entryPage, setEntryPage] = useState(1);
  const EXAM_PAGE_SIZE = 6;

  // States for Students/Admit Cards
  const [examsData, setExamsData] = useState<UpcomingExaminationData[]>([]);
  const [students, setStudents] = useState<
    {
      _id: string;
      name: string;
      phoneNumber: string;
      parentName: string;
    }[]
  >([]);
  const [studentPage, setStudentPage] = useState(1);
  const STUDENT_PAGE_SIZE = 9;

  // ───────────────── FETCHING LOGIC ─────────────────

  const fetchExaminations = useCallback(() => {
    if (!props.batchId) return;
    setIsLoading(true);

    GetExamination(props.batchId)
      .then((res: any) => {
        const data =
          res?.data?.examination || res?.data?.data?.examination || [];
        const formatted: ExaminationItem[] = data.map((item: any) => ({
          _id: item._id,
          title: item.title,
          url: item.url,
        }));
        setEntries(formatted);
      })
      .catch((e: any) => {
        notifications.show({
          title: "Something Went Wrong",
          message: "Unable to load study materials right now.",
          color: "red",
          icon: <IconX size={16} />,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [props.batchId, setIsLoading]);

  const fetchAllStudents = (id: string) => {
    GetAllStudentsFromBatch(id)
      .then((x: any) => {
        const { students } = x.students;
        const studentData = students.map((s: any) => {
          return {
            _id: s._id,
            name: s.name,
            phoneNumber: s.phoneNumber,
            parentName: s.parentName,
          };
        });
        setStudents(studentData);
      })
      .catch((e) => console.log(e));
  };

  const fetchUpcommingExams = (id: string) => {
    GetUpCommingExams(id)
      .then((res: any) => {
        setExamsData(res.data);
      })
      .catch((e: any) => console.log(e));
  };

  useEffect(() => {
    if (props.batchId) {
      fetchExaminations();
      fetchUpcommingExams(props.batchId);
      fetchAllStudents(props.batchId);
    }
  }, [props.batchId, fetchExaminations]);

  // ───────────────── ADMIT CARD GENERATOR ─────────────────

  const downloadAdmitCard = (id: string) => {
    GetStudentForIdCard(id)
      .then(async (res: any) => {
        const studentInfo = res.student;

        const base64Profile = await getBase64Image(studentInfo.profilePic);
        const base64Logo = await getBase64Image(studentInfo.instituteId.logo);

        const idCardhtml = GenerateAdmitCard({
          schoolName: studentInfo.instituteId.name,
          schoolLogo: base64Logo,
          schoolAddress: studentInfo.instituteId.address,
          institutePhoneNumber: studentInfo.instituteId.institutePhoneNumber,
          studentName: studentInfo.name,
          studentPhoto: base64Profile,
          className: studentInfo.batchId.name,
          rollNo: studentInfo.rollNumber,
          entrollmentNum: studentInfo.enrollmentNo,
          dob: formatDate(studentInfo.dateOfBirth),
          phone: studentInfo.phoneNumber,
          address: studentInfo.address,
          principalSignature: studentInfo.instituteId.signature,
          examsData,
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
      .catch((e: any) => {
        console.log(e);
      });
  };

  // ───────────────── PAGINATION COMPUTATIONS ─────────────────

  const totalExamPages = Math.max(
    1,
    Math.ceil(entries.length / EXAM_PAGE_SIZE),
  );
  const paginatedEntries = entries.slice(
    (entryPage - 1) * EXAM_PAGE_SIZE,
    entryPage * EXAM_PAGE_SIZE,
  );

  const totalStudentPages = Math.max(
    1,
    Math.ceil(students.length / STUDENT_PAGE_SIZE),
  );
  const paginatedStudents = students.slice(
    (studentPage - 1) * STUDENT_PAGE_SIZE,
    studentPage * STUDENT_PAGE_SIZE,
  );

  return (
    <Box
      p={isMobile ? "sm" : "xl"}
      style={{
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* HEADER BANNER */}
      <Paper
        radius="28px"
        p="xl"
        mb="xl"
        style={{
          background: "linear-gradient(135deg, #5c3de8, #7b5ef8)",
          color: "white",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 10px 30px rgba(92,61,232,0.2)",
        }}
      >
        {/* Subtle Background Glow Elements */}
        <Box
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        />

        <Group
          justify="space-between"
          style={{ position: "relative", zIndex: 1 }}
        >
          <Stack gap={4}>
            <Group>
              <ThemeIcon size={54} radius="xl" color="white" variant="light">
                <IconSparkles size={28} />
              </ThemeIcon>

              <div>
                <Title order={2} c="white">
                  Examinations
                </Title>

                <Text c="rgba(255,255,255,0.8)">
                  Manage exam schedules & admit cards
                </Text>
              </div>
            </Group>
          </Stack>

          <Button
            leftSection={<IconPlus size={18} />}
            radius="xl"
            size="md"
            onClick={openAdd}
            color="white"
            c="#5c3de8"
            style={{ fontWeight: 600 }}
          >
            New Examination
          </Button>
        </Group>
      </Paper>

      {/* LOADING STATE */}
      {isLoading ? (
        <Flex justify="center" mt={80}>
          <Loader color="violet" size="lg" type="bars" />
        </Flex>
      ) : (
        <Stack gap={40}>
          {/* SECTION 1: EXAMINATION COLLECTION */}
          {entries.length === 0 ? (
            <Paper
              radius="24px"
              p={60}
              ta="center"
              style={{
                background: "#faf7ff",
                border: "1px dashed #cdbdff",
              }}
            >
              <ThemeIcon
                size={80}
                radius="100%"
                mx="auto"
                mb="md"
                style={{
                  background: "linear-gradient(135deg, #5c3de8, #7b5ef8)",
                }}
              >
                <IconBook size={40} />
              </ThemeIcon>

              <Title order={3}>No Examination Found</Title>

              <Text c="dimmed" mt={6}>
                Upload examination schedules and notices
              </Text>

              <Button
                mt="xl"
                radius="xl"
                leftSection={<IconPlus size={18} />}
                onClick={openAdd}
                style={{
                  background: "linear-gradient(135deg, #5c3de8, #7b5ef8)",
                }}
              >
                Create Examination
              </Button>
            </Paper>
          ) : (
            <Paper
              radius="24px"
              p="lg"
              style={{
                background: "#fff",
                border: "1px solid #f1ebff",
                boxShadow: "0 10px 30px rgba(92,61,232,0.05)",
              }}
            >
              <Group justify="space-between" mb="xl">
                <div>
                  <Title
                    order={2}
                    style={{
                      color: "#1a1a2e",
                      fontWeight: 700,
                    }}
                  >
                    Examination Collection
                  </Title>

                  <Text size="sm" c="dimmed">
                    {entries.length} Examinations Found
                  </Text>
                </div>
              </Group>

              <Grid gutter="xl">
                {paginatedEntries.map((item) => (
                  <Grid.Col
                    key={item._id}
                    span={{
                      base: 12,
                      sm: 6,
                      lg: 4,
                    }}
                  >
                    <Paper
                      radius="24px"
                      p={0}
                      style={{
                        overflow: "hidden",
                        background: "#ffffff",
                        border: "1px solid #ede7ff",
                        boxShadow: "0 12px 35px rgba(92,61,232,0.10)",
                        transition: "all .3s ease",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Stack gap={0}>
                        <Box
                          style={{
                            aspectRatio: "16 / 10",
                            overflow: "hidden",
                            background: "#f5f5f5",
                          }}
                        >
                          <img
                            src={item.url}
                            alt={item.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </Box>

                        <Box
                          p="lg"
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Text
                            fw={700}
                            size="lg"
                            mb="xs"
                            lineClamp={2}
                            style={{ minHeight: "56px" }}
                          >
                            {item.title}
                          </Text>

                          <Text size="sm" c="dimmed" mb="lg">
                            Examination Schedule
                          </Text>

                          <Box style={{ flexGrow: 1 }} />

                          <Button
                            component="a"
                            href={item.url}
                            target="_blank"
                            radius="xl"
                            size="md"
                            fullWidth
                            style={{
                              background:
                                "linear-gradient(135deg,#5c3de8,#7b5ef8)",
                            }}
                          >
                            View Examination
                          </Button>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid.Col>
                ))}
              </Grid>

              {entries.length > EXAM_PAGE_SIZE && (
                <Flex
                  justify="space-between"
                  align="center"
                  mt="xl"
                  direction={isMobile ? "column" : "row"}
                  gap="sm"
                >
                  <Text size="sm" c="dimmed">
                    Showing{" "}
                    {Math.min(
                      (entryPage - 1) * EXAM_PAGE_SIZE + 1,
                      entries.length,
                    )}{" "}
                    to {Math.min(entryPage * EXAM_PAGE_SIZE, entries.length)} of{" "}
                    {entries.length} resources
                  </Text>

                  <Pagination
                    total={totalExamPages}
                    value={entryPage}
                    onChange={setEntryPage}
                    radius="xl"
                    size="sm"
                    styles={{
                      control: {
                        "&[data-active]": {
                          background: "#5c3de8",
                          borderColor: "#5c3de8",
                        },
                      },
                    }}
                  />
                </Flex>
              )}
            </Paper>
          )}

          {/* SECTION 2: ONLINE TEST ADMIT CARD (Conditional Render) */}
          {examsData.length > 0 && (
            <Paper
              radius="24px"
              p="lg"
              style={{
                background: "#fff",
                border: "1px solid #f1ebff",
                boxShadow: "0 10px 30px rgba(92,61,232,0.05)",
              }}
            >
              <Group justify="space-between" mb="xl">
                <div>
                  <Title
                    order={2}
                    style={{
                      color: "#1a1a2e",
                      fontWeight: 800,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Online Test Admit Card
                  </Title>

                  <Text size="sm" c="dimmed" fw={500} mt={2}>
                    Select a student to generate and download their upcoming
                    admit card
                  </Text>
                </div>
                <Box
                  px="md"
                  py="xs"
                  style={{
                    background: "#f4f0ff",
                    borderRadius: "20px",
                    color: "#5c3de8",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  {students.length} Total Students
                </Box>
              </Group>

              {students.length === 0 ? (
                <Paper
                  radius="xl"
                  p={60}
                  ta="center"
                  style={{ background: "#faf7ff" }}
                >
                  <Text c="dimmed">No students found in this batch.</Text>
                </Paper>
              ) : (
                <Grid gutter="lg">
                  {paginatedStudents.map((student) => (
                    <Grid.Col
                      key={student._id}
                      span={{
                        base: 12,
                        sm: 6,
                        lg: 4,
                      }}
                    >
                      <Paper
                        radius="16px"
                        p="lg"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #ede7ff",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                          transition: "all .2s ease-in-out",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow =
                            "0 12px 30px rgba(92,61,232,0.12)";
                          e.currentTarget.style.borderColor = "#cdbdff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 20px rgba(0,0,0,0.02)";
                          e.currentTarget.style.borderColor = "#ede7ff";
                        }}
                      >
                        <Group align="flex-start" wrap="nowrap">
                          <Avatar
                            size="md"
                            radius="xl"
                            color="violet"
                            style={{
                              background:
                                "linear-gradient(135deg, #e5dbff, #d1bfff)",
                              color: "#5c3de8",
                            }}
                          >
                            {student.name.charAt(0).toUpperCase()}
                          </Avatar>

                          <Box style={{ flex: 1 }}>
                            <Text fw={700} size="md" c="#1a1a2e" lineClamp={1}>
                              {student.name}
                            </Text>
                            <Group gap="xs" mt={4}>
                              <IconPhone size={14} color="#8e8e8e" />
                              <Text size="xs" c="dimmed">
                                {student.phoneNumber || "No Contact"}
                              </Text>
                            </Group>
                          </Box>
                        </Group>

                        <Button
                          fullWidth
                          mt="md"
                          radius="xl"
                          variant="light"
                          color="violet"
                          leftSection={<IconDownload size={16} />}
                          onClick={() => downloadAdmitCard(student._id)}
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          Download Admit Card
                        </Button>
                      </Paper>
                    </Grid.Col>
                  ))}
                </Grid>
              )}

              {/* Premium Pagination Footer */}
              {students.length > STUDENT_PAGE_SIZE && (
                <Flex
                  justify="space-between"
                  align="center"
                  mt={40}
                  pt={20}
                  style={{ borderTop: "1px solid #f1ebff" }}
                  direction={isMobile ? "column" : "row"}
                  gap="sm"
                >
                  <Text size="sm" c="dimmed" fw={500}>
                    Showing{" "}
                    <span style={{ color: "#1a1a2e" }}>
                      {Math.min(
                        (studentPage - 1) * STUDENT_PAGE_SIZE + 1,
                        students.length,
                      )}
                    </span>{" "}
                    to{" "}
                    <span style={{ color: "#1a1a2e" }}>
                      {Math.min(
                        studentPage * STUDENT_PAGE_SIZE,
                        students.length,
                      )}
                    </span>{" "}
                    of{" "}
                    <span style={{ color: "#1a1a2e" }}>{students.length}</span>{" "}
                    students
                  </Text>

                  <Pagination
                    total={totalStudentPages}
                    value={studentPage}
                    onChange={setStudentPage}
                    radius="xl"
                    size="sm"
                    styles={{
                      control: {
                        border: "none",
                        "&[data-active]": {
                          background:
                            "linear-gradient(135deg, #5c3de8, #7b5ef8)",
                          boxShadow: "0 4px 10px rgba(92,61,232,0.3)",
                        },
                      },
                    }}
                  />
                </Flex>
              )}
            </Paper>
          )}
        </Stack>
      )}

      {/* DRAWER FOR CREATING EXAM */}
      <Drawer
        opened={addDrawerOpen}
        onClose={closeAdd}
        title={
          <Group gap="xs">
            <ThemeIcon
              size={34}
              radius="xl"
              style={{
                background: "linear-gradient(135deg, #5c3de8, #7b5ef8)",
              }}
            >
              <IconBook size={18} />
            </ThemeIcon>

            <Text fw={700} size="lg">
              Add Examination
            </Text>
          </Group>
        }
        position="right"
        size={isMobile ? "100%" : 460}
        padding="xl"
      >
        <EntryForm
          onCancel={closeAdd}
          batchId={props.batchId}
          fetchNotes={fetchExaminations}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </Drawer>
    </Box>
  );
}
