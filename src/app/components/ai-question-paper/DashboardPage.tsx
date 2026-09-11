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
  Badge,
  TextInput,
  Select,
  SimpleGrid,
  ThemeIcon,
  ActionIcon,
  Skeleton,
  Pagination,
  Center,
  Menu,
  Divider,
  Paper,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconSparkles,
  IconEdit,
  IconDownload,
  IconSend,
  IconDotsVertical,
  IconFileText,
  IconArchive,
  IconFilter,
} from "@tabler/icons-react";
import { useQuestionPapers } from "../../../hooks/useAIQuestionPaper";
import { AIQuestionPaper, Question } from "../../../axios/aiQuestionPaper/aiQuestionPaper.api";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useAppSelector } from "@/app/redux/redux.hooks";

function PaperCard({ paper }: { paper: AIQuestionPaper }) {
  const router = useRouter();

  const statusColor: Record<string, string> = {
    draft: "orange",
    published: "green",
    archived: "gray",
  };

  return (
    <Card withBorder radius="md" p="md" style={{ cursor: "pointer" }}>
      <Stack gap="sm">
        <Group justify="space-between" wrap="nowrap">
          <Stack gap={2} style={{ minWidth: 0 }}>
            <Text fw={600} size="sm" truncate>
              {paper.title}
            </Text>
            <Text size="xs" c="dimmed">
              {paper.chapterName || "—"} •{" "}
              {dayjs(paper.createdAt).format("DD MMM YYYY")}
            </Text>
          </Stack>
          <Menu shadow="md" position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" size="sm">
                <IconDotsVertical size={14} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit size={14} />}
                onClick={() =>
                  router.push(`/ai-question-paper/editor/${paper._id}`)
                }
              >
                Edit
              </Menu.Item>
              {paper.pdfUrl && (
                <Menu.Item
                  leftSection={<IconDownload size={14} />}
                  component="a"
                  href={paper.pdfUrl}
                  target="_blank"
                >
                  Download PDF
                </Menu.Item>
              )}
              {paper.answerKeyPdfUrl && (
                <Menu.Item
                  leftSection={<IconFileText size={14} />}
                  component="a"
                  href={paper.answerKeyPdfUrl}
                  target="_blank"
                >
                  Download Answer Key
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Divider />

        <Group gap="xs">
          <Badge
            color={statusColor[paper.status] || "gray"}
            variant="light"
            size="xs"
          >
            {paper.status}
          </Badge>
          <Badge color="violet" variant="outline" size="xs">
            {paper.totalMarks} Marks
          </Badge>
          <Badge color="blue" variant="outline" size="xs">
            {paper.duration} min
          </Badge>
          {paper.difficulty && (
            <Badge color="gray" variant="outline" size="xs">
              {paper.difficulty}
            </Badge>
          )}
        </Group>

        <Group gap="xs" mt={4}>
          <Button
            size="xs"
            color="violet"
            variant="light"
            leftSection={<IconEdit size={12} />}
            onClick={() =>
              router.push(`/ai-question-paper/editor/${paper._id}`)
            }
          >
            Edit
          </Button>
          {paper.status !== "published" && (
            <Button
              size="xs"
              color="green"
              variant="light"
              leftSection={<IconSend size={12} />}
              onClick={() =>
                // NOTE: this button had no onClick before — it did nothing
                // when clicked. Publishing needs a confirmation step, which
                // already exists on the editor page, so route there instead
                // of silently publishing straight from the dashboard.
                router.push(`/ai-question-paper/editor/${paper._id}`)
              }
            >
              Publish
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
}

export default function AIQuestionPaperDashboard() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails
  );
  const teacher = useAppSelector(
    (state: any) => state.teacherSlice.teacherDetails
  );
// const instituteId = "";
// const teacherId = undefined;

  const instituteId = institute?._id;
  const teacherId = teacher?._id;

  const { data, isLoading }:any = useQuestionPapers({
    instituteId: instituteId || "",
    teacherId,
    page,
    limit: 12,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const papers: AIQuestionPaper[] = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  if (!instituteId) {
    return (
      <Container size="xl" py="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} height={180} radius="md" />
          ))}
        </SimpleGrid>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Group gap="xs">
              <ThemeIcon color="violet" variant="light" size="lg" radius="md">
                <IconSparkles size={20} />
              </ThemeIcon>
              <Title order={2} fw={700}>
                AI Question Papers
              </Title>
            </Group>
            <Text c="dimmed" size="sm">
              Generate, manage and publish AI-powered question papers
            </Text>
          </Stack>
          <Button
            color="violet"
            leftSection={<IconPlus size={16} />}
            onClick={() => router.push("/ai-question-paper/upload")}
          >
            New Question Paper
          </Button>
        </Group>

        {/* Stats */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          {[
            { label: "Total Papers", value: total, color: "violet" },
            {
              label: "Published",
              value: papers.filter((p) => p.status === "published").length,
              color: "green",
            },
            {
              label: "Drafts",
              value: papers.filter((p) => p.status === "draft").length,
              color: "orange",
            },
            {
              label: "This Month",
              value: papers.filter(
                (p) =>
                  dayjs(p.createdAt).month() === dayjs().month()
              ).length,
              color: "blue",
            },
          ].map((stat) => (
            <Paper
              key={stat.label}
              withBorder
              radius="md"
              p="md"
            >
              <Stack gap={4}>
                <Text size="xs" c="dimmed" fw={500}>
                  {stat.label}
                </Text>
                <Text fw={700} size="xl" c={stat.color}>
                  {stat.value}
                </Text>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>

        {/* Filters */}
        <Group gap="sm">
          <TextInput
            placeholder="Search papers..."
            leftSection={<IconSearch size={14} />}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              setPage(1);
            }}
            style={{ flex: 1, maxWidth: 360 }}
          />
          <Select
            placeholder="Filter by status"
            leftSection={<IconFilter size={14} />}
            clearable
            data={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ]}
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
            w={180}
          />
        </Group>

        {/* Grid */}
        {isLoading ? (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} height={180} radius="md" />
            ))}
          </SimpleGrid>
        ) : papers.length === 0 ? (
          <Card withBorder radius="md" p="xl">
            <Center py="xl">
              <Stack align="center" gap="md">
                <ThemeIcon color="violet" variant="light" size={60} radius="xl">
                  <IconSparkles size={30} />
                </ThemeIcon>
                <Stack align="center" gap={4}>
                  <Text fw={600}>No question papers yet</Text>
                  <Text c="dimmed" size="sm" ta="center">
                    Upload study material and generate your first AI question paper
                  </Text>
                </Stack>
                <Button
                  color="violet"
                  leftSection={<IconPlus size={16} />}
                  onClick={() => router.push("/ai-question-paper/upload")}
                >
                  Get Started
                </Button>
              </Stack>
            </Center>
          </Card>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {papers.map((paper) => (
              <PaperCard key={paper._id} paper={paper} />
            ))}
          </SimpleGrid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Center>
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
              color="violet"
              radius="md"
            />
          </Center>
        )}
      </Stack>
    </Container>
  );
}