"use client";
import {
  Box, Button, Card, Container, Group, Text, Title, Badge,
  TextInput, Stack, Center, Tabs, Avatar, Divider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconVideo, IconCalendar, IconClock, IconSearch,
  IconKey, IconUsers, IconBook,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { GetClassMeetings, GetMeetingByCode } from "@/axios/institute/MeetingApi";
import { ErrorNotification, SuccessNotification } from "@/app/helperFunction/Notification";
import { Meeting } from "../meeting/meeting.types";



const STATUS_CONFIG = {
  scheduled: { color: "blue", label: "Upcoming" },
  live: { color: "green", label: "Live Now" },
  ended: { color: "gray", label: "Completed" },
  cancelled: { color: "red", label: "Cancelled" },
};

export default function StudentMeetingsPage(Props:{studentId: string, batchId: string,  student: string,

}) {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [codeInput, setCodeInput] = useState("");
  const [searching, setSearching] = useState(false);
  const pathname = usePathname();
  const [currentUrl, setCurrentUrl] = useState("");

  const STUDENT = {
  id: Props.studentId,
  name: Props.student,
  role: "student" as const,
  classId: Props.batchId,
};

useEffect(() => {
  setCurrentUrl(window.location.href);
}, [pathname]);

console.log("Current URL:", currentUrl);


const loadMeetings = () => {
  GetClassMeetings(Props.batchId)
    .then((res: any) => {
      console.log("GET CLASS MEETINGS SUCCESS =>", res);

      setMeetings(res?.data || res);
    })
    .catch((err: any) => {
      console.log("GET CLASS MEETINGS ERROR =>", err);

      ErrorNotification(
        err?.response?.data?.message ||
          "Failed To Load Classes"
      );
    });
};

useEffect(() => {
  loadMeetings();
}, [Props.batchId]);


const joinByCode = () => {
  if (!codeInput.trim()) {
    ErrorNotification("Please Enter Meeting Code");
    return;
  }

  setSearching(true);

  GetMeetingByCode(codeInput.trim())
    .then((res: any) => {
      console.log("GET MEETING BY CODE SUCCESS =>", res);

      const meeting = res?.data || res;

      if (meeting.status === "ended") {
        ErrorNotification("This Class Has Ended");
        setSearching(false);
        return;
      }

      if (meeting.status === "cancelled") {
        ErrorNotification("This Class Was Cancelled");
        setSearching(false);
        return;
      }

      SuccessNotification("Joining Class");

      router.push(
        `/meetings/room/${meeting._id}?role=${STUDENT.role}&userId=${STUDENT.id}&name=${encodeURIComponent(
          STUDENT.name
        )}&redirect=${encodeURIComponent(currentUrl)}`
      );

      setSearching(false);
    })
    .catch((err: any) => {
      console.log("GET MEETING BY CODE ERROR =>", err);

      ErrorNotification(
        err?.response?.data?.message ||
          "Invalid Meeting Code"
      );

      setSearching(false);
    });
};

  const joinMeeting = (meeting: Meeting) => {
    if (meeting.status === "ended") {
     ErrorNotification("This Class Has Already Ended");
      return;
    }
    if (meeting.status === "cancelled") {
      ErrorNotification("This Class Was Cancelled");
      return;
    }
    router.push(
      `/meeting/${meeting._id}?role=${STUDENT.role}&userId=${STUDENT.id}&name=${encodeURIComponent(STUDENT.name)}&redirect=${encodeURIComponent(currentUrl)}`
    );
  };

  const live = meetings.filter((m) => m.status === "live");
  const upcoming = meetings.filter((m) => m.status === "scheduled");
  const past = meetings.filter((m) => m.status === "ended" || m.status === "cancelled");

  return (
    <Box w="100%" py={{ base: "sm", sm: "md" }} style={{ minWidth: 0 }}>
      <Container size="lg" px={{ base: 0, sm: "md" }}>
        <Group justify="space-between" align="flex-start" mb="md" gap="md" wrap="wrap">
          <Box>
            <Title order={2} fw={700} c="#172033" style={{ fontFamily: "Poppins" }}>My Classes</Title>
            <Text c="dimmed" size="sm">Join your online classroom sessions</Text>
          </Box>

          {/* Join by code */}
          <Group gap="xs" style={{ width: "100%", maxWidth: 390, minWidth: 0 }} wrap="nowrap">
            <TextInput
              placeholder="Enter meeting code..."
              leftSection={<IconKey size={14} />}
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && joinByCode()}
              maxLength={6}
              style={{ flex: 1, minWidth: 0 }}
              styles={{ input: { fontFamily: "monospace", fontWeight: 600, letterSpacing: 2 } }}
            />
            <Button
              loading={searching}
              onClick={joinByCode}
              color="blue"
              leftSection={<IconSearch size={14} />}
            >
              Join
            </Button>
          </Group>
        </Group>

        {/* Live now */}
        {live.length > 0 && (
          <Box mb="md">
            <Group gap="sm" mb="md">
              <Box w={8} h={8} style={{ borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
              <Title order={4} c="green.7">Live Now</Title>
            </Group>
            <Stack>
              {live.map((m) => (
                <StudentMeetingCard key={m._id} meeting={m} onJoin={() => joinMeeting(m)} />
              ))}
            </Stack>
          </Box>
        )}

        {/* Upcoming */}
        <Title order={4} mb="md" c="#172033" style={{ fontFamily: "Poppins" }}>Upcoming Classes</Title>
        {upcoming.length === 0 ? (
          <Card withBorder radius={10} p="xl" mb="xl" ta="center" style={{ borderColor: "#e5eaf2" }}>
            <IconCalendar size={40} color="var(--mantine-color-gray-4)" />
            <Text c="dimmed" mt="sm">No upcoming classes scheduled</Text>
          </Card>
        ) : (
          <Stack mb="xl">
            {upcoming.map((m) => (
              <StudentMeetingCard key={m._id} meeting={m} onJoin={() => joinMeeting(m)} />
            ))}
          </Stack>
        )}

        {/* Past */}
        {past.length > 0 && (
          <>
            <Divider mb="md" label="Past Classes" labelPosition="center" />
            <Stack>
              {past.map((m) => (
                <StudentMeetingCard key={m._id} meeting={m} onJoin={() => joinMeeting(m)} />
              ))}
            </Stack>
          </>
        )}
      </Container>
    </Box>
  );
}

function StudentMeetingCard({ meeting, onJoin }: { meeting: Meeting; onJoin: () => void }) {
  const status = STATUS_CONFIG[meeting.status];
  const isJoinable = meeting.status === "live" || meeting.status === "scheduled";

  return (
    <Card withBorder radius={10} p={{ base: "sm", sm: "md" }} style={{
      borderColor: "#e5eaf2",
      boxShadow: "0 2px 8px rgba(20, 42, 76, 0.06)",
      borderLeft: meeting.status === "live" ? "4px solid #0d55dd" : undefined,
      background: meeting.status === "live" ? "#f3f7ff" : "#ffffff",
    }}>
      <Group justify="space-between" gap="sm" wrap="wrap">
        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: "1 1 280px" }}>
          <Box
            p="sm"
            style={{
              borderRadius: 10,
              background: meeting.status === "live"
                ? "#e4edff"
                : "#e4edff",
              flexShrink: 0,
            }}
          >
            <IconVideo
              size={24}
              color={meeting.status === "live"
                ? "#0755d9"
                : "#0755d9"}
            />
          </Box>
          <Box style={{ minWidth: 0 }}>
            <Group gap="sm" mb={4}>
              <Text fw={600}>{meeting.title}</Text>
              <Badge color={status.color} size="sm" radius="sm">{status.label}</Badge>
            </Group>
            <Group gap="sm" wrap="wrap">
              <Group gap={4}><IconBook size={13} /><Text size="xs" c="dimmed">{meeting.subject}</Text></Group>
              <Group gap={4}><IconUsers size={13} /><Text size="xs" c="dimmed">{meeting.teacherName}</Text></Group>
              <Group gap={4}><IconCalendar size={13} /><Text size="xs" c="dimmed">{dayjs(meeting.scheduledAt).format("DD MMM, hh:mm A")}</Text></Group>
              <Group gap={4}><IconClock size={13} /><Text size="xs" c="dimmed">{meeting.duration} mins</Text></Group>
            </Group>
          </Box>
        </Group>
        {isJoinable && (
          <Button
            color={"blue"}
            variant={meeting.status === "live" ? "filled" : "light"}
            leftSection={<IconVideo size={14} />}
            radius="md"
            onClick={onJoin}
          >
            {meeting.status === "live" ? "Join Now" : "Enter Classroom"}
          </Button>
        )}
      </Group>
    </Card>
  );
}
