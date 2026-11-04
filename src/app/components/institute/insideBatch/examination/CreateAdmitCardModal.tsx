"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  Button,
  Stack,
  Text,
  Flex,
  MultiSelect,
  Divider,
  Paper,
  Checkbox,
  Group,
  Loader,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCheck, IconCalendarEvent } from "@tabler/icons-react";
import { GetAllSubjectsFromBatch } from "@/axios/batch/BatchGetApi";

import { SuccessNotification, ErrorNotification } from "@/app/helperFunction/Notification";
import { CreateAdmitCardBulk } from "@/axios/institute/ExaminatonApi";

interface Props {
  opened: boolean;
  onClose: () => void;
  batchId: string;
  batchStudents: {
    _id: string;
    name: string;
    rollNumber: string | number;
  }[];
  onSuccess: () => void;
}

interface SubjectScheduleState {
  subjectId: string;
  subjectName: string;
  subjectType: string;
  subjectCode: string;
  examDate: Date | null;
  examTime: string;
}

export default function CreateAdmitCardModal({
  opened,
  onClose,
  batchId,
  batchStudents,
  onSuccess,
}: Props) {
  const [examName, setExamName] = useState("");
  const [session, setSession] = useState("2026-2027");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<SubjectScheduleState[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch batch subjects when opened
  useEffect(() => {
    if (!opened || !batchId) return;

    setIsLoadingSubjects(true);
    GetAllSubjectsFromBatch(batchId)
      .then((res: any) => {
        const list = res?.subjects?.subjects || res?.subjects || [];
        const formatted: SubjectScheduleState[] = list.map((sub: any) => ({
          subjectId: sub._id,
          subjectName: sub.name,
          subjectType: sub.type || "Scholastic",
          subjectCode: sub.code || "",
          examDate: null,
          examTime: "09:30 AM - 12:30 PM",
        }));
        setSchedules(formatted);
      })
      .catch((err) => {
        console.error(err);
        ErrorNotification("Failed to load batch subjects");
      })
      .finally(() => {
        setIsLoadingSubjects(false);
      });
  }, [opened, batchId]);

  // Select all students toggle
  const handleSelectAllStudents = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(batchStudents.map((s) => s._id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleUpdateSchedule = (
    index: number,
    field: "subjectCode" | "examDate" | "examTime",
    value: any
  ) => {
    setSchedules((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async () => {
    if (!examName.trim()) {
      ErrorNotification("Please enter an Examination Name");
      return;
    }
    if (!session.trim()) {
      ErrorNotification("Please enter a Session");
      return;
    }
    if (selectedStudents.length === 0) {
      ErrorNotification("Please select at least one student");
      return;
    }

    // Validate that at least one subject has a date
    const hasAnyDate = schedules.some((s) => s.examDate !== null);
    if (!hasAnyDate) {
      ErrorNotification("Please specify examination date for the subjects");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        batchId,
        examName: examName.trim(),
        session: session.trim(),
        studentIds: selectedStudents,
        schedules: schedules.map((s) => ({
          subjectId: s.subjectId,
          subjectName: s.subjectName,
          subjectType: s.subjectType,
          subjectCode: s.subjectCode.trim(),
          examDate: s.examDate ? s.examDate.toISOString() : null,
          examTime: s.examTime.trim(),
        })),
      };

      await CreateAdmitCardBulk(payload);

      SuccessNotification("Admit Cards successfully generated!");
      onSuccess();
      onClose();
      // Reset form
      setExamName("");
      setSelectedStudents([]);
    } catch (err: any) {
      console.error(err);
      ErrorNotification(err?.response?.data?.message || "Failed to create admit cards");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCoScholastic = (type?: string) =>
    type?.toLowerCase().replace(/[^a-z]/g, "").startsWith("coschol") ?? false;

  const scholasticList = schedules.filter((s) => !isCoScholastic(s.subjectType));
  const coScholasticList = schedules.filter((s) => isCoScholastic(s.subjectType));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconCalendarEvent size={20} color="#2F6FED" />
          <Text fw={700} fz={18} c="#1B2559">
            Generate Admit Card / Date Sheet
          </Text>
        </Group>
      }
      centered
      size="xl"
      radius="16px"
    >
      <Stack gap="md">
        {/* Top Controls: Exam Name, Session & Multi-Students */}
        <Flex gap={16} wrap="wrap">
          <TextInput
            label="Examination Name"
            placeholder="e.g. Mid TERM, Annual TERM"
            value={examName}
            onChange={(e) => setExamName(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 200 }}
            required
          />
          <TextInput
            label="Session"
            placeholder="2026-2027"
            value={session}
            onChange={(e) => setSession(e.currentTarget.value)}
            style={{ width: 140 }}
            required
          />
        </Flex>

        {/* Student MultiSelect */}
        <Paper p="sm" withBorder radius="md" bg="#FAFCFF">
          <Group justify="space-between" mb={6}>
            <Text fw={600} fz={13} c="#33415C">
              Select Students ({selectedStudents.length} / {batchStudents.length} selected)
            </Text>
            <Checkbox
              label="Select All Students"
              size="xs"
              checked={
                batchStudents.length > 0 &&
                selectedStudents.length === batchStudents.length
              }
              indeterminate={
                selectedStudents.length > 0 &&
                selectedStudents.length < batchStudents.length
              }
              onChange={(e) => handleSelectAllStudents(e.currentTarget.checked)}
            />
          </Group>

          <MultiSelect
            placeholder="Search & choose students..."
            data={batchStudents.map((st) => ({
              label: `${st.name} (Roll: ${st.rollNumber || "-"})`,
              value: st._id,
            }))}
            value={selectedStudents}
            onChange={setSelectedStudents}
            searchable
            clearable
          />
        </Paper>

        <Divider label="Subject Schedule & Timetable" labelPosition="center" />

        {isLoadingSubjects ? (
          <Flex justify="center" py="xl">
            <Loader size="md" color="blue" />
          </Flex>
        ) : schedules.length === 0 ? (
          <Text c="dimmed" ta="center" py="md">
            No subjects configured in this batch.
          </Text>
        ) : (
          <Stack gap="md" style={{ maxHeight: "380px", overflowY: "auto", paddingRight: 4 }}>
            {/* SCHOLASTIC SUBJECTS */}
            {scholasticList.length > 0 && (
              <>
                <Text fw={700} size="sm" c="#2F6FED">
                  Scholastic Subjects
                </Text>
                {schedules.map((item, index) => {
                  if (isCoScholastic(item.subjectType)) return null;
                  return (
                    <Flex
                      key={item.subjectId}
                      gap={10}
                      align="center"
                      p="xs"
                      style={{
                        borderRadius: "8px",
                        background: "#F8FAFC",
                        border: "1px solid #EEF2F6",
                      }}
                    >
                      <Text fw={600} fz={13} style={{ width: "32%" }} lineClamp={1}>
                        {item.subjectName}
                      </Text>

                      <TextInput
                        placeholder="Code (e.g. 041)"
                        value={item.subjectCode}
                        onChange={(e) =>
                          handleUpdateSchedule(index, "subjectCode", e.currentTarget.value)
                        }
                        style={{ width: "20%" }}
                        size="xs"
                      />

                      <DateInput
                        placeholder="Exam Date"
                        value={item.examDate}
                        onChange={(val) => handleUpdateSchedule(index, "examDate", val)}
                        style={{ width: "24%" }}
                        size="xs"
                        clearable
                      />

                      <TextInput
                        placeholder="Time (e.g. 10:00 AM)"
                        value={item.examTime}
                        onChange={(e) =>
                          handleUpdateSchedule(index, "examTime", e.currentTarget.value)
                        }
                        style={{ width: "24%" }}
                        size="xs"
                      />
                    </Flex>
                  );
                })}
              </>
            )}

            {/* CO-SCHOLASTIC SUBJECTS */}
            {coScholasticList.length > 0 && (
              <>
                <Text fw={700} size="sm" c="orange" mt="xs">
                  Co-Scholastic Subjects
                </Text>
                {schedules.map((item, index) => {
                  if (!isCoScholastic(item.subjectType)) return null;
                  return (
                    <Flex
                      key={item.subjectId}
                      gap={10}
                      align="center"
                      p="xs"
                      style={{
                        borderRadius: "8px",
                        background: "#FFFBF2",
                        border: "1px solid #FFE8CC",
                      }}
                    >
                      <Text fw={600} fz={13} style={{ width: "32%" }} lineClamp={1}>
                        {item.subjectName}
                      </Text>

                      <TextInput
                        placeholder="Code"
                        value={item.subjectCode}
                        onChange={(e) =>
                          handleUpdateSchedule(index, "subjectCode", e.currentTarget.value)
                        }
                        style={{ width: "20%" }}
                        size="xs"
                      />

                      <DateInput
                        placeholder="Exam Date"
                        value={item.examDate}
                        onChange={(val) => handleUpdateSchedule(index, "examDate", val)}
                        style={{ width: "24%" }}
                        size="xs"
                        clearable
                      />

                      <TextInput
                        placeholder="Time"
                        value={item.examTime}
                        onChange={(e) =>
                          handleUpdateSchedule(index, "examTime", e.currentTarget.value)
                        }
                        style={{ width: "24%" }}
                        size="xs"
                      />
                    </Flex>
                  );
                })}
              </>
            )}
          </Stack>
        )}

        {/* Action Button */}
        <Button
          fullWidth
          size="md"
          radius="10px"
          loading={isSubmitting}
          onClick={handleSubmit}
          leftSection={<IconCheck size={18} />}
          style={{
            background: "linear-gradient(135deg, #4F7CFB 0%, #2F6FED 100%)",
            marginTop: 10,
          }}
        >
          Create Admit Cards
        </Button>
      </Stack>
    </Modal>
  );
}