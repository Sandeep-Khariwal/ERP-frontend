"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Title,
  Text,
  Stack,
  Button,
  Grid,
  Group,
  Badge,
  Loader,
  Flex,
} from "@mantine/core";
import { IconDownload, IconCalendarEvent, IconCertificate } from "@tabler/icons-react";

import { GetStudentDetail } from "@/axios/institute/InstituteGetApi";
import { generateAdmitCardHtml } from "./AdmitCardDesignHelper";
import { getBase64Image, ErrorNotification } from "@/app/helperFunction/Notification";
import { formatDate } from "@/app/components/marketing/utility/utils";
import { GetLoggedInStudentAdmitCards } from "@/axios/institute/ExaminatonApi";


export default function StudentAdmitCardView({ studentId,  batchId }: { studentId: string,  batchId:string }) {
  const [loading, setLoading] = useState(true);
  const [admitCards, setAdmitCards] = useState<any[]>([]);

  useEffect(() => {
    if (!studentId) return;

    setLoading(true);
    // Student side API to fetch ONLY this student's admit cards
    GetLoggedInStudentAdmitCards(studentId)
      .then((res: any) => {
        const list = res?.admitCards || res?.data || [];
        setAdmitCards(list);
      })
      .catch((err) => {
        console.error("Student admit card error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [studentId]);

  const handleDownload = async (record: any) => {
    try {
      const studentRes: any = await GetStudentDetail(studentId);
      const student = studentRes?.student;

      if (!student) {
        ErrorNotification("Unable to load profile data");
        return;
      }

      const instituteData = student.instituteId;

      const studentPhoto = await getBase64Image(student.profilePic);
      const instituteLogo = await getBase64Image(instituteData?.logo);
      const principalSign = await getBase64Image(
        instituteData?.signature || instituteData?.principalSignature
      );

      const html = generateAdmitCardHtml({
        instituteName: instituteData?.name,
        instituteLogo: instituteLogo,
        instituteAddress: instituteData?.address,
        institutePhone: instituteData?.institutePhoneNumber || instituteData?.phoneNumber,
        instituteEmail: instituteData?.email,
        principalSignature: principalSign,

        examName: record.examName,
        session: record.session,

        studentName: student.name,
        rollNumber: String(student.rollNumber || ""),
        enrollmentNo: student.enrollmentNo || "",
        batchName: student.batchId?.name || "Class",
        fatherName: student.parentName,
        motherName: student.motherName,
        dob: student.dateOfBirth ? formatDate(student.dateOfBirth) : "",
        studentPhoto: studentPhoto,

        schedules: record.schedules.map((s: any) => ({
          subjectName: s.subjectName,
          subjectCode: s.subjectCode,
          examDate: s.examDate ? formatDate(s.examDate) : "-",
          examTime: s.examTime,
          subjectType: s.subjectType,
        })),
      });

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();

        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.focus();
            printWindow.print();
          }
        }, 500);
      }
    } catch (err) {
      console.error(err);
      ErrorNotification("Failed to download admit card");
    }
  };

  return (
    <Box p="lg" style={{ minHeight: "80vh" }}>
      <Paper
        radius="16px"
        p="xl"
        mb="xl"
        style={{
          background: "linear-gradient(135deg, #EEF3FF 0%, #E0EAFF 100%)",
          border: "1px solid #DCE7FF",
        }}
      >
        <Group>
          <Flex
            align="center"
            justify="center"
            style={{
              width: 46,
              height: 46,
              borderRadius: "12px",
              background: "#FFFFFF",
            }}
          >
            <IconCertificate size={24} color="#2F6FED" />
          </Flex>
          <div>
            <Title order={3} c="#1B2559">
              My Examination Admit Cards
            </Title>
            <Text c="#5B6B8C" fz={13}>
              View and download your official examination hall tickets.
            </Text>
          </div>
        </Group>
      </Paper>

      {loading ? (
        <Flex justify="center" mt={60}>
          <Loader size="lg" color="blue" />
        </Flex>
      ) : admitCards.length === 0 ? (
        <Paper radius="16px" p={50} ta="center" withBorder bg="#FAFCFF">
          <IconCalendarEvent size={44} color="#4F7CFB" style={{ margin: "0 auto 10px" }} />
          <Title order={4} c="#1B2559">
            No Admit Card Available
          </Title>
          <Text c="dimmed" fz={13} mt={4}>
            Your school has not issued any admit card for your class yet.
          </Text>
        </Paper>
      ) : (
        <Grid gutter="lg">
          {admitCards.map((card) => (
            <Grid.Col key={card._id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Paper
                radius="16px"
                p="xl"
                withBorder
                style={{
                  background: "#fff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  transition: "transform 0.2s ease",
                }}
              >
                <Stack justify="space-between" style={{ height: "100%" }}>
                  <Box>
                    <Group justify="space-between" mb="xs">
                      <Badge color="blue" variant="light" size="lg" radius="xl">
                        {card.session}
                      </Badge>
                      <Text fz={12} c="dimmed">
                        {card.schedules?.length || 0} Subjects
                      </Text>
                    </Group>

                    <Title order={3} c="#1B2559" mt="xs">
                      {card.examName}
                    </Title>
                    <Text c="#5B6B8C" fz={13} mt={4}>
                      Official Hall Ticket & Examination Schedule
                    </Text>
                  </Box>

                  <Button
                    mt="xl"
                    fullWidth
                    radius="10px"
                    leftSection={<IconDownload size={18} />}
                    onClick={() => handleDownload(card)}
                    style={{
                      background: "linear-gradient(135deg, #4F7CFB 0%, #2F6FED 100%)",
                      fontWeight: 600,
                    }}
                  >
                    Download Admit Card
                  </Button>
                </Stack>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Box>
  );
}