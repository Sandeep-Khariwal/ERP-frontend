"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Stack,
    Card,
    Button,
    Flex,
    Grid,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { SuccessNotification, ErrorNotification } from "@/app/helperFunction/Notification";
import { GetAllLiveTest } from "@/axios/tests/TestsGetApi";
import StudentTestPage from "./StudentTestModal";
import StudentResultModal from "./StudentResultModal"; // Import the result modal

interface Subject {
    _id: string;
    name: string;
}
interface AccessWindow {
  startTime: string;
  endTime: string;
}

interface TestData {
  _id: string;
  batchId: string;
  isCompleted: any[];
  isDeleted: boolean;
  name: string;
  questionAttempted: any[];
  questions: any[];
  resultId: any[];
  accessWindow: AccessWindow;   
  student_time: any[];
  subjectId: Subject;
  totalTime: number;
  __v: number;
}

interface StudentTestCardProps {
    studentId?: string;
    batchId: string;
    test?: any;
}

export default function StudentTestCard({ batchId, studentId }: StudentTestCardProps) {
    const [tests, setTests] = useState<TestData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTest, setSelectedTest] = useState<string>("")
    const [testModalOpened, setTestModalOpened] = useState(false);
    
    // States for result modal
    const [resultModalOpened, setResultModalOpened] = useState(false);
    const [selectedResultId, setSelectedResultId] = useState<string | null>(null);

    const isMd = useMediaQuery("(max-width: 968px)");

    useEffect(() => {
        getLiveQuiz();
    }, [batchId]);

    const getLiveQuiz = () => {
        setLoading(true);
        GetAllLiveTest(batchId)
            .then((x: any) => {
                console.log("testsdetails :", x);
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
        setSelectedTest("");
    };

    // Handler for showing result modal
    const handleShowResult = (test: TestData) => {
        console.log("handleShowResult called with test:", test);
        console.log("studentId:", studentId);
        console.log("test.resultId:", test.resultId);
        
        if (!studentId) {
            // If no studentId provided, take the first available result
            if (test.resultId.length > 0) {
                console.log("Using first result ID:", test.resultId[0].id);
                setSelectedResultId(test.resultId[0].id);
                setResultModalOpened(true);
            } else {
                console.log("No results found");
                ErrorNotification("No result found");
            }
            return;
        }

        // Get the result ID for the current student
        const studentResult = test.resultId.find(result => result.studentId === studentId);
        console.log("studentResult found:", studentResult);
        
        if (studentResult) {
            console.log("Using student result ID:", studentResult.id);
            setSelectedResultId(studentResult.id);
            setResultModalOpened(true);
        } else {
            console.log("No result found for student:", studentId);
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
            {loading ? (
                <Box ta="center" c="dimmed" py="xl">
                    Loading tests...
                </Box>
            ) : (
                <Box maw={1200} mx="auto" p="md">
                    <Stack gap="lg">
                        <Box component="h2" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                            Online Tests
                        </Box>

                        <Grid gutter={isMd ? "sm" : "lg"}>
                            {tests.map((test) => (
                                <Grid.Col
                                    span={{ base: 12, sm: 12, md: 12, lg: 12 }}
                                    key={test._id}
                                >
                                    <Card
                                        shadow="sm"
                                        padding="lg"
                                        radius="md"
                                        withBorder
                                        style={{
                                            width: "100%",
                                            minHeight: "180px",
                                        }}
                                    >

                                        <Stack gap="sm">
                                            <Box style={{ fontWeight: 700, fontSize: "1.2rem" }}>
                                                {test.name}
                                            </Box>
                                            <Box style={{ fontSize: "0.95rem", color: "#1976d2" }}>
                                                Subject: <strong>{test.subjectId?.name || "N/A"}</strong>
                                            </Box>
                                            <Box style={{ fontSize: "0.9rem", color: "gray" }}>
                                                Duration: {formatDuration(test.totalTime)}
                                            </Box>
                                            <Box style={{ fontSize: "0.9rem", color: "gray" }}>
                                                Questions: {test.questions?.length || 0}
                                            </Box>
                                            <Box style={{ fontSize: "0.9rem", color: "gray" }}>
                                                Time:{" "}
                                                {new Date(test.accessWindow?.startTime).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}{" "}
                                                | Date:{" "}
                                                {new Date(test.accessWindow?.startTime).toLocaleDateString("en-US", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </Box>

                                            <Flex justify="flex-end" align="center" mt="sm">
                                                {studentId ? 
                                                    // If studentId is provided, check for student-specific result
                                                    test.resultId?.some(result => result.studentId === studentId) ? (
                                                        <Button 
                                                            size="sm" 
                                                            color="blue"
                                                            onClick={() => handleShowResult(test)}
                                                        >
                                                            Result
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            color="orange"
                                                            onClick={() => handleStartTest(test._id)}
                                                        >
                                                            Start
                                                        </Button>
                                                    )
                                                    :
                                                    // If no studentId, show result if any results exist
                                                    test.resultId?.length > 0 ? (
                                                        <Button 
                                                            size="sm" 
                                                            color="blue"
                                                            onClick={() => handleShowResult(test)}
                                                        >
                                                            Result
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            color="orange"
                                                            onClick={() => handleStartTest(test._id)}
                                                        >
                                                            Start
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
                </Box>
            )}

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
                onClose={handleCloseResult}
            />
        </>
    );
}