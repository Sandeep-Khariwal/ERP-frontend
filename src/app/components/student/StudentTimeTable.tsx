// "use client";

// import { Box, Paper, Stack, Text, Title } from "@mantine/core";

// interface StudentTimeTableProps {
//   studentId: string;
//   batchId: string;
// }

// export default function StudentTimeTable({
//   studentId,
//   batchId,
// }: StudentTimeTableProps) {
//   return (
//     <Paper
//       p={{ base: "md", sm: "xl" }}
//       radius="lg"
//       withBorder
//       shadow="xs"
//     >
//       <Stack gap="md">
//         <Box>
//           <Title order={3} c="#1B2559">
//             Time Table
//           </Title>
//           <Text size="sm" c="dimmed" mt={4}>
//             View your class schedule here.
//           </Text>
//         </Box>

//         {/* Timetable API/data can be added here later */}
//         <Box
//           p="xl"
//           style={{
//             border: "1px dashed #CBD5E1",
//             borderRadius: 12,
//             textAlign: "center",
//           }}
//         >
//           <Text fw={600} c="#334155">
//             Time Table
//           </Text>
//           <Text size="sm" c="dimmed" mt={6}>
//             Your class schedule will appear here.
//           </Text>
//         </Box>
//       </Stack>
//     </Paper>
//   );
// }

"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Paper,
  Stack,
  Text,
  Title,
  Group,
  Badge,
  ThemeIcon,
  LoadingOverlay,
  Flex,
  Progress,
  Tabs,
  Card,
  SimpleGrid,
  Button,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconDoor,
  IconCalendarTime,
  IconAlertCircle,
  IconCheck,
  IconSparkles,
  IconGridDots,
  IconList,
  IconUserCheck,
} from "@tabler/icons-react";

import { GetBatchGrid } from "@/axios/timetable/timetable.api";
import { GetAllClassManagement } from "@/axios/timetable/classManagement.api";
import { DayOfWeek, Timetable } from "../institute/insideBatch/timetable/timetable.types";
import { TimetableGrid } from "../institute/insideBatch/timetable/TimetableGrid";

interface StudentTimeTableProps {
  studentId: string;
  batchId: string;
  batchName?: string;
}

// Helper: Convert "HH:mm" to total minutes
function timeToMinutes(timeStr?: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

// Helper: Convert "13:30" to "1:30 PM"
function format12Hour(timeStr?: string): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${adjustedHours}:${formattedMinutes} ${period}`;
}

const DAYS_LIST: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function StudentTimeTable({
  studentId,
  batchId,
  batchName,
}: StudentTimeTableProps) {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [managedRecords, setManagedRecords] = useState<any[]>([]);
  const [managedIds, setManagedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Current day of week string (e.g. "Monday")
  const currentDayName = useMemo<DayOfWeek>(() => {
    const days: DayOfWeek[] = [
      "Sunday" as DayOfWeek,
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[currentTime.getDay()];
  }, [currentTime]);

  // Selected tab for Day view (defaults to today if weekday, else Monday)
  const [selectedDay, setSelectedDay] = useState<string>(
    DAYS_LIST.includes(currentDayName) ? currentDayName : "Monday"
  );
  const [viewMode, setViewMode] = useState<string>("day");

  // Keep live time updated every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Fetch batch timetable & today's overrides/substitutes
  useEffect(() => {
    if (!batchId) return;

    setLoading(true);

    const todayStr = new Date().toISOString().slice(0, 10);

    Promise.allSettled([
      GetBatchGrid(batchId),
      GetAllClassManagement({
        batchId,
        startDate: todayStr,
        endDate: todayStr,
      }),
    ])
      .then(([gridRes, manageRes]) => {
        // Handle Timetable Grid
       
if (gridRes.status === "fulfilled") {
  const response = gridRes.value as { data?: any[] };
  const raw = response?.data || [];

  const enriched: Timetable[] = raw.map((t: any) => ({
    ...t,
    batchName: t.batchId?.name ?? t.batchName,
    subjectName: t.subjectId?.name ?? t.subjectName,
    teacherName: t.teacherId?.name ?? t.teacherName,
  }));

  setTimetables(enriched);
}


        // Handle Overridden / Managed records
   
if (manageRes.status === "fulfilled") {
  const response = manageRes.value as { data?: any[] };
  const recs = response?.data || [];

  setManagedRecords(recs);
  setManagedIds(
    new Set(
      recs
        .filter((r: any) => r.status !== "Cancelled")
        .map((r: any) => r.timetableId)
    )
  );
}

      })
      .catch((err) => {
        console.error("Error loading student timetable:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [batchId]);

  // Today's scheduled classes sorted chronologically
  const todayClasses = useMemo(() => {
    return timetables
      .filter((t) => t.dayOfWeek === currentDayName)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }, [timetables, currentDayName]);

  // Determine current active class and next upcoming class
  const { activeClass, nextClass, progressPercent, minutesLeft } = useMemo(() => {
    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    let active: Timetable | null = null;
    let next: Timetable | null = null;
    let percent = 0;
    let remaining = 0;

    for (const item of todayClasses) {
      const startMin = timeToMinutes(item.startTime);
      const endMin = timeToMinutes(item.endTime);

      if (nowMinutes >= startMin && nowMinutes < endMin) {
        active = item;
        const totalDuration = endMin - startMin;
        const elapsed = nowMinutes - startMin;
        percent = totalDuration > 0 ? Math.min(100, Math.round((elapsed / totalDuration) * 100)) : 0;
        remaining = endMin - nowMinutes;
        break;
      } else if (nowMinutes < startMin && !next) {
        next = item;
      }
    }

    return {
      activeClass: active,
      nextClass: next,
      progressPercent: percent,
      minutesLeft: remaining,
    };
  }, [todayClasses, currentTime]);

  // Selected day's classes for the day-view
  const selectedDayClasses = useMemo(() => {
    return timetables
      .filter((t) => t.dayOfWeek === selectedDay)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }, [timetables, selectedDay]);

  // Helper to check if a slot has a substitute teacher or is cancelled today
  const getOverrideInfo = (slotId: string) => {
    const override = managedRecords.find((r) => r.timetableId === slotId);
    if (!override) return null;
    return {
      isCancelled: override.status === "Cancelled",
      substituteTeacher: override.substituteTeacherId?.name || override.teacherName,
      remarks: override.remarks,
    };
  };

  const activeOverride = activeClass ? getOverrideInfo(activeClass._id) : null;

  return (
    <Stack gap="lg">
      {/* ======================================================== */}
      {/* 1. HERO CARD: LIVE TIMETABLE & TEACHER ON DUTY WIDGET    */}
      {/* ======================================================== */}
      <Paper
        p={{ base: "md", sm: "xl" }}
        radius="18px"
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #1E3A8A 100%)",
          color: "#FFFFFF",
          boxShadow: "0 10px 30px -5px rgba(15, 23, 42, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative glow */}
        <Box
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(59, 130, 246, 0) 70%)",
            pointerEvents: "none",
          }}
        />

        <Stack gap="md">
          {/* Header Row: Live Status & Digital Time */}
          <Flex justify="space-between" align="center" wrap="wrap" gap="sm">
            <Group gap="xs">
              <ThemeIcon
                size={34}
                radius="md"
                style={{
                  background: activeClass
                    ? "rgba(16, 185, 129, 0.2)"
                    : "rgba(59, 130, 246, 0.2)",
                  color: activeClass ? "#34D399" : "#60A5FA",
                }}
              >
                <IconSparkles size={18} />
              </ThemeIcon>
              <div>
                <Text fw={700} fz={{ base: 14, sm: 16 }} c="#FFFFFF">
                  Live Class Monitor
                </Text>
                <Text fz={12} c="rgba(255, 255, 255, 0.65)">
                  {currentDayName},{" "}
                  {currentTime.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </div>
            </Group>

            {/* Time Pill */}
            <Badge
              size="lg"
              radius="xl"
              variant="outline"
              color="gray"
              leftSection={<IconClock size={14} />}
              styles={{
                root: {
                  borderColor: "rgba(255, 255, 255, 0.25)",
                  color: "#FFFFFF",
                  background: "rgba(255, 255, 255, 0.07)",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 13,
                },
              }}
            >
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Badge>
          </Flex>

          {/* Body: Active Class OR Next Class OR Free Time */}
          {activeClass ? (
            <Box
              p={{ base: "md", sm: "lg" }}
              style={{
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Flex
                justify="space-between"
                align={{ base: "flex-start", sm: "center" }}
                direction={{ base: "column", sm: "row" }}
                gap="md"
              >
                <Stack gap={6}>
                  <Group gap="xs">
                    <Badge
                      color="green"
                      variant="filled"
                      size="sm"
                      radius="sm"
                      style={{
                        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                      }}
                    >
                      ● HAPPENING NOW
                    </Badge>
                    <Text fz={13} c="rgba(255, 255, 255, 0.7)">
                      {format12Hour(activeClass.startTime)} -{" "}
                      {format12Hour(activeClass.endTime)}
                    </Text>
                  </Group>

                  <Text fw={800} fz={{ base: 22, sm: 26 }} c="#FFFFFF">
                    {activeClass.subjectName || "Subject Scheduled"}
                  </Text>

                  {/* KISKI DUTY HAI / TEACHER DETAILS */}
                  <Group gap="lg" mt={2} wrap="wrap">
                    <Group gap={6}>
                      <ThemeIcon size={26} radius="xl" color="blue" variant="light">
                        <IconUser size={15} />
                      </ThemeIcon>
                      <div>
                        <Text fz={11} c="rgba(255, 255, 255, 0.6)" tt="uppercase" fw={600}>
                          Teacher on Duty
                        </Text>
                        <Text fz={14} fw={700} c="#93C5FD">
                          {activeOverride?.substituteTeacher ||
                            activeClass.teacherName ||
                            "Assigned Faculty"}
                        </Text>
                      </div>
                    </Group>

                    {activeClass.room && (
                      <Group gap={6}>
                        <ThemeIcon size={26} radius="xl" color="cyan" variant="light">
                          <IconDoor size={15} />
                        </ThemeIcon>
                        <div>
                          <Text fz={11} c="rgba(255, 255, 255, 0.6)" tt="uppercase" fw={600}>
                            Classroom / Lab
                          </Text>
                          <Text fz={14} fw={700} c="#FFFFFF">
                            {activeClass.room}
                          </Text>
                        </div>
                      </Group>
                    )}

                    {activeOverride?.isCancelled && (
                      <Badge color="red" variant="filled" size="md">
                        Class Cancelled Today
                      </Badge>
                    )}
                  </Group>
                </Stack>

                {/* Progress / Time Left */}
                <Box
                  style={{
                    minWidth: 160,
                    width: "100%",
                    maxWidth: 220,
                  }}
                >
                  <Flex justify="space-between" mb={4}>
                    <Text fz={12} c="rgba(255, 255, 255, 0.7)">
                      Time remaining
                    </Text>
                    <Text fz={12} fw={700} c="#34D399">
                      {minutesLeft}m left
                    </Text>
                  </Flex>
                  <Progress
                    value={progressPercent}
                    size="sm"
                    radius="xl"
                    color="teal"
                    styles={{
                      root: { background: "rgba(255, 255, 255, 0.15)" },
                    }}
                  />
                </Box>
              </Flex>
            </Box>
          ) : nextClass ? (
            /* Next upcoming class info */
            <Box
              p="md"
              style={{
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px dashed rgba(255, 255, 255, 0.2)",
              }}
            >
              <Flex justify="space-between" align="center" wrap="wrap" gap="sm">
                <Group gap="sm">
                  <ThemeIcon size={38} radius="md" color="indigo" variant="light">
                    <IconCalendarTime size={20} />
                  </ThemeIcon>
                  <div>
                    <Group gap="xs">
                      <Badge color="blue" variant="light" size="xs">
                        UPCOMING NEXT
                      </Badge>
                      <Text fz={12} c="rgba(255, 255, 255, 0.7)">
                        Starts at {format12Hour(nextClass.startTime)}
                      </Text>
                    </Group>
                    <Text fw={700} fz={17} c="#FFFFFF" mt={2}>
                      {nextClass.subjectName || "Subject"}
                    </Text>
                  </div>
                </Group>

                <Group gap="md">
                  <Group gap={6}>
                    <IconUser size={16} color="#93C5FD" />
                    <Text fz={13} fw={600} c="#93C5FD">
                      Duty: {nextClass.teacherName || "Assigned Faculty"}
                    </Text>
                  </Group>
                  {nextClass.room && (
                    <Badge variant="outline" color="gray" styles={{ root: { color: "#FFF" } }}>
                      Room {nextClass.room}
                    </Badge>
                  )}
                </Group>
              </Flex>
            </Box>
          ) : (
            /* No classes remaining today */
            <Box
              p="md"
              style={{
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.04)",
                textAlign: "center",
              }}
            >
              <Text fz={14} c="rgba(255, 255, 255, 0.8)">
                🌿 No ongoing classes right now.{" "}
                {todayClasses.length > 0
                  ? "All classes for today have concluded!"
                  : "No classes scheduled for today."}
              </Text>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* ======================================================== */}
      {/* 2. MAIN SCHEDULE SECTION: RESPONSIVE TABS & MATRIX VIEW  */}
      {/* ======================================================== */}
      <Paper
        p={{ base: "md", sm: "lg" }}
        radius="16px"
        withBorder
        shadow="xs"
        style={{
          borderColor: "#E2E8F0",
          position: "relative",
          minHeight: 350,
        }}
      >
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2, opacity: 0.6 }} />

        {/* Header Controls */}
        <Flex
          justify="space-between"
          align={{ base: "flex-start", sm: "center" }}
          direction={{ base: "column", sm: "row" }}
          gap="md"
          mb="lg"
        >
          <div>
            <Title order={3} c="#1B2559" fz={{ base: 18, sm: 22 }}>
              Class Timetable
            </Title>
            <Text size="xs" c="dimmed" mt={2}>
              {batchName ? `Class schedule for ${batchName}` : "Weekly routine & period breakdown"}
            </Text>
          </div>

          {/* Toggle View Mode: Day-by-Day vs Full Matrix */}
          <Group gap="xs">
            <Button.Group>
              <Button
                size="xs"
                variant={viewMode === "day" ? "filled" : "default"}
                leftSection={<IconList size={14} />}
                onClick={() => setViewMode("day")}
                color="blue"
              >
                Day View
              </Button>
              <Button
                size="xs"
                variant={viewMode === "grid" ? "filled" : "default"}
                leftSection={<IconGridDots size={14} />}
                onClick={() => setViewMode("grid")}
                color="blue"
              >
                Full Week
              </Button>
            </Button.Group>
          </Group>
        </Flex>

        {/* -------------------------------------------------------- */}
        {/* VIEW 1: DAY-BY-DAY TIMELINE CARDS (IDEAL FOR MOBILE)     */}
        {/* -------------------------------------------------------- */}
        {viewMode === "day" && (
          <Stack gap="md">
            {/* Day Selector Pills */}
            <Tabs
              value={selectedDay}
              onChange={(val) => val && setSelectedDay(val)}
              variant="pills"
              radius="xl"
            >
              <Tabs.List
                style={{
                  overflowX: "auto",
                  flexWrap: "nowrap",
                  paddingBottom: 4,
                }}
              >
                {DAYS_LIST.map((day) => {
                  const isToday = day === currentDayName;
                  return (
                    <Tabs.Tab
                      key={day}
                      value={day}
                      px={{ base: "sm", sm: "md" }}
                      py={6}
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                      }}
                      rightSection={
                        isToday ? (
                          <Badge size="xs" circle color="green" variant="filled">
                            •
                          </Badge>
                        ) : undefined
                      }
                    >
                      {day}
                    </Tabs.Tab>
                  );
                })}
              </Tabs.List>
            </Tabs>

            {/* List of Periods for Selected Day */}
            {selectedDayClasses.length === 0 ? (
              <Stack align="center" justify="center" py="xl" gap="sm">
                <ThemeIcon size={52} radius="xl" variant="light" color="gray">
                  <IconCalendar size={28} />
                </ThemeIcon>
                <Text fw={600} c="#475569">
                  No classes scheduled on {selectedDay}
                </Text>
                <Text size="xs" c="dimmed" ta="center">
                  Enjoy your day or check other days for scheduled lectures.
                </Text>
              </Stack>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {selectedDayClasses.map((item, idx) => {
                  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
                  const startMin = timeToMinutes(item.startTime);
                  const endMin = timeToMinutes(item.endTime);
                  const isCurrent =
                    selectedDay === currentDayName &&
                    nowMinutes >= startMin &&
                    nowMinutes < endMin;
                  const isFinished =
                    selectedDay === currentDayName && nowMinutes >= endMin;

                  const override = getOverrideInfo(item._id);

                  return (
                    <Card
                      key={item._id || idx}
                      p="md"
                      radius="14px"
                      withBorder
                      style={{
                        borderColor: isCurrent
                          ? "#3B82F6"
                          : isFinished
                          ? "#E2E8F0"
                          : "#CBD5E1",
                        background: isCurrent
                          ? "#EFF6FF"
                          : isFinished
                          ? "#F8FAFC"
                          : "#FFFFFF",
                        boxShadow: isCurrent
                          ? "0 4px 14px 0 rgba(59, 130, 246, 0.15)"
                          : "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Stack gap="xs">
                        {/* Period Time & Badge */}
                        <Flex justify="space-between" align="center">
                          <Group gap={6}>
                            <IconClock size={15} color="#64748B" />
                            <Text fz={13} fw={700} c="#1E293B">
                              {format12Hour(item.startTime)} - {format12Hour(item.endTime)}
                            </Text>
                          </Group>

                          {isCurrent ? (
                            <Badge color="green" variant="filled" size="xs">
                              Live Now
                            </Badge>
                          ) : isFinished ? (
                            <Badge color="gray" variant="light" size="xs">
                              Completed
                            </Badge>
                          ) : (
                            <Badge color="blue" variant="light" size="xs">
                              Slot {idx + 1}
                            </Badge>
                          )}
                        </Flex>

                        {/* Subject */}
                        <Text fw={700} fz={17} c="#0F172A" mt={2}>
                          {item.subjectName || "Subject"}
                        </Text>

                        {/* Teacher Duty */}
                        <Group gap="xs" mt={4}>
                          <ThemeIcon
                            size={26}
                            radius="xl"
                            variant="light"
                            color={override?.substituteTeacher ? "orange" : "blue"}
                          >
                            <IconUser size={14} />
                          </ThemeIcon>
                          <Box style={{ flex: 1 }}>
                            <Text fz={11} c="dimmed" fw={600}>
                              Duty Teacher
                            </Text>
                            <Text fz={13} fw={600} c="#334155" lineClamp={1}>
                              {override?.substituteTeacher ||
                                item.teacherName ||
                                "Not Assigned"}
                            </Text>
                          </Box>
                        </Group>

                        {/* Room Location & Overrides */}
                        <Flex justify="space-between" align="center" mt={4} pt={6} style={{ borderTop: "1px solid #F1F5F9" }}>
                          {item.room ? (
                            <Group gap={4}>
                              <IconDoor size={14} color="#64748B" />
                              <Text fz={12} c="#64748B" fw={500}>
                                Room: {item.room}
                              </Text>
                            </Group>
                          ) : (
                            <Text fz={12} c="dimmed">
                              Room: TBA
                            </Text>
                          )}

                          {override?.isCancelled ? (
                            <Badge color="red" variant="light" size="xs">
                              Cancelled
                            </Badge>
                          ) : override?.substituteTeacher ? (
                            <Badge color="orange" variant="light" size="xs" leftSection={<IconUserCheck size={12} />}>
                              Proxy Teacher
                            </Badge>
                          ) : null}
                        </Flex>
                      </Stack>
                    </Card>
                  );
                })}
              </SimpleGrid>
            )}
          </Stack>
        )}

        {/* -------------------------------------------------------- */}
        {/* VIEW 2: FULL WEEK MATRIX (USES TIMETABLE GRID)           */}
        {/* -------------------------------------------------------- */}
        {viewMode === "grid" && (
          <Box>
            {timetables.length === 0 && !loading ? (
              <Stack align="center" justify="center" py="xl" gap="sm">
                <ThemeIcon size={56} radius="xl" variant="light" color="gray">
                  <IconCalendar size={28} />
                </ThemeIcon>
                <Text fw={600} c="#475569">
                  No weekly schedule available
                </Text>
                <Text size="xs" c="dimmed">
                  Timetable slots have not been configured for this batch yet.
                </Text>
              </Stack>
            ) : (
              <TimetableGrid
                timetables={timetables}
                managedTimetableIds={managedIds}
                isAdmin={false}
              />
            )}
          </Box>
        )}
      </Paper>
    </Stack>
  );
}