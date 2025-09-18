"use client";


import { SuccessNotification } from "@/app/helperFunction/Notification";
import { ErrorNotification } from "@/app/helperFunction/Notification";
import { GetAllSubjectsFromBatch } from "@/axios/batch/BatchGetApi";
import { CreateTest } from "@/axios/batch/BatchPostApi";
import { CreateTestMeta, CreateTestQuestion } from "@/axios/tests/Tests.post";
import { StudentsDataWithBatch } from "@/interface/student.interface";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Table,
  Text,
  Title,
  Textarea,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconX,
} from "@tabler/icons-react";
import React, { SetStateAction, useEffect, useState } from "react";
import { DateTimePicker } from '@mantine/dates';

const AddTestsModal = (props: {
  opened: boolean;
  batchId: string;
  students: StudentsDataWithBatch[];
  setOpenAddTestsModal: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [allSubjects, setAllSubjects] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [marks, setMarks] = useState<
    { studentId: string; name: string; marks: number }[]
  >([]);
  const [testName, setTestName] = useState<string>("");
  const [maxMarks, setMaxMarks] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [testTime, setTestTime] = useState<number>(0);
  const [active, setActive] = useState(0);
  const [testId, setTestId] = useState<string>("");
  type McqQuestion = {
    question: string;
    options: string[];
    correctAnswerIndex: number;
  };

  const [mcqs, setMcqs] = useState<McqQuestion[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);


  useEffect(() => {
    setIsLoading(true);
    GetAllSubjectsFromBatch(props.batchId)
      .then((x: any) => {
        const { subjects } = x.subjects;
        const formatedSubjects = subjects.map(
          (s: { _id: string; name: string }) => {
            return {
              value: s._id,
              label: s.name,
            };
          }
        );

        setAllSubjects(formatedSubjects);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, [props.batchId]);

  const handleMarkChange = (
    studentId: string,
    name: string,
    newMarks: number
  ) => {
    setMarks((prevMarks) => {
      const existingMark = prevMarks.find(
        (mark) => mark.studentId === studentId
      );
      if (existingMark) {
        return prevMarks.map((mark) =>
          mark.studentId === studentId ? { ...mark, marks: newMarks } : mark
        );
      } else {
        return [...prevMarks, { studentId, name: name, marks: newMarks }];
      }
    });
  };
  type MCQ = {
    question: string;
    options: string[];
    correctAnswerIndex: number;
  };


  const handleNextFromStep1 = async () => {
    const payload = {
      batchId: props.batchId,
      subjectId: selectedSubject,
      name: testName,
      maxMarks: maxMarks,
      totalTime: testTime,
      startTime: startTime?.toISOString() || "",
    };

    CreateTestMeta(payload)
      .then((x: any) => {

        const testId = x.data.test._id
        if (testId) {
          setTestId(testId);
          setPage(1);
          SuccessNotification("Test created!");
        }

      })
      .catch((e) => {
        console.log(e);
        ErrorNotification("Failed to create test!");
      })
  };





  const createTest = async () => {
    if (!testId) {
      ErrorNotification("Test ID not found");
      return;
    }

    if (mcqs.length === 0) {
      ErrorNotification("Please add at least one question");
      return;
    }

    try {
      setIsLoading(true);
      for (let mcq of mcqs) {
        const options = mcq.options.map((opt, i) => ({
          name: opt,
          answer: i === mcq.correctAnswerIndex,
        }));

        const payload = {
          question: {
            question: mcq.question,
            testId: testId,
            options: options,
            correctAns: mcq.options[mcq.correctAnswerIndex],
          }
        };

        await CreateTestQuestion(payload);
      }

      SuccessNotification("Test and all questions submitted successfully!");
      props.setOpenAddTestsModal(false);

    } catch (err) {
      console.error(err);
      ErrorNotification("Failed to submit questions");
    } finally {
      setIsLoading(false);
    }
  };


  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);


    if (correctAnswer === index.toString()) {
      setCorrectAnswer("");
    } else if (correctAnswer && parseInt(correctAnswer) > index) {
      setCorrectAnswer((prev) => (prev ? (parseInt(prev) - 1).toString() : ""));
    }
  };

  const handleCorrectAnswerChange = (value: string) => {
    setCorrectAnswer(value);
  };

  const handleSubmit = () => {
    if (!question || options.some((opt) => opt === "") || correctAnswer === "") {
      ErrorNotification("Fill all fields");
      return;
    }

    const newMcq = {
      question,
      options,
      correctAnswerIndex: parseInt(correctAnswer),
    };

    setMcqs((prev) => [...prev, newMcq]);

    // Reset form
    setQuestion("");
    setOptions(["", ""]);
    setCorrectAnswer("");

    SuccessNotification("Question saved!");
  };


  const handleSaveAndNew = () => {
    if (!question || options.some((opt) => opt === "") || correctAnswer === "") {
      ErrorNotification("Fill all fields");
      return;
    }

    const newMcq = {
      question,
      options,
      correctAnswerIndex: parseInt(correctAnswer),
    };

    setMcqs((prev) => [...prev, newMcq]);

    setQuestion("");
    setOptions(["", ""]);
    setCorrectAnswer("");

    SuccessNotification("Question saved! Add another.");
    console.log("New MCQ saved. All questions so far:", [...mcqs, newMcq]);
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Modal
        opened={props.opened}
        onClose={() => {
          props.setOpenAddTestsModal(false)
        }
        }
        title={"Add Tests for students"}
        size={"lg"}
      >

        <Group mb="lg">
          {page === 0 && (
            <>
              <Text
                ta={"center"}
                mx={isMd ? 14 : 30}
                mt={20}
                ml={"40%"}
                c={"#2F4F4F"}
                fw={600}
                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                fz={24}
                ff={"Roboto"}
                w={"auto"}
              >
                Add Tests
              </Text>
              <Flex direction="column" gap="md" mt={20} w="100%">
                <Flex gap="lg" wrap="wrap" justify="space-between">
                  <Select
                    data={allSubjects}
                    required
                    value={selectedSubject}
                    onChange={(value) => setSelectedSubject(value || "")}
                    placeholder="Select Subject"
                    label="Select Subject"
                    w="15rem"
                  />

                  <TextInput
                    placeholder="Enter test name"
                    label="Test Name"
                    required
                    w="15rem"
                    onChange={(e) => setTestName(e.target.value)}
                  />
                </Flex>

                <Flex gap="lg" wrap="wrap" justify="space-between">
                  <NumberInput
                    placeholder="Total Marks"
                    label="Total Marks"
                    required
                    w="15rem"
                    min={0}
                    onChange={(value) => setMaxMarks(Number(value) ?? 0)}
                  />

                  <NumberInput
                    placeholder="Time (min)"
                    label="Duration (Minutes)"
                    required
                    w="15rem"
                    min={0}
                    onChange={(value) => setTestTime(Number(value) ?? 0)}
                  />
                </Flex>

                <Flex gap="lg" wrap="wrap" justify="space-between">
                  <Box w="15rem">
                    <DateTimePicker
                      label="Start Time"
                      value={startTime}
                      onChange={setStartTime}
                      required
                    />
                  </Box>

                  <Box w="15rem">
                  
                  </Box>
                </Flex>
              </Flex>

            </>
          )}{page === 1 && (
            <>
              <Text ta="center" mx={isMd ? 14 : 30} mt={20} ml="36%" c="#2F4F4F" fw={600} fz={24} ff="Roboto">
                Make Mcq  Questions
              </Text>
              <Box w="100%" h="15%">
                <Textarea
                  label="Enter your question"
                  placeholder="Type your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  autosize
                  minRows={2}
                />
              </Box>

              <Stack mb="md">
                <Title order={5}>Options</Title>

                <SimpleGrid cols={2} spacing="md" verticalSpacing="sm">
                  {options.map((opt, index) => (
                    <Box
                      key={index}
                      p="xs"
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 8,
                      }}
                    >
                      <Flex align="center" gap="xs">
                        <Radio
                          value={index.toString()}
                          checked={correctAnswer === index.toString()}
                          onChange={() => handleCorrectAnswerChange(index.toString())}
                        />

                        <TextInput
                          placeholder={`Option ${index + 1}`}
                          value={opt}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          required
                          style={{ flex: 1 }}
                        />

                        {options.length > 2 && (
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => removeOption(index)}
                            title="Remove Option"
                          >
                            <IconX size={18} />
                          </ActionIcon>
                        )}
                      </Flex>
                    </Box>
                  ))}
                </SimpleGrid>

                {correctAnswer !== "" && (
                  <Text c="green" mt="sm">
                    ✅ Correct Answer: Option {parseInt(correctAnswer) + 1}
                  </Text>
                )}
              </Stack>

              <Group mt="md">
                <Button variant="outline" onClick={addOption}>
                  ➕ Add Option
                </Button>
                <Group>
                  <Button color="blue" onClick={handleSubmit}>
                    💾 Save Question
                  </Button>

                </Group>
              </Group>
            </>
          )}
          {page === 2 && (
            <>
              <Box
                style={{
                  width: "100%",
                  maxWidth: 700,
                  height: 400,
                  margin: "0 auto",
                  padding: 16,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  backgroundColor: "#fafafa",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* 📝 Title */}
                <Box
                  style={{
                    flexShrink: 0,
                    marginBottom: 8,
                    paddingBottom: 8,
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <Text fw={600} size="lg">
                    📝 Review All Added Questions
                  </Text>
                </Box>

                <Box
                  style={{
                    overflowY: "auto",
                    flexGrow: 1,
                    paddingRight: 8,
                  }}
                >
                  <Stack>
                    {mcqs.map((mcq, index) => (
                      <Box
                        key={index}
                        p="md"
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: 8,
                          background: "#fff",
                          overflowX: "hidden",
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                          minWidth: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <Text fw={600}>
                          {index + 1}. {mcq.question}
                        </Text>
                        <Box mt="xs">
                          {mcq.options.map((opt, i) => (
                            <Text
                              key={i}
                              color={i === mcq.correctAnswerIndex ? "green" : "black"}
                            >
                              {String.fromCharCode(65 + i)}. {opt}
                            </Text>
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </>
          )}

        </Group>
        <Group mt={30} >
          <Button
            disabled={page === 0}
            variant="default"
            onClick={() => setPage((prev) => prev - 1)}
          >
            ← Back
          </Button>

          {page === 2 ? (
            <Button color="green" onClick={createTest}>
              ✅ Submit Test
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (page === 0) {
                  handleNextFromStep1(); 
                } else {
                  setPage((prev) => prev + 1); 
                }
              }}
            >
              Next →
            </Button>
          )}
        </Group>
      </Modal>
    </>

  );
};
export default AddTestsModal;
