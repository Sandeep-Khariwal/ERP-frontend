"use client";

import {
  Modal,
  Select,
  Textarea,
  Button,
  Group,
  Stack,
  Title,
  Alert,
  Text,
  Divider,
  Badge,
  SegmentedControl,
  Box,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconUserCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";


import { MANAGEMENT_REASONS, ManagementReason, Teacher, Timetable } from "./timetable.types";
import { BulkCreateClassManagement, CreateClassManagement, GetFreeTeachers } from "@/axios/timetable/classManagement.api";

interface Props {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
  timetable: Timetable | null;
  teachers: Teacher[];
  adminId: string;
}

type ManageMode = "single" | "range";

interface FormValues {
  substituteTeacherId: string;
  reason: ManagementReason;
  notes: string;
}

export function ManageClassModal({
  opened,
  onClose,
  onSuccess,
  timetable,
  teachers,
  adminId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ManageMode>("single");
  const [singleDate, setSingleDate] = useState<Date | null>(new Date());
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [freeTeacherIds, setFreeTeacherIds] = useState<string[]>([]);
  const [loadingFree, setLoadingFree] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      substituteTeacherId: "",
      reason: "Teacher Absent",
      notes: "",
    },
    validate: {
      substituteTeacherId: (v) => (!v ? "Substitute teacher is required" : null),
      reason: (v) => (!v ? "Reason is required" : null),
    },
  });

  // Load free teachers when timetable or date changes
useEffect(() => {
  if (!timetable || !singleDate) return;

  const allIds = teachers.map((t) => t._id);

  setLoadingFree(true);

  GetFreeTeachers({
    timetableId: timetable._id,
    date: singleDate.toISOString().slice(0, 10),
    allTeacherIds: allIds,
  })
    .then((res: any) => {
      console.log("FREE TEACHERS RESPONSE 👉", res);

      setFreeTeacherIds(res?.data || []);
    })
    .catch((err: any) => {
      console.log("FREE TEACHERS ERROR ❌", err);

      setFreeTeacherIds(allIds);
    })
    .finally(() => {
      setLoadingFree(false);
    });
}, [timetable, singleDate, teachers]);

  const availableTeachers = teachers.filter(
    (t) => freeTeacherIds.includes(t._id) && t._id !== timetable?.teacherId
  );

const handleSubmit = (values: FormValues) => {
  if (!timetable) return;

  setLoading(true);
  setError(null);

  if (mode === "single") {
    if (!singleDate) {
      setError("Please select a date.");
      setLoading(false);
      return;
    }

    CreateClassManagement({
      timetableId: timetable._id,
      substituteTeacherId: values.substituteTeacherId,
     managementDate: singleDate!.toISOString(),
      reason: values.reason,
      notes: values.notes,
      managedBy: adminId,
    })
      .then((res: any) => {
        console.log("CREATE MANAGEMENT RESPONSE 👉", res);

        form.reset();
        onSuccess();
        onClose();
      })
      .catch((err: any) => {
        console.log("CREATE MANAGEMENT ERROR ❌", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Something went wrong"
        );
      })
      .finally(() => {
        setLoading(false);
      });

    return;
  }

  const [start, end] = dateRange;

  if (!start || !end) {
    setError("Please select a date range.");
    setLoading(false);
    return;
  }

  BulkCreateClassManagement({
    timetableId: timetable._id,
    substituteTeacherId: values.substituteTeacherId,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    reason: values.reason,
    notes: values.notes,
    managedBy: adminId,
  })
    .then((res: any) => {
      console.log("BULK MANAGEMENT RESPONSE 👉", res);

      form.reset();
      onSuccess();
      onClose();
    })
    .catch((err: any) => {
      console.log("BULK MANAGEMENT ERROR ❌", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong"
      );
    })
    .finally(() => {
      setLoading(false);
    });
};
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      title={<Title order={4}>Manage Class</Title>}
    >
      {timetable && (
        <Stack gap="xs" mb="md" p="sm" style={{ background: "var(--mantine-color-blue-0)", borderRadius: 8 }}>
          <Text size="sm" fw={600}>
            {timetable.subjectName ?? timetable.subjectId}
          </Text>
          <Group gap="xs">
            <Badge variant="outline" size="sm">{timetable.dayOfWeek}</Badge>
            <Badge variant="outline" size="sm">{timetable.startTime} – {timetable.endTime}</Badge>
            {timetable.room && <Badge variant="outline" size="sm">📍 {timetable.room}</Badge>}
          </Group>
          <Text size="xs" c="dimmed">
            Original Teacher: <strong>{timetable.teacherName ?? timetable.teacherId}</strong>
          </Text>
        </Stack>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {error}
            </Alert>
          )}

          <Box>
            <Text size="sm" fw={500} mb={6}>Management Period</Text>
            <SegmentedControl
              fullWidth
              value={mode}
              onChange={(v) => setMode(v as ManageMode)}
              data={[
                { label: "Single Day", value: "single" },
                { label: "Date Range", value: "range" },
              ]}
            />
          </Box>

          {mode === "single" ? (
            <DatePickerInput
              label="Date"
              placeholder="Pick date"
              value={singleDate}
              onChange={setSingleDate}
              required
            />
          ) : (
            <DatePickerInput
              type="range"
              label="Date Range"
              placeholder="Pick date range"
              value={dateRange}
              onChange={setDateRange}
              required
            />
          )}

          <Divider />

          <Select
            label={
              <Group gap={4}>
                <Text size="sm" fw={500}>Substitute Teacher</Text>
                {loadingFree && <Text size="xs" c="dimmed">(loading available...)</Text>}
                {!loadingFree && (
                  <Badge size="xs" color="green" variant="light" leftSection={<IconUserCheck size={10} />}>
                    {availableTeachers.length} available
                  </Badge>
                )}
              </Group>
            }
            placeholder="Select substitute teacher"
            data={availableTeachers.map((t) => ({ value: t._id, label: t.name }))}
            {...form.getInputProps("substituteTeacherId")}
            required
            disabled={loadingFree}
            description="Only showing teachers free in this time slot"
          />

          <Select
            label="Reason"
            data={MANAGEMENT_REASONS}
            {...form.getInputProps("reason")}
            required
          />

          <Textarea
            label="Notes (optional)"
            placeholder="Any additional notes..."
            rows={3}
            {...form.getInputProps("notes")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} color="yellow">
              Manage Class
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
