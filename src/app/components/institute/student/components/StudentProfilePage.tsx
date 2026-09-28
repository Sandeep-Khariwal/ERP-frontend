"use client";

import {
  ActionIcon,
  Box,
  Card,
  Grid,
  Group,
  Text,
  Avatar,
  Stack,
  Flex,
  Menu,
  LoadingOverlay,
  ThemeIcon,
} from "@mantine/core";
import { Line } from "react-chartjs-2";
import { Select } from "@mantine/core";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartOptions,
} from "chart.js";
import {
  IconCalendarTime,
  IconCurrencyRupee,
  IconDotsVertical,
  IconGenderBigender,
  IconHome,
  IconPhone,
  IconServer,
  IconUser,
  IconSchool,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { StudentTabs } from "../../InstituteStudents";
import { GetStudentOverview } from "@/axios/student/StudentGetApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

export interface StudentOverview {
  _id: string;
  name: string;
  uniqueRoll: string;
  phoneNumber: string[];
  profilePic: string;
  batchId: {
    _id: string;
    name: string;
  };
  parentName: string;
  parentNumber: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  testReports: {
    name: string;
    subject: { _id: string, name: string };
    marks: number;
  }[];
}

interface Dataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  fill: boolean;
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export default function StudentProfilePage(props: {
  selectedStudentId: string;
  onStudentLoaded?: (student: any) => void;
  onClickAction: (val: StudentTabs) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [student, setStudent] = useState<StudentOverview>({
    _id: "",
    name: "",
    uniqueRoll: "",
    phoneNumber: [],
    profilePic: "/boyStudent.png",
    batchId: {
      _id: "",
      name: "",
    },
    parentName: "",
    parentNumber: "",
    dateOfBirth: "",
    address: "",
    gender: "",
    testReports: [
      { name: "",subject: { _id: "", name: "" }, marks: 0 },
      { name: "", subject: { _id: "", name: "" }, marks: 0 } ,
      { name: "", subject: { _id: "", name: "" }, marks: 0 },
      { name: "", subject: { _id: "", name: "" }, marks: 0 },
      { name: "", subject: { _id: "", name: "" }, marks: 0 },
      { name: "", subject: { _id: "", name: "" }, marks: 0 },
    ],
  });

  const [data, setData] = useState<ChartData | null>(null);
  const [options, setOptions] = useState<ChartOptions<"line"> | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
const [allSubjects, setAllSubjects] = useState<string[]>([]);


useEffect(() => {
  const subjects = Array.from(
    new Set(student.testReports.map((t) => t.subject.name))
  );

  setAllSubjects(subjects);

  if (subjects.length > 0 && !selectedSubject) {
    setSelectedSubject(subjects[0]);
  }
}, [student]);

useEffect(() => {
  if (!selectedSubject) return;

  const filteredReports = student.testReports.filter(
    (t) => t.subject.name === selectedSubject
  );

  const info: ChartData = {
    labels: filteredReports.map((_, i) => `Attempt ${i + 1}`),
    datasets: [
      {
        label: selectedSubject + " Progress",
        data: filteredReports.map((t) => t.marks),
        borderColor: "#ff6384",
        backgroundColor: "rgba(255,99,132,0.2)",
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  if (info.labels.length > 0) {
    setData(info);
    setOptions(options);
  }
}, [student, selectedSubject]);

  useEffect(() => {
    if (props.selectedStudentId) {
      setIsLoading(true);
      GetStudentOverview(props.selectedStudentId)
        .then((x: any) => {
          console.log("studentoverview" , x);
          
          setStudent(x.student);
          props.onStudentLoaded?.(x.student);
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    }
  }, [props.selectedStudentId, props.onStudentLoaded]);

  return (
    <Box w="100%" pos="relative" style={{ minWidth: 0 }}>
      <LoadingOverlay visible={isLoading} />
      <Stack gap="md" p={{ base: "sm", sm: "md" }} style={{ minWidth: 0 }}>
        <Card
          radius={10}
          p={{ base: "sm", sm: "md" }}
          shadow="0 2px 8px rgba(20, 42, 76, 0.06)"
          style={{ background: "linear-gradient(105deg, #e8efff 0%, #f7f9ff 100%)", border: "1px solid #e1e8f4" }}
        >
          <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
            <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: "1 1 260px" }}>
              <Avatar src={student.profilePic || "/boyStudent.png"} size={56} radius="xl" style={{ border: "3px solid #ffffff", flexShrink: 0 }} />
              <Stack gap={2} style={{ minWidth: 0 }}>
                <Text fz={10} fw={700} c="#0755d9">Student profile</Text>
                <Text fz={17} fw={700} c="#172033" style={{ fontFamily: "Poppins", overflowWrap: "anywhere", lineHeight: 1.25 }}>{student.name}</Text>
                <Text fz={11} c="#667085" style={{ overflowWrap: "anywhere" }}>
                  {student.batchId.name} | Student Roll: {student.uniqueRoll}
                </Text>
              </Stack>
            </Group>
            <Menu shadow="md" trigger="click" width={170}>
              <Menu.Target>
                <ActionIcon variant="white" color="blue" radius="md" size={34} aria-label="Student actions">
                  <IconDotsVertical size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconServer size={16} />} onClick={() => props.onClickAction(StudentTabs.OVERVIEW)}>Overview</Menu.Item>
                <Menu.Item leftSection={<IconCurrencyRupee size={16} />} onClick={() => props.onClickAction(StudentTabs.FEES)}>Fee Status</Menu.Item>
                <Menu.Item leftSection={<IconCalendarTime size={16} />} onClick={() => props.onClickAction(StudentTabs.ATTENDANCE)}>Attendance</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Card>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card radius={10} p={{ base: "sm", sm: "md" }} shadow="0 2px 8px rgba(20, 42, 76, 0.06)" withBorder style={{ borderColor: "#e5eaf2", height: "100%" }}>
              <Group justify="space-between" mb="sm">
                <Text fz={13} fw={700} c="#0755d9">Basic details</Text>
                <ThemeIcon variant="light" color="blue" radius="md" size={26}><IconUser size={14} /></ThemeIcon>
              </Group>
              <Stack gap={10}>
                <DetailRow icon={<IconUser size={12} />} label="Name" value={student.name} tone="blue" />
                <DetailRow icon={<IconUser size={12} />} label="Father" value={student.parentName} tone="teal" />
                <DetailRow icon={<IconCalendarTime size={12} />} label="Date of birth" value={student.dateOfBirth.split("T")[0]} tone="blue" />
                <DetailRow icon={<IconGenderBigender size={12} />} label="Gender" value={student.gender} tone="teal" />
                <DetailRow icon={<IconSchool size={12} />} label="Class" value={student.batchId.name} tone="blue" />
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card radius={10} p={{ base: "sm", sm: "md" }} shadow="0 2px 8px rgba(20, 42, 76, 0.06)" withBorder style={{ borderColor: "#e5eaf2", height: "100%" }}>
              <Group justify="space-between" mb="sm">
                <Text fz={13} fw={700} c="#0755d9">Contact details</Text>
                <ThemeIcon variant="light" color="teal" radius="md" size={26}><IconPhone size={14} /></ThemeIcon>
              </Group>
              <Stack gap={10}>
                <DetailRow icon={<IconPhone size={12} />} label="Student" value={student.phoneNumber[0]} tone="teal" />
                <DetailRow icon={<IconPhone size={12} />} label="Guardian" value={student.parentNumber} tone="blue" />
                <DetailRow icon={<IconHome size={12} />} label="Address" value={student.address} tone="teal" />
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        <Card radius={10} p={{ base: "sm", sm: "md" }} shadow="0 2px 8px rgba(20, 42, 76, 0.06)" withBorder style={{ borderColor: "#e5eaf2", minWidth: 0 }}>
          <Flex justify="space-between" align="center" gap="sm" wrap="wrap" mb="sm">
            <Text fz={14} fw={700} c="#172033">{selectedSubject ? `${selectedSubject} Progress` : "Progress"}</Text>
            <Select
              aria-label="Select subject"
              placeholder="Select subject"
              data={allSubjects}
              value={selectedSubject}
              onChange={(value) => setSelectedSubject(value)}
              size="xs"
              w={{ base: "100%", xs: 180 }}
              searchable
              nothingFoundMessage="No subject found"
            />
          </Flex>
          {data && <Box h={{ base: 220, sm: 280 }} style={{ minWidth: 0 }}><Line data={data} options={options!!} /></Box>}
        </Card>
      </Stack>
    </Box>
  );
}

function DetailRow(props: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "blue" | "teal";
}) {
  return (
    <Group gap={8} wrap="nowrap" style={{ minWidth: 0 }}>
      <ThemeIcon variant="light" color={props.tone} radius="xl" size={22} style={{ flexShrink: 0 }}>
        {props.icon}
      </ThemeIcon>
      <Text fz={11} c="#667085" w={92} style={{ flexShrink: 0 }}>{props.label}</Text>
      <Text fz={12} fw={700} c="#172033" style={{ minWidth: 0, overflowWrap: "anywhere" }}>{props.value}</Text>
    </Group>
  );
}
