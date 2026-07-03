"use client";

import {
  Table,
  Badge,
  Text,
  Group,
  Select,
  Button,
  Stack,
  Box,
  ActionIcon,
  Tooltip,
  TextInput,
  Paper,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconSearch, IconTrash, IconFilter } from "@tabler/icons-react";
import { useState, useEffect } from "react";


import { ClassManagement } from "./timetable.types";
import { CancelClassManagement, GetAllClassManagement } from "@/axios/timetable/classManagement.api";

interface Props {
  batchId?: string;
}

const STATUS_COLORS: Record<string, string> = {
  "Managed Successfully": "green",
  Pending: "yellow",
  Cancelled: "red",
};

export function ClassManagementHistory({ batchId }: Props) {
  const [records, setRecords] = useState<ClassManagement[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

 const fetchRecords = () => {
  setLoading(true);

  const filters: any = {};

  if (batchId) filters.batchId = batchId;

  if (dateRange[0]) {
    filters.startDate = dateRange[0].toISOString().slice(0, 10);
  }

  if (dateRange[1]) {
    filters.endDate = dateRange[1].toISOString().slice(0, 10);
  }

  GetAllClassManagement(filters)
    .then((res: any) => {
      console.log("GET MANAGEMENT RESPONSE 👉", res);

      const data = res?.data || [];

      const filteredData = statusFilter
        ? data.filter((item: any) => item.status === statusFilter)
        : data;

      setRecords(filteredData);
    })
    .catch((err: any) => {
      console.log("GET MANAGEMENT ERROR ❌", err);
    })
    .finally(() => {
      setLoading(false);
    });
};

 useEffect(() => {
  fetchRecords();
}, [batchId]);

//Agar status/date change pe bhi auto load chahiye:
// useEffect(() => {
//   fetchRecords();
// }, [batchId, statusFilter, dateRange]);

const handleCancel = (id: string) => {
  if (!confirm("Cancel this management record?")) return;

  CancelClassManagement(id)
    .then((res: any) => {
      console.log("CANCEL MANAGEMENT RESPONSE 👉", res);
      fetchRecords();
    })
    .catch((err: any) => {
      console.log("CANCEL MANAGEMENT ERROR ❌", err);
    });
};
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Stack gap="md">
      {/* Filters */}
      <Paper p="sm" withBorder radius="md">
        <Group gap="sm" wrap="wrap">
          <DatePickerInput
            type="range"
            placeholder="Filter by date range"
            value={dateRange}
            onChange={setDateRange}
            size="sm"
            clearable
            style={{ minWidth: 240 }}
          />
          <Select
            placeholder="Filter by status"
            data={["Managed Successfully", "Pending", "Cancelled"]}
            value={statusFilter}
            onChange={setStatusFilter}
            size="sm"
            clearable
            style={{ minWidth: 180 }}
          />
          <Button
            leftSection={<IconFilter size={14} />}
            size="sm"
            variant="light"
            onClick={fetchRecords}
            loading={loading}
          >
            Apply
          </Button>
        </Group>
      </Paper>

      <Box style={{ overflowX: "auto" }}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Subject</Table.Th>
              <Table.Th>Original Teacher</Table.Th>
              <Table.Th>Substitute</Table.Th>
              <Table.Th>Reason</Table.Th>
              <Table.Th>Managed At</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {records.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text ta="center" c="dimmed" py="md">
                    No management records found.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
            {records.map((r) => (
              <Table.Tr key={r._id}>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {formatDate(r.managementDate)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{r.subjectName ?? r.subjectId}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{r.originalTeacherName ?? r.originalTeacherId}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500} c="blue">
                    {r.substituteTeacherName ?? r.substituteTeacherId}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" size="sm">
                    {r.reason}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" c="dimmed">
                    {r.createdAt ? formatTime(r.createdAt) : "—"}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={STATUS_COLORS[r.status] ?? "gray"}
                    variant="filled"
                    size="sm"
                  >
                    {r.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {r.status !== "Cancelled" && (
                    <Tooltip label="Cancel management">
                      <ActionIcon
                        size="sm"
                        color="red"
                        variant="subtle"
                        onClick={() => handleCancel(r._id)}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Stack>
  );
}
