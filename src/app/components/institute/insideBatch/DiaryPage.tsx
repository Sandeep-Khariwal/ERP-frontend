"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  TextInput,
  Select,
  Table,
  Text,
  Title,
  Group,
  Stack,
  Badge,
  ActionIcon,
  Menu,
  Drawer,
  Textarea,
  Paper,
  Divider,
  Modal,
  Pagination,
  Grid,
  Card,
  ScrollArea,
  ThemeIcon,
  Tooltip,
  Avatar,
  Flex,
  Indicator,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconSearch,
  IconPlus,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconList,
  IconBook,
  IconFlask,
  IconLanguage,
  IconGlobe,
  IconDeviceDesktop,
  IconLetterA,
  IconChevronDown,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { DateValue } from "@mantine/dates";
import { CreateDiary } from "@/axios/institute/InstitutePostApi";
import { SuccessNotification } from "@/app/helperFunction/Notification";
import { GetAllDiary, GetAllTeachersFromBatch } from "@/axios/institute/InstituteGetApi";
import { DeleteDiary, updateDiary } from "@/axios/institute/InstitutePutApi";

// ─── Types ──────────────────────────────────────────────────────────────────

type Subject =
  | "Mathematics"
  | "Science"
  | "English"
  | "Social Science"
  | "Computer"
  | "Hindi";

interface DiaryEntry {
  id: string;
  subject: Subject;
  teacher: string;
  title: string;
  description: string;
  date: string; // ISO string
  time: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SUBJECTS: Subject[] = [
  "Mathematics",
  "Science",
  "English",
  "Social Science",
  "Computer",
  "Hindi",
];

const TEACHER_MAP: Record<Subject, string> = {
  Mathematics: "Rahul Sharma",
  Science: "Neha Verma",
  English: "Priya Singh",
  "Social Science": "Amit Tiwari",
  Computer: "Vikash Patel",
  Hindi: "Sunita Devi",
};

const SUBJECT_COLORS: Record<Subject, string> = {
  Mathematics: "#6c5ce7",
  Science: "#00b894",
  English: "#fdcb6e",
  "Social Science": "#e17055",
  Computer: "#0984e3",
  Hindi: "#fd79a8",
};

const SUBJECT_ICONS: Record<Subject, React.ReactNode> = {
  Mathematics: <IconBook size={16} />,
  Science: <IconFlask size={16} />,
  English: <IconLanguage size={16} />,
  "Social Science": <IconGlobe size={16} />,
  Computer: <IconDeviceDesktop size={16} />,
  Hindi: <IconLetterA size={16} />,
};

function getSubjectIcon(subject: string) {
  const s = subject.toLowerCase();

  if (s.includes("math")) return <IconBook size={16} />;
  if (s.includes("science")) return <IconFlask size={16} />;
  if (s.includes("english")) return <IconLanguage size={16} />;
  if (s.includes("social")) return <IconGlobe size={16} />;
  if (s.includes("computer") || s.includes("c")) return <IconDeviceDesktop size={16} />;
  if (s.includes("hindi")) return <IconLetterA size={16} />;

  return <IconBook size={16} />; // default icon
}

const INITIAL_ENTRIES: DiaryEntry[] = [
  {
    id: "1",
    subject: "Mathematics",
    teacher: "Rahul Sharma",
    title: "Homework - 1",
    description: "Solve Exercise 5.1 Questions 1 to 5",
    date: "2026-05-12",
    time: "10:30 AM",
  },
  {
    id: "2",
    subject: "Science",
    teacher: "Neha Verma",
    title: "Practical Work",
    description: "Complete experiment on Acid and Base",
    date: "2026-05-12",
    time: "09:15 AM",
  },
  {
    id: "3",
    subject: "English",
    teacher: "Priya Singh",
    title: "Reading Task",
    description: "Read Chapter 3 and write summary",
    date: "2026-05-12",
    time: "08:45 AM",
  },
  {
    id: "4",
    subject: "Social Science",
    teacher: "Amit Tiwari",
    title: "Map Work",
    description: "Mark all rivers on India map",
    date: "2026-05-11",
    time: "03:30 PM",
  },
  {
    id: "5",
    subject: "Computer",
    teacher: "Vikash Patel",
    title: "Lab Assignment",
    description: "Create a presentation on MS PowerPoint",
    date: "2026-05-11",
    time: "01:20 PM",
  },
  {
    id: "6",
    subject: "Hindi",
    teacher: "Sunita Devi",
    title: "पाठ - 2 अभ्यास",
    description: "पाठ 2 पढ़कर प्रश्न उत्तर लिखिए",
    date: "2026-05-10",
    time: "11:00 AM",
  },
  {
    id: "7",
    subject: "Mathematics",
    teacher: "Rahul Sharma",
    title: "Chapter 6 Notes",
    description: "Write notes for Chapter 6 - Triangles",
    date: "2026-05-10",
    time: "09:00 AM",
  },
  {
    id: "8",
    subject: "Science",
    teacher: "Neha Verma",
    title: "Diagram Practice",
    description: "Draw and label plant cell diagram",
    date: "2026-05-09",
    time: "10:00 AM",
  },
];

const PAGE_SIZE = 6;

// ─── Sub-Components ──────────────────────────────────────────────────────────

// function SubjectIcon({ subject }: { subject: Subject }) {
//   return (
//     <ThemeIcon
//       size={32}
//       radius="xl"
//       style={{ background: SUBJECT_COLORS[subject] + "22" }}
//       color={SUBJECT_COLORS[subject]}
//     >
//       <span style={{ color: SUBJECT_COLORS[subject] }}>
//         {getSubjectIcon[subject]}
//       </span>
//     </ThemeIcon>
//   );
// }
function SubjectIcon({ subject }: { subject: string }) {
  return (
    <ThemeIcon size={32} radius="xl">
      {getSubjectIcon(subject)}
    </ThemeIcon>
  );
}

// ─── Entry Form (shared for Add & Edit) ──────────────────────────────────────

interface EntryFormProps {
  initial?: Partial<DiaryEntry>;
  onSave: (entry: Omit<DiaryEntry, "id">) => void;
  onCancel: () => void;
  teacher?: string;
  batchId: string;
  subjects: { _id: string; name: string }[];
    id?: string; 
    isLoading?: boolean;
setIsLoading?: (v: boolean) => void;
fetchDiary: () => void;
}

function EntryForm({ initial, onSave, onCancel, teacher, batchId, subjects, id,  isLoading, setIsLoading, fetchDiary }: EntryFormProps) {
  const [subject, setSubject] = useState<string>(initial?.subject ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState<DateValue>(
    initial?.date ? new Date(initial.date) : new Date()
  );
//  const [teacherName,setteacherName] = useState<string>("")
const [teacherName, setteacherName] = useState<string>(initial?.teacher ?? "")

  useEffect(() => {
  if (initial) {
    setSubject(initial.subject ?? "");
    setTitle(initial.title ?? "");
    setDescription(initial.description ?? "");
    setDate(initial.date ? new Date(initial.date) : new Date());
    setteacherName(initial.teacher ?? "");
  }
}, [initial]);


  const handleSave = () => {
    if (!subject || !title || !description || !date) {
      notifications.show({
        title: "Validation Error",
        message: "Please fill all required fields.",
        color: "red",
        icon: <IconX size={16} />,
      });
      return;
    }
setIsLoading?.(true);

     const payload = {
    subject: subject as Subject,
    title,
    description,
    date: (date as Date).toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // ✅ EDIT API CALL
  if (id) {
    updateDiary(id, payload)
      .then((res: any) => {
        console.log("edit :", res);
        
        SuccessNotification("Diary updated!!");
        fetchDiary();
        onCancel(); 

        // onSave({
        //   ...payload,
        //   teacher: teacherName,
        // });
         setIsLoading?.(false);
      })
      .catch((e: any) => {
        console.log(e);
        
      })
       .finally(() => {
      setIsLoading?.(false);
    });

    return;
  }




    CreateDiary({
      subject: subject as Subject,
      teacher: teacherName,
      title,
      description,
      batch: batchId,
      date: (date as Date).toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    })
      .then((res: any) => {
        console.log("resdiary :", res);

  fetchDiary();   // ✅ UI तुरंत update
  onCancel();     // ✅ Drawer close
        

        // onSave({
        //   subject: res.diary.subject,
        //   teacher: res.diary.teacher,
        //   title: res.diary.title,
        //   description: res.diary.description,
        //   date: (date as Date).toISOString().split("T")[0],
        //   time: new Date().toLocaleTimeString("en-US", {
        //     hour: "2-digit",
        //     minute: "2-digit",
        //   }),
        // });

        SuccessNotification("Diary created!!")
         setIsLoading?.(false);
      })
      .catch((e: any) => {
        console.log(e);
         setIsLoading?.(false);
      })

  };


  return (
    <Stack gap="md">
      <DatePickerInput
        label="Date"
        placeholder="Pick date"
        value={date}
        onChange={setDate}
        leftSection={<IconCalendar size={16} />}
        styles={{ input: { borderRadius: 8 } }}
      />

      <Select
        label="Subject"
        placeholder="Select Subject"
        data={subjects.map((sub) => ({
          value: sub.name,   // ✅ id use karo
          label: sub.name   // ✅ name show karo
        }))}
        value={subject}
        onChange={(v) =>
          setSubject(v ?? "")
        }
        rightSection={<IconChevronDown size={14} />}
        styles={{ input: { borderRadius: 8 } }}
        required
      />

      <TextInput
        label="Teacher"
        value={teacherName}
        placeholder="Enter teacher name "
         onChange={(e) => setteacherName(e.currentTarget.value)}
      styles={{ input: { borderRadius: 8 } }}
      required
      />

      <TextInput
        label="Title"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        styles={{ input: { borderRadius: 8 } }}
        required
      />

      <Textarea
        label="Description"
        placeholder="Write description here..."
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        minRows={4}
        styles={{ input: { borderRadius: 8 } }}
        required
      />

      <Group justify="flex-end" mt="sm" gap="sm">
        <Button variant="default" onClick={onCancel} radius="md">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          radius="md"
            loading={isLoading} // 👈 ये add करो
  disabled={isLoading} // optional but best
          style={{ background: "#5c3de8" }}
          leftSection={<IconCheck size={16} />}
        >
          Save Entry
        </Button>
      </Group>
    </Stack>
  );
}

// ─── Mobile Card View ─────────────────────────────────────────────────────────

interface EntryCardProps {
  entry: DiaryEntry;
  onEdit: (entry: DiaryEntry) => void;
  onDelete: (id: string) => void;
}

function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {

  
  return (
    <Card
      withBorder
      radius="lg"
      p="md"
      style={{ borderColor: "#e9ecef", position: "relative" }}
    >
      <Group justify="space-between" align="flex-start">
        <Group gap="sm" align="flex-start">
          <SubjectIcon subject={entry.subject} />
          <Stack gap={2}>
            <Text
              fw={600}
              size="sm"
              style={{ color: "#5c3de8", cursor: "pointer" }}
            >
              {entry.title}
            </Text>
            <Text size="xs" c="dimmed">
              {entry.subject} · {entry.teacher}
            </Text>
          </Stack>
        </Group>

        <Menu shadow="md" width={160} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="sm">
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={() => onEdit(entry)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={14} />}
              color="red"
              onClick={() => onDelete(entry.id)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Text size="sm" mt="sm" c="dimmed" lineClamp={2}>
        {entry.description}
      </Text>

      <Group justify="space-between" mt="sm">
        <Badge
          size="sm"
          variant="light"
          style={{
            background: SUBJECT_COLORS[entry.subject] + "18",
            color: SUBJECT_COLORS[entry.subject],
            border: "none",
          }}
        >
          {new Date(entry.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Badge>
        <Text size="xs" c="dimmed">
          {entry.time}
        </Text>
      </Group>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DiaryPage(props: {
  batchId: string;
  subjects: { _id: string; name: string }[];
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // const [entries, setEntries] = useState<DiaryEntry[]>(INITIAL_ENTRIES);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [teacherFilter, setTeacherFilter] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateValue>(new Date());
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Drawer / Modal state
  const [addDrawerOpen, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [editEntry, setEditEntry] = useState<DiaryEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteModalOpen, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  // Unique teachers
  const allTeachers = Array.from(new Set(entries.map((e) => e.teacher)));

  // Filtering
  const filtered = entries.filter((e) => {
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchSubject = !subjectFilter || e.subject === subjectFilter;
    const matchTeacher = !teacherFilter || e.teacher === teacherFilter;
    // return matchSearch && matchSubject && matchTeacher;
    // filter kiya hai diary purani diary date pe dikhehi
      // ✅ DATE FILTER ADD
  const matchDate =
    !selectedDate ||
    new Date(e.date).toDateString() ===
      new Date(selectedDate as Date).toDateString();

  return matchSearch && matchSubject && matchTeacher && matchDate;

  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);



  const fetchDiary = useCallback(() => {
  if (!props.batchId) return;

  setIsLoading(true);

  GetAllDiary(props.batchId)
    .then((res: any) => {
      console.log("GET DIARY RESPONSE 👉", res);

      const data = res?.diary || []; // ✅ FIXED

      const formatted: DiaryEntry[] = data.map((item: any) => ({
        id: item._id,
        subject: item.subject,
        teacher: item.teacher,
        title: item.title,
        description: item.description,
        date: item.date,
        time: new Date(item.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      console.log("FORMATTED DATA 👉", formatted); // 👈 DEBUG

      setEntries(formatted);
    })
    .catch((err: any) => {
      console.log("GET DIARY ERROR ❌", err);
    })
    .finally(() => {
      setIsLoading(false);
    });
}, [props.batchId]);


useEffect(() => {
  fetchDiary();
}, [props.batchId]);

  // Handlers
  const handleAddSave = useCallback(
    (data: Omit<DiaryEntry, "id">) => {
      const newEntry: DiaryEntry = { ...data, id: Date.now().toString() };
      setEntries((prev) => [newEntry, ...prev]);
      closeAdd();
      notifications.show({
        title: "Entry Added",
        message: `"${data.title}" has been added to the diary.`,
        color: "green",
        icon: <IconCheck size={16} />,
      });
    },
    [closeAdd]
  );

  const handleEditSave = useCallback(
    (data: Omit<DiaryEntry, "id">) => {
      if (!editEntry) return;
      setEntries((prev) =>
        prev.map((e) => (e.id === editEntry.id ? { ...data, id: e.id } : e))
      );
      setEditEntry(null);
      notifications.show({
        title: "Entry Updated",
        message: `"${data.title}" has been updated.`,
        color: "blue",
        icon: <IconCheck size={16} />,
      });
    },
    [editEntry]
  );

 const handleDeleteConfirm = useCallback(() => {
  if (!deleteId) return;
    setIsLoading(true);

  // ✅ API CALL
  DeleteDiary(deleteId)
    .then((res: any) => {
      // ✅ UI update (existing logic)
      setEntries((prev) => prev.filter((e) => e.id !== deleteId));
      closeDelete();

      setDeleteId(null);
      fetchDiary();   // 👈 ADD THIS
   SuccessNotification("Diary Deleted!!");
    })
    .catch((e: any) => {
      console.log(e);
      setIsLoading(false)
    });

}, [deleteId, closeDelete]);

  const requestDelete = (id: string) => {
    setDeleteId(id);
    openDelete();
  };

  const formattedDate = selectedDate
    ? (selectedDate as Date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    : "Select Date";

  return (
    <Box
      style={{
        minHeight: "100vh",
        // background: "#f6f7fb",
        fontFamily: "'DM Sans', sans-serif",
      }}
      p={isMobile ? "sm" : "xl"}
    >
      {/* Header */}
      <Paper
        radius="xl"
        p={isMobile ? "md" : "lg"}
        mb="lg"
        withBorder
        style={{ borderColor: "#e9ecef", background: "#fff" }}
      >
        <Flex
          justify="space-between"
          align={isMobile ? "flex-start" : "center"}
          direction={isMobile ? "column" : "row"}
          gap={isMobile ? "sm" : 0}
        >
          <Stack gap={2}>
            <Group gap="xs">
              <ThemeIcon size={36} radius="xl" style={{ background: "#5c3de822" }}>
                <IconCalendar size={20} color="#5c3de8" />
              </ThemeIcon>
              <Title order={3} style={{ color: "#1a1a2e", fontWeight: 700 }}>
                Diary
              </Title>
            </Group>
            <Text size="sm" c="dimmed" ml={44}>
              View and manage daily diary entries for all subjects.
            </Text>
          </Stack>

          <Group gap="sm" style={{ width: isMobile ? "100%" : "auto" }}>
            {/* Date Picker */}
            <DatePickerInput
              value={selectedDate}
              onChange={setSelectedDate}
              leftSection={<IconCalendar size={16} color="#5c3de8" />}
              rightSection={<IconChevronDown size={14} color="#5c3de8" />}
              styles={{
                input: {
                  borderRadius: 24,
                  border: "1.5px solid #e0d6ff",
                  color: "#5c3de8",
                  fontWeight: 600,
                  paddingRight: 36,
                  background: "#f5f0ff",
                  minWidth: isMobile ? "auto" : 160,
                  cursor: "pointer",
                },
              }}
              valueFormat="DD MMM YYYY"
            />

            <Button
              leftSection={<IconPlus size={16} />}
              radius="xl"
              style={{
                background: "linear-gradient(135deg, #5c3de8, #7b5ef8)",
                flex: isMobile ? 1 : "unset",
              }}
              onClick={openAdd}
            >
              Add Entry
            </Button>
          </Group>
        </Flex>
      </Paper>

      {/* Filters Row */}


      {/* Table / Card View */}
      {isMobile ? (
        /* Mobile: Card Grid */
        <Stack gap="sm">
          {paginated.length === 0 ? (
            <Paper radius="xl" p="xl" withBorder style={{ textAlign: "center" }}>
              <Text c="dimmed">No diary entries found.</Text>
            </Paper>
          ) : (
            paginated.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={setEditEntry}
                onDelete={requestDelete}
              />
            ))
          )}
        </Stack>
      ) : (
        /* Desktop: Table */
        <Paper
          radius="xl"
          withBorder
          style={{ borderColor: "#e9ecef", background: "#fff", overflow: "hidden" }}
        >
          <ScrollArea>
            <Table
              highlightOnHover
              verticalSpacing="md"
              horizontalSpacing="lg"
              style={{ minWidth: 700 }}
            >
              <Table.Thead>
                <Table.Tr style={{ background: "#f5f0ff" }}>
                  {["Subject", "Teacher", "Title", "Description", "Date", "Action"].map(
                    (h) => (
                      <Table.Th
                        key={h}
                        style={{
                          color: "#5c3de8",
                          fontWeight: 600,
                          fontSize: 13,
                          letterSpacing: 0.3,
                          padding: "14px 20px",
                        }}
                      >
                        {h}
                      </Table.Th>
                    )
                  )}
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {paginated.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={6} style={{ textAlign: "center", padding: 40 }}>
                      <Text c="dimmed">No diary entries found.</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  paginated.map((entry) => (
                    <Table.Tr
                      key={entry.id}
                      style={{ borderBottom: "1px solid #f1f3f5" }}
                    >
                      <Table.Td style={{ padding: "12px 20px" }}>
                        <Group gap="sm">
                         {getSubjectIcon(entry.subject)}
                          <Text fw={500} size="sm">
                            {entry.subject}
                          </Text>
                        </Group>
                      </Table.Td>

                      <Table.Td style={{ padding: "12px 20px" }}>
                        <Text size="sm">{entry.teacher}</Text>
                      </Table.Td>

                      <Table.Td style={{ padding: "12px 20px" }}>
                        <Text
                          size="sm"
                          fw={600}
                          style={{ color: "#5c3de8", cursor: "pointer" }}
                        >
                          {entry.title}
                        </Text>
                      </Table.Td>

                      <Table.Td style={{ padding: "12px 20px", maxWidth: 220 }}>
                        <Text size="sm" c="dimmed" lineClamp={2}>
                          {entry.description}
                        </Text>
                      </Table.Td>

                      <Table.Td style={{ padding: "12px 20px" }}>
                        <Stack gap={2}>
                          <Text size="sm" fw={500}>
                            {new Date(entry.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {entry.time}
                          </Text>
                        </Stack>
                      </Table.Td>

                      <Table.Td style={{ padding: "12px 20px" }}>
                        <Menu shadow="md" width={160} position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                              <IconDotsVertical size={18} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEdit size={14} />}
                              onClick={() => setEditEntry(entry)}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              onClick={() => requestDelete(entry.id)}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>
      )}

      {/* Footer: count + pagination */}
      <Flex
        justify="space-between"
        align="center"
        mt="lg"
        direction={isMobile ? "column" : "row"}
        gap="sm"
      >
        <Text size="sm" c="dimmed">
          Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)} to{" "}
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries
        </Text>
        <Pagination
          total={totalPages}
          value={page}
          onChange={setPage}
          radius="xl"
          size="sm"
          styles={{
            control: {
              "&[data-active]": {
                background: "#5c3de8",
                borderColor: "#5c3de8",
              },
            },
          }}
        />
      </Flex>

      {/* ── Add Entry Drawer ── */}
      <Drawer
        opened={addDrawerOpen}
        onClose={closeAdd}
        title={
          <Group gap="xs">
            <ThemeIcon size={28} radius="xl" style={{ background: "#5c3de822" }}>
              <IconCalendar size={14} color="#5c3de8" />
            </ThemeIcon>
            <Text fw={700} size="md" style={{ color: "#1a1a2e" }}>
              Add Diary Entry
            </Text>
          </Group>
        }
        position="right"
        size={isMobile ? "100%" : 420}
        styles={{
          header: { borderBottom: "1px solid #f1f3f5", paddingBottom: 16 },
          body: { paddingTop: 20 },
        }}
      >
        <EntryForm
          onSave={handleAddSave}
          onCancel={closeAdd}
          batchId={props.batchId}
          subjects={props.subjects}
           fetchDiary={fetchDiary}
        />
      </Drawer>

      {/* ── Edit Entry Drawer ── */}
      <Drawer
        opened={!!editEntry}
        onClose={() => setEditEntry(null)}
        title={
          <Group gap="xs">
            <ThemeIcon size={28} radius="xl" style={{ background: "#0984e322" }}>
              <IconEdit size={14} color="#0984e3" />
            </ThemeIcon>
            <Text fw={700} size="md" style={{ color: "#1a1a2e" }}>
              Edit Diary Entry
            </Text>
          </Group>
        }
        position="right"
        size={isMobile ? "100%" : 420}
        styles={{
          header: { borderBottom: "1px solid #f1f3f5", paddingBottom: 16 },
          body: { paddingTop: 20 },
        }}
      >
        {editEntry && (
          <EntryForm
           id={editEntry.id}
            initial={editEntry}
            onSave={handleEditSave}
            onCancel={() => setEditEntry(null)}
            teacher={editEntry.teacher}
            batchId={props.batchId}
            subjects={props.subjects}
              fetchDiary={fetchDiary}

          />
        )}
      </Drawer>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        opened={deleteModalOpen}
        onClose={closeDelete}
        title={
          <Text fw={700} style={{ color: "#c0392b" }}>
            Delete Entry
          </Text>
        }
        centered
        radius="lg"
        size="sm"
      >
        <Stack>
          <Text size="sm" c="dimmed">
            Are you sure you want to delete this diary entry? This action cannot
            be undone.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="default" radius="md" onClick={closeDelete}>
              Cancel
            </Button>
            <Button color="red" loading={isLoading} radius="md" onClick={handleDeleteConfirm} leftSection={<IconTrash size={14} />}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
