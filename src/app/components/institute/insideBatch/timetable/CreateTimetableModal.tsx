"use client";

import {
  Modal,
  TextInput,
  Select,
  Button,
  Group,
  Stack,
  Title,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";

import { Batch, DAYS_OF_WEEK, Subject, Teacher } from "./timetable.types";
import { CreateTimetable, CreateTimetablePayload } from "@/axios/timetable/timetable.api";
import { SuccessNotification } from "@/app/helperFunction/Notification";

interface Props {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
  batches: Batch[];
  subjects: Subject[];
  teachers: Teacher[];
}

export function CreateTimetableModal({
  opened,
  onClose,
  onSuccess,
  batches,
  subjects,
  teachers,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateTimetablePayload>({
    initialValues: {
      batchId: "",
      subjectId: "",
      teacherId: "",
      dayOfWeek: "Monday",
      startTime: "",
      endTime: "",
      room: "",
    },
    validate: {
      batchId: (v) => (!v ? "Batch is required" : null),
      subjectId: (v) => (!v ? "Subject is required" : null),
      teacherId: (v) => (!v ? "Teacher is required" : null),
      dayOfWeek: (v) => (!v ? "Day is required" : null),
      startTime: (v) => (!v ? "Start time is required" : null),
      endTime: (v, values) => {
        if (!v) return "End time is required";
        if (v <= values.startTime) return "End time must be after start time";
        return null;
      },
    },
  });

const handleSubmit = (values: CreateTimetablePayload) => {
  setLoading(true);
  setError(null);

  CreateTimetable(values)
    .then((res: any) => {
      console.log("CREATE TIMETABLE RESPONSE 👉", res);
      SuccessNotification("Time Table Created")

      form.reset();
      onSuccess();
      onClose();
    })
    .catch((err: any) => {
      console.log("CREATE TIMETABLE ERROR ❌", err);

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
    <Modal opened={opened} onClose={onClose} size="md" title={<Title order={4}>Add Timetable Slot</Title>}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {error}
            </Alert>
          )}

          <Select
            label="Batch"
            placeholder="Select batch"
            data={batches.map((b) => ({ value: b._id, label: b.name }))}
            {...form.getInputProps("batchId")}
            required
          />

          <Select
            label="Subject"
            placeholder="Select subject"
            data={subjects.map((s) => ({ value: s._id, label: s.name }))}
            {...form.getInputProps("subjectId")}
            required
          />

          <Select
            label="Teacher"
            placeholder="Select teacher"
            data={teachers.map((t) => ({ value: t._id, label: t.name }))}
            {...form.getInputProps("teacherId")}
            required
          />

          <Select
            label="Day of Week"
            data={DAYS_OF_WEEK}
            {...form.getInputProps("dayOfWeek")}
            required
          />

          <Group grow>
            <TextInput
              label="Start Time"
              type="time"
              {...form.getInputProps("startTime")}
              required
            />
            <TextInput
              label="End Time"
              type="time"
              {...form.getInputProps("endTime")}
              required
            />
          </Group>

          <TextInput
            label="Room (optional)"
            placeholder="e.g. Room 201"
            {...form.getInputProps("room")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Slot
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
