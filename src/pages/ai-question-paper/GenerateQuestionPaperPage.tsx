// "use client";

// import { useState } from "react";
// import {
//   Container,
//   Title,
//   Text,
//   Button,
//   Group,
//   Stack,
//   Card,
//   TextInput,
//   Select,
//   NumberInput,
//   SimpleGrid,
//   ThemeIcon,
//   Divider,
//   Alert,
//   Badge,
//   Loader,
//   Center,
// } from "@mantine/core";
// import { useForm } from "@mantine/form";
// import { notifications } from "@mantine/notifications";
// import {
//   IconSparkles,
//   IconAlertCircle,
//   IconCheck,
//   IconBrain,
// } from "@tabler/icons-react";
// import { useGenerateQuestionPaper } from "../../hooks/useAIQuestionPaper";
// import { useRouter, useSearchParams } from "next/navigation";

// const INSTITUTE_ID = "INST-001";
// const TEACHER_ID = "TCH-001";

// export default function GenerateQuestionPaperPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const idsParam = searchParams.get("ids") || "";
//   const docIds = idsParam.split(",").filter(Boolean);

//   const generateMutation = useGenerateQuestionPaper();
//   const [isGenerating, setIsGenerating] = useState(false);

//   const form = useForm({
//     initialValues: {
//       title: "",
//       classId: "",
//       className: "",
//       subjectId: "",
//       subject: "",
//       chapterName: "",
//       language: "English",
//       difficulty: "mixed",
//       totalMarks: 100,
//       duration: 180,
//       mcqCount: 10,
//       shortCount: 5,
//       longCount: 3,
//       veryLongCount: 2,
//       bloomsTaxonomy: "remember",
//       examType: "unit_test",
//     },
//     validate: {
//       title: (v) => (!v.trim() ? "Title is required" : null),
//       classId: (v) => (!v ? "Class is required" : null),
//       subjectId: (v) => (!v ? "Subject is required" : null),
//       totalMarks: (v) => (v < 1 ? "Total marks must be at least 1" : null),
//       duration: (v) => (v < 1 ? "Duration must be at least 1 minute" : null),
//     },
//   });

//   const handleGenerate = async () => {
//     const validation = form.validate();
//     if (validation.hasErrors) return;

//     if (!docIds.length) {
//       notifications.show({
//         title: "No OCR documents",
//         message: "Please upload study material first",
//         color: "orange",
//       });
//       return;
//     }

//     setIsGenerating(true);

//     const res = await generateMutation.mutateAsync({
//       instituteId: INSTITUTE_ID,
//       teacherId: TEACHER_ID,
//       ocrDocumentIds: docIds,
//       ...form.values,
//     });

//     setIsGenerating(false);

//     if (res.status === 200) {
//       notifications.show({
//         title: "Question Paper Generated!",
//         message: "Your AI question paper is ready to edit",
//         color: "green",
//         icon: <IconCheck size={16} />,
//       });
//       router.push(`/ai-question-paper/editor/${res.data._id}`);
//     } else {
//       notifications.show({
//         title: "Generation Failed",
//         message: res.message || "Something went wrong",
//         color: "red",
//         icon: <IconAlertCircle size={16} />,
//       });
//     }
//   };

//   if (isGenerating) {
//     return (
//       <Container size="sm" py="xl">
//         <Center>
//           <Stack align="center" gap="xl" py={80}>
//             <ThemeIcon color="violet" size={80} radius="xl" variant="light">
//               <IconBrain size={40} />
//             </ThemeIcon>
//             <Stack align="center" gap="sm">
//               <Title order={3}>Generating Question Paper...</Title>
//               <Text c="dimmed" size="sm" ta="center">
//                 AI is analyzing your study material and creating questions.
//                 This may take 30–60 seconds.
//               </Text>
//               <Loader color="violet" size="lg" mt="sm" />
//             </Stack>
//           </Stack>
//         </Center>
//       </Container>
//     );
//   }

//   return (
//     <Container size="lg" py="xl">
//       <Stack gap="xl">
//         {/* Header */}
//         <Stack gap={4}>
//           <Group gap="xs">
//             <ThemeIcon color="violet" variant="light" size="lg" radius="md">
//               <IconSparkles size={20} />
//             </ThemeIcon>
//             <Title order={2} fw={700}>
//               Configure Question Paper
//             </Title>
//           </Group>
//           <Text c="dimmed" size="sm">
//             Set your exam parameters and let AI generate a complete question
//             paper from your uploaded material.
//           </Text>
//           {docIds.length > 0 && (
//             <Badge color="violet" variant="light">
//               {docIds.length} OCR document{docIds.length > 1 ? "s" : ""} selected
//             </Badge>
//           )}
//         </Stack>

//         {/* Form */}
//         <Card withBorder radius="md" p="lg">
//           <Stack gap="lg">
//             {/* Basic Info */}
//             <Stack gap="xs">
//               <Text fw={600} size="sm" c="violet">
//                 Exam Information
//               </Text>
//               <Divider />
//             </Stack>

//             <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
//               <TextInput
//                 label="Question Paper Title"
//                 placeholder="e.g. Chapter 5 Unit Test — Science"
//                 required
//                 {...form.getInputProps("title")}
//               />
//               <TextInput
//                 label="Chapter Name"
//                 placeholder="e.g. Light and Shadow"
//                 {...form.getInputProps("chapterName")}
//               />
//             </SimpleGrid>

//             <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
//               <Select
//                 label="Class"
//                 placeholder="Select class"
//                 required
//                 data={[
//                   "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
//                   "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
//                   "Class 11", "Class 12",
//                 ].map((c) => ({ value: c, label: c }))}
//                 onChange={(v) => {
//                   form.setFieldValue("classId", v || "");
//                   form.setFieldValue("className", v || "");
//                 }}
//                 error={form.errors.classId}
//               />
//               <Select
//                 label="Subject"
//                 placeholder="Select subject"
//                 required
//                 data={[
//                   "Mathematics", "Science", "English", "Hindi",
//                   "Social Science", "Physics", "Chemistry", "Biology",
//                   "History", "Geography", "Computer Science",
//                 ].map((s) => ({ value: s, label: s }))}
//                 onChange={(v) => {
//                   form.setFieldValue("subjectId", v || "");
//                   form.setFieldValue("subject", v || "");
//                 }}
//                 error={form.errors.subjectId}
//               />
//               <Select
//                 label="Language"
//                 data={[
//                   { value: "English", label: "English" },
//                   { value: "Hindi", label: "Hindi" },
//                   { value: "Mixed", label: "English + Hindi" },
//                 ]}
//                 {...form.getInputProps("language")}
//               />
//             </SimpleGrid>

//             {/* Exam Settings */}
//             <Stack gap="xs" mt="sm">
//               <Text fw={600} size="sm" c="violet">
//                 Exam Settings
//               </Text>
//               <Divider />
//             </Stack>

//             <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
//               <NumberInput
//                 label="Total Marks"
//                 min={1}
//                 max={500}
//                 {...form.getInputProps("totalMarks")}
//               />
//               <NumberInput
//                 label="Duration (minutes)"
//                 min={10}
//                 max={360}
//                 {...form.getInputProps("duration")}
//               />
//               <Select
//                 label="Difficulty"
//                 data={[
//                   { value: "easy", label: "Easy" },
//                   { value: "medium", label: "Medium" },
//                   { value: "hard", label: "Hard" },
//                   { value: "mixed", label: "Mixed" },
//                 ]}
//                 {...form.getInputProps("difficulty")}
//               />
//               <Select
//                 label="Exam Type"
//                 data={[
//                   { value: "unit_test", label: "Unit Test" },
//                   { value: "monthly_test", label: "Monthly Test" },
//                   { value: "half_yearly", label: "Half Yearly" },
//                   { value: "annual", label: "Annual Exam" },
//                   { value: "board", label: "Board Pattern" },
//                 ]}
//                 {...form.getInputProps("examType")}
//               />
//             </SimpleGrid>

//             {/* Question Counts */}
//             <Stack gap="xs" mt="sm">
//               <Text fw={600} size="sm" c="violet">
//                 Question Distribution
//               </Text>
//               <Divider />
//             </Stack>

//             <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
//               <NumberInput
//                 label="MCQ Count"
//                 description="1 mark each"
//                 min={0}
//                 max={100}
//                 {...form.getInputProps("mcqCount")}
//               />
//               <NumberInput
//                 label="Short Questions"
//                 description="2–3 marks each"
//                 min={0}
//                 max={50}
//                 {...form.getInputProps("shortCount")}
//               />
//               <NumberInput
//                 label="Long Questions"
//                 description="5 marks each"
//                 min={0}
//                 max={20}
//                 {...form.getInputProps("longCount")}
//               />
//               <NumberInput
//                 label="Very Long Questions"
//                 description="10 marks each"
//                 min={0}
//                 max={10}
//                 {...form.getInputProps("veryLongCount")}
//               />
//             </SimpleGrid>

//             {/* Bloom's */}
//             <Select
//               label="Bloom's Taxonomy Level"
//               description="Target cognitive skill level"
//               data={[
//                 { value: "remember", label: "Remember" },
//                 { value: "understand", label: "Understand" },
//                 { value: "apply", label: "Apply" },
//                 { value: "analyze", label: "Analyze" },
//                 { value: "evaluate", label: "Evaluate" },
//                 { value: "create", label: "Create" },
//                 { value: "mixed", label: "Mixed Levels" },
//               ]}
//               {...form.getInputProps("bloomsTaxonomy")}
//               maw={300}
//             />

//             {/* Alert */}
//             <Alert
//               color="violet"
//               variant="light"
//               icon={<IconSparkles size={16} />}
//             >
//               AI will generate questions strictly from your uploaded study
//               material. No external content will be added.
//             </Alert>

//             {/* Actions */}
//             <Group justify="flex-end" mt="sm">
//               <Button
//                 variant="default"
//                 onClick={() => router.back()}
//               >
//                 Back
//               </Button>
//               <Button
//                 color="violet"
//                 leftSection={<IconSparkles size={16} />}
//                 onClick={handleGenerate}
//                 loading={generateMutation.isPending}
//                 size="md"
//               >
//                 Generate Question Paper
//               </Button>
//             </Group>
//           </Stack>
//         </Card>
//       </Stack>
//     </Container>
//   );
// }





"use client";

import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  TextInput,
  Select,
  NumberInput,
  SimpleGrid,
  ThemeIcon,
  Divider,
  Alert,
  Badge,
  Loader,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconSparkles,
  IconAlertCircle,
  IconCheck,
  IconBrain,
} from "@tabler/icons-react";
import { useGenerateQuestionPaper } from "../../hooks/useAIQuestionPaper";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/app/redux/redux.hooks";

