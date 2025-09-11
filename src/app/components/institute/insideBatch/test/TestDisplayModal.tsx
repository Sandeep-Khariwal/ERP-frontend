"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  Box,
  Stack,
  Badge,
  Paper,
  Center,
  ScrollArea,
  Loader,
  Flex,
} from "@mantine/core";
import { GetAllQuestionsByTestId } from "../../../../../axios/tests/TestsGetApi";
import { RenderQuestionCard } from "./RenderQuestions";

// Types
interface Option {
  _id: string;
  name: string;
  answer: boolean;
}

export interface Question {
  _id: string;
  question: string;
  options: Option[];
  explanation?: string;
}

interface Test {
  _id: string;
  name?: string;
  testName?: string;
  totalTime?: number;
  testTime?: number;
  maxMarks?: number;
  startTime?: string;
}

interface Props {
  opened: boolean;
  onClose: () => void;
  test: Test | null;
}

export default function TestDisplayModal({ opened, onClose, test }: Props) {
  const [questionsMap, setQuestionsMap] = useState<Map<string, Question>>(new Map());
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [maxMarks, setMaxMarks] = useState<number>(0); // Frontend state for max marks
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions when modal opens
  useEffect(() => {
    console.log("useEffect triggered", { opened, testId: test?._id });
    
    if (!opened || !test?._id) {
      console.log("Early return - opened:", opened, "testId:", test?._id);
      return;
    }

    setLoading(true);
    setError(null);

    GetAllQuestionsByTestId(test._id)
      .then((res: any) => {
        console.log("questions :", res.data.questions);
        const fetchedQuestions = res.data.questions || [];
        setAllQuestions(fetchedQuestions);
        setMaxMarks(fetchedQuestions.length); 
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message);
        console.log("err", err);
        setQuestionsMap(new Map());
        setAllQuestions([]);
        setMaxMarks(0);
        setLoading(false);
      });
  }, [opened, test?._id]);

  // Reset state when modal closes
  useEffect(() => {
    if (!opened) {
      setQuestionsMap(new Map());
      setAllQuestions([]);
      setMaxMarks(0);
      setError(null);
      setLoading(false);
    }
  }, [opened]);

  // Helper functions
  const formatDuration = (totalTime: number): string => {
    const totalMinutes = totalTime > 1000 ? Math.round(totalTime / (1000 * 60)) : totalTime;
    if (!totalMinutes || totalMinutes <= 0) return "N/A";
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours === 0) return `${minutes} mins`;
    if (minutes === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
    return `${hours}:${minutes.toString().padStart(2, '0')} hrs`;
  };

  const getQuestionsArray = () => {
    return Array.from(questionsMap.values());
  };

  if (!test) return null;

  const questions = getQuestionsArray();
  const activeQuestionsCount = allQuestions.length;
  const rawDuration = test?.testTime || test?.totalTime || 0;
  const formattedDuration = formatDuration(rawDuration);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      centered
      scrollAreaComponent={ScrollArea.Autosize}
      title={
        <Stack gap="sm">
          <Text fz={20} fw={600}>
            {test?.name || test?.testName || "Unnamed Test"}
          </Text>

          <Flex justify="space-between" align="center" wrap="wrap" gap="md">
            <Flex gap="xl" wrap="wrap">
              <Badge color="blue" variant="light" size="lg">
                {activeQuestionsCount} Questions
              </Badge>
              <Flex gap="xs" align="center">
                <Text size="sm" c="dimmed">Max Marks:</Text>
                <Badge color="green" variant="light" size="sm">
                  {maxMarks}
                </Badge>
              </Flex>
            </Flex>
          </Flex>

          <Flex gap="xl" wrap="wrap">
            <Flex gap="xs" align="center">
              <Text size="sm" c="dimmed">Duration:</Text>
              <Badge color="orange" variant="light" size="sm">
                {formattedDuration}
              </Badge>
            </Flex>
          </Flex>
        </Stack>
      }
    >
      <Box mih={300}>
        {loading ? (
          <Center py="md">
            <Stack align="center" gap="sm">
              <Loader size="md" />
              <Text size="sm" c="dimmed">Loading questions...</Text>
            </Stack>
          </Center>
        ) : error ? (
          <Center py="xl">
            <Stack align="center" gap="sm">
              <Text size="lg" c="red">⚠️</Text>
              <Text size="sm" c="red">{error}</Text>
            </Stack>
          </Center>
        ) : allQuestions.length > 0 ? (
          <Stack gap="md">
            {allQuestions.map((question, index) =>  (
              <RenderQuestionCard key={question._id} question={question} />
            ))}
          </Stack>
        ) : (
          <Center py="xl">
            <Stack align="center" gap="sm">
              <Text size="lg" c="dimmed">📝</Text>
              <Text size="sm" c="dimmed">No questions found for this test</Text>
            </Stack>
          </Center>
        )}
      </Box>
    </Modal>
  );
}