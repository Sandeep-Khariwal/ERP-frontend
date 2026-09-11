"use client";

import {
  Box,
  Text,
  Badge,
  ActionIcon,
  Tooltip,
  Group,
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

const FALLBACK_PERIODS = [
  { startTime: "08:00", endTime: "08:45" },
  { startTime: "09:00", endTime: "09:45" },
  { startTime: "10:15", endTime: "11:00" },
  { startTime: "11:15", endTime: "12:00" },
  { startTime: "13:00", endTime: "13:45" },
];

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

  // Derive the distinct periods (start–end pairs) actually used in this
  // batch's schedule, sorted chronologically. Falls back to a sensible
  // default set of periods when nothing has been scheduled yet.
  const periodKey = (p: { startTime: string; endTime: string }) =>
    `${p.startTime}-${p.endTime}`;

  const periodMap = new Map<string, { startTime: string; endTime: string }>();
  timetables.forEach((t) => {
    periodMap.set(periodKey(t), {
      startTime: t.startTime,
      endTime: t.endTime,
    });
  });

  const periods =
    periodMap.size > 0
      ? Array.from(periodMap.values()).sort((a, b) =>
          a.startTime.localeCompare(b.startTime),
        )
      : FALLBACK_PERIODS;

  return (
    <Box style={{ overflowX: "auto" }}>
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: `100px repeat(${DAYS_OF_WEEK.length}, 1fr)`,
          minWidth: 900,
          border: "1px solid #EEF1F6",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Header row */}
        <Box
          p="sm"
          style={{
            background: "#F7F9FC",
            borderBottom: "1px solid #EEF1F6",
          }}
        >
          <Text fw={600} fz={13} c="#64748B">
            Time
          </Text>
        </Box>
        {DAYS_OF_WEEK.map((day) => (
          <Box
            key={day}
            p="sm"
            style={{
              background: "#F7F9FC",
              borderBottom: "1px solid #EEF1F6",
              borderLeft: "1px solid #EEF1F6",
            }}
          >
            <Text fw={600} fz={13} c="#1B2559">
              {day}
            </Text>
          </Box>
        ))}

        {/* Period rows */}
        {periods.map((period, pIdx) => (
          <>
            <Box
              key={`time-${periodKey(period)}`}
              p="sm"
              style={{
                borderBottom:
                  pIdx === periods.length - 1 ? "none" : "1px solid #EEF1F6",
              }}
            >
              <Text fz={13} fw={600} c="#1B2559">
                {period.startTime}
              </Text>
              <Text fz={12} c="#8B96AD">
                {period.endTime}
              </Text>
            </Box>
            {DAYS_OF_WEEK.map((day) => {
              const slots = byDay[day].filter(
                (t) =>
                  t.startTime === period.startTime &&
                  t.endTime === period.endTime,
              );
              const hasSlot = slots.length > 0;
              return (
                <Box
                  key={`cell-${day}-${periodKey(period)}`}
                  style={{
                    borderLeft: "1px solid #EEF1F6",
                    borderBottom:
                      pIdx === periods.length - 1
                        ? "none"
                        : "1px solid #EEF1F6",
                    minHeight: 72,
                    padding: 8,
                  }}
                >
                  {hasSlot ? (
                    slots.map((slot) => {
                      const isManaged = managedTimetableIds.has(slot._id);
                      return (
                        <Box
                          key={slot._id}
                          p={10}
                          mb={6}
                          style={{
                            borderRadius: "10px",
                            background: "#EAF1FF",
                            position: "relative",
                          }}
                        >
                          <Stack gap={2} pr={isAdmin ? 40 : 0}>
                            <Text fz={13} fw={700} c="#1B2559">
                              {slot.subjectName ?? slot.subjectId}
                            </Text>
                            <Text fz={12} c="#5B6B8C">
                              {slot.teacherName ?? slot.teacherId}
                              {slot.room ? ` • ${slot.room}` : ""}
                            </Text>
                            {isManaged && (
                              <Badge
                                color="orange"
                                size="xs"
                                variant="light"
                                radius="xl"
                                mt={2}
                                w="fit-content"
                              >
                                Overridden today
                              </Badge>
                            )}
                          </Stack>

                          {isAdmin && (
                            <Group
                              gap={2}
                              style={{
                                position: "absolute",
                                top: 6,
                                right: 6,
                              }}
                            >
                              {onManage && (
                                <Tooltip label="Manage class">
                                  <ActionIcon
                                    size="xs"
                                    variant="subtle"
                                    color="blue"
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
                        </Box>
                      );
                    })
                  ) : (
                    <Box
                      style={{
                        border: "1px dashed #E2E8F0",
                        borderRadius: "10px",
                        height: "100%",
                        minHeight: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text fz={12} c="#B4BECF">
                        Open slot
                      </Text>
                    </Box>
                  )}
                </Box>
              );
            })}
          </>
        ))}
      </Box>
    </Box>
  );
}
