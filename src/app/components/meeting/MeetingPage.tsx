"use client";
import {
  Box, Button, Card, Container, Grid, Group, NumberInput,
  Select, Stack, Text, Textarea, TextInput, Title, Badge,
  ActionIcon, Divider, Modal, Alert,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconVideo, IconCalendar, IconClock, IconUsers, IconPlus,
  IconTrash, IconEdit, IconX, IconCheck, IconAlertCircle,
  IconBook, IconLink,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import {  useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Meeting } from "./meeting.types";
import { CancelMeeting, CreateMeeting, GetTeacherMeetings, GetUpcomingMeetings, } from "@/axios/institute/MeetingApi";
import { ErrorNotification, SuccessNotification } from "@/app/helperFunction/Notification";
import { UserType } from "../dashboard/InstituteBatchesSection";
import { TeacherData } from "@/interfaces/batchInterface";
import { GetAllTeachersFromBatch } from "@/axios/institute/InstituteGetApi";
import { usePathname } from "next/navigation";


// ── Status badge config ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  scheduled: { color: "blue", label: "Scheduled" },
  live: { color: "green", label: "Live" },
  ended: { color: "gray", label: "Ended" },
  cancelled: { color: "red", label: "Cancelled" },
};

export default function MeetingsPage(props: {
 

  userType: UserType;
  batchId: string;
  batchName: string;
  teacherData: TeacherData;
  subjects?: { _id: string; name: string }[];
}) {
    const pathname = usePathname();

  console.log(pathname);
  console.log("propsusertype", props.userType);

  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editMeeting, setEditMeeting] = useState<Meeting | null>(null);
  const [teacherData, settTeacherData] = useState<TeacherData[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");


  console.log("teacherData : ",teacherData);

  const [selectedTeacher, setSelectedTeacher] = useState<{
  id: string;
  name: string;
} | null>(null);

const teacherOptions = teacherData.map((teacher) => ({
  value: teacher._id,
  label: teacher.name,
}));
  
const subjectOptions =
  props.subjects?.map((subject) => ({
    value: subject._id,
    label: subject.name,
  })) || [];

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      subject: "",
      scheduledAt: null as Date | null,
      duration: 60,
    },
    validate: {
      title: (v) => (!v ? "Title is required" : null),
      subject: (v) => (!v ? "Subject is required" : null),
      scheduledAt: (v) => (!v ? "Please select date & time" : null),
    },
  });

  
  useEffect(() => {
  setCurrentUrl(window.location.href);
}, [pathname]);
console.log("currentUrl:", currentUrl);



  const loadMeetings = () => {
    setLoading(true);
    if (UserType.OTHERS === props.userType) {
      console.log("meeting for admin");
      GetUpcomingMeetings(props.batchId)
        .then((res: any) => {
          console.log("GET MEETINGS SUCCESS =>", res);

          setMeetings(res?.data || res);

          setLoading(false);
        })
        .catch((err: any) => {
          console.log("GET MEETINGS ERROR =>", err.response.data.message);

          ErrorNotification(err.response.data.message);

          setLoading(false);
        });
      // getupcomming meeting
    } else {
      console.log("meeting for teacher");

     GetTeacherMeetings(props.teacherData._id)
        .then((res: any) => {
          console.log("GET MEETINGS SUCCESS =>", res);

          setMeetings(res?.data || res);

          setLoading(false);
        })
        .catch((err: any) => {
          console.log("GET MEETINGS ERROR =>", err.response.data.message);

          ErrorNotification(err.response.data.message);

          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);


  useEffect(() => {
    if (props.batchId) {
      setLoading(true);
      GetAllTeachersFromBatch(props.batchId)
        .then((x: any) => {
          const { teachers } = x;
          const teachersData = teachers.map((s: any) => {
            return {
              _id: s._id,
              name: s.name,
              phoneNumber: s.phoneNumber,
              subjects: s.subjects,
            };
          });

          settTeacherData(teachersData);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
  }, [props.batchId]);

  const handleSubmit = (values: typeof form.values) => {
    if (!selectedTeacher) {
  ErrorNotification("Please Select Teacher");
  return;
}
    const payload = {
      ...values,
      teacherId: selectedTeacher.id,
  teacherName: selectedTeacher.name,
      classId: props.batchId,
      className: props.batchName,
      scheduledAt: values.scheduledAt!,
    };

    console.log("CREATE MEETING PAYLOAD =>", payload);

    setSubmitting(true);

    CreateMeeting(payload)
      .then((res: any) => {
        console.log("CREATE MEETING SUCCESS =>", res);

        SuccessNotification("Meeting Scheduled Successfully");

        form.reset();
        close();

        loadMeetings();

        setSubmitting(false);
      })
      .catch((err: any) => {
        console.log("CREATE MEETING ERROR =>", err);

        ErrorNotification(
          err?.response?.data?.message || "Failed To Schedule Meeting"
        );

        setSubmitting(false);
      });
  };

  const handleCancel = (id: string) => {
    console.log("CANCEL MEETING ID =>", id);

    CancelMeeting(id)
      .then((res: any) => {
        console.log("CANCEL SUCCESS =>", res);

        SuccessNotification("Meeting Cancelled Successfully");

        loadMeetings();
      })
      .catch((err: any) => {
        console.log("CANCEL ERROR =>", err);

        ErrorNotification(
          err?.response?.data?.message || "Failed To Cancel Meeting"
        );
      });
  };

  const handleJoin = (meeting: Meeting) => {
  //   router.push(`/meetings/room/${meeting._id}?role=${CURRENT_USER.role}&userId=${CURRENT_USER.id}&name=${encodeURIComponent(CURRENT_USER.name)}`);
  // };
console.log("props.teacherData._id: ", props.teacherData._id);
console.log("props.teacherData.name: ", props.teacherData.name);
console.log("FULL TEACHER DATA => ", props.teacherData);

  router.push(
    
    
  `/meeting/${meeting._id}?role=${props.userType === UserType.TEACHER ? "teacher" : "admin"}&userId=${props.teacherData._id}&name=${encodeURIComponent(props.teacherData.name)}&redirect=${encodeURIComponent(currentUrl)}`
);
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    notifications.show({ color: "teal", message: `Code ${code} copied!` });
  };

  const upcoming = meetings.filter((m) => m.status === "scheduled");
  const past = meetings.filter((m) => m.status !== "scheduled");

  return (
    <Box bg="gray.0" mih="100vh" py="xl">
      <Container size="xl">
        {/* ── Header ── */}
        <Group justify="space-between" mb="xl">
          <Box>
            <Title order={2} fw={700} c="dark.8">
              Online Classes
            </Title>
            <Text c="dimmed" size="sm">Schedule and manage your virtual classroom sessions</Text>
          </Box>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={open}
            size="md"
            radius="md"
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
          >
            Schedule New Class
          </Button>
        </Group>

        {/* ── Stats Row ── */}
        <Grid mb="xl">
          {[
            { label: "Total Classes", value: meetings.length, color: "violet", icon: IconVideo },
            { label: "Upcoming", value: upcoming.length, color: "blue", icon: IconCalendar },
            { label: "Completed", value: meetings.filter((m) => m.status === "ended").length, color: "teal", icon: IconCheck },
            { label: "Live Now", value: meetings.filter((m) => m.status === "live").length, color: "green", icon: IconUsers },
          ].map((stat) => (
            <Grid.Col span={{ base: 6, sm: 3 }} key={stat.label}>
              <Card withBorder radius="md" p="lg">
                <Group>
                  <Box
                    p="xs"
                    style={{ borderRadius: 10, background: `var(--mantine-color-${stat.color}-1)` }}
                  >
                    <stat.icon size={22} color={`var(--mantine-color-${stat.color}-6)`} />
                  </Box>
                  <Box>
                    <Text size="xl" fw={700}>{stat.value}</Text>
                    <Text size="xs" c="dimmed">{stat.label}</Text>
                  </Box>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* ── Upcoming Meetings ── */}
        <Title order={4} mb="md" c="dark.7">Upcoming Classes</Title>
        {upcoming.length === 0 ? (
          <Card withBorder radius="md" p="xl" mb="xl" ta="center">
            <IconCalendar size={40} color="var(--mantine-color-gray-4)" />
            <Text c="dimmed" mt="sm">No upcoming classes scheduled</Text>
            <Button variant="light" mt="md" onClick={open}>Schedule Now</Button>
          </Card>
        ) : (
          <Stack mb="xl">
            {upcoming.map((meeting) => (
              <MeetingCard
                key={meeting._id}
                meeting={meeting}
                // role={CURRENT_USER.role}
                 role={props.userType === UserType.TEACHER ? "teacher" : "admin"}
                onJoin={() => handleJoin(meeting)}
                onCancel={() => handleCancel(meeting._id)}
                onCopyCode={() => copyCode(meeting.meetingCode)}
              />
            ))}
          </Stack>
        )}

        {/* ── Past Meetings ── */}
        {past.length > 0 && (
          <>
            <Divider mb="md" />
            <Title order={4} mb="md" c="dark.7">Past Classes</Title>
            <Stack>
              {past.map((meeting) => (
                <MeetingCard
                  key={meeting._id}
                  meeting={meeting}
                  // role={CURRENT_USER.role}
                    role={props.userType === UserType.TEACHER ? "teacher" : "admin"}
                  onJoin={() => handleJoin(meeting)}
                  onCancel={() => handleCancel(meeting._id)}
                  onCopyCode={() => copyCode(meeting.meetingCode)}
                />
              ))}
            </Stack>
          </>
        )}
      </Container>

      {/* ── Schedule Modal ── */}
      <Modal
        opened={opened}
        onClose={close}
        title={<Title order={4}>Schedule New Class</Title>}
        size="lg"
        radius="md"
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Class Title"
              placeholder="e.g., Chapter 5: Photosynthesis"
              required
              {...form.getInputProps("title")}
            />
         <Select
  label="Subject"
  placeholder="Select subject"
  required
  data={subjectOptions}
  {...form.getInputProps("subject")}
/>

            <Select
  label="Teacher"
  placeholder="Select teacher"
  required
  data={teacherOptions}
  value={selectedTeacher?.id || null}
  onChange={(value) => {
    const teacher = teacherData.find((t) => t._id === value);

    if (teacher) {
      setSelectedTeacher({
        id: teacher._id,
        name: teacher.name,
      });
    }
  }}
/>
            <Textarea
              label="Description (optional)"
              placeholder="What will be covered in this session..."
              rows={3}
              {...form.getInputProps("description")}
            />
            <Grid>
              <Grid.Col span={8}>
                <DateTimePicker
                  label="Date & Time"
                  placeholder="Select date and time"
                  required
                  minDate={new Date()}
                  {...form.getInputProps("scheduledAt")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Duration (mins)"
                  min={15}
                  max={180}
                  step={15}
                  {...form.getInputProps("duration")}
                />
              </Grid.Col>
            </Grid>

            <Alert icon={<IconAlertCircle size={16} />} color="blue" radius="md">
              Students in <strong>{props.batchName}</strong> will receive a notification when the class starts.
            </Alert>

            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={close}>Cancel</Button>
              <Button type="submit" loading={submitting} style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                Schedule Class
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}

// ── Meeting Card Component ───────────────────────────────────────────────────
interface MeetingCardProps {
  meeting: Meeting;
  role: "teacher" | "student" | "admin";
  onJoin: () => void;
  onCancel: () => void;
  onCopyCode: () => void;
}

function MeetingCard({ meeting, role, onJoin, onCancel, onCopyCode }: MeetingCardProps) {
  const status = STATUS_CONFIG[meeting.status];
  const isTeacher = role === "teacher" || role === "admin";
  const isPast = meeting.status === "ended" || meeting.status === "cancelled";
  const isLive = meeting.status === "live";

  return (
    <Card withBorder radius="md" p="lg" style={{
      borderLeft: isLive ? "4px solid var(--mantine-color-green-5)" : undefined,
      background: isLive ? "var(--mantine-color-green-0)" : undefined,
    }}>
      <Group justify="space-between" wrap="nowrap">
        <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
          <Box
            p="md"
            style={{
              borderRadius: 12,
              background: isLive ? "var(--mantine-color-green-1)" : "var(--mantine-color-violet-0)",
              flexShrink: 0,
            }}
          >
            <IconVideo
              size={24}
              color={isLive ? "var(--mantine-color-green-6)" : "var(--mantine-color-violet-6)"}
            />
          </Box>
          <Box style={{ minWidth: 0 }}>
            <Group gap="sm" mb={4}>
              <Text fw={600} size="md" truncate>{meeting.title}</Text>
              <Badge color={status.color} size="sm" radius="sm">{status.label}</Badge>
              {isLive && <Badge color="green" variant="dot" size="sm">LIVE</Badge>}
            </Group>
            <Group gap="lg">
              <Group gap={4}>
                <IconBook size={13} color="var(--mantine-color-gray-5)" />
                <Text size="xs" c="dimmed">{meeting.subject}</Text>
              </Group>
              <Group gap={4}>
                <IconCalendar size={13} color="var(--mantine-color-gray-5)" />
                <Text size="xs" c="dimmed">{dayjs(meeting.scheduledAt).format("DD MMM, hh:mm A")}</Text>
              </Group>
              <Group gap={4}>
                <IconClock size={13} color="var(--mantine-color-gray-5)" />
                <Text size="xs" c="dimmed">{meeting.duration} mins</Text>
              </Group>
              <Group gap={4}>
                <IconUsers size={13} color="var(--mantine-color-gray-5)" />
                <Text size="xs" c="dimmed">{meeting.participants?.length || 0} joined</Text>
              </Group>
            </Group>
          </Box>
        </Group>

        <Group gap="sm" wrap="nowrap">
          {/* Meeting Code */}
          <Box
            px="sm"
            py={4}
            style={{
              background: "var(--mantine-color-gray-1)",
              borderRadius: 8,
              cursor: "inter",
              border: "1px dashed var(--mantine-color-gray-3)",
            }}
            onClick={onCopyCode}
          >
            <Group gap={4}>
              <IconLink size={12} color="var(--mantine-color-gray-5)" />
              <Text size="xs" ff="monospace" fw={600} c="violet">{meeting.meetingCode}</Text>
            </Group>
          </Box>

          {!isPast && (
            <Button
              size="sm"
              radius="md"
              onClick={onJoin}
              color={isLive ? "green" : "violet"}
              variant={isLive ? "filled" : "light"}
              leftSection={<IconVideo size={14} />}
            >
              {isLive ? "Join Live" : "Start Class"}
            </Button>
          )}

          {isTeacher && !isPast && (
            <ActionIcon
              color="red"
              variant="light"
              size="lg"
              radius="md"
              onClick={onCancel}
              title="Cancel meeting"
            >
              <IconX size={16} />
            </ActionIcon>
          )}
        </Group>
      </Group>
    </Card>
  );
}

