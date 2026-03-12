"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  NumberInput,
  Textarea,
  ActionIcon,
  Radio,
  Grid,
  Divider,
  ScrollArea,
  Center,
  Loader,
} from "@mantine/core";
import { IconX, IconPlus, IconEdit, IconSettings, IconTrash } from "@tabler/icons-react";

// Import your API functions
import { 
  DeleteTestQuestionById, 
  GetAllQuestionsByTestId 
} from "../../../../../axios/tests/TestsGetApi"; 

import{
    CreateTestQuestion, 
  UpdateTest
} from  "../../../../../axios/tests/Tests.post"

// Types
interface Subject {
  _id: string;
  name: string;
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
  correctAns: string;
  explanation?: string;
  isDeleted: boolean;
}

interface Test {
  _id: string;
  batchId: string;
  name?: string;
  testName?: string;
  subjectId: string;
  totalTime: number;
  questions: Question[];
  startTime?: string;
}

interface Props {
  opened: boolean;
  onClose: () => void;
  onTestUpdated: () => void;
  test: Test | null;
  subjects?: Subject[];
}

// Helper Functions
const convertToMinutes = (timeValue: number): number => {
  if (!timeValue) return 0;
  return timeValue > 1000 ? Math.round(timeValue / (1000 * 60)) : timeValue;
};

const formatDateTimeForInput = (dateString: string) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().slice(0, 16);
  } catch {
    return "";
  }
};

const showNotification = (message: string, type: "success" | "error") => {
  if (type === "success") {
    console.log(`✅ SUCCESS: ${message}`);
    // SuccessNotification(message);
  } else {
    console.log(`❌ ERROR: ${message}`);
    // ErrorNotification(message);
  }
};

export default function SimpleEditTestModal({
  opened,
  onClose,
  test,
  onTestUpdated,
  subjects = [],
}: Props) {
  // UI State
  const [currentView, setCurrentView] = useState<"list" | "edit-question" | "add-question" | "edit-test">("list");
  const [loading, setLoading] = useState<boolean>(false);
  const [questionsLoading, setQuestionsLoading] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<{ 
    open: boolean; 
    questionId: string; 
    questionText: string 
  }>({
    open: false,
    questionId: "",
    questionText: "",
  });

  console.log("subjects : ",subjects);
  

  // Data State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [maxMarks, setMaxMarks] = useState<number>(0); // Frontend state for max marks
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form State - Question
  const [questionForm, setQuestionForm] = useState({
    text: "",
    options: ["", "", "", ""],
    correctIndex: -1,
    explanation: "",
  });

  // Form State - Test Details
  const [testForm, setTestForm] = useState({
    name: "",
    duration: 0,
    subjectId: "",
    startTime: "",
  });

  // Fetch questions from API
  const fetchQuestions = () => {
    if (!test?._id) return;
    
    setQuestionsLoading(true);
    GetAllQuestionsByTestId(test._id)
      .then((res: any) => {
        const fetchedQuestions = res.data.questions || [];
        setQuestions(fetchedQuestions);
        setMaxMarks(fetchedQuestions.length); // Update max marks based on questions count
        setQuestionsLoading(false);
      })
      .catch((err: any) => {
        console.log("err", err);
        setQuestions([]);
        setMaxMarks(0);
        setQuestionsLoading(false);
      });
  };

  // Initialize data when test changes
  useEffect(() => {
    if (test) {
      setTestForm({
        name: test.name || test.testName || "",
        duration: convertToMinutes(test.totalTime),
        subjectId: test.subjectId || "",
        startTime: formatDateTimeForInput(test.startTime || ""),
      });
      
      fetchQuestions();
    }
  }, [test]);

  // Reset states when modal closes
  useEffect(() => {
    if (!opened) {
      setCurrentView("list");
      resetQuestionForm();
      setEditingQuestion(null);
    }
  }, [opened]);

  // Form Handlers
  const resetQuestionForm = () => {
    setQuestionForm({
      text: "",
      options: ["", "", "", ""],
      correctIndex: -1,
      explanation: "",
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const addOption = () => {
    if (questionForm.options.length < 6) {
      setQuestionForm(prev => ({
        ...prev,
        options: [...prev.options, ""]
      }));
    }
  };

  const removeOption = (index: number) => {
    if (questionForm.options.length > 2) {
      setQuestionForm(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        correctIndex: prev.correctIndex === index ? -1 : 
                    prev.correctIndex > index ? prev.correctIndex - 1 : prev.correctIndex
      }));
    }
  };

  // View Handlers
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionForm({
      text: question.question,
      options: question.options?.map(opt => opt.name) || ["", "", "", ""],
      correctIndex: question.options?.findIndex(opt => opt.answer) || -1,
      explanation: question.explanation || "",
    });
    setCurrentView("edit-question");
  };

  const handleAddNewQuestion = () => {
    resetQuestionForm();
    setEditingQuestion(null);
    setCurrentView("add-question");
  };

  const handleEditTestDetails = () => {
    setCurrentView("edit-test");
  };

  // Save Handlers
  const handleSaveQuestion = () => {
    if (!test || !questionForm.text.trim()) {
      showNotification("Please enter a question", "error");
      return;
    }

    if (questionForm.options.some(opt => !opt.trim())) {
      showNotification("Please fill all options", "error");
      return;
    }

    if (questionForm.correctIndex === -1) {
      showNotification("Please select the correct answer", "error");
      return;
    }

    setLoading(true);
    
    const questionData = {
      question: {
        testId: test._id,
        question: questionForm.text,
        options: questionForm.options.map((option, index) => ({
          name: option,
          answer: index === questionForm.correctIndex
        })),
        correctAns: questionForm.options[questionForm.correctIndex],
        ...(questionForm.explanation && { explanation: questionForm.explanation })
      },
      ...(editingQuestion?._id && { questionId: editingQuestion._id })
    };

    CreateTestQuestion(questionData)
      .then((res: any) => {
        showNotification(
          `Question ${editingQuestion ? "updated" : "added"} successfully`,
          "success"
        );
        
        fetchQuestions(); 
        setCurrentView("list");
        resetQuestionForm();
        onTestUpdated();
        setLoading(false);
      })
      .catch((err: any) => {
        console.log("err", err);
        showNotification("Failed to save question", "error");
        setLoading(false);
      });
  };

  const handleDeleteQuestion = () => {
    if (!deleteModal.questionId) return;

    setLoading(true);
    
    DeleteTestQuestionById(deleteModal.questionId)
      .then((res: any) => {
        showNotification("Question deleted successfully", "success");
        
        // Update local state
        const updatedQuestions = questions.filter(q => q._id !== deleteModal.questionId);
        setQuestions(updatedQuestions);
        setMaxMarks(updatedQuestions.length); // Update max marks on frontend
        
        setDeleteModal({ open: false, questionId: "", questionText: "" });
        onTestUpdated();
        setLoading(false);
      })
      .catch((err: any) => {
        console.log("err", err);
        showNotification("Failed to delete question", "error");
        setLoading(false);
      });
  };

  const handleSaveTestDetails = () => {
    if (!test || !testForm.name.trim()) {
      showNotification("Please enter a test name", "error");
      return;
    }

    if (testForm.duration <= 0) {
      showNotification("Please enter a valid test duration", "error");
      return;
    }

    setLoading(true);
    
    const updateData = {
      testId: test._id,
      name: testForm.name.trim(),
      testName: testForm.name.trim(),
      totalTime: testForm.duration,
      ...(testForm.subjectId && { subjectId: testForm.subjectId }),
      ...(testForm.startTime && { startTime: new Date(testForm.startTime).toISOString() }),
    };

    UpdateTest(updateData)
      .then((res: any) => {
        showNotification("Test details updated successfully", "success");
        setCurrentView("list");
        onTestUpdated();
        setLoading(false);
      })
      .catch((err: any) => {
        console.log("err", err);
        showNotification("Failed to update test details", "error");
        setLoading(false);
      });
  };

  const handleClose = () => {
    setCurrentView("list");
    resetQuestionForm();
    onClose();
  };

  // Render Functions
  const renderTestInfo = () => (
    <Box p="md" bg="gray.0" style={{ borderRadius: 8 }}>
      <Flex justify="space-between" align="center" mb="xs">
        <Text fw={600} fz={18} ff="Roboto">
          {testForm.name || "Test Details"}
        </Text>
        <ActionIcon variant="light" onClick={handleEditTestDetails}>
          <IconSettings size={16} />
        </ActionIcon>
      </Flex>
      <Text size="sm" c="dimmed" ff="Roboto">
        Duration: {testForm.duration} minutes | Max Marks: {maxMarks}
        {test?.startTime && <> | Start: {new Date(test.startTime).toLocaleString()}</>}
        {subjects.length > 0 && testForm.subjectId && (
          <> | Subject: {subjects.find(s => s._id === testForm.subjectId)?.name}</>
        )}
      </Text>
    </Box>
  );

  const renderQuestionsList = () => (
    <Box>
      <Flex justify="space-between" align="center" mb="md">
        <Text fw={600} fz={16} ff="Roboto">
          Questions ({questions.length})
        </Text>
        <Button 
          leftSection={<IconPlus size={16} />} 
          onClick={handleAddNewQuestion} 
          size="sm"
          variant="outline"
          c="#111"
          style={{ borderColor: "#111" }}
        >
          Add New Question
        </Button>
      </Flex>

      <ScrollArea h={400}>
        {questionsLoading ? (
          <Center py="xl">
            <Stack align="center" gap="sm">
              <Loader size="md" />
              <Text size="sm" c="dimmed">Loading questions...</Text>
            </Stack>
          </Center>
        ) : (
          <Stack gap="md">
            {questions.length === 0 ? (
              <Center py="xl">
                <Stack align="center" gap="sm">
                  <Text size="lg" c="dimmed">📝</Text>
                  <Text size="sm" c="dimmed" ta="center">
                    No questions found. Add your first question to get started.
                  </Text>
                </Stack>
              </Center>
            ) : (
              questions.map((question, index) => (
                <Box 
                  key={question._id} 
                  p="md" 
                  style={{ 
                    border: "1px solid #ddd", 
                    borderRadius: 8,
                    backgroundColor: "#fafafa"
                  }}
                >
                  <Flex justify="space-between" align="flex-start" mb="xs">
                    <Text fw={600} size="sm" ff="Roboto" style={{ flex: 1, marginRight: 10 }}>
                      Q{index + 1}: {question.question}
                    </Text>
                    <Flex gap="xs">
                      <ActionIcon 
                        size="sm" 
                        variant="light" 
                        onClick={() => handleEditQuestion(question)}
                      >
                        <IconEdit size={14} />
                      </ActionIcon>
                      <ActionIcon
                        size="sm"
                        variant="light"
                        color="red"
                        onClick={() => setDeleteModal({
                          open: true,
                          questionId: question._id,
                          questionText: question.question,
                        })}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Flex>
                  </Flex>
                  
                  <Stack gap={4}>
                    {question.options?.map((option, optIndex) => (
                      <Text 
                        key={option._id || optIndex} 
                        size="xs" 
                        c={option.answer ? "green" : "gray"}
                        ff="Roboto"
                      >
                        {String.fromCharCode(65 + optIndex)}. {option.name} {option.answer && " ✓"}
                      </Text>
                    ))}
                  </Stack>
                  
                  {question.explanation && (
                    <Text size="xs" c="blue" mt="xs" ff="Roboto">
                      💡 {question.explanation}
                    </Text>
                  )}
                </Box>
              ))
            )}
          </Stack>
        )}
      </ScrollArea>
    </Box>
  );

  const renderQuestionForm = () => (
    <Box>
      <Text fw={600} mb="md" fz={18} ff="Roboto">
        {editingQuestion ? "Edit Question" : "Add New Question"}
      </Text>
      
      <Stack gap="md">
        <Textarea
          label="Question"
          placeholder="Enter your question here..."
          value={questionForm.text}
          onChange={(e) => setQuestionForm(prev => ({ ...prev, text: e.target.value }))}
          minRows={2}
          required
        />

        <Text size="sm" fw={500} ff="Roboto">Options</Text>
        <Stack gap="sm">
          {questionForm.options.map((option, index) => (
            <Flex key={index} align="center" gap="xs">
              <Radio
                checked={questionForm.correctIndex === index}
                onChange={() => setQuestionForm(prev => ({ ...prev, correctIndex: index }))}
              />
              <TextInput
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                style={{ flex: 1 }}
                required
              />
              {questionForm.options.length > 2 && (
                <ActionIcon 
                  color="red" 
                  variant="light" 
                  onClick={() => removeOption(index)}
                >
                  <IconX size={16} />
                </ActionIcon>
              )}
            </Flex>
          ))}
        </Stack>

        {questionForm.options.length < 6 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addOption}
            leftSection={<IconPlus size={16} />}
          >
            Add Option
          </Button>
        )}

        <Textarea
          label="Explanation (Optional)"
          placeholder="Explain why this is the correct answer..."
          value={questionForm.explanation}
          onChange={(e) => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
          minRows={2}
        />

        <Flex justify="flex-end" gap="sm" mt="md">
          <Button 
            variant="outline" 
            onClick={() => setCurrentView("list")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveQuestion} 
            loading={loading}
            c="#fff"
            style={{ backgroundColor: "#111" }}
          >
            {editingQuestion ? "Update Question" : "Add Question"}
          </Button>
        </Flex>
      </Stack>
    </Box>
  );

  const renderTestDetailsForm = () => (
    <Stack gap="md">
      <Text fw={600} fz={18} ff="Roboto">Edit Test Details</Text>
      
      <Grid>
        <Grid.Col span={8}>
          <TextInput
            label="Test Name"
            value={testForm.name}
            onChange={(e) => setTestForm(prev => ({ ...prev, name: e.target.value }))}
            required
            placeholder="Enter test name"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            label="Duration (minutes)"
            value={testForm.duration}
            onChange={(value) => setTestForm(prev => ({ ...prev, duration: Number(value) || 0 }))}
            min={1}
            max={999}
            required
            placeholder="e.g., 60"
          />
        </Grid.Col>
      </Grid>

      {subjects.length > 0 && (
        <Select
          label="Subject"
          placeholder="Select subject"
          value={testForm.subjectId}
          onChange={(value) => setTestForm(prev => ({ ...prev, subjectId: value || "" }))}
          data={subjects.map(subject => ({ value: subject._id, label: subject.name }))}
          clearable
        />
      )}

      <TextInput
        label="Start Time (Optional)"
        type="datetime-local"
        value={testForm.startTime}
        onChange={(e) => setTestForm(prev => ({ ...prev, startTime: e.target.value }))}
        placeholder="Select start time"
      />

      <Flex justify="flex-end" gap="sm" mt="md">
        <Button 
          variant="outline" 
          onClick={() => setCurrentView("list")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSaveTestDetails} 
          loading={loading}
          c="white"
          style={{ backgroundColor: "#b60f0f" }}
        >
          Save Test Details
        </Button>
      </Flex>
    </Stack>
  );

  if (!test) {
    return null;
  }

  return (
    <>
      <Modal 
        opened={opened} 
        onClose={handleClose} 
        title="Edit Test" 
        size="xl"
        centered
        styles={{
          header: { 
            borderBottom: '1px solid #eee',
            paddingBottom: '1rem'
          }
        }}
      >
        <Stack gap="md" pos="relative">
          {loading && (
            <Box 
              pos="absolute" 
              top={0} 
              left={0} 
              right={0} 
              bottom={0} 
              bg="rgba(255,255,255,0.8)" 
              style={{ zIndex: 1000 }}
            >
              <Center h="100%">
                <Loader size="lg" />
              </Center>
            </Box>
          )}

          {currentView === "list" && (
            <>
              {renderTestInfo()}
              <Divider />
              {renderQuestionsList()}
              <Flex justify="flex-end" mt="md">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
              </Flex>
            </>
          )}

          {(currentView === "edit-question" || currentView === "add-question") && (
            <>
              <Divider />
              {renderQuestionForm()}
            </>
          )}

          {currentView === "edit-test" && (
            <>
              <Divider />
              {renderTestDetailsForm()}
            </>
          )}
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, questionId: "", questionText: "" })}
        title="Delete Question"
        size="md"
        centered
      >
        <Stack gap="md">
          <Text ff="Roboto">
            Are you sure you want to delete this question? This action cannot be undone.
          </Text>
          
          <Box 
            p="md" 
            bg="yellow.1" 
            style={{ 
              borderRadius: 8, 
              border: "1px solid #ffc107" 
            }}
          >
            <Text size="sm" fw={500} mb="xs" ff="Roboto">
              Question to be deleted:
            </Text>
            <Text 
              size="sm" 
              style={{ wordBreak: "break-word" }}
              ff="Roboto"
            >
              "{deleteModal.questionText}"
            </Text>
          </Box>

          <Flex justify="flex-end" gap="sm">
            <Button 
              variant="outline" 
              onClick={() => setDeleteModal({ open: false, questionId: "", questionText: "" })}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              color="red" 
              onClick={handleDeleteQuestion} 
              loading={loading}
            >
              Delete Question
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
}