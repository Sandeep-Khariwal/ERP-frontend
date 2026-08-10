// "use client";

// import { useState, useEffect } from "react";
// import {
//   Container,
//   Title,
//   Text,
//   Button,
//   Group,
//   Stack,
//   Card,
//   Textarea,
//   Badge,
//   Loader,
//   Center,
//   Alert,
//   ThemeIcon,
//   Tabs,
//   ActionIcon,
//   Skeleton,
//   Paper,
// } from "@mantine/core";
// import { notifications } from "@mantine/notifications";
// import {
//   IconEye,
//   IconEdit,
//   IconCheck,
//   IconAlertCircle,
//   IconRefresh,
//   IconArrowRight,
//   IconFileText,
// } from "@tabler/icons-react";
// import { useOCRDocument, useUpdateOCRText } from "../../hooks/useAIQuestionPaper";
// import { useRouter, useSearchParams } from "next/navigation";

// const INSTITUTE_ID = "INST-001";

// interface OCRPreviewCardProps {
//   docId: string;
//   index: number;
//   onTextChange: (id: string, text: string) => void;
// }

// function OCRPreviewCard({ docId, index, onTextChange }: OCRPreviewCardProps) {
//   const { data, isLoading } = useOCRDocument(docId, INSTITUTE_ID);
//   const updateMutation = useUpdateOCRText();
//   const [editMode, setEditMode] = useState(false);
//   const [localText, setLocalText] = useState("");
//   const doc = data?.data;

//   useEffect(() => {
//     if (doc?.extractedText) {
//       setLocalText(doc.extractedText);
//       onTextChange(docId, doc.extractedText);
//     }
//   }, [doc?.extractedText]);

//   const handleSave = async () => {
//     const res = await updateMutation.mutateAsync({
//       id: docId,
//       instituteId: INSTITUTE_ID,
//       extractedText: localText,
//     });

//     if (res.status === 200) {
//       notifications.show({
//         title: "Saved",
//         message: "OCR text updated",
//         color: "green",
//         icon: <IconCheck size={16} />,
//       });
//       setEditMode(false);
//       onTextChange(docId, localText);
//     }
//   };

//   const statusColor: Record<string, string> = {
//     pending: "gray",
//     processing: "yellow",
//     completed: "green",
//     failed: "red",
//   };

//   if (isLoading) {
//     return (
//       <Card withBorder radius="md" p="md">
//         <Skeleton height={20} width={200} mb="sm" />
//         <Skeleton height={120} />
//       </Card>
//     );
//   }

//   if (!doc) {
//     return (
//       <Card withBorder radius="md" p="md">
//         <Text c="dimmed" size="sm">Document not found</Text>
//       </Card>
//     );
//   }

//   const isProcessing = doc.status === "pending" || doc.status === "processing";

//   return (
//     <Card withBorder radius="md" p="md">
//       <Group justify="space-between" mb="sm">
//         <Group gap="sm">
//           <ThemeIcon color="violet" variant="light" radius="md" size="sm">
//             <IconFileText size={14} />
//           </ThemeIcon>
//           <Stack gap={2}>
//             <Text size="sm" fw={600}>
//               File {index + 1}: {doc.originalFileName}
//             </Text>
//             <Text size="xs" c="dimmed">
//               {(doc.size / 1024).toFixed(1)} KB
//             </Text>
//           </Stack>
//         </Group>
//         <Badge
//           color={statusColor[doc.status] || "gray"}
//           variant="light"
//           size="sm"
//         >
//           {doc.status}
//         </Badge>
//       </Group>

//       {isProcessing && (
//         <Center py="xl">
//           <Stack align="center" gap="sm">
//             <Loader color="violet" size="sm" />
//             <Text size="sm" c="dimmed">
//               OCR processing in progress...
//             </Text>
//           </Stack>
//         </Center>
//       )}

//       {doc.status === "failed" && (
//         <Alert
//           color="red"
//           icon={<IconAlertCircle size={16} />}
//           variant="light"
//         >
//           OCR extraction failed. Please re-upload the file.
//         </Alert>
//       )}

//       {doc.status === "completed" && (
//         <Stack gap="sm">
//           <Tabs defaultValue="preview">
//             <Tabs.List>
//               <Tabs.Tab value="preview" leftSection={<IconEye size={14} />}>
//                 Preview
//               </Tabs.Tab>
//               <Tabs.Tab value="edit" leftSection={<IconEdit size={14} />}>
//                 Edit
//               </Tabs.Tab>
//             </Tabs.List>

//             <Tabs.Panel value="preview" pt="sm">
//               <Paper
//                 withBorder
//                 p="sm"
//                 radius="md"
//                 style={{ maxHeight: 300, overflowY: "auto", whiteSpace: "pre-wrap" }}
//               >
//                 <Text size="sm" style={{ lineHeight: 1.7 }}>
//                   {localText || "No text extracted"}
//                 </Text>
//               </Paper>
//             </Tabs.Panel>

//             <Tabs.Panel value="edit" pt="sm">
//               <Stack gap="sm">
//                 <Textarea
//                   value={localText}
//                   onChange={(e) => setLocalText(e.currentTarget.value)}
//                   minRows={8}
//                   maxRows={16}
//                   autosize
//                   placeholder="Edit extracted text here..."
//                   styles={{
//                     input: { fontFamily: "monospace", fontSize: 13 },
//                   }}
//                 />
//                 <Group justify="flex-end">
//                   <Button
//                     size="xs"
//                     color="violet"
//                     loading={updateMutation.isPending}
//                     onClick={handleSave}
//                     leftSection={<IconCheck size={14} />}
//                   >
//                     Save Changes
//                   </Button>
//                 </Group>
//               </Stack>
//             </Tabs.Panel>
//           </Tabs>
//         </Stack>
//       )}
//     </Card>
//   );
// }

// export default function OCRPreviewPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const idsParam = searchParams.get("ids") || "";
//   const docIds = idsParam.split(",").filter(Boolean);

//   const [ocrTexts, setOcrTexts] = useState<Record<string, string>>({});

//   const handleTextChange = (id: string, text: string) => {
//     setOcrTexts((prev) => ({ ...prev, [id]: text }));
//   };

//   const handleProceed = () => {
//     const params = new URLSearchParams({
//       ids: docIds.join(","),
//     });
//     router.push(`/ai-question-paper/generate?${params}`);
//   };

//   if (!docIds.length) {
//     return (
//       <Container size="lg" py="xl">
//         <Alert color="red" icon={<IconAlertCircle size={16} />}>
//           No OCR documents found. Please upload files first.
//         </Alert>
//         <Button
//           mt="md"
//           color="violet"
//           onClick={() => router.push("/ai-question-paper/upload")}
//         >
//           Go to Upload
//         </Button>
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
//               <IconEye size={20} />
//             </ThemeIcon>
//             <Title order={2} fw={700}>
//               OCR Text Preview
//             </Title>
//           </Group>
//           <Text c="dimmed" size="sm">
//             Review and edit the text extracted from your uploaded files. You
//             can correct any OCR errors before generating the question paper.
//           </Text>
//         </Stack>

//         {/* OCR Cards */}
//         <Stack gap="md">
//           {docIds.map((id, i) => (
//             <OCRPreviewCard
//               key={id}
//               docId={id}
//               index={i}
//               onTextChange={handleTextChange}
//             />
//           ))}
//         </Stack>

//         {/* Actions */}
//         <Group justify="space-between">
//           <Button
//             variant="default"
//             onClick={() => router.push("/ai-question-paper/upload")}
//             leftSection={<IconRefresh size={16} />}
//           >
//             Upload More Files
//           </Button>

//           <Button
//             color="violet"
//             rightSection={<IconArrowRight size={16} />}
//             onClick={handleProceed}
//           >
//             Proceed to Generate Paper
//           </Button>
//         </Group>
//       </Stack>
//     </Container>
//   );
// }






"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  Textarea,
  Badge,
  Loader,
  Center,
  Alert,
  ThemeIcon,
  Tabs,
  ActionIcon,
  Skeleton,
  Paper,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconEye,
  IconEdit,
  IconCheck,
  IconAlertCircle,
  IconRefresh,
  IconArrowRight,
  IconFileText,
} from "@tabler/icons-react";
import { useOCRDocument, useUpdateOCRText } from "../../hooks/useAIQuestionPaper";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/app/redux/redux.hooks";

interface OCRPreviewCardProps {
  docId: string;
  index: number;
  instituteId: string;
  onTextChange: (id: string, text: string) => void;
}

function OCRPreviewCard({ docId, index, instituteId, onTextChange }: OCRPreviewCardProps) {
  const { data, isLoading } = useOCRDocument(docId, instituteId);
  const updateMutation = useUpdateOCRText();
  const [editMode, setEditMode] = useState(false);
  const [localText, setLocalText] = useState("");
  const doc = data?.data;

  useEffect(() => {
    if (doc?.extractedText) {
      setLocalText(doc.extractedText);
      onTextChange(docId, doc.extractedText);
    }
  }, [doc?.extractedText]);

  const handleSave = async () => {
    try {
      const res: any = await updateMutation.mutateAsync({
        id: docId,
        instituteId: instituteId,
        extractedText: localText,
      });

      notifications.show({
        title: "Saved",
        message: "OCR text updated",
        color: "green",
        icon: <IconCheck size={16} />,
      });
      setEditMode(false);
      onTextChange(docId, localText);
    } catch (error: any) {
      console.log("SAVE OCR TEXT ERROR :", error?.response || error);
      notifications.show({
        title: "Save Failed",
        message: error?.response?.data?.message || "Could not save changes",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const statusColor: Record<string, string> = {
    pending: "gray",
    processing: "yellow",
    completed: "green",
    failed: "red",
  };

  if (isLoading) {
    return (
      <Card withBorder radius="md" p="md">
        <Skeleton height={20} width={200} mb="sm" />
        <Skeleton height={120} />
      </Card>
    );
  }

  if (!doc) {
    return (
      <Card withBorder radius="md" p="md">
        <Text c="dimmed" size="sm">Document not found</Text>
      </Card>
    );
  }

  const isProcessing = doc.status === "pending" || doc.status === "processing";

  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" mb="sm">
        <Group gap="sm">
          <ThemeIcon color="violet" variant="light" radius="md" size="sm">
            <IconFileText size={14} />
          </ThemeIcon>
          <Stack gap={2}>
            <Text size="sm" fw={600}>
              File {index + 1}: {doc.originalFileName}
            </Text>
            <Text size="xs" c="dimmed">
              {(doc.size / 1024).toFixed(1)} KB
            </Text>
          </Stack>
        </Group>
        <Badge
          color={statusColor[doc.status] || "gray"}
          variant="light"
          size="sm"
        >
          {doc.status}
        </Badge>
      </Group>

      {isProcessing && (
        <Center py="xl">
          <Stack align="center" gap="sm">
            <Loader color="violet" size="sm" />
            <Text size="sm" c="dimmed">
              OCR processing in progress...
            </Text>
          </Stack>
        </Center>
      )}

      {doc.status === "failed" && (
        <Alert
          color="red"
          icon={<IconAlertCircle size={16} />}
          variant="light"
        >
          OCR extraction failed. Please re-upload the file.
        </Alert>
      )}

      {doc.status === "completed" && (
        <Stack gap="sm">
          <Tabs defaultValue="preview">
            <Tabs.List>
              <Tabs.Tab value="preview" leftSection={<IconEye size={14} />}>
                Preview
              </Tabs.Tab>
              <Tabs.Tab value="edit" leftSection={<IconEdit size={14} />}>
                Edit
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="preview" pt="sm">
              <Paper
                withBorder
                p="sm"
                radius="md"
                style={{ maxHeight: 300, overflowY: "auto", whiteSpace: "pre-wrap" }}
              >
                <Text size="sm" style={{ lineHeight: 1.7 }}>
                  {localText || "No text extracted"}
                </Text>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="edit" pt="sm">
              <Stack gap="sm">
                <Textarea
                  value={localText}
                  onChange={(e) => setLocalText(e.currentTarget.value)}
                  minRows={8}
                  maxRows={16}
                  autosize
                  placeholder="Edit extracted text here..."
                  styles={{
                    input: { fontFamily: "monospace", fontSize: 13 },
                  }}
                />
                <Group justify="flex-end">
                  <Button
                    size="xs"
                    color="violet"
                    loading={updateMutation.isPending}
                    onClick={handleSave}
                    leftSection={<IconCheck size={14} />}
                  >
                    Save Changes
                  </Button>
                </Group>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      )}
    </Card>
  );
}

export default function OCRPreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") || "";
  const docIds = idsParam.split(",").filter(Boolean);

  // Real institute data from Redux — NOT a hardcoded placeholder.
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails
  );
  const instituteId = institute?._id;

  const [ocrTexts, setOcrTexts] = useState<Record<string, string>>({});

  const handleTextChange = (id: string, text: string) => {
    setOcrTexts((prev) => ({ ...prev, [id]: text }));
  };

  const handleProceed = () => {
    const params = new URLSearchParams({
      ids: docIds.join(","),
    });
    router.push(`/ai-question-paper/generate?${params}`);
  };

  if (!docIds.length) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          No OCR documents found. Please upload files first.
        </Alert>
        <Button
          mt="md"
          color="violet"
          onClick={() => router.push("/ai-question-paper/upload")}
        >
          Go to Upload
        </Button>
      </Container>
    );
  }

  // Institute not loaded yet (e.g. SessionRestore still running) —
  // show a loader instead of firing requests with an undefined instituteId.
  if (!instituteId) {
    return (
      <Container size="lg" py="xl">
        <Center py="xl">
          <Stack align="center" gap="sm">
            <Loader color="violet" size="md" />
            <Text size="sm" c="dimmed">
              Loading institute data...
            </Text>
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
              <IconEye size={20} />
            </ThemeIcon>
            <Title order={2} fw={700}>
              OCR Text Preview
            </Title>
          </Group>
          <Text c="dimmed" size="sm">
            Review and edit the text extracted from your uploaded files. You
            can correct any OCR errors before generating the question paper.
          </Text>
        </Stack>

        {/* OCR Cards */}
        <Stack gap="md">
          {docIds.map((id, i) => (
            <OCRPreviewCard
              key={id}
              docId={id}
              index={i}
              instituteId={instituteId}
              onTextChange={handleTextChange}
            />
          ))}
        </Stack>

        {/* Actions */}
        <Group justify="space-between">
          <Button
            variant="default"
            onClick={() => router.push("/ai-question-paper/upload")}
            leftSection={<IconRefresh size={16} />}
          >
            Upload More Files
          </Button>

          <Button
            color="violet"
            rightSection={<IconArrowRight size={16} />}
            onClick={handleProceed}
          >
            Proceed to Generate Paper
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}