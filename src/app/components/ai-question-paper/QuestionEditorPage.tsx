// "use client";

// import { useState, useCallback } from "react";
// import {
//   Container,
//   Title,
//   Text,
//   Button,
//   Group,
//   Stack,
//   Card,
//   TextInput,
//   Textarea,
//   Select,
//   NumberInput,
//   Badge,
//   ActionIcon,
//   Divider,
//   ThemeIcon,
//   Skeleton,
//   Alert,
//   Modal,
//   Tabs,
//   ScrollArea,
//   Paper,
//   Menu,
// } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
// import { notifications } from "@mantine/notifications";
// import {
//   IconEdit,
//   IconTrash,
//   IconCopy,
//   IconGripVertical,
//   IconPlus,
//   IconCheck,
//   IconAlertCircle,
//   IconArrowUp,
//   IconArrowDown,
//   IconDotsVertical,
//   IconDownload,
//   IconSend,
//   IconFileText,
// } from "@tabler/icons-react";
// import {
//   useQuestionPaper,
//   useUpdatePaper,
//   useGeneratePDF,
//   usePublishExam,
//   useCreateExam,
// } from "../../hooks/useAIQuestionPaper";
// import { Question } from "../../api/aiQuestionPaper.api";
// import { useParams, useRouter } from "next/navigation";

// const INSTITUTE_ID = "INST-001";
// const TEACHER_ID = "TCH-001";
// const INSTITUTION_NAME = "ShikshaPay School";

// // ─── Question Card ─────────────────────────────────────────────────────────────

// interface QuestionCardProps {
//   question: Question;
//   index: number;
//   total: number;
//   onEdit: (q: Question) => void;
//   onDelete: (id: string) => void;
//   onDuplicate: (q: Question) => void;
//   onMoveUp: (id: string) => void;
//   onMoveDown: (id: string) => void;
// }

// function QuestionCard({
//   question,
//   index,
//   total,
//   onEdit,
//   onDelete,
//   onDuplicate,
//   onMoveUp,
//   onMoveDown,
// }: QuestionCardProps) {
//   const typeColor: Record<string, string> = {
//     mcq: "violet",
//     short: "blue",
//     long: "teal",
//     very_long: "orange",
//   };
//   const typeLabel: Record<string, string> = {
//     mcq: "MCQ",
//     short: "Short",
//     long: "Long",
//     very_long: "Very Long",
//   };

//   return (
//     <Card withBorder radius="md" p="md">
//       <Group justify="space-between" wrap="nowrap" align="flex-start">
//         {/* Drag Handle + Number */}
//         <Group gap="xs" style={{ flexShrink: 0 }}>
//           <ActionIcon variant="subtle" color="gray" size="sm">
//             <IconGripVertical size={14} />
//           </ActionIcon>
//           <ThemeIcon
//             color={typeColor[question.type] || "gray"}
//             variant="light"
//             size="sm"
//             radius="xl"
//           >
//             <Text size="xs" fw={700}>
//               {index + 1}
//             </Text>
//           </ThemeIcon>
//         </Group>

//         {/* Content */}
//         <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
//           <Group gap="xs">
//             <Badge
//               color={typeColor[question.type] || "gray"}
//               variant="light"
//               size="xs"
//             >
//               {typeLabel[question.type]}
//             </Badge>
//             <Badge color="gray" variant="outline" size="xs">
//               {question.marks} Mark{question.marks > 1 ? "s" : ""}
//             </Badge>
//             <Badge color="gray" variant="outline" size="xs">
//               {question.difficulty}
//             </Badge>
//           </Group>

//           <Text size="sm" fw={500}>
//             {question.questionText}
//           </Text>

//           {question.type === "mcq" && question.options?.length > 0 && (
//             <SimpleOptions
//               options={question.options}
//               correctAnswer={question.correctAnswer}
//             />
//           )}

//           {question.type !== "mcq" && question.correctAnswer && (
//             <Paper withBorder p="xs" radius="sm" bg="green.0">
//               <Text size="xs" c="green.7">
//                 <strong>Answer:</strong> {question.correctAnswer}
//               </Text>
//             </Paper>
//           )}
//         </Stack>

//         {/* Actions */}
//         <Menu shadow="md" position="bottom-end">
//           <Menu.Target>
//             <ActionIcon variant="subtle" color="gray" size="sm">
//               <IconDotsVertical size={14} />
//             </ActionIcon>
//           </Menu.Target>
//           <Menu.Dropdown>
//             <Menu.Item
//               leftSection={<IconEdit size={14} />}
//               onClick={() => onEdit(question)}
//             >
//               Edit
//             </Menu.Item>
//             <Menu.Item
//               leftSection={<IconCopy size={14} />}
//               onClick={() => onDuplicate(question)}
//             >
//               Duplicate
//             </Menu.Item>
//             <Menu.Item
//               leftSection={<IconArrowUp size={14} />}
//               disabled={index === 0}
//               onClick={() => onMoveUp(question._id)}
//             >
//               Move Up
//             </Menu.Item>
//             <Menu.Item
//               leftSection={<IconArrowDown size={14} />}
//               disabled={index === total - 1}
//               onClick={() => onMoveDown(question._id)}
//             >
//               Move Down
//             </Menu.Item>
//             <Menu.Divider />
//             <Menu.Item
//               leftSection={<IconTrash size={14} />}
//               color="red"
//               onClick={() => onDelete(question._id)}
//             >
//               Delete
//             </Menu.Item>
//           </Menu.Dropdown>
//         </Menu>
//       </Group>
//     </Card>
//   );
// }

// function SimpleOptions({
//   options,
//   correctAnswer,
// }: {
//   options: { label: string; text: string }[];
//   correctAnswer: string;
// }) {
//   return (
//     <Stack gap={4}>
//       {options.map((opt) => (
//         <Group key={opt.label} gap="xs">
//           <Badge
//             color={opt.label === correctAnswer ? "green" : "gray"}
//             variant={opt.label === correctAnswer ? "filled" : "outline"}
//             size="xs"
//             radius="sm"
//           >
//             {opt.label}
//           </Badge>
//           <Text size="xs" c={opt.label === correctAnswer ? "green" : undefined}>
//             {opt.text}
//           </Text>
//         </Group>
//       ))}
//     </Stack>
//   );
// }

// // ─── Edit Question Modal ───────────────────────────────────────────────────────

// function EditQuestionModal({
//   question,
//   opened,
//   onClose,
//   onSave,
// }: {
//   question: Question | null;
//   opened: boolean;
//   onClose: () => void;
//   onSave: (q: Question) => void;
// }) {
//   const [form, setForm] = useState<Question | null>(question);

//   const handleSave = () => {
//     if (!form) return;
//     onSave(form);
//     onClose();
//   };

//   if (!form) return null;

//   return (
//     <Modal
//       opened={opened}
//       onClose={onClose}
//       title="Edit Question"
//       size="lg"
//       radius="md"
//     >
//       <Stack gap="md">
//         <Textarea
//           label="Question Text"
//           value={form.questionText}
//           onChange={(e) =>
//             setForm({ ...form, questionText: e.currentTarget.value })
//           }
//           minRows={3}
//           autosize
//           required
//         />

//         <Group grow>
//           <Select
//             label="Type"
//             value={form.type}
//             onChange={(v) => setForm({ ...form, type: v as any })}
//             data={[
//               { value: "mcq", label: "MCQ" },
//               { value: "short", label: "Short" },
//               { value: "long", label: "Long" },
//               { value: "very_long", label: "Very Long" },
//             ]}
//           />
//           <NumberInput
//             label="Marks"
//             value={form.marks}
//             min={1}
//             onChange={(v) => setForm({ ...form, marks: Number(v) })}
//           />
//           <Select
//             label="Difficulty"
//             value={form.difficulty}
//             onChange={(v) => setForm({ ...form, difficulty: v as any })}
//             data={[
//               { value: "easy", label: "Easy" },
//               { value: "medium", label: "Medium" },
//               { value: "hard", label: "Hard" },
//             ]}
//           />
//         </Group>

//         {form.type === "mcq" && (
//           <Stack gap="xs">
//             <Text size="sm" fw={500}>
//               Options
//             </Text>
//             {form.options.map((opt, i) => (
//               <Group key={opt.label} gap="xs">
//                 <Badge variant="outline" size="sm">
//                   {opt.label}
//                 </Badge>
//                 <TextInput
//                   style={{ flex: 1 }}
//                   value={opt.text}
//                   onChange={(e) => {
//                     const updated = [...form.options];
//                     updated[i] = { ...opt, text: e.currentTarget.value };
//                     setForm({ ...form, options: updated });
//                   }}
//                 />
//               </Group>
//             ))}
//             <TextInput
//               label="Correct Answer"
//               placeholder="A / B / C / D"
//               value={form.correctAnswer}
//               onChange={(e) =>
//                 setForm({ ...form, correctAnswer: e.currentTarget.value })
//               }
//             />
//           </Stack>
//         )}

//         {form.type !== "mcq" && (
//           <Textarea
//             label="Model Answer"
//             value={form.correctAnswer}
//             onChange={(e) =>
//               setForm({ ...form, correctAnswer: e.currentTarget.value })
//             }
//             minRows={3}
//             autosize
//           />
//         )}

//         <Textarea
//           label="Explanation (optional)"
//           value={form.explanation}
//           onChange={(e) =>
//             setForm({ ...form, explanation: e.currentTarget.value })
//           }
//           minRows={2}
//           autosize
//         />

//         <Group justify="flex-end" mt="sm">
//           <Button variant="default" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button color="violet" onClick={handleSave} leftSection={<IconCheck size={14} />}>
//             Save Question
//           </Button>
//         </Group>
//       </Stack>
//     </Modal>
//   );
// }

// // ─── Main Editor Page ──────────────────────────────────────────────────────────

// export default function QuestionEditorPage() {
//   const params = useParams();
//   const router = useRouter();
//   const paperId = params.id as string;

//   const { data, isLoading } = useQuestionPaper(paperId, INSTITUTE_ID);
//   const updatePaperMutation = useUpdatePaper();
//   const generatePDFMutation = useGeneratePDF();
//   const publishMutation = usePublishExam();
//   const createExamMutation = useCreateExam();

//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
//   const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
//   const [publishModalOpened, { open: openPublish, close: closePublish }] = useDisclosure(false);

//   const paper = data?.data;

//   // Sync questions from API
//   useState(() => {
//     if (paper?.questions) {
//       setQuestions(paper.questions);
//     }
//   });

//   if (isLoading) {
//     return (
//       <Container size="lg" py="xl">
//         <Stack gap="md">
//           <Skeleton height={40} width={300} />
//           {[1, 2, 3, 4].map((i) => (
//             <Skeleton key={i} height={100} radius="md" />
//           ))}
//         </Stack>
//       </Container>
//     );
//   }

//   if (!paper) {
//     return (
//       <Container size="lg" py="xl">
//         <Alert color="red" icon={<IconAlertCircle size={16} />}>
//           Question paper not found
//         </Alert>
//       </Container>
//     );
//   }

//   const currentQuestions = questions.length ? questions : paper.questions || [];

//   const handleEditQuestion = (q: Question) => {
//     setEditingQuestion({ ...q });
//     openEdit();
//   };

//   const handleSaveEditedQuestion = (updated: Question) => {
//     const newList = currentQuestions.map((q) =>
//       q._id === updated._id ? updated : q
//     );
//     setQuestions(newList);
//   };

//   const handleDeleteQuestion = (id: string) => {
//     setQuestions(currentQuestions.filter((q) => q._id !== id));
//   };

//   const handleDuplicateQuestion = (q: Question) => {
//     const copy: Question = {
//       ...q,
//       _id: `${q._id}-copy-${Date.now()}`,
//       order: currentQuestions.length,
//     };
//     setQuestions([...currentQuestions, copy]);
//   };

//   const moveQuestion = (id: string, dir: "up" | "down") => {
//     const idx = currentQuestions.findIndex((q) => q._id === id);
//     if (idx < 0) return;
//     const next = dir === "up" ? idx - 1 : idx + 1;
//     if (next < 0 || next >= currentQuestions.length) return;
//     const arr = [...currentQuestions];
//     [arr[idx], arr[next]] = [arr[next], arr[idx]];
//     setQuestions(arr);
//   };

//   const handleSaveChanges = async () => {
//     const res = await updatePaperMutation.mutateAsync({
//       id: paperId,
//       instituteId: INSTITUTE_ID,
//       teacherId: TEACHER_ID,
//       updates: { questions: currentQuestions },
//     });
//     if (res.status === 200) {
//       notifications.show({
//         title: "Saved",
//         message: "Changes saved successfully",
//         color: "green",
//         icon: <IconCheck size={16} />,
//       });
//     }
//   };

//   const handleGeneratePDF = async () => {
//     const res = await generatePDFMutation.mutateAsync({
//       id: paperId,
//       instituteId: INSTITUTE_ID,
//       teacherId: TEACHER_ID,
//       instituteName: INSTITUTION_NAME,
//     });
//     if (res.status === 200) {
//       notifications.show({
//         title: "PDF Generated",
//         message: "Your PDF is ready to download",
//         color: "green",
//       });
//     }
//   };

//   const handlePublish = async () => {
//     closePublish();
//     const res = await publishMutation.mutateAsync({
//       id: paperId,
//       instituteId: INSTITUTE_ID,
//       teacherId: TEACHER_ID,
//     });
//     if (res.status === 200) {
//       notifications.show({
//         title: "Published!",
//         message: "Exam is now published and live",
//         color: "green",
//         icon: <IconCheck size={16} />,
//       });
//     }
//   };

//   const mcqs = currentQuestions.filter((q) => q.type === "mcq");
//   const shorts = currentQuestions.filter((q) => q.type === "short");
//   const longs = currentQuestions.filter((q) => q.type === "long");
//   const veryLongs = currentQuestions.filter((q) => q.type === "very_long");

//   return (
//     <Container size="xl" py="xl">
//       <Stack gap="xl">
//         {/* Header */}
//         <Group justify="space-between" align="flex-start">
//           <Stack gap={4}>
//             <Group gap="xs">
//               <ThemeIcon color="violet" variant="light" size="lg" radius="md">
//                 <IconEdit size={20} />
//               </ThemeIcon>
//               <Title order={2} fw={700}>
//                 Question Editor
//               </Title>
//             </Group>
//             <Text c="dimmed" size="sm">
//               {paper.title}
//             </Text>
//             <Group gap="xs" mt={4}>
//               <Badge color="violet" variant="light">
//                 {currentQuestions.length} Questions
//               </Badge>
//               <Badge color="blue" variant="light">
//                 {paper.totalMarks} Marks
//               </Badge>
//               <Badge color="teal" variant="light">
//                 {paper.duration} min
//               </Badge>
//               <Badge
//                 color={paper.status === "published" ? "green" : "orange"}
//                 variant="light"
//               >
//                 {paper.status}
//               </Badge>
//             </Group>
//           </Stack>

//           {/* Action Buttons */}
//           <Group gap="xs">
//             <Button
//               variant="default"
//               size="sm"
//               onClick={handleSaveChanges}
//               loading={updatePaperMutation.isPending}
//               leftSection={<IconCheck size={14} />}
//             >
//               Save
//             </Button>
//             <Button
//               variant="light"
//               color="blue"
//               size="sm"
//               onClick={handleGeneratePDF}
//               loading={generatePDFMutation.isPending}
//               leftSection={<IconFileText size={14} />}
//             >
//               Generate PDF
//             </Button>
//             {paper.pdfUrl && (
//               <Button
//                 variant="light"
//                 color="teal"
//                 size="sm"
//                 component="a"
//                 href={paper.pdfUrl}
//                 target="_blank"
//                 leftSection={<IconDownload size={14} />}
//               >
//                 Download
//               </Button>
//             )}
//             <Button
//               color="violet"
//               size="sm"
//               onClick={openPublish}
//               leftSection={<IconSend size={14} />}
//               disabled={paper.status === "published"}
//             >
//               Publish
//             </Button>
//           </Group>
//         </Group>

//         <Divider />

//         {/* Questions Tabs */}
//         <Tabs defaultValue="all" color="violet">
//           <Tabs.List>
//             <Tabs.Tab value="all">
//               All ({currentQuestions.length})
//             </Tabs.Tab>
//             <Tabs.Tab value="mcq">MCQ ({mcqs.length})</Tabs.Tab>
//             <Tabs.Tab value="short">Short ({shorts.length})</Tabs.Tab>
//             <Tabs.Tab value="long">Long ({longs.length})</Tabs.Tab>
//             <Tabs.Tab value="very_long">Very Long ({veryLongs.length})</Tabs.Tab>
//           </Tabs.List>

//           {(["all", "mcq", "short", "long", "very_long"] as const).map(
//             (tab) => {
//               const tabQuestions =
//                 tab === "all"
//                   ? currentQuestions
//                   : currentQuestions.filter((q) => q.type === tab);

//               return (
//                 <Tabs.Panel key={tab} value={tab} pt="md">
//                   <ScrollArea>
//                     <Stack gap="sm">
//                       {tabQuestions.length === 0 && (
//                         <Card withBorder radius="md" p="xl">
//                           <Stack align="center" gap="sm">
//                             <Text c="dimmed" size="sm">
//                               No questions in this section
//                             </Text>
//                           </Stack>
//                         </Card>
//                       )}
//                       {tabQuestions.map((q, i) => (
//                         <QuestionCard
//                           key={q._id}
//                           question={q}
//                           index={i}
//                           total={tabQuestions.length}
//                           onEdit={handleEditQuestion}
//                           onDelete={handleDeleteQuestion}
//                           onDuplicate={handleDuplicateQuestion}
//                           onMoveUp={(id) => moveQuestion(id, "up")}
//                           onMoveDown={(id) => moveQuestion(id, "down")}
//                         />
//                       ))}
//                     </Stack>
//                   </ScrollArea>
//                 </Tabs.Panel>
//               );
//             }
//           )}
//         </Tabs>

//         {/* Answer Key Preview */}
//         {paper.answerKey?.length > 0 && (
//           <Card withBorder radius="md" p="md">
//             <Stack gap="sm">
//               <Text fw={600} size="sm">
//                 Answer Key ({paper.answerKey.length} entries)
//               </Text>
//               <Divider />
//               <ScrollArea h={200}>
//                 <Stack gap="xs">
//                   {paper.answerKey.map((ak: any, i: number) => (
//                     <Group key={ak.questionId} gap="md">
//                       <Badge variant="outline" size="xs" color="violet">
//                         Q{i + 1}
//                       </Badge>
//                       <Text size="xs" style={{ flex: 1 }}>
//                         {ak.answer}
//                       </Text>
//                       <Badge size="xs" color="gray" variant="light">
//                         {ak.marks} mark{ak.marks > 1 ? "s" : ""}
//                       </Badge>
//                     </Group>
//                   ))}
//                 </Stack>
//               </ScrollArea>
//             </Stack>
//           </Card>
//         )}
//       </Stack>

//       {/* Edit Modal */}
//       <EditQuestionModal
//         question={editingQuestion}
//         opened={editModalOpened}
//         onClose={closeEdit}
//         onSave={handleSaveEditedQuestion}
//       />

//       {/* Publish Confirmation Modal */}
//       <Modal
//         opened={publishModalOpened}
//         onClose={closePublish}
//         title="Publish Exam"
//         size="sm"
//         radius="md"
//       >
//         <Stack gap="md">
//           <Alert color="violet" variant="light" icon={<IconSend size={16} />}>
//             Once published, this exam will be visible to students. Make sure
//             all questions and answers are correct.
//           </Alert>
//           <Group justify="flex-end">
//             <Button variant="default" onClick={closePublish}>
//               Cancel
//             </Button>
//             <Button
//               color="violet"
//               onClick={handlePublish}
//               loading={publishMutation.isPending}
//             >
//               Publish Now
//             </Button>
//           </Group>
//         </Stack>
//       </Modal>
//     </Container>
//   );
// }
     

"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Badge,
  ActionIcon,
  Divider,
  ThemeIcon,
  Skeleton,
  Alert,
  Modal,
  Tabs,
  ScrollArea,
  Paper,
  Menu,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconEdit,
  IconTrash,
  IconCopy,
  IconGripVertical,
  IconPlus,
  IconCheck,
  IconAlertCircle,
  IconArrowUp,
  IconArrowDown,
  IconDotsVertical,
  IconDownload,
  IconSend,
  IconFileText,
} from "@tabler/icons-react";
import {
  useQuestionPaper,
  useUpdatePaper,
  useGeneratePDF,
  usePublishExam,
  useCreateExam,
} from "../../../hooks/useAIQuestionPaper";
import { Question } from "../../../axios/aiQuestionPaper/aiQuestionPaper.api";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux/redux.hooks";

// ─── Question Card ─────────────────────────────────────────────────────────────

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
  onDuplicate: (q: Question) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

function QuestionCard({
  question,
  index,
  total,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: QuestionCardProps) {
  const typeColor: Record<string, string> = {
    mcq: "violet",
    short: "blue",
    long: "teal",
    very_long: "orange",
  };
  const typeLabel: Record<string, string> = {
    mcq: "MCQ",
    short: "Short",
    long: "Long",
    very_long: "Very Long",
  };

  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        {/* Drag Handle + Number */}
        <Group gap="xs" style={{ flexShrink: 0 }}>
          <ActionIcon variant="subtle" color="gray" size="sm">
            <IconGripVertical size={14} />
          </ActionIcon>
          <ThemeIcon
            color={typeColor[question.type] || "gray"}
            variant="light"
            size="sm"
            radius="xl"
          >
            <Text size="xs" fw={700}>
              {index + 1}
            </Text>
          </ThemeIcon>
        </Group>

        {/* Content */}
        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Group gap="xs">
            <Badge
              color={typeColor[question.type] || "gray"}
              variant="light"
              size="xs"
            >
              {typeLabel[question.type]}
            </Badge>
            <Badge color="gray" variant="outline" size="xs">
              {question.marks} Mark{question.marks > 1 ? "s" : ""}
            </Badge>
            <Badge color="gray" variant="outline" size="xs">
              {question.difficulty}
            </Badge>
          </Group>

          <Text size="sm" fw={500}>
            {question.questionText}
          </Text>

          {question.type === "mcq" && question.options?.length > 0 && (
            <SimpleOptions
              options={question.options}
              correctAnswer={question.correctAnswer}
            />
          )}

          {question.type !== "mcq" && question.correctAnswer && (
            <Paper withBorder p="xs" radius="sm" bg="green.0">
              <Text size="xs" c="green.7">
                <strong>Answer:</strong> {question.correctAnswer}
              </Text>
            </Paper>
          )}
        </Stack>

        {/* Actions */}
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="sm">
              <IconDotsVertical size={14} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={() => onEdit(question)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              leftSection={<IconCopy size={14} />}
              onClick={() => onDuplicate(question)}
            >
              Duplicate
            </Menu.Item>
            <Menu.Item
              leftSection={<IconArrowUp size={14} />}
              disabled={index === 0}
              onClick={() => onMoveUp(question._id)}
            >
              Move Up
            </Menu.Item>
            <Menu.Item
              leftSection={<IconArrowDown size={14} />}
              disabled={index === total - 1}
              onClick={() => onMoveDown(question._id)}
            >
              Move Down
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconTrash size={14} />}
              color="red"
              onClick={() => onDelete(question._id)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card>
  );
}

function SimpleOptions({
  options,
  correctAnswer,
}: {
  options: { label: string; text: string }[];
  correctAnswer: string;
}) {
  return (
    <Stack gap={4}>
      {options.map((opt) => (
        <Group key={opt.label} gap="xs">
          <Badge
            color={opt.label === correctAnswer ? "green" : "gray"}
            variant={opt.label === correctAnswer ? "filled" : "outline"}
            size="xs"
            radius="sm"
          >
            {opt.label}
          </Badge>
          <Text size="xs" c={opt.label === correctAnswer ? "green" : undefined}>
            {opt.text}
          </Text>
        </Group>
      ))}
    </Stack>
  );
}

// ─── Edit Question Modal ───────────────────────────────────────────────────────

function EditQuestionModal({
  question,
  opened,
  onClose,
  onSave,
}: {
  question: Question | null;
  opened: boolean;
  onClose: () => void;
  onSave: (q: Question) => void;
}) {
  const [form, setForm] = useState<Question | null>(question);

  const handleSave = () => {
    if (!form) return;
    onSave(form);
    onClose();
  };

  if (!form) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Question"
      size="lg"
      radius="md"
    >
      <Stack gap="md">
        <Textarea
          label="Question Text"
          value={form.questionText}
          onChange={(e) =>
            setForm({ ...form, questionText: e.currentTarget.value })
          }
          minRows={3}
          autosize
          required
        />

        <Group grow>
          <Select
            label="Type"
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v as any })}
            data={[
              { value: "mcq", label: "MCQ" },
              { value: "short", label: "Short" },
              { value: "long", label: "Long" },
              { value: "very_long", label: "Very Long" },
            ]}
          />
          <NumberInput
            label="Marks"
            value={form.marks}
            min={1}
            onChange={(v) => setForm({ ...form, marks: Number(v) })}
          />
          <Select
            label="Difficulty"
            value={form.difficulty}
            onChange={(v) => setForm({ ...form, difficulty: v as any })}
            data={[
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
            ]}
          />
        </Group>

        {form.type === "mcq" && (
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Options
            </Text>
            {form.options.map((opt, i) => (
              <Group key={opt.label} gap="xs">
                <Badge variant="outline" size="sm">
                  {opt.label}
                </Badge>
                <TextInput
                  style={{ flex: 1 }}
                  value={opt.text}
                  onChange={(e) => {
                    const updated = [...form.options];
                    updated[i] = { ...opt, text: e.currentTarget.value };
                    setForm({ ...form, options: updated });
                  }}
                />
              </Group>
            ))}
            <TextInput
              label="Correct Answer"
              placeholder="A / B / C / D"
              value={form.correctAnswer}
              onChange={(e) =>
                setForm({ ...form, correctAnswer: e.currentTarget.value })
              }
            />
          </Stack>
        )}

        {form.type !== "mcq" && (
          <Textarea
            label="Model Answer"
            value={form.correctAnswer}
            onChange={(e) =>
              setForm({ ...form, correctAnswer: e.currentTarget.value })
            }
            minRows={3}
            autosize
          />
        )}

        <Textarea
          label="Explanation (optional)"
          value={form.explanation}
          onChange={(e) =>
            setForm({ ...form, explanation: e.currentTarget.value })
          }
          minRows={2}
          autosize
        />

        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button color="violet" onClick={handleSave} leftSection={<IconCheck size={14} />}>
            Save Question
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

// ─── Main Editor Page ──────────────────────────────────────────────────────────

export default function QuestionEditorPage() {
  const params = useParams();
  const router = useRouter();
  const paperId = params?.id as string;

  // Real institute/teacher data from Redux — not hardcoded placeholders.
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails
  );
  const teacher = useAppSelector(
    (state: any) => state.teacherSlice.teacherDetails
  );
  const instituteId = institute?._id;
  const teacherId = teacher?._id;
  // Use the real institute name for PDF generation instead of a hardcoded one.
  const instituteName = institute?.name || "";

  const { data, isLoading }:any = useQuestionPaper(paperId, instituteId);
  const updatePaperMutation = useUpdatePaper();
  const generatePDFMutation = useGeneratePDF();
  const publishMutation = usePublishExam();
  const createExamMutation = useCreateExam();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [publishModalOpened, { open: openPublish, close: closePublish }] = useDisclosure(false);

  const paper = data?.data;

  // Sync questions from API whenever the paper data changes.
  // NOTE: the original code used useState(() => {...}) as a mount-only hack,
  // which never re-ran if `paper` arrived after the first render (a common
  // race with React Query). useEffect with the right dependency is correct.
  useEffect(() => {
    if (paper?.questions) {
      setQuestions(paper.questions);
    }
  }, [paper?.questions]);

  if (!instituteId || !teacherId) {
    return (
      <Container size="lg" py="xl">
        <Center py="xl">
          <Stack align="center" gap="sm">
            <Skeleton height={20} width={200} />
            <Text size="sm" c="dimmed">
              Loading institute/teacher data...
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Stack gap="md">
          <Skeleton height={40} width={300} />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={100} radius="md" />
          ))}
        </Stack>
      </Container>
    );
  }

  if (!paper) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          Question paper not found
        </Alert>
      </Container>
    );
  }

  const currentQuestions = questions.length ? questions : paper.questions || [];

  const handleEditQuestion = (q: Question) => {
    setEditingQuestion({ ...q });
    openEdit();
  };

  const handleSaveEditedQuestion = (updated: Question) => {
    const newList = currentQuestions.map((q:any) =>
      q._id === updated._id ? updated : q
    );
    setQuestions(newList);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(currentQuestions.filter((q:any) => q._id !== id));
  };

  const handleDuplicateQuestion = (q: Question) => {
    const copy: Question = {
      ...q,
      _id: `${q._id}-copy-${Date.now()}`,
      order: currentQuestions.length,
    };
    setQuestions([...currentQuestions, copy]);
  };

  const moveQuestion = (id: string, dir: "up" | "down") => {
    const idx = currentQuestions.findIndex((q:any) => q._id === id);
    if (idx < 0) return;
    const next = dir === "up" ? idx - 1 : idx + 1;
    if (next < 0 || next >= currentQuestions.length) return;
    const arr = [...currentQuestions];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    setQuestions(arr);
  };

  const handleSaveChanges = async () => {
    try {
      await updatePaperMutation.mutateAsync({
        id: paperId,
        instituteId,
        teacherId,
        updates: { questions: currentQuestions },
      });
      notifications.show({
        title: "Saved",
        message: "Changes saved successfully",
        color: "green",
        icon: <IconCheck size={16} />,
      });
    } catch (error: any) {
      console.log("SAVE PAPER ERROR :", error?.response || error);
      notifications.show({
        title: "Save Failed",
        message: error?.response?.data?.message || "Could not save changes",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const handleGeneratePDF = async () => {
    try {
      await generatePDFMutation.mutateAsync({
        id: paperId,
        instituteId,
        teacherId,
        instituteName,
      });
      notifications.show({
        title: "PDF Generated",
        message: "Your PDF is ready to download",
        color: "green",
      });
    } catch (error: any) {
      console.log("GENERATE PDF ERROR :", error?.response || error);
      notifications.show({
        title: "PDF Generation Failed",
        message: error?.response?.data?.message || "Could not generate PDF",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const handlePublish = async () => {
    closePublish();
    try {
      await publishMutation.mutateAsync({
        id: paperId,
        instituteId,
        teacherId,
      });
      notifications.show({
        title: "Published!",
        message: "Exam is now published and live",
        color: "green",
        icon: <IconCheck size={16} />,
      });
    } catch (error: any) {
      console.log("PUBLISH ERROR :", error?.response || error);
      notifications.show({
        title: "Publish Failed",
        message: error?.response?.data?.message || "Could not publish exam",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const mcqs = currentQuestions.filter((q:any) => q.type === "mcq");
  const shorts = currentQuestions.filter((q:any) => q.type === "short");
  const longs = currentQuestions.filter((q:any) => q.type === "long");
  const veryLongs = currentQuestions.filter((q:any) => q.type === "very_long");

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Group gap="xs">
              <ThemeIcon color="violet" variant="light" size="lg" radius="md">
                <IconEdit size={20} />
              </ThemeIcon>
              <Title order={2} fw={700}>
                Question Editor
              </Title>
            </Group>
            <Text c="dimmed" size="sm">
              {paper.title}
            </Text>
            <Group gap="xs" mt={4}>
              <Badge color="violet" variant="light">
                {currentQuestions.length} Questions
              </Badge>
              <Badge color="blue" variant="light">
                {paper.totalMarks} Marks
              </Badge>
              <Badge color="teal" variant="light">
                {paper.duration} min
              </Badge>
              <Badge
                color={paper.status === "published" ? "green" : "orange"}
                variant="light"
              >
                {paper.status}
              </Badge>
            </Group>
          </Stack>

          {/* Action Buttons */}
          <Group gap="xs">
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveChanges}
              loading={updatePaperMutation.isPending}
              leftSection={<IconCheck size={14} />}
            >
              Save
            </Button>
            <Button
              variant="light"
              color="blue"
              size="sm"
              onClick={handleGeneratePDF}
              loading={generatePDFMutation.isPending}
              leftSection={<IconFileText size={14} />}
            >
              Generate PDF
            </Button>
            {paper.pdfUrl && (
              <Button
                variant="light"
                color="teal"
                size="sm"
                component="a"
                href={paper.pdfUrl}
                target="_blank"
                leftSection={<IconDownload size={14} />}
              >
                Download
              </Button>
            )}
            <Button
              color="violet"
              size="sm"
              onClick={openPublish}
              leftSection={<IconSend size={14} />}
              disabled={paper.status === "published"}
            >
              Publish
            </Button>
          </Group>
        </Group>

        <Divider />

        {/* Questions Tabs */}
        <Tabs defaultValue="all" color="violet">
          <Tabs.List>
            <Tabs.Tab value="all">
              All ({currentQuestions.length})
            </Tabs.Tab>
            <Tabs.Tab value="mcq">MCQ ({mcqs.length})</Tabs.Tab>
            <Tabs.Tab value="short">Short ({shorts.length})</Tabs.Tab>
            <Tabs.Tab value="long">Long ({longs.length})</Tabs.Tab>
            <Tabs.Tab value="very_long">Very Long ({veryLongs.length})</Tabs.Tab>
          </Tabs.List>

          {(["all", "mcq", "short", "long", "very_long"] as const).map(
            (tab) => {
              const tabQuestions =
                tab === "all"
                  ? currentQuestions
                  : currentQuestions.filter((q:any) => q.type === tab);

              return (
                <Tabs.Panel key={tab} value={tab} pt="md">
                  <ScrollArea>
                    <Stack gap="sm">
                      {tabQuestions.length === 0 && (
                        <Card withBorder radius="md" p="xl">
                          <Stack align="center" gap="sm">
                            <Text c="dimmed" size="sm">
                              No questions in this section
                            </Text>
                          </Stack>
                        </Card>
                      )}
                      {tabQuestions.map((q:any, i:number) => (
                        <QuestionCard
                          key={q._id}
                          question={q}
                          index={i}
                          total={tabQuestions.length}
                          onEdit={handleEditQuestion}
                          onDelete={handleDeleteQuestion}
                          onDuplicate={handleDuplicateQuestion}
                          onMoveUp={(id) => moveQuestion(id, "up")}
                          onMoveDown={(id) => moveQuestion(id, "down")}
                        />
                      ))}
                    </Stack>
                  </ScrollArea>
                </Tabs.Panel>
              );
            }
          )}
        </Tabs>

        {/* Answer Key Preview */}
        {paper.answerKey?.length > 0 && (
          <Card withBorder radius="md" p="md">
            <Stack gap="sm">
              <Text fw={600} size="sm">
                Answer Key ({paper.answerKey.length} entries)
              </Text>
              <Divider />
              <ScrollArea h={200}>
                <Stack gap="xs">
                  {paper.answerKey.map((ak: any, i: number) => (
                    <Group key={ak.questionId} gap="md">
                      <Badge variant="outline" size="xs" color="violet">
                        Q{i + 1}
                      </Badge>
                      <Text size="xs" style={{ flex: 1 }}>
                        {ak.answer}
                      </Text>
                      <Badge size="xs" color="gray" variant="light">
                        {ak.marks} mark{ak.marks > 1 ? "s" : ""}
                      </Badge>
                    </Group>
                  ))}
                </Stack>
              </ScrollArea>
            </Stack>
          </Card>
        )}
      </Stack>

      {/* Edit Modal */}
      <EditQuestionModal
        question={editingQuestion}
        opened={editModalOpened}
        onClose={closeEdit}
        onSave={handleSaveEditedQuestion}
      />

      {/* Publish Confirmation Modal */}
      <Modal
        opened={publishModalOpened}
        onClose={closePublish}
        title="Publish Exam"
        size="sm"
        radius="md"
      >
        <Stack gap="md">
          <Alert color="violet" variant="light" icon={<IconSend size={16} />}>
            Once published, this exam will be visible to students. Make sure
            all questions and answers are correct.
          </Alert>
          <Group justify="flex-end">
            <Button variant="default" onClick={closePublish}>
              Cancel
            </Button>
            <Button
              color="violet"
              onClick={handlePublish}
              loading={publishMutation.isPending}
            >
              Publish Now
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}