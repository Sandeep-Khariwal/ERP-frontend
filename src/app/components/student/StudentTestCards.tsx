"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Card,
  Button,
  Flex,
  Grid,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import {
  SuccessNotification,
  ErrorNotification,
} from "@/app/helperFunction/Notification";
import { GetAllLiveTest } from "@/axios/tests/TestsGetApi";
import StudentTestPage from "./StudentTestModal";
import StudentResultModal from "./StudentResultModal"; // Import the result modal

interface Subject {
  _id: string;
  name: string;
}

interface TestData {
  _id: string;
  batchId: string;
  isCompleted: any[];
  isDeleted: boolean;
  name: string;
  questionAttempted: any[];
  questions: any[];
  resultId: string;
  startTime: Date;
  isLiveNow: boolean;
  student_time: any[];
  subjectId: Subject;
  totalTime: number;
  expired?: boolean;
  __v: number;
}

interface StudentTestCardProps {
  studentId?: string;
  batchId: string;
  test?: any;
}

export default function StudentTestCard({
  batchId,
  studentId,
}: StudentTestCardProps) {
  const [tests, setTests] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [testModalOpened, setTestModalOpened] = useState(false);

  // States for result modal
  const [resultModalOpened, setResultModalOpened] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  useEffect(() => {
    getLiveQuiz();
  }, [batchId]);

  const getLiveQuiz = () => {
    setLoading(true);
    GetAllLiveTest(batchId)
      .then((x: any) => {
        setTests(x.data || []);
        SuccessNotification("Tests loaded successfully");
      })
      .catch(() => ErrorNotification("Failed to load tests"))
      .finally(() => setLoading(false));
  };

  const formatDuration = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const handleStartTest = (testId: string) => {
    setSelectedTest(testId);
    setTestModalOpened(true);
  };

  const handleCloseTest = () => {
    setTestModalOpened(false);
    getLiveQuiz();
    setSelectedTest("");
  };

  // Handler for showing result modal
  const handleShowResult = (test: TestData) => {
    if (!studentId) {
      // If no studentId provided, take the first available result

      if (test.resultId.length > 0) {
        setSelectedResultId(test.resultId);
        setResultModalOpened(true);
      } else {
        ErrorNotification("No result found");
      }
      return;
    }
    if (test.resultId) {
      setSelectedResultId(test.resultId);
      setResultModalOpened(true);
    } else {
      ErrorNotification("No result found for this student");
    }
  };

  // Handler for closing result modal
  const handleCloseResult = () => {
    setResultModalOpened(false);
    setSelectedResultId(null);
  };

  return (
    <>
      <Stack w="100%" mx="auto" p={{ base: "xs", sm: "md" }} style={{ minWidth: 0 }}>
        <LoadingOverlay visible={loading} />
        <Stack w="100%" style={{ minWidth: 0 }}>
          <Text fw={700} fz={18} c="#172033" style={{ fontFamily: "Poppins" }}>Online Tests</Text>

          <Grid gutter="md" w="100%">
            {tests.map((test) => (
              <Grid.Col key={test._id} span={{ base: 12, xs: 6, sm: 4 }}>
              <Card shadow="0 2px 8px rgba(20, 42, 76, 0.06)" padding="md" radius={10} withBorder style={{ minHeight: 180, height: "100%", borderColor: "#e5eaf2" }}>
                <Stack gap="sm">
                  <Box style={{ fontWeight: 700, fontSize: 15, color: "#172033", overflowWrap: "anywhere" }}>
                    {test.name}
                  </Box>
                  <Box style={{ fontSize: 12, color: "#0755d9" }}>
                    Subject: <strong>{test.subjectId?.name || "N/A"}</strong>
                  </Box>
                  <Box style={{ fontSize: 12, color: "#667085" }}>
                    Duration: {formatDuration(test.totalTime)}
                  </Box>
                  <Box style={{ fontSize: 12, color: "#667085" }}>
                    Questions: {test.questions?.length || 0}
                  </Box>
                  <Box style={{ fontSize: 12, color: "#667085" }}>
                    Time:{" "}
                    {new Date(test.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    | Date:{" "}
                    {new Date(test?.startTime).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Box>

                  <Flex justify="flex-end" align="center" mt="sm">
                    {test.resultId ? (
                      <Button
                        size="sm"
                        radius="md"
                        color="blue"
                        onClick={() => handleShowResult(test)}
                      >
                        Result
                      </Button>
                    ) : test.isLiveNow ? (
                      <Button
                        size="sm"
                        radius="md"
                        color="green"
                        onClick={() => handleStartTest(test._id)}
                      >
                        Start Test
                      </Button>
                    ) : test.expired
                      ? (
                        <Button size="sm" color="orange" radius="md" disabled>
                          Expired
                        </Button>
                      ) :
                      (<Button size="sm" color="yellow" radius="md">
                        Start Soon
                      </Button>
                      )

                    }
                  </Flex>
                </Stack>
              </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Stack>

      {/* Test Modal */}
      <StudentTestPage
        opened={testModalOpened}
        testId={selectedTest}
        onClose={handleCloseTest}
      />

      {/* Result Modal */}
      <StudentResultModal
        opened={resultModalOpened}
        resultId={selectedResultId}
        studentId={studentId!!}
        onClose={handleCloseResult}
      />
    </>
  );
}
