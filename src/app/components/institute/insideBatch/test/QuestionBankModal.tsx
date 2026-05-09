"use client";

import React, { useEffect, useState } from "react";

import {
  Modal,
  Stack,
  Text,
  Button,
  Flex,
  Box,
  Checkbox,
  Select,
  ScrollArea,
  ActionIcon,
  Group,
  Divider,
  Loader,
  Center,
} from "@mantine/core";

import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { GetAllSubjectsFromBatch } from "@/axios/batch/BatchGetApi";
import { useAppSelector } from "@/app/redux/redux.hooks";
import { GetInstituteBatches } from "@/axios/institute/instituteSlice";
import { CreateQuestionBank } from "@/axios/tests/Tests.post";
import { ErrorNotification } from "@/app/helperFunction/Notification";
import {
  GetAllQuestionsByTestId,
  GetAllQuestionsFromBank,
} from "@/axios/tests/TestsGetApi";

interface Props {
  opened: boolean;
  onClose: () => void;

  batchId: string;
  testId: string;
  onSuccess: () => void;
}

interface Option {
  _id: string;
  name: string;
  answer: boolean;
}

interface Question {
  _id: string;
  question: string;
  options: Option[];
}

export default function QuestionBankModal({
  opened,
  onClose,

  batchId,
  testId,
  onSuccess,
}: Props) {
  // Dummy Questions
  // const [questions] = useState<Question[]>([
  //   {
  //     _id: "1",
  //     question: "how are you?",
  //     options: [
  //       { _id: "1", name: "fine", answer: true },
  //       { _id: "2", name: "good", answer: false },
  //     ],
  //   },
  //   {
  //     _id: "2",
  //     question: "what is your name?",
  //     options: [
  //       { _id: "1", name: "John", answer: false },
  //       { _id: "2", name: "Mike", answer: false },
  //     ],
  //   },
  //   {
  //     _id: "3",
  //     question: "where do you live?",
  //     options: [
  //       { _id: "1", name: "India", answer: false },
  //       { _id: "2", name: "USA", answer: false },
  //     ],
  //   },
  //   {
  //     _id: "4",
  //     question: "what is 2 + 2?",
  //     options: [
  //       { _id: "1", name: "3", answer: false },
  //       { _id: "2", name: "4", answer: true },
  //     ],
  //   },
  // ]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Selected Questions
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  //   const [selectedBatch, setSelectedBatch] = useState<string | null>(batchName);
  const [selectedBatch, setSelectedBatch] = useState<string>(batchId);

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [subjects, setSubjects] = useState<
    {
      _id: string;
      name: string;
    }[]
  >([]);

  const [batches, setBatches] = useState<
    {
      _id: string;
      name: string;
    }[]
  >([]);

  const institute = useAppSelector(
    (state) => state.instituteSlice.instituteDetails,
  );

  // Single Select
  const handleSelectQuestion = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Select All
  const handleSelectAll = () => {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(questions.map((q) => q._id));
    }
  };

  useEffect(() => {
    GetAllQuestionsFromBank(selectedBatch, selectedSubject)
      .then((res: any) => {
        setQuestions(res.data.questions);
      })
      .catch((e: any) => {
        console.log(e);
      });
  }, [selectedBatch, selectedSubject]);

  // Add Selected
  const handleAddSelected = async () => {
    if (selectedQuestions.length === 0) {
      ErrorNotification("No questions selected");
      return;
    }

    if (!selectedSubject) {
      ErrorNotification("Please select subject");
      return;
    }

    const filteredQuestions = questions.filter((question) =>
      selectedQuestions.includes(question._id),
    );

    console.log("SELECTED QUESTION IDS :", selectedQuestions);

    console.log("FILTERED QUESTIONS :", filteredQuestions);

    const payload = filteredQuestions.map((question) => ({
      question: {
        testId: testId,

        question: question.question,

        options: question.options.map((option) => ({
          name: option.name,
          answer: option.answer,
        })),

        correctAns: question.options.find((opt) => opt.answer)?.name || "",

        explanation: "",
      },

      batchId: selectedBatch || "",

      subjectId: selectedSubject || "",
    }));

    console.log(payload);

    CreateQuestionBank(payload)
      .then((res) => {
        console.log("Questions Created", res);
        onSuccess();
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllInstituteBatches = () => {
    GetInstituteBatches(institute?._id || "")
      .then((x: any) => {
        setBatches(x.batches || []);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (!selectedBatch) return;

    GetAllSubjectsFromBatch(selectedBatch)
      .then((res: any) => {
        const subjectsData = res.subjects.subjects || [];

        console.log("SUBJECTS :", subjectsData);

        setSubjects(subjectsData);
      })

      .catch((err) => {
        console.log(err);

        setSubjects([]);
      });
  }, [selectedBatch]);

  useEffect(() => {
    if (institute?._id) {
      getAllInstituteBatches();
    }
  }, [institute?._id]);
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="80%"
      radius="md"
      title={
        <Box>
          <Text fw={600} fz={26}>
            Question Bank
          </Text>

          <Text size="sm" c="dimmed" mt={4}>
            Select questions from the bank and add them to your test.
          </Text>
        </Box>
      }
      styles={{
        body: {
          paddingTop: 10,
        },
      }}
    >
      <Stack gap="md">
        {/* Top Filters */}

        <Flex
          justify="space-between"
          align="center"
          p="md"
          bg="#f8fafc"
          style={{
            border: "1px solid #e9ecef",
            borderRadius: 12,
          }}
        >
          <Group>
            {/* 
           <Select
              placeholder="Select Batch"
              data={[
                { value: "batch1", label: "Batch 1" },
                { value: "batch2", label: "Batch 2" },
              ]}
              w={220}
            /> */}
            <Select
              placeholder="Select Batch"
              data={batches.map((batch) => ({
                value: batch._id,
                label: batch.name,
              }))}
              onChange={(value: any) => {
                setSelectedBatch(value!);

                setSelectedSubject("");
              }}
              w={220}
            />

            {/* <Select
              placeholder="Select Subject"
              data={[
                { value: "math", label: "Math" },
                { value: "science", label: "Science" },
              ]}
              w={220}
            /> */}
            {/* <Select
  placeholder="Select Subject"
  value={selectedSubject}
  onChange={setSelectedSubject}
  data={subjects
    .filter((subject) => subject._id && subject.name !== "All Subjects")
    .map((subject) => ({
      value: subject._id,
      label: subject.name,
    }))}
  w={220}
/> */}

            <Select
              placeholder="Select Subject"
              value={selectedSubject}
              onChange={(v: any) => {
                console.log("select subject : ", v);

                setSelectedSubject(v);
              }}
              data={subjects.map((subject) => ({
                value: subject._id,
                label: subject.name,
              }))}
              w={220}
            />
          </Group>

          <Button
            leftSection={<IconPlus size={18} />}
            style={{
              background: "#228be6",
            }}
            onClick={handleAddSelected}
          >
            Add in Test
          </Button>
        </Flex>

        {/* Questions Container */}

        <Box
          bg="#fafafa"
          style={{
            border: "1px solid #e9ecef",
            borderRadius: 12,
          }}
        >
          {/* Header */}

          <Flex justify="space-between" align="center" p="md">
            <Group>
              <Checkbox
                checked={
                  questions.length > 0 &&
                  selectedQuestions.length === questions.length
                }
                onChange={handleSelectAll}
              />

              <Text fw={600}>All Questions</Text>
            </Group>

            <Text fw={600} c="blue">
              {selectedQuestions.length} selected
            </Text>
          </Flex>

          <Divider />

          {/* Questions List */}

          <ScrollArea h={380}>
            {loadingQuestions ? (
              <Center py="xl">
                <Loader />
              </Center>
            ) : questions.length === 0 ? (
              <Center py="xl">
                <Text c="dimmed">No Questions Found</Text>
              </Center>
            ) : (
              <Stack p="md">
                {questions.map((question, index) => (
                  <Box
                    key={question._id}
                    p="sm"
                    style={{
                      border: "1px solid #e9ecef",
                      borderRadius: 12,
                      background: "#fdfdfd",
                      minHeight: 110,
                    }}
                  >
                    <Flex justify="space-between" align="flex-start">
                      {/* Left Side */}

                      <Flex gap="md" align="flex-start">
                        <Checkbox
                          mt={4}
                          checked={selectedQuestions.includes(question._id)}
                          onChange={() => handleSelectQuestion(question._id)}
                        />

                        <Box>
                          <Text fw={700} size="md" mb={6}>
                            Q{index + 1}: {question.question}
                          </Text>

                          <Stack gap={1}>
                            {question.options.map((option, optIndex) => (
                              <Text
                                key={option._id}
                                size="md"
                                c={option.answer ? "green" : "gray"}
                              >
                                {String.fromCharCode(65 + optIndex)}.{" "}
                                {option.name}
                                {option.answer && " ✓"}
                              </Text>
                            ))}
                          </Stack>
                        </Box>
                      </Flex>

                      {/* Right Side Icons */}

                      <Group gap="xs">
                        <ActionIcon variant="light" color="blue">
                          <IconEdit size={16} />
                        </ActionIcon>

                        <ActionIcon variant="light" color="red">
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Flex>
                  </Box>
                ))}
              </Stack>
            )}
          </ScrollArea>
        </Box>

        {/* Footer Buttons */}

        <Flex justify="flex-end" gap="md" mt="sm">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </Flex>
      </Stack>
    </Modal>
  );
}
