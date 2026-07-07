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
    <Box bg="gray.0" mih="100vh" py="xl">
      <Container size="lg">
        <Group justify="space-between" mb="xl">
          <Box>
            <Title order={2} fw={700} c="dark.8">My Classes</Title>
            <Text c="dimmed" size="sm">Join your online classroom sessions</Text>
          </Box>

          {/* Join by code */}
          <Group gap="xs">
            <TextInput
              placeholder="Enter meeting code..."
              leftSection={<IconKey size={14} />}
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && joinByCode()}
              maxLength={6}
              styles={{ input: { fontFamily: "monospace", fontWeight: 600, letterSpacing: 2 } }}
            />
            <Button
              loading={searching}
              onClick={joinByCode}
              color="violet"
              leftSection={<IconSearch size={14} />}
            >
              Join
            </Button>
          </Group>
        </Group>

        {/* Live now */}
        {live.length > 0 && (
          <Box mb="xl">
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
        <Title order={4} mb="md" c="dark.7">Upcoming Classes</Title>
        {upcoming.length === 0 ? (
          <Card withBorder radius="md" p="xl" mb="xl" ta="center">
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
    <Card withBorder radius="md" p="lg" style={{
      borderLeft: meeting.status === "live" ? "4px solid var(--mantine-color-green-5)" : undefined,
      background: meeting.status === "live" ? "var(--mantine-color-green-0)" : undefined,
    }}>
      <Group justify="space-between">
        <Group gap="md">
          <Box
            p="md"
            style={{
              borderRadius: 12,
              background: meeting.status === "live"
                ? "var(--mantine-color-green-1)"
                : "var(--mantine-color-violet-0)",
            }}
          >
            <IconVideo
              size={24}
              color={meeting.status === "live"
                ? "var(--mantine-color-green-6)"
                : "var(--mantine-color-violet-6)"}
            />
          </Box>
          <Box>
            <Group gap="sm" mb={4}>
              <Text fw={600}>{meeting.title}</Text>
              <Badge color={status.color} size="sm" radius="sm">{status.label}</Badge>
            </Group>
            <Group gap="lg">
              <Group gap={4}><IconBook size={13} /><Text size="xs" c="dimmed">{meeting.subject}</Text></Group>
              <Group gap={4}><IconUsers size={13} /><Text size="xs" c="dimmed">{meeting.teacherName}</Text></Group>
              <Group gap={4}><IconCalendar size={13} /><Text size="xs" c="dimmed">{dayjs(meeting.scheduledAt).format("DD MMM, hh:mm A")}</Text></Group>
              <Group gap={4}><IconClock size={13} /><Text size="xs" c="dimmed">{meeting.duration} mins</Text></Group>
            </Group>
          </Box>
        </Group>
        {isJoinable && (
          <Button
            color={meeting.status === "live" ? "green" : "violet"}
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
