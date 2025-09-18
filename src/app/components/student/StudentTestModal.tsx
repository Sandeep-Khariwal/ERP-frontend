"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Stack,
  Text,
  Flex,
  Box,
  Paper,
  Group,
  Loader,
  Center,
  Grid,
  Modal,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { GetOnlineTest } from "@/axios/tests/TestsGetApi";
import { SubmitStudentResponse, SubmitTest } from "@/axios/tests/Tests.post"; // Import from your API file
import { SuccessNotification, ErrorNotification } from "@/app/helperFunction/Notification";

type StudentTestPageProps = {
  opened: boolean;
  testId: string | null;
  onClose: () => void;
};

interface Option {
  _id: string;
  name: string;
}

interface Question {
  _id: string;
  question: string;
  options: Option[];
}

interface Test {
  _id: string;
  name: string;
  questions: Question[];
  totalTime: number;
  subjectId: {
    _id: string;
    name: string;
  };
}

const StudentTestPage = ({ testId, onClose, opened }: StudentTestPageProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [selectedOptions, setSelectedOptions] = useState<Map<number, string>>(new Map());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  
  const isMd = useMediaQuery("(max-width: 968px)");

  // Prevent modal close during active test
  const handleModalClose = () => {
    if (testStarted && !submitted) {
      if (confirm("Are you sure you want to exit? Your test will be automatically submitted!")) {
        handleSubmitTest();
      }
    } else {
      onClose();
    }
  };

  // Prevent browser back/forward and page refresh
  useEffect(() => {
    if (!opened || !testStarted) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submitted) {
        e.preventDefault();
        e.returnValue = 'Test in progress. Are you sure you want to leave?';
        handleSubmitTest();
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (!submitted) {
        e.preventDefault();
        handleSubmitTest();
        window.history.pushState(null, '', window.location.href);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'r') ||
        e.key === 'F5'
      ) {
        e.preventDefault();
        ErrorNotification("This action is not allowed during the test!");
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [opened, testStarted, submitted]);

  // Tab switching detection
  useEffect(() => {
    if (!opened || !testStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden && !submitted) {
        ErrorNotification("⚠️ Tab switching detected! Test will be auto-submitted!");
        handleSubmitTest();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [opened, testStarted, submitted]);

  // Fullscreen enter
  const enterFullscreen = (): void => {
    const el = document.documentElement as any;
    
    try {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    } catch (error) {
      // Silent fail
      console.error("Fullscreen error:", error);
    }
  };

  // Fetch test + questions
  useEffect(() => {
    if (testId && opened) {
      setLoading(true);
      setTestStarted(false);
      setSubmitted(false);
      setCurrentQuestionIndex(0);
      setAnsweredQuestions(new Set());
      setSelectedOptions(new Map());
      setStartTime(Date.now());
      
      GetOnlineTest(testId)
        .then((res: any) => {
          const testData = res.data || res;
          setTest(testData);
          setQuestions(testData?.questions || []);
          setLoading(false);
          setTestStarted(true);
          enterFullscreen();
          SuccessNotification("Test loaded successfully! Test has started.");
        })
        .catch((err: unknown) => {
          console.error("Test fetch error:", err);
          setLoading(false);
          ErrorNotification("Failed to load test. Please try again.");
        });
    }
  }, [testId, opened]);

  // Reset state when modal closes
  useEffect(() => {
    if (!opened) {
      setTestStarted(false);
      setSubmitted(false);
      setCurrentQuestionIndex(0);
      setAnsweredQuestions(new Set());
      setSelectedOptions(new Map());
      setTest(null);
      setQuestions([]);
    }
  }, [opened]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentSelectedOption = selectedOptions.get(currentQuestionIndex);

  // Converted to .then() - handles option selection
  const handleOptionClick = (option: Option) => {
    if (submitted || answeredQuestions.has(currentQuestionIndex)) return;

    const pendingTime = Date.now() - startTime;
    
    SubmitStudentResponse({
      optionId: option._id,
      pendingTime,
      questionId: currentQuestion._id,
    })
    .then(() => {
      const newAnsweredQuestions = new Set(answeredQuestions);
      newAnsweredQuestions.add(currentQuestionIndex);
      setAnsweredQuestions(newAnsweredQuestions);

      const newSelectedOptions = new Map(selectedOptions);
      newSelectedOptions.set(currentQuestionIndex, option._id);
      setSelectedOptions(newSelectedOptions);

      SuccessNotification("Answer submitted successfully!");
    })
    .catch((error: unknown) => {
      console.error("Failed to submit answer:", error);
      ErrorNotification("Failed to submit answer. Please try again.");
    });
  };

  const goNext = (): void => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goBack = (): void => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Already using .then() - handles final test submission
  const handleSubmitTest = () => {
    if (!testId) return;
    console.log("Submitting test with testId:", testId); 

    setSubmitting(true);
    SubmitTest({ testId })
      .then((response: any) => {
        console.log("Test submission response:", response);
        setSubmitted(true);
        SuccessNotification("Test submitted successfully!");
        setSubmitting(false);
        
        setTimeout(() => {
          onClose();
        }, 2000);
      })
      .catch((error: unknown) => {
        console.error("Failed to submit test:", error);
        ErrorNotification("Failed to submit test. Please try again.");
        setSubmitting(false);
      });
  };

  const renderModalContent = () => {
    if (loading) {
      return (
        <Center h="80vh">
          <Stack align="center" gap="sm">
            <Loader size="lg" />
            <Text size="lg" fw={500}>Loading test...</Text>
            <Text size="sm" c="dimmed">Please wait while we prepare your test</Text>
          </Stack>
        </Center>
      );
    }

    if (!questions.length) {
      return (
        <Center h="80vh">
          <Stack align="center" gap="sm">
            <Text size="lg" c="red">No questions available</Text>
            <Button onClick={onClose}>Close</Button>
          </Stack>
        </Center>
      );
    }

    if (submitted) {
      return (
        <Center h="80vh">
          <Stack align="center" gap="sm">
            <Text size="xl" fw={700} c="green">✅ Test Submitted Successfully!</Text>
            <Text size="md" c="dimmed">Thank you for completing the test.</Text>
            <Text size="sm" c="dimmed">You can view your results later.</Text>
            <Button onClick={onClose} size="lg" mt="lg">
              Close Test
            </Button>
          </Stack>
        </Center>
      );
    }

    return (
      <Box style={{ height: '100%', overflowY: 'auto' }}>
        <Grid gutter={isMd ? "sm" : "lg"} h="100%">
          <Grid.Col span={12}>
            {/* Test Header */}
            <Box mb="md" p="sm" bg="blue.0" style={{ borderRadius: '8px' }}>
              <Flex justify="space-between" align="center">
                <Box>
                  <Text size="xl" fw={700} c="blue.8">{test?.name}</Text>
                  <Text size="sm" c="dimmed">Subject: {test?.subjectId?.name}</Text>
                </Box>
                <Box ta="center">
                  <Text size="sm" c="dimmed">Question</Text>
                  <Text size="lg" fw={700} c="blue.8">
                    {currentQuestionIndex + 1}/{questions.length}
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Grid.Col>

          <Grid.Col span={12}>
            {/* Question indicators */}
            <Flex wrap="wrap" justify="center" gap={isMd ? "xs" : "sm"} mb="lg">
              {questions.map((_, i: number) => {
                let bgColor = "gray";
                if (i === currentQuestionIndex) {
                  bgColor = "blue";
                } else if (answeredQuestions.has(i)) {
                  bgColor = "green";
                }

                return (
                  <Box
                    key={i}
                    w={isMd ? 30 : 35}
                    h={isMd ? 30 : 35}
                    bg={bgColor}
                    onClick={() => setCurrentQuestionIndex(i)}
                    style={{
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: i === currentQuestionIndex ? "3px solid white" : "2px solid transparent",
                      fontSize: isMd ? "14px" : "16px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {i + 1}
                  </Box>
                );
              })}
            </Flex>
          </Grid.Col>

          <Grid.Col span={12}>
            {/* Question */}
            <Paper p="lg" bg="gray.0" radius="md" mb="lg">
              <Text fw={600} size={isMd ? "lg" : "xl"} c="dark.8">
                Q{currentQuestionIndex + 1}. {currentQuestion.question}
              </Text>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            {/* Options */}
            <Stack gap={isMd ? "sm" : "md"}>
              {currentQuestion.options.map((option: Option, idx: number) => {
                const isSelected = currentSelectedOption === option._id;
                const isAnswered = answeredQuestions.has(currentQuestionIndex);

                let bgColor = "white";
                let textColor = "dark.7";
                let borderColor = "#e0e0e0";

                if (isSelected) {
                  bgColor = "blue.0";
                  textColor = "blue.8";
                  borderColor = "#1976d2";
                }

                return (
                  <Paper
                    key={option._id}
                    shadow="xs"
                    p={isMd ? "md" : "lg"}
                    radius="md"
                    bg={bgColor}
                    style={{
                      cursor: isAnswered ? "not-allowed" : "pointer",
                      color: textColor,
                      fontWeight: 500,
                      fontSize: isMd ? "16px" : "18px",
                      border: `2px solid ${borderColor}`,
                      opacity: isAnswered && !isSelected ? 0.6 : 1,
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => handleOptionClick(option)}
                  >
                    <Text>{String.fromCharCode(65 + idx)}. {option.name}</Text>
                  </Paper>
                );
              })}
            </Stack>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper p="md" bg="gray.0" radius="md" mt="auto">
              <Group justify="space-between">
                <Button 
                  onClick={goBack} 
                  disabled={currentQuestionIndex === 0}
                  size={isMd ? "md" : "lg"}
                  variant="outline"
                  leftSection="←"
                >
                  Previous
                </Button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button 
                    onClick={goNext} 
                    size={isMd ? "md" : "lg"}
                    rightSection="→"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    color="green" 
                    onClick={handleSubmitTest} 
                    size={isMd ? "md" : "lg"}
                    loading={submitting}
                    leftSection="✓"
                  >
                    Submit Test
                  </Button>
                )}
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      </Box>
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={handleModalClose}
      title={null}
      size="100%"
      padding={0}
      radius={0}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      centered
      styles={{
        content: {
          height: '100vh',
          maxHeight: '100vh',
          margin: 0,
          borderRadius: 0,
        },
        body: {
          height: '100vh',
          padding: isMd ? '16px' : '24px',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {renderModalContent()}
    </Modal>
  );
};

export default StudentTestPage;