export default function GenerateQuestionPaperPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") || "";
  const docIds = idsParam.split(",").filter(Boolean);

  // Real institute/teacher data from Redux — not hardcoded placeholders.
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails
  );
  const teacher = useAppSelector(
    (state: any) => state.teacherSlice.teacherDetails
  );

  const generateMutation = useGenerateQuestionPaper();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      classId: "",
      className: "",
      subjectId: "",
      subject: "",
      chapterName: "",
      language: "English",
      difficulty: "mixed",
      totalMarks: 100,
      duration: 180,
      mcqCount: 10,
      shortCount: 5,
      longCount: 3,
      veryLongCount: 2,
      bloomsTaxonomy: "remember",
      examType: "unit_test",
    },
    validate: {
      title: (v) => (!v.trim() ? "Title is required" : null),
      classId: (v) => (!v ? "Class is required" : null),
      subjectId: (v) => (!v ? "Subject is required" : null),
      totalMarks: (v) => (v < 1 ? "Total marks must be at least 1" : null),
      duration: (v) => (v < 1 ? "Duration must be at least 1 minute" : null),
    },
  });

  const handleGenerate = async () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    if (!docIds.length) {
      notifications.show({
        title: "No OCR documents",
        message: "Please upload study material first",
        color: "orange",
      });
      return;
    }

    if (!institute?._id || !teacher?._id) {
      console.log("GENERATE BLOCKED: missing institute or teacher id", {
        instituteId: institute?._id,
        teacherId: teacher?._id,
      });
      notifications.show({
        title: "Missing Data",
        message: "Institute or Teacher not found. Please re-login.",
        color: "red",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // NOTE: ApiHelper.post() returns response.data directly, so the
      // result here IS the backend body — there is no `.status` on it.
      const res: any = await generateMutation.mutateAsync({
        instituteId: institute._id,
        teacherId: teacher._id,
        ocrDocumentIds: docIds,
        ...form.values,
      });

      console.log("Generate result:", res);

      const paper = res?.data;

      if (paper?._id) {
        notifications.show({
          title: "Question Paper Generated!",
          message: "Your AI question paper is ready to edit",
          color: "green",
          icon: <IconCheck size={16} />,
        });
        router.push(`/ai-question-paper/editor/${paper._id}`);
      } else {
        console.log("GENERATE ERROR: no paper id in response", res);
        notifications.show({
          title: "Generation Failed",
          message: res?.message || "Something went wrong",
          color: "red",
          icon: <IconAlertCircle size={16} />,
        });
      }
    } catch (error: any) {
      console.log("GENERATE PAGE ERROR :", error?.response || error);
      notifications.show({
        title: "Generation Failed",
        message:
          error?.response?.data?.message ||
          "Something went wrong while generating the paper",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <Container size="sm" py="xl">
        <Center>
          <Stack align="center" gap="xl" py={80}>
            <ThemeIcon color="violet" size={80} radius="xl" variant="light">
              <IconBrain size={40} />
            </ThemeIcon>
            <Stack align="center" gap="sm">
              <Title order={3}>Generating Question Paper...</Title>
              <Text c="dimmed" size="sm" ta="center">
                AI is analyzing your study material and creating questions.
                This may take 30–60 seconds.
              </Text>
              <Loader color="violet" size="lg" mt="sm" />
            </Stack>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Stack gap={4}>
          <Group gap="xs">
            <ThemeIcon color="violet" variant="light" size="lg" radius="md">
              <IconSparkles size={20} />
            </ThemeIcon>
            <Title order={2} fw={700}>
              Configure Question Paper
            </Title>
          </Group>
          <Text c="dimmed" size="sm">
            Set your exam parameters and let AI generate a complete question
            paper from your uploaded material.
          </Text>
          {docIds.length > 0 && (
            <Badge color="violet" variant="light">
              {docIds.length} OCR document{docIds.length > 1 ? "s" : ""} selected
            </Badge>
          )}
        </Stack>

        {/* Form */}
        <Card withBorder radius="md" p="lg">
          <Stack gap="lg">
            {/* Basic Info */}
            <Stack gap="xs">
              <Text fw={600} size="sm" c="violet">
                Exam Information
              </Text>
              <Divider />
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="Question Paper Title"
                placeholder="e.g. Chapter 5 Unit Test — Science"
                required
                {...form.getInputProps("title")}
              />
              <TextInput
                label="Chapter Name"
                placeholder="e.g. Light and Shadow"
                {...form.getInputProps("chapterName")}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <Select
                label="Class"
                placeholder="Select class"
                required
                data={[
                  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
                  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
                  "Class 11", "Class 12",
                ].map((c) => ({ value: c, label: c }))}
                onChange={(v) => {
                  form.setFieldValue("classId", v || "");
                  form.setFieldValue("className", v || "");
                }}
                error={form.errors.classId}
              />
              <Select
                label="Subject"
                placeholder="Select subject"
                required
                data={[
                  "Mathematics", "Science", "English", "Hindi",
                  "Social Science", "Physics", "Chemistry", "Biology",
                  "History", "Geography", "Computer Science",
                ].map((s) => ({ value: s, label: s }))}
                onChange={(v) => {
                  form.setFieldValue("subjectId", v || "");
                  form.setFieldValue("subject", v || "");
                }}
                error={form.errors.subjectId}
              />
              <Select
                label="Language"
                data={[
                  { value: "English", label: "English" },
                  { value: "Hindi", label: "Hindi" },
                  { value: "Mixed", label: "English + Hindi" },
                ]}
                {...form.getInputProps("language")}
              />
            </SimpleGrid>

            {/* Exam Settings */}
            <Stack gap="xs" mt="sm">
              <Text fw={600} size="sm" c="violet">
                Exam Settings
              </Text>
              <Divider />
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
              <NumberInput
                label="Total Marks"
                min={1}
                max={500}
                {...form.getInputProps("totalMarks")}
              />
              <NumberInput
                label="Duration (minutes)"
                min={10}
                max={360}
                {...form.getInputProps("duration")}
              />
              <Select
                label="Difficulty"
                data={[
                  { value: "easy", label: "Easy" },
                  { value: "medium", label: "Medium" },
                  { value: "hard", label: "Hard" },
                  { value: "mixed", label: "Mixed" },
                ]}
                {...form.getInputProps("difficulty")}
              />
              <Select
                label="Exam Type"
                data={[
                  { value: "unit_test", label: "Unit Test" },
                  { value: "monthly_test", label: "Monthly Test" },
                  { value: "half_yearly", label: "Half Yearly" },
                  { value: "annual", label: "Annual Exam" },
                  { value: "board", label: "Board Pattern" },
                ]}
                {...form.getInputProps("examType")}
              />
            </SimpleGrid>

            {/* Question Counts */}
            <Stack gap="xs" mt="sm">
              <Text fw={600} size="sm" c="violet">
                Question Distribution
              </Text>
              <Divider />
            </Stack>

            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
              <NumberInput
                label="MCQ Count"
                description="1 mark each"
                min={0}
                max={100}
                {...form.getInputProps("mcqCount")}
              />
              <NumberInput
                label="Short Questions"
                description="2–3 marks each"
                min={0}
                max={50}
                {...form.getInputProps("shortCount")}
              />
              <NumberInput
                label="Long Questions"
                description="5 marks each"
                min={0}
                max={20}
                {...form.getInputProps("longCount")}
              />
              <NumberInput
                label="Very Long Questions"
                description="10 marks each"
                min={0}
                max={10}
                {...form.getInputProps("veryLongCount")}
              />
            </SimpleGrid>

            {/* Bloom's */}
            <Select
              label="Bloom's Taxonomy Level"
              description="Target cognitive skill level"
              data={[
                { value: "remember", label: "Remember" },
                { value: "understand", label: "Understand" },
                { value: "apply", label: "Apply" },
                { value: "analyze", label: "Analyze" },
                { value: "evaluate", label: "Evaluate" },
                { value: "create", label: "Create" },
                { value: "mixed", label: "Mixed Levels" },
              ]}
              {...form.getInputProps("bloomsTaxonomy")}
              maw={300}
            />

            {/* Alert */}
            <Alert
              color="violet"
              variant="light"
              icon={<IconSparkles size={16} />}
            >
              AI will generate questions strictly from your uploaded study
              material. No external content will be added.
            </Alert>

            {/* Actions */}
            <Group justify="flex-end" mt="sm">
              <Button
                variant="default"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button
                color="violet"
                leftSection={<IconSparkles size={16} />}
                onClick={handleGenerate}
                loading={generateMutation.isPending}
                size="md"
              >
                Generate Question Paper
              </Button>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
