"use client";

import {
  Container,
  Title,
  Button,
  Group,
  Select,
  Tabs,
  Paper,
  Text,
  Stack,
  Badge,
  LoadingOverlay,
  ThemeIcon,
} from "@mantine/core";
import { IconPlus, IconCalendar, IconHistory, IconUserOff } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Batch, Subject, Teacher, Timetable } from "./timetable.types";
import { TimetableGrid } from "./TimetableGrid";
import { ClassManagementHistory } from "./ClassManagementHistory";
import { CreateTimetableModal } from "./CreateTimetableModal";
import { ManageClassModal } from "./ManageClassModal";
import { DeleteTimetable, GetBatchGrid } from "@/axios/timetable/timetable.api";
import { GetAllClassManagement } from "@/axios/timetable/classManagement.api";
import { TeacherData } from "@/interfaces/batchInterface";
import { GetAllTeachersFromBatch } from "@/axios/institute/InstituteGetApi";


// Mock API endpoints loaders
async function fetchBatches(): Promise<Batch[]> {
  return [
    { _id: "batch1", name: "Class 10-A" },
    { _id: "batch2", name: "Class 10-B" },
  ];
}

async function fetchSubjects(): Promise<Subject[]> {
  return [
    { _id: "sub1", name: "Mathematics" },
    { _id: "sub2", name: "Science" },
    { _id: "sub3", name: "English" },
  ];
}

async function fetchTeachers(): Promise<Teacher[]> {
  return [
    { _id: "t1", name: "Rahul Sharma", isActive: true },
    { _id: "t2", name: "Amit Kumar", isActive: true },
    { _id: "t3", name: "Priya Singh", isActive: true },
  ];
}

const ADMIN_ID = "admin001";

export default function TimetablePage(props: {
    batchId: string;
      subjects?: { _id: string; name: string }[];
       teacherData: TeacherData;
         teachers?: TeacherData[];
           batchName: string;
}) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [managedIds, setManagedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [manageTarget, setManageTarget] = useState<Timetable | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("grid");

  // Load baseline reference records
// useEffect(() => {
//   Promise.all([
//     fetchBatches(),
//     fetchSubjects(),
//     fetchTeachers(),
//   ])
//     .then(([b, s, t]) => {
//       console.log("INITIAL DATA RESPONSE 👉", { b, s, t });

//       setBatches(b);
//       setSubjects(s);
//       setTeachers(t);

//       if (b.length) {
//         setSelectedBatchId(b[0]._id);
//       }
//     })
//     .catch((err) => {
//       console.log("INITIAL DATA ERROR ❌", err);
//     });
// }, []);

useEffect(() => {
  const batchData: Batch[] = [
    {
      _id: props.batchId,
      name: props.batchName,
    },
  ];

  const subjectData: Subject[] =
    props.subjects?.map((s) => ({
      _id: s._id,
      name: s.name,
    })) || [];

  const teacherList: Teacher[] =
    props.teachers?.map((t) => ({
      _id: t._id,
      name: t.name,
      isActive: true,
    })) || [];

  setBatches(batchData);
  setSubjects(subjectData);
  setTeachers(teacherList);
  setSelectedBatchId(props.batchId);

  console.log("PROPS DATA 👉", {
    batchData,
    subjectData,
    teacherList,
  });
}, [props.batchId, props.batchName, props.subjects, props.teachers]);
  // Sync dataset updates when targeted pipeline changes

  useEffect(() => {
  if (!props.batchId) return;

  GetAllTeachersFromBatch(props.batchId)
    .then((res: any) => {
      console.log("GET TEACHERS SUCCESS 👉", res);

      const teacherList: Teacher[] =
        res?.teachers?.map((t: any) => ({
          _id: t._id,
          name: t.name,
          isActive: true,
        })) || [];

      setTeachers(teacherList);
    })
    .catch((err: any) => {
      console.log("GET TEACHERS ERROR ❌", err);
    });
}, [props.batchId]);

  useEffect(() => {
    if (!selectedBatchId) return;
    loadTimetable();
    loadTodayManaged();
  }, [selectedBatchId]);

  const loadTimetable = () => {
  if (!selectedBatchId) return;

  setLoading(true);

  GetBatchGrid(selectedBatchId)
    .then((res: any) => {
      console.log("GET TIMETABLE RESPONSE 👉", res);

      const data = res?.data || [];

      const enriched = data.map((t: any) => ({
        ...t,
        batchName: batches.find((b) => b._id === t.batchId)?.name,
        subjectName: subjects.find((s) => s._id === t.subjectId)?.name,
        teacherName: teachers.find((te) => te._id === t.teacherId)?.name,
      }));

      setTimetables(enriched);
    })
    .catch((err: any) => {
      console.log("GET TIMETABLE ERROR ❌", err);
    })
    .finally(() => {
      setLoading(false);
    });
};

const loadTodayManaged = () => {
  if (!selectedBatchId) return;

  const today = new Date().toISOString().slice(0, 10);

  GetAllClassManagement({
    batchId: selectedBatchId,
    startDate: today,
    endDate: today,
  })
    .then((res: any) => {
      console.log("GET MANAGEMENT RESPONSE 👉", res);

      const records = res?.data || [];

      setManagedIds(
        new Set(
          records
            .filter((r: any) => r.status !== "Cancelled")
            .map((r: any) => r.timetableId)
        )
      );
    })
    .catch((err: any) => {
      console.log("GET MANAGEMENT ERROR ❌", err);
    });
};
const handleDelete = (item: Timetable) => {
  if (!confirm(`Delete timetable slot for ${item.subjectName}?`)) return;

  DeleteTimetable(item._id)
    .then(() => {
      console.log("DELETE TIMETABLE SUCCESS ✅");

      loadTimetable();
    })
    .catch((err: any) => {
      console.log("DELETE TIMETABLE ERROR ❌", err);
    });
};

  return (
    <Container size="xl" py="xl" >
  
      {/* Header Panel */}
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={4}>
          <Title order={1} fw={800} lts="-0.5px">
            Timetable Management
          </Title>
          <Text c="dimmed" size="sm">
            Configure weekly operational hours schedules and active teacher deployments.
          </Text>
        </Stack>
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={() => setCreateOpen(true)}
          size="md"
          radius="md"
          className="gradient-btn"
          style={{ boxShadow: "var(--mantine-shadow-md)" }}
        >
          Add New Slot
        </Button>
      </Group>

      {/* Control Actions & Filtering */}
      <Paper p="md" withBorder mb="xl" radius="lg" shadow="sm">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Text size="sm" fw={600} c="dimmed">
              Selected Target Class:
            </Text>
            <Select
              placeholder="Pick target collection"
              data={batches.map((b) => ({ value: b._id, label: b.name }))}
              value={selectedBatchId}
              onChange={setSelectedBatchId}
              style={{ minWidth: 220 }}
              size="sm"
              radius="md"
              comboboxProps={{ transitionProps: { transition: "pop-top-left", duration: 200 } }}
            />
          </Group>
          {managedIds.size > 0 && (
            <Badge 
              color="orange" 
              variant="light" 
              size="lg" 
              radius="md"
              leftSection={<IconUserOff size={14} />}
              p="md"
            >
              {managedIds.size} Sessions Overridden Today
            </Badge>
          )}
        </Group>
      </Paper>

      {/* Tab Management Views */}
      <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
        <Tabs.List mb="lg">
          <Tabs.Tab value="grid" leftSection={<IconCalendar size={16} />} py="xs">
            Weekly Schedule Matrix
          </Tabs.Tab>
          <Tabs.Tab value="history" leftSection={<IconHistory size={16} />} py="xs">
            Exception & Change Log
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="grid">
          <Paper withBorder radius="lg" p="lg" shadow="xs" style={{ position: "relative", minHeight: "300px" }}>
            <LoadingOverlay visible={loading} overlayProps={{ blur: 2, opacity: 0.6 }} />
            
            {timetables.length === 0 && !loading ? (
              <Stack align="center" justify="center" py="xl" gap="md">
                <ThemeIcon size={64} radius="xl" variant="light" color="gray">
                  <IconCalendar size={36} stroke={1.5} />
                </ThemeIcon>
                <Stack gap={2} align="center">
                  <Text fw={600} size="lg">No Schedules Configured</Text>
                  <Text c="dimmed" size="sm" ta="center"  style={{ maxWidth: 360 }}>
                    There are no operational slots setup for this batch yet. Get started by establishing the first slot.
                  </Text>
                </Stack>
                <Button
                  variant="light"
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setCreateOpen(true)}
                  mt="xs"
                  radius="md"
                >
                  Create Anchor Allocation
                </Button>
              </Stack>
            ) : (
              <TimetableGrid
                timetables={timetables}
                managedTimetableIds={managedIds}
                onDelete={handleDelete}
                onManage={(slot) => setManageTarget(slot)}
                isAdmin
              />
            )}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="history">
          <Paper withBorder radius="lg" p="lg" shadow="xs">
            <ClassManagementHistory batchId={selectedBatchId ?? undefined} />
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Overlays / Action Modals */}
      <CreateTimetableModal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => { loadTimetable(); }}
        batches={batches}
        subjects={subjects}
        teachers={teachers}
      />

      <ManageClassModal
        opened={!!manageTarget}
        onClose={() => setManageTarget(null)}
        onSuccess={() => { loadTimetable(); loadTodayManaged(); }}
        timetable={manageTarget}
        teachers={teachers}
        adminId={ADMIN_ID}
      />
    </Container>
  );
}