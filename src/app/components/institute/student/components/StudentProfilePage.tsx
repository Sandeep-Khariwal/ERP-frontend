"use client";

import {
  Card,
  Text,
  Avatar,
  Divider,
  Stack,
  Title,
  Flex,
  Menu,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { Line } from "react-chartjs-2";
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
  IconServer,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { GetStudentOverview } from "@/api/student/StudentGetApi";
import { StudentTabs } from "../../InstituteStudents";

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
  onClickAction: (val: StudentTabs) => void;
}) {
  // const isMd = useMediaQuery(`(max-width: 968px)`);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [student, setStudent] = useState<StudentOverview>({
    _id: "",
    name: "",
    uniqueRoll: "",
    phoneNumber: [],
    profilePic: "https://randomuser.me/api/portraits/women/45.jpg",
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

  useEffect(() => {
    const info: ChartData = {
      labels: student.testReports.map((t) => t.subject.name),
      datasets: [
        {
          label: "Progress",
          data: student.testReports.map((t) => t.marks),
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
            maxTicksLimit: 100,
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
  }, [student]);

  useEffect(() => {
    if (props.selectedStudentId) {
      setIsLoading(true);
      GetStudentOverview(props.selectedStudentId)
        .then((x: any) => {
          setStudent(x.student);
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    }
  }, [props.selectedStudentId]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <LoadingOverlay visible={isLoading} />
      <Flex direction="column" align="center" gap="md">
        <Avatar
          src={
            student?.profilePic ||
            "https://randomuser.me/api/portraits/women/45.jpg"
          }
          size={80}
          radius="xl"
        />
        <Stack align="center">
          <Title order={3}>{student?.name}</Title>
          <Text c="dimmed">
            {student.batchId.name} | Student Roll: {student.uniqueRoll}
          </Text>
        </Stack>
      </Flex>
      <Divider my="lg" />
      <Stack
        w={"100%"}
        style={{ border: "1px solid #BFBFBF", borderRadius: "0.5rem" }}
        p={10}
      >
        <Flex w={"100%"} align={"center"} justify={"space-between"}>
          <Text>Basic details</Text>
          <Menu shadow="md" trigger="hover" width={150}>
            <Menu.Target>
              <IconDotsVertical style={{ cursor: "pointer" }} />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconServer />}
                onClick={() => props.onClickAction(StudentTabs.OVERVIEW)}
              >
                Overview
              </Menu.Item>
              <Menu.Item
                leftSection={<IconCurrencyRupee />}
                onClick={() => props.onClickAction(StudentTabs.FEES)}
              >
                Fee Status
              </Menu.Item>
              <Menu.Item
                leftSection={<IconCalendarTime />}
                onClick={() => props.onClickAction(StudentTabs.ATTENDANCE)}
              >
                Attendance
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
        <Flex w={"100%"} align={"center"} justify={"space-between"} mt={10}>
          <Stack w={"30%"}>
            <Text
              lh={0}
              fz={16}
              fw={600}
              c={"#BFBFBF"}
              style={{ fontFamily: "sans-serif" }}
            >
              Gender
            </Text>
            <Text
              lh={0.5}
              fz={14}
              c={"#4F4F4F"}
              style={{ fontFamily: "sans-serif" }}
            >
              {student.gender}
            </Text>
          </Stack>

          <Stack w={"30%"}>
            <Text
              lh={0}
              fz={16}
              fw={600}
              c={"#BFBFBF"}
              style={{ fontFamily: "sans-serif" }}
            >
              Date of Birth
            </Text>
            <Text
              lh={0.5}
              fz={14}
              c={"#4F4F4F"}
              style={{ fontFamily: "sans-serif" }}
            >
              {student.dateOfBirth.split("T")[0]}
            </Text>
          </Stack>

          <Stack w={"30%"}>
            <Text
              lh={0}
              fz={16}
              fw={600}
              c={"#BFBFBF"}
              style={{ fontFamily: "sans-serif" }}
            >
              Number
            </Text>
            <Text
              lh={0.5}
              fz={14}
              c={"#4F4F4F"}
              style={{ fontFamily: "sans-serif" }}
            >
              {student.phoneNumber[0]}
            </Text>
          </Stack>
        </Flex>
        <Flex w={"100%"} align={"center"} justify={"start"} mt={20} gap={20}>
          <Stack w={"30%"}>
            <Text
              lh={0}
              fz={16}
              fw={600}
              c={"#BFBFBF"}
              style={{ fontFamily: "sans-serif" }}
            >
              Address
            </Text>
            <Text fz={14} c={"#4F4F4F"} style={{ fontFamily: "sans-serif" }}>
              {student.address}
            </Text>
          </Stack>

          <Stack w={"30%"}>
            <Text
              lh={0}
              fz={16}
              fw={600}
              c={"#BFBFBF"}
              style={{ fontFamily: "sans-serif" }}
            >
              Father
            </Text>
            <Text
              lh={0.5}
              fz={14}
              c={"#4F4F4F"}
              style={{ fontFamily: "sans-serif" }}
            >
              {student.parentName}
            </Text>
            <Text
              lh={0.5}
              fz={14}
              c={"#4F4F4F"}
              style={{ fontFamily: "sans-serif" }}
            >
              ({student.parentNumber})
            </Text>
          </Stack>
        </Flex>
      </Stack>
      <Stack
        w={"100%"}
        h={"100%"}
        style={{ border: "1px solid #BFBFBF", borderRadius: "0.5rem" }}
        p={10}
        mt={20}
      >
        <Title order={4}>Progress</Title>
        {data && <Line data={data} options={options!!} />}
      </Stack>
    </Card>
  );
}
