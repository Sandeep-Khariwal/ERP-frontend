"use client";

import {
  Box,
  Text,
  Badge,
  ActionIcon,
  Tooltip,
  Group,
  Paper,
  Stack,
} from "@mantine/core";
import { IconEdit, IconTrash, IconCalendarEvent } from "@tabler/icons-react";
import { DayOfWeek, DAYS_OF_WEEK, Timetable } from "./timetable.types";


interface TimetableGridProps {
  timetables: Timetable[];
  managedTimetableIds?: Set<string>; // IDs that are managed on today
  onEdit?: (item: Timetable) => void;
  onDelete?: (item: Timetable) => void;
  onManage?: (item: Timetable) => void;
  isAdmin?: boolean;
}

const TIME_SLOTS = [
  "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
];

function getSlotColor(subjectName?: string): string {
  const colors = [
    "blue", "teal", "violet", "orange", "pink", "cyan", "green", "indigo",
  ];
  if (!subjectName) return "blue";
  const idx = subjectName.charCodeAt(0) % colors.length;
  return colors[idx];
}

export function TimetableGrid({
  timetables,
  managedTimetableIds = new Set(),
  onEdit,
  onDelete,
  onManage,
  isAdmin = true,
}: TimetableGridProps) {
  // Group timetables by day
  const byDay: Record<DayOfWeek, Timetable[]> = {} as any;
  DAYS_OF_WEEK.forEach((d) => (byDay[d] = []));
  timetables.forEach((t) => {
    if (byDay[t.dayOfWeek]) byDay[t.dayOfWeek].push(t);
  });

  return (
    <Box style={{ overflowX: "auto" }}>
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: `80px repeat(${DAYS_OF_WEEK.length}, 1fr)`,
          minWidth: 800,
        }}
      >
        {/* Header row */}
        <Box
          p="xs"
          style={{ borderBottom: "2px solid var(--mantine-color-gray-3)" }}
        />
        {DAYS_OF_WEEK.map((day) => (
          <Box
            key={day}
            p="xs"
            ta="center"
            style={{
              borderBottom: "2px solid var(--mantine-color-gray-3)",
              borderLeft: "1px solid var(--mantine-color-gray-2)",
            }}
          >
            <Text fw={600} size="sm">
              {day.slice(0, 3)}
            </Text>
          </Box>
        ))}

        {/* Time rows */}
        {TIME_SLOTS.map((time, tIdx) => (
          <>
            <Box
              key={`time-${time}`}
              p="xs"
              style={{
                borderBottom: "1px solid var(--mantine-color-gray-2)",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Text size="xs" c="dimmed">
                {time}
              </Text>
            </Box>
            {DAYS_OF_WEEK.map((day) => {
              const slots = byDay[day].filter(
                (t) =>
                  t.startTime >= time &&
                  t.startTime < (TIME_SLOTS[tIdx + 1] ?? "18:00")
              );
              return (
                <Box
                  key={`cell-${day}-${time}`}
                  style={{
                    borderBottom: "1px solid var(--mantine-color-gray-2)",
                    borderLeft: "1px solid var(--mantine-color-gray-2)",
                    minHeight: 64,
                    padding: 4,
                  }}
                >
                  {slots.map((slot) => {
                    const isManaged = managedTimetableIds.has(slot._id);
                    const color = getSlotColor(slot.subjectName);
                    return (
                      <Paper
                        key={slot._id}
                        p={6}
                        mb={4}
                        radius="sm"
                        style={{
                          backgroundColor: `var(--mantine-color-${color}-1)`,
                          borderLeft: `3px solid var(--mantine-color-${color}-6)`,
                          position: "relative",
                        }}
                      >
                        <Stack gap={2}>
                          <Text size="xs" fw={700} c={`${color}.8`}>
                            {slot.subjectName ?? slot.subjectId}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {slot.startTime} – {slot.endTime}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {slot.teacherName ?? slot.teacherId}
                          </Text>
                          {slot.room && (
                            <Text size="xs" c="dimmed">
                              📍 {slot.room}
                            </Text>
                          )}
                          {isManaged && (
                            <Badge color="yellow" size="xs" variant="filled" mt={2}>
                              Managed
                            </Badge>
                          )}
                        </Stack>

                        {isAdmin && (
                          <Group
                            gap={2}
                            style={{ position: "absolute", top: 4, right: 4 }}
                          >
                            {onManage && (
                              <Tooltip label="Manage class">
                                <ActionIcon
                                  size="xs"
                                  variant="subtle"
                                  color="yellow"
                                  onClick={() => onManage(slot)}
                                >
                                  <IconCalendarEvent size={12} />
                                </ActionIcon>
                              </Tooltip>
                            )}
                            {onEdit && (
                              <Tooltip label="Edit">
                                <ActionIcon
                                  size="xs"
                                  variant="subtle"
                                  onClick={() => onEdit(slot)}
                                >
                                  <IconEdit size={12} />
                                </ActionIcon>
                              </Tooltip>
                            )}
                            {onDelete && (
                              <Tooltip label="Delete">
                                <ActionIcon
                                  size="xs"
                                  variant="subtle"
                                  color="red"
                                  onClick={() => onDelete(slot)}
                                >
                                  <IconTrash size={12} />
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </Group>
                        )}
                      </Paper>
                    );
                  })}
                </Box>
              );
            })}
          </>
        ))}
      </Box>
    </Box>
  );
}
