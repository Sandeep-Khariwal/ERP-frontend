"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Text,
  Button,
  Group,
  Stack,
  Paper,
  Divider,
  Loader,
  Center,
  ScrollArea,
  Flex,
  RingProgress,
  Badge,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { GetTestResult } from "@/axios/tests/TestsGetApi";
import { SuccessNotification, ErrorNotification } from "@/app/helperFunction/Notification";

type TestResultModalProps = {
  opened: boolean;
  resultId: string | null;
  studentId: string;
  onClose: () => void;
};

interface Option {
  _id: string;
  name: string;
  answer: boolean;
}

// Fixed: attempt can be either array or object
interface Attempt {
  studentId: string;
  optionId: string;
}

interface Question {
  _id: string;
  question: string;
  correctAns: string;
  explaination: string;
  options: Option[];
  attempt: Attempt | Attempt[]; // Support both formats
  testId: string;
}

interface TestResult {
  _id: string;
  studentId: string;
  testId: string;
  batchId: string;
  subjectId: string;
  questions: Question[];
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  totalTimeSpent: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const StudentResultModal = ({ opened, resultId, studentId, onClose }: TestResultModalProps) => {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  

  useEffect(() => {
    if (opened && resultId) {
      setLoading(true);
      GetTestResult(resultId,studentId)
        .then((res: any) => {
          console.log("API Response:", res);
          const data = res.data || res;
          
          // Process the data to fix any inconsistencies
          const processedData = {
            ...data,
            ...calculateStats(data.questions || [])
          };

          setTestResult(processedData);
          setLoading(false);
          // SuccessNotification("Result loaded");
        })
        .catch((error) => {
          console.error("API Error:", error);
          setLoading(false);
          ErrorNotification("Failed to load result");
        });
    }
  }, [opened, resultId]);

  // Fixed: Handle both array and object format for attempt
  const getUserSelectedOption = (q: Question) => {
    let optionId: string | null = null;
    
    if (Array.isArray(q.attempt)) {
      optionId = q.attempt.length > 0 ? q.attempt[0].optionId : null;
    } else if (q.attempt && typeof q.attempt === 'object') {
      optionId = q.attempt.optionId;
    }
    
    return optionId ? q.options.find((o) => o._id === optionId) || null : null;
  };

  const getCorrectOption = (q: Question) => q.options.find((o) => o.answer) || null;

  const isQuestionAttempted = (q: Question) => {
    if (Array.isArray(q.attempt)) {
      return q.attempt.length > 0;
    } else if (q.attempt && typeof q.attempt === 'object') {
      return !!q.attempt.optionId;
    }
    return false;
  };

  // Calculate correct stats from actual question data
  const calculateStats = (questions: Question[]) => {
    console.log("questions : ",questions);
    
    let attemptedQuestions = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    questions.forEach(q => {
      if (isQuestionAttempted(q)) {
        attemptedQuestions++;
        const selected = getUserSelectedOption(q);
        const correct = getCorrectOption(q);
        
        if (selected && correct && selected._id === correct._id) {
          correctAnswers++;
        } else {
          wrongAnswers++;
        }
      }
    });

    const accuracy = attemptedQuestions > 0 ? (correctAnswers / attemptedQuestions) * 100 : 0;

    return {
      attemptedQuestions,
      correctAnswers,
      wrongAnswers,
      accuracy
    };
  };

  const renderSummary = () => {
    const total = testResult?.totalQuestions ?? 1;
    const correct = testResult?.correctAnswers ?? 0;
    const wrong = testResult?.wrongAnswers ?? 0;
    const attempted = testResult?.attemptedQuestions ?? 0;
    const notAttempted = total - attempted;

    return (
      <Stack gap="md" p="md">
        <Text fw={700} size="xl" ta="center">
          Test Summary
        </Text>

        <Paper p="md" radius="md" withBorder>
          <Flex justify="space-around">
            <Stack align="center">
              <Text size="sm" c="dimmed">Total</Text>
              <Text fw={700} size="lg">{total}</Text>
            </Stack>
            <Stack align="center">
              <Text size="sm" c="dimmed">Attempted</Text>
              <Text fw={700} size="lg" c="blue">{attempted}</Text>
            </Stack>
            <Stack align="center">
              <Text size="sm" c="dimmed">Correct</Text>
              <Text fw={700} size="lg" c="green">{correct}</Text>
            </Stack>
            <Stack align="center">
              <Text size="sm" c="dimmed">Wrong</Text>
              <Text fw={700} size="lg" c="red">{wrong}</Text>
            </Stack>
          </Flex>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Center>
            <RingProgress
              size={160}
              thickness={8}
              sections={[
                { value: (correct / total) * 100, color: "green", tooltip: `Correct: ${correct}` },
                { value: (wrong / total) * 100, color: "red", tooltip: `Wrong: ${wrong}` },
                { value: (notAttempted / total) * 100, color: "gray", tooltip: `Not Attempted: ${notAttempted}` },
              ]}
              label={
                <Stack gap={2} align="center">
                  <Text size="lg" fw={700}>
                    {Math.round(testResult?.accuracy ?? 0)}%
                  </Text>
                  <Text size="xs" c="dimmed">
                    Accuracy
                  </Text>
                </Stack>
              }
            />
          </Center>
          <Group justify="center" mt="sm">
            <Flex gap="md">
              <Group gap={4}>
                <Box w={12} h={12} bg="green" style={{ borderRadius: "50%" }} />
                <Text size="xs">Correct ({correct})</Text>
              </Group>
              <Group gap={4}>
                <Box w={12} h={12} bg="red" style={{ borderRadius: "50%" }} />
                <Text size="xs">Wrong ({wrong})</Text>
              </Group>
              <Group gap={4}>
                <Box w={12} h={12} bg="gray" style={{ borderRadius: "50%" }} />
                <Text size="xs">Not Attempted ({notAttempted})</Text>
              </Group>
            </Flex>
          </Group>
        </Paper>
      </Stack>
    );
  };

  const renderQuestions = () => (
    <Stack gap="md" p="md">
      <Text fw={700} size="xl" ta="center">
        Question Review
      </Text>
      {testResult?.questions.map((q, idx) => {
        const selected = getUserSelectedOption(q);
        const correct = getCorrectOption(q);
        const correctId = correct?._id;
        const isCorrect = selected?._id === correctId;
        const isAttempted = isQuestionAttempted(q);

        return (
          <Paper key={q._id} p="md" radius="md" withBorder>
            <Flex justify="space-between" align="flex-start" mb="sm">
              <Text fw={600} style={{ flex: 1 }}>
                Q{idx + 1}. {q.question}
              </Text>
              <Badge 
                color={!isAttempted ? "gray" : isCorrect ? "green" : "red"}
                variant="light"
              >
                {!isAttempted ? "Not Attempted" : isCorrect ? "Correct" : "Wrong"}
              </Badge>
            </Flex>
            
            <Stack gap="xs">
              {q.options.map((o, optIdx) => {
                const isSel = selected?._id === o._id;
                const isAns = correctId === o._id;
                
                return (
                  <Paper
                    key={o._id}
                    p="sm"
                    radius="sm"
                    style={{
                      border: isAns 
                        ? "2px solid #28a745" 
                        : isSel 
                        ? "2px solid #dc3545" 
                        : "1px solid #dee2e6",
                      backgroundColor: isAns
                        ? "#d4edda"
                        : isSel && !isAns
                        ? "#f8d7da"
                        : "#f8f9fa",
                    }}
                  >
                    <Flex justify="space-between" align="center">
                      <Text size="sm" fw={isSel || isAns ? 600 : 400}>
                        {String.fromCharCode(65 + optIdx)}. {o.name}
                      </Text>
                      <Group gap="xs">
                        {isAns && (
                          <Badge size="xs" color="green" variant="filled">
                            Correct
                          </Badge>
                        )}
                        {isSel && !isAns && (
                          <Badge size="xs" color="red" variant="filled">
                            Your Choice
                          </Badge>
                        )}
                        {isSel && isAns && (
                          <Badge size="xs" color="green" variant="filled">
                            Your Choice ✓
                          </Badge>
                        )}
                      </Group>
                    </Flex>
                  </Paper>
                );
              })}
            </Stack>
            
            {/* Show selected answer summary */}
            {isAttempted && (
              <Paper p="sm" radius="sm" mt="sm" style={{ backgroundColor: "#f1f3f5" }}>
                <Group gap="md">
                  <Text size="sm" fw={500}>Your Answer:</Text>
                  <Text size="sm" c={isCorrect ? "green" : "red"} fw={600}>
                    {selected?.name} {isCorrect ? "✓" : "✗"}
                  </Text>
                  {!isCorrect && (
                    <>
                      <Text size="sm" fw={500}>Correct Answer:</Text>
                      <Text size="sm" c="green" fw={600}>
                        {correct?.name} ✓
                      </Text>
                    </>
                  )}
                </Group>
              </Paper>
            )}
            
            {q.explaination && (
              <>
                <Divider my="sm" />
                <Paper p="sm" radius="sm" style={{ backgroundColor: "#e7f5ff" }}>
                  <Text size="sm" fw={500} mb="xs" c="blue">
                    Explanation:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {q.explaination}
                  </Text>
                </Paper>
              </>
            )}
          </Paper>
        );
      })}
    </Stack>
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={null}
      size="95%"
      centered
      radius="md"
      padding={0}
    >
      {loading ? (
        <Center h="60vh">
          <Loader size="lg" />
        </Center>
      ) : (
        <ScrollArea h={isMobile ? "70vh" : "80vh"}>
          {testResult ? (
            <>
              {renderSummary()}
              <Divider my="md" />
              {renderQuestions()}
              <Group justify="flex-end" p="md">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </Group>
            </>
          ) : (
            <Center h="60vh">
              <Text>No result data available</Text>
            </Center>
          )}
        </ScrollArea>
      )}
    </Modal>
  );
};

export default StudentResultModal;