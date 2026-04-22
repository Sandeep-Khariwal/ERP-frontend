"use client";

import {
  Table,
  Avatar,
  Text,
  Group,
  ActionIcon,
  Skeleton,
  Paper,
  Center,
  Stack,
  Pagination,
  Select,
  Box,
  Tooltip,
} from "@mantine/core";
import {
  IconEye,
  IconPhone,
  IconChevronRight,
  IconInbox,
} from "@tabler/icons-react";
import { ScoreBadge, StatusBadge, SourceBadge } from "./LeadBadges";
// import { getInitials, timeAgo } from "../utility/utils";
import { Lead, PaginationType } from "@/types";
import { getInitials, timeAgo } from "../utility/utils";

interface Props {
  leads: Lead[];
  pagination: PaginationType;
  loading: boolean;
  page: number;
  limit: number;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
  onView: (lead: Lead) => void;
}

export function LeadTable({
  leads,
  pagination,
  loading,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onView,
}: Props) {
  if (loading) {
    return (
      <Stack gap="xs">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} height={52} radius="sm" />
        ))}
      </Stack>
    );
  }

  console.log("actual leads : ",leads);
  

  if (!loading && leads.length === 0) {
    return (
      <Center py={80}>
        <Stack align="center" gap="sm">
          <IconInbox
            size={48}
            color="var(--mantine-color-dimmed)"
            strokeWidth={1}
          />
          <Text c="dimmed" fw={500}>
            No leads found
          </Text>
          <Text size="sm" c="dimmed">
            Try adjusting your filters
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
        <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
          <Table.Thead style={{ background: "var(--mantine-color-gray-0)" }}>
            <Table.Tr>
              <Table.Th>Lead</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Course Interest</Table.Th>
              <Table.Th>Source</Table.Th>
              <Table.Th>Score</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Added</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {leads.map((lead) => (
              <Table.Tr
                key={lead._id}
                style={{ cursor: "pointer" }}
                onClick={() => onView(lead)}
              >
                {/* Lead identity */}
                <Table.Td>
                  <Group gap="sm" wrap="nowrap">
                    <Avatar size={34} radius="xl" color="blue">
                      {getInitials(lead.name)}
                    </Avatar>
                    <Box>
                      <Text size="sm" fw={600} lh={1.3}>
                        {lead.name || "—"}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {lead.email || ""}
                      </Text>
                    </Box>
                  </Group>
                </Table.Td>

                {/* Phone */}
                <Table.Td>
                  <Group gap={4} wrap="nowrap">
                    <IconPhone size={13} color="var(--mantine-color-dimmed)" />
                    <Text size="sm" ff="monospace">
                      {lead.phone}
                    </Text>
                  </Group>
                </Table.Td>

                {/* Course */}
                <Table.Td>
                  <Text size="sm" truncate maw={160}>
                    {lead.courseInterest || "—"}
                  </Text>
                </Table.Td>

                {/* Source */}
                <Table.Td>
                  <SourceBadge source={lead.source} />
                </Table.Td>

                {/* Score */}
                <Table.Td>
                  <ScoreBadge score={lead.leadScore} />
                </Table.Td>

                {/* Status */}
                <Table.Td>
                  <StatusBadge status={lead.status} />
                </Table.Td>

                {/* Time */}
                <Table.Td>
                  <Tooltip label={lead.createdAt} position="left">
                    <Text size="xs" c="dimmed">
                      {timeAgo(lead.createdAt)}
                    </Text>
                  </Tooltip>
                </Table.Td>

                {/* Action */}
                <Table.Td>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(lead);
                    }}
                  >
                    <IconChevronRight size={15} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Group justify="space-between" align="center">
          <Group gap="xs" align="center">
            <Text size="sm" c="dimmed">
              Rows per page
            </Text>
            <Select
              size="xs"
              w={70}
              value={String(limit)}
              onChange={(v) => onLimitChange(Number(v))}
              data={["10", "20", "50", "100"]}
            />
            <Text size="sm" c="dimmed">
              {(page - 1) * limit + 1}–
              {Math.min(page * limit, pagination.total)} of {pagination.total}
            </Text>
          </Group>
          <Pagination
            total={pagination.totalPages}
            value={page}
            onChange={onPageChange}
            size="sm"
            radius="md"
          />
        </Group>
      )}
    </Stack>
  );
}
