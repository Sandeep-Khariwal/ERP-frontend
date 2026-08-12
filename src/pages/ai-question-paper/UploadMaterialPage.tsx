"use client";

import { useState, useCallback } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  Badge,
  Progress,
  ActionIcon,
  rem,
  Alert,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import {
  IconUpload,
  IconFile,
  IconX,
  IconCheck,
  IconAlertCircle,
  IconFileTypePdf,
  IconPhoto,
  IconTrash,
} from "@tabler/icons-react";
import { useAppSelector } from "@/app/redux/redux.hooks";
import { useUploadMaterial } from "../../hooks/useAIQuestionPaper";
import { useRouter } from "next/navigation";

interface UploadedFile {
  file: File;
  id: string;
  status: "pending" | "uploading" | "done" | "error";
  ocrDocId?: string;
  errorMsg?: string;
}

export default function UploadMaterialPage() {
  const router = useRouter();
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails
  );
  const teacher = useAppSelector(
    (state: any) => state.teacherSlice.teacherDetails
  );
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const uploadMutation = useUploadMaterial();

  const onDrop = useCallback((dropped: FileWithPath[]) => {
    const newFiles: UploadedFile[] = dropped.map((f) => ({
      file: f,
      id: `${Date.now()}-${Math.random()}`,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = async () => {
    if (!files.length) {
      notifications.show({
        title: "No files",
        message: "Please add at least one file",
        color: "orange",
      });
      return;
    }

    const pending = files.filter((f) => f.status === "pending");
    if (!pending.length) return;

    // Debug: log what we actually have in redux before doing anything else.
    console.log("Institute:", institute);
    console.log("Teacher:", teacher);

    if (!institute?._id || !teacher?._id) {
      console.log("UPLOAD BLOCKED: missing institute or teacher id", {
        instituteId: institute?._id,
        teacherId: teacher?._id,
      });
      notifications.show({
        title: "Missing Data",
        message: "Institute or Teacher not found.",
        color: "red",
      });
      return;
    }

    setFiles((prev) =>
      prev.map((f) =>
        f.status === "pending" ? { ...f, status: "uploading" } : f
      )
    );

    try {
      // NOTE: ApiHelper.post() already returns response.data directly
      // (not the full axios response), so there is no `.status` on `result`.
      // `result` here IS the backend body, e.g. { data: [...] }
      const result: any = await uploadMutation.mutateAsync({
        files: pending.map((f) => f.file),
        instituteId: institute._id,
        teacherId: teacher._id,
      });

      console.log("Upload result:", result);

      const data: any[] = result?.data || [];

      setFiles((prev) =>
        prev.map((f) => {
          const match = data.find((d: any) => d.fileName === f.file.name);
          if (!match) {
            // No matching entry from backend for this file — mark as error
            // instead of leaving it stuck on "uploading" forever.
            if (f.status === "uploading") {
              return { ...f, status: "error", errorMsg: "No response for this file" };
            }
            return f;
          }
          return {
            ...f,
            status: match.status === 200 ? "done" : "error",
            ocrDocId: match.ocrDocument?._id,
            errorMsg: match.message,
          };
        })
      );

      const successIds = data
        .filter((d: any) => d.status === 200 && d.ocrDocument?._id)
        .map((d: any) => d.ocrDocument._id);

      if (successIds.length > 0) {
        notifications.show({
          title: "Upload Successful",
          message: `${successIds.length} file(s) uploaded. OCR processing started.`,
          color: "green",
          icon: <IconCheck size={16} />,
        });

        setTimeout(() => {
          router.push(
            `/ai-question-paper/ocr-preview?ids=${successIds.join(",")}`
          );
        }, 1500);
      } else {
        console.log("UPLOAD ERROR: no successful files in response", data);
        notifications.show({
          title: "Upload Failed",
          message: "None of the files were processed successfully.",
          color: "red",
          icon: <IconX size={16} />,
        });
      }
    } catch (error: any) {
      // Network error, server down, timeout, etc. land here.
      // Without this catch, the promise rejection from mutateAsync
      // would go uncaught and crash the flow silently.
      console.log("UPLOAD PAGE ERROR :", error?.response || error);

      setFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading"
            ? {
                ...f,
                status: "error",
                errorMsg:
                  error?.code === "ERR_NETWORK"
                    ? "Network error — check your internet connection"
                    : error?.response?.data?.message || "Upload failed",
              }
            : f
        )
      );

      notifications.show({
        title: "Upload Failed",
        message:
          error?.code === "ERR_NETWORK"
            ? "Network error — please check your internet connection and try again."
            : error?.response?.data?.message || "Something went wrong while uploading.",
        color: "red",
        icon: <IconX size={16} />,
      });
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Stack gap={4}>
          <Group gap="xs">
            <ThemeIcon color="violet" variant="light" size="lg" radius="md">
              <IconUpload size={20} />
            </ThemeIcon>
            <Title order={2} fw={700}>
              Upload Study Material
            </Title>
          </Group>
          <Text c="dimmed" size="sm">
            Upload book pages, notes, PDFs or question banks. We'll extract
            text automatically using OCR.
          </Text>
        </Stack>

        {/* Dropzone */}
        <Dropzone
          onDrop={onDrop}
          maxSize={20 * 1024 * 1024}
          accept={[
            MIME_TYPES.jpeg,
            MIME_TYPES.png,
            MIME_TYPES.webp,
            MIME_TYPES.pdf,
            "image/jpg",
          ]}
          multiple
          styles={{
            root: {
              borderColor: "#9262FF",
              borderWidth: 2,
              borderStyle: "dashed",
              backgroundColor: "rgba(146, 98, 255, 0.03)",
              borderRadius: 12,
            },
          }}
        >
          <Group
            justify="center"
            gap="xl"
            mih={160}
            style={{ pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload
                size={52}
                stroke={1.5}
                color="var(--mantine-color-violet-6)"
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={52} stroke={1.5} color="var(--mantine-color-red-6)" />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconUpload size={52} stroke={1.5} color="#9262FF" />
            </Dropzone.Idle>

            <Stack align="center" gap={4}>
              <Text size="xl" fw={600}>
                Drag files here or click to browse
              </Text>
              <Text size="sm" c="dimmed">
                Supported: JPG, PNG, WEBP, PDF — Max 20 MB per file
              </Text>
            </Stack>
          </Group>
        </Dropzone>

        {/* File List */}
        {files.length > 0 && (
          <Stack gap="sm">
            <Text fw={600} size="sm">
              Files ({files.length})
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {files.map((f) => (
                <Card
                  key={f.id}
                  withBorder
                  radius="md"
                  p="sm"
                  style={{
                    borderColor:
                      f.status === "done"
                        ? "var(--mantine-color-green-4)"
                        : f.status === "error"
                        ? "var(--mantine-color-red-4)"
                        : "var(--mantine-color-gray-3)",
                  }}
                >
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
                      <ThemeIcon
                        color={isImage(f.file.type) ? "blue" : "red"}
                        variant="light"
                        radius="md"
                      >
                        {isImage(f.file.type) ? (
                          <IconPhoto size={16} />
                        ) : (
                          <IconFileTypePdf size={16} />
                        )}
                      </ThemeIcon>
                      <Stack gap={2} style={{ minWidth: 0 }}>
                        <Text size="sm" fw={500} truncate>
                          {f.file.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {formatSize(f.file.size)}
                        </Text>
                      </Stack>
                    </Group>

                    <Group gap="xs">
                      {f.status === "pending" && (
                        <Badge color="gray" variant="light" size="sm">
                          Pending
                        </Badge>
                      )}
                      {f.status === "uploading" && (
                        <Badge color="violet" variant="light" size="sm">
                          Uploading...
                        </Badge>
                      )}
                      {f.status === "done" && (
                        <Badge color="green" variant="light" size="sm">
                          Done
                        </Badge>
                      )}
                      {f.status === "error" && (
                        <Badge color="red" variant="light" size="sm">
                          Failed
                        </Badge>
                      )}

                      {f.status === "pending" && (
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          size="sm"
                          onClick={() => removeFile(f.id)}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      )}
                    </Group>
                  </Group>

                  {f.status === "uploading" && (
                    <Progress
                      value={60}
                      color="violet"
                      size="xs"
                      mt="xs"
                      animated
                    />
                  )}

                  {f.status === "error" && f.errorMsg && (
                    <Text size="xs" c="red" mt={4}>
                      {f.errorMsg}
                    </Text>
                  )}
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        )}

        {/* Alert */}
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="violet"
          variant="light"
          radius="md"
        >
          After upload, our system will automatically extract text using Google
          Vision OCR. You can review and edit the extracted text before
          generating a question paper.
        </Alert>

        {/* Actions */}
        <Group justify="flex-end">
          <Button
            variant="default"
            onClick={() => router.push("/ai-question-paper")}
          >
            Cancel
          </Button>
          <Button
            color="violet"
            leftSection={<IconUpload size={16} />}
            onClick={handleUpload}
            loading={uploadMutation.isPending}
            disabled={
              !files.filter((f) => f.status === "pending").length
            }
          >
            Upload & Extract Text
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}