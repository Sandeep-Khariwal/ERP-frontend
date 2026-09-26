"use client";

import {
  Avatar,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCalendar,
  IconEdit,
  IconGenderBigender,
  IconHome,
  IconId,
  IconPhone,
  IconPhoneCall,
  IconRecordMail,
  IconUser,
} from "@tabler/icons-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { Select } from "@mantine/core";
import { Bar } from "react-chartjs-2";
import { BarElement } from "chart.js";
import { ChartData as ChartJSData } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartOptions,
} from "chart.js";
import { ChartData, StudentOverView } from "./StudentPage";
import { SuccessNotification } from "@/app/helperFunction/Notification";
import { AddStudentRollNumber } from "@/axios/student/StudentPut";
import { UserType } from "../dashboard/InstituteBatchesSection";
import { GetVanLiveLocation } from "@/axios/student/StudentGetApi";
import { useAppSelector } from "@/app/redux/redux.hooks";
import VanTracker from "./VanTracker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
);

export interface Device {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  speed: number;
  ignition: number;
  device_time: string;
  odometer: number;
}

const StudentOverview = (props: {
  student: StudentOverView;
  // data: ChartData;
  // options: ChartOptions<"line">;
  userType: UserType;
  testReportMap: Map<string, number[]>;
  testOnlineMap: Map<string, number[]>;
  refreshStudents: () => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openAddRollNoModal, setOpenAddRollNoModal] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [rollNo, setRollNo] = useState<string>("");
  const [showSubjects, setShowSubjects] = useState(false);
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails,
  );
  const [lineOptions, setLineOptions] = useState<ChartOptions<"line"> | null>(
    null,
  );
  const [barOptions, setBarOptions] = useState<ChartOptions<"bar"> | null>(
    null,
  );

  const addRollNumber = () => {
    setIsLoading(true);
    AddStudentRollNumber(selectedStudentId, rollNo)
      .then((x: any) => {
        setIsLoading(false);
        SuccessNotification("Roll No Updated Success!!");
        setOpenAddRollNoModal(false);
        props.refreshStudents();
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };
  const [mapModal, setMapModal] = useState<boolean>(false);
  const [allsubjects, setAllSubjects] = useState<string[]>([]);
  const [quizAllSubjects, setquizAllSubjects] = useState<string[]>([]);
  const [selectedSubjectLine, setSelectedSubjectLine] = useState<string>("");
  const [selectedSubjectBar, setSelectedSubjectBar] = useState<string>("");

  const [lineData, setLineData] = useState<ChartJSData<"line"> | null>(null);
  const [barData, setBarData] = useState<ChartJSData<"bar"> | null>(null);

  useEffect(() => {
    if (selectedSubjectLine) {
      const marksArray = props.testReportMap.get(selectedSubjectLine) ?? [];

      const labels = marksArray.map((_, i) => `Attempt ${i + 1}`);

      setLineData({
        labels,
        datasets: [
          {
            label: "Progress",
            data: marksArray,
            borderColor: "#ff6384",
            backgroundColor: "rgba(255,99,132,0.2)",
            fill: true,
          },
        ],
      });
    }
  }, [selectedSubjectLine]);

  useEffect(() => {
    if (selectedSubjectBar) {
      const marksArray = props.testOnlineMap.get(selectedSubjectBar) ?? [];
      const labels = marksArray.map((_, i) => `Attempt ${i + 1}`);

      setBarData({
        labels,
        datasets: [
          {
            label: "Progress",
            data: marksArray,
            backgroundColor: "#36a2eb",
          },
        ],
      });
    }
  }, [selectedSubjectBar]);

  useEffect(() => {
    for (const x of props.testReportMap.keys()) {
      if (!selectedSubjectLine) {
        setSelectedSubjectLine(x);
      }
      setAllSubjects((prev) => {
        if (prev.includes(x)) {
          return prev;
        }
        return [...prev, x];
      });
    }
  }, [props.testReportMap]);

  useEffect(() => {
    for (const x of props.testOnlineMap.keys()) {
      if (!selectedSubjectBar) {
        setSelectedSubjectBar(x);
      }
      setquizAllSubjects((prev) => {
        if (prev.includes(x)) {
          return prev;
        }
        return [...prev, x];
      });
    }

    const commonOptions = {
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 10,
            callback: function (value: any) {
              return value + " %";
            },
          },
        },
      },
    };

    setLineOptions(commonOptions);
    setBarOptions(commonOptions);

    // if (data.labels.length > 0) {
    //   setData(data);
    // }
  }, [props.testReportMap]);

  return (
    <Stack gap="md" w={"100%"} style={{ minWidth: 0 }}>
      {/* Map Modal */}
      <Modal
        opened={mapModal}
        onClose={() => setMapModal(false)}
        radius="md"
        centered
        size="lg"
        transitionProps={{ transition: "fade", duration: 200 }}
        styles={{ body: { padding: 0 } }}
      >
        <VanTracker
          van={props?.student?.van}
          instituteId={institute?._id ?? ""}
        />
      </Modal>

      <LoadingOverlay visible={isLoading} />

      {/* Header Section */}
      <Card
        radius={10}
        shadow="0 2px 8px rgba(20, 42, 76, 0.06)"
        p={{ base: "sm", sm: "md" }}
        style={{
          background: "linear-gradient(105deg, #e8efff 0%, #f7f9ff 100%)",
          border: "1px solid #e1e8f4",
          minWidth: 0,
        }}
      >
        <Group align="center" gap="sm" wrap="wrap">
          <Avatar
            src={props.student?.profilePic || "/boyStudent.png"}
            size={56}
            radius="xl"
            style={{ border: "3px solid #ffffff", flexShrink: 0 }}
          />
          <Stack gap={2} style={{ minWidth: 0, flex: "1 1 180px" }}>
            <Text
              fw={700}
              fz={11}
              c="#0755d9"
              style={{ fontFamily: "Nunito,Poppins,Greycliff CF, Verdana, sans-serif" }}
            >
              Student profile
            </Text>
            <Text
              fw={700}
              fz={{ base: 16, sm: 18 }}
              c="#172033"
              style={{ fontFamily: "Poppins", overflowWrap: "anywhere", lineHeight: 1.25 }}
            >
              Welcome, {props.student?.name}
            </Text>
            <Text c="#667085" fz={12} style={{ fontFamily: "Nunito,Poppins,Greycliff CF, Verdana, sans-serif", overflowWrap: "anywhere" }}>
              {props.student.batchId?.name} · Student Roll:{" "}
              {props.student.rollNumber}
            </Text>
          </Stack>
          {institute?.featureAccess?.transportManagement &&
            props.student.van && (
              <Button
                onClick={() => setMapModal(true)}
                radius="xl"
                size="sm"
                styles={{
                  root: {
                    backgroundColor: "#0d55dd",
                    fontWeight: 600,
                    fontFamily: "Nunito,Poppins,Greycliff CF, Verdana, sans-serif",
                    boxShadow: "0px 3px 8px rgba(13,85,221,0.18)",
                    flexShrink: 0,
                  },
                }}
              >
                Check Live Location
              </Button>
            )}
        </Group>
      </Card>

      <Grid gutter="md">
        {/* Basic Details */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card
            radius={10}
            shadow="0 2px 8px rgba(20, 42, 76, 0.06)"
            p={{ base: "sm", sm: "md" }}
            style={{ background: "#FFFFFF", border: "1px solid #e5eaf2", minWidth: 0 }}
          >
            <Group justify="space-between" mb="sm">
              <Text fw={700} fz={14} c="#0755d9" style={{ fontFamily: "Poppins" }}>Basic details</Text>
              <ThemeIcon variant="light" color="blue" radius="md" size={26}><IconUser size={14} /></ThemeIcon>
            </Group>
            <Stack gap={10}>
              <Group gap={8} wrap="nowrap"><ThemeIcon variant="light" color="blue" radius="xl" size={22}><IconUser size={12} /></ThemeIcon><Text fz={11} c="#667085" w={78} style={{ flexShrink: 0 }}>Name</Text><Text fz={12} fw={700} c="#172033" style={{ minWidth: 0, overflowWrap: "anywhere" }}>{props.student.name ?? "N/A"}</Text></Group>
              <Group gap={8} wrap="nowrap"><ThemeIcon variant="light" color="teal" radius="xl" size={22}><IconUser size={12} /></ThemeIcon><Text fz={11} c="#667085" w={78} style={{ flexShrink: 0 }}>Guardian</Text><Text fz={12} fw={700} c="#172033" style={{ minWidth: 0, overflowWrap: "anywhere" }}>{props.student.parentName ?? "N/A"}</Text></Group>
              <Group gap={8} wrap="nowrap"><ThemeIcon variant="light" color="blue" radius="xl" size={22}><IconCalendar size={12} /></ThemeIcon><Text fz={11} c="#667085" w={78} style={{ flexShrink: 0 }}>Date of birth</Text><Text fz={12} fw={700} c="#172033" style={{ minWidth: 0, overflowWrap: "anywhere" }}>{props.student.dateOfBirth.split("T")[0] ?? "N/A"}</Text></Group>
              <Group gap={8} wrap="nowrap"><ThemeIcon variant="light" color="teal" radius="xl" size={22}><IconGenderBigender size={12} /></ThemeIcon><Text fz={11} c="#667085" w={78} style={{ flexShrink: 0 }}>Gender</Text><Text fz={12} fw={700} c="#172033" style={{ minWidth: 0, overflowWrap: "anywhere" }}>{props.student.gender ?? "N/A"}</Text></Group>
            </Stack>
          </Card>
        </Grid.Col>
        {/* Contact Details */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card
            radius={10}
            shadow="0 2px 8px rgba(20, 42, 76, 0.06)"
            p={{ base: "sm", sm: "md" }}
            style={{ background: "#FFFFFF", border: "1px solid #e5eaf2", minWidth: 0 }}
          >
            <Group justify="space-between" mb="sm">
              <Text fw={700} fz={14} c="#0755d9" style={{ fontFamily: "Poppins" }}>Contact details</Text>
              <ThemeIcon variant="light" color="teal" radius="md" size={26}><IconPhone size={14} /></ThemeIcon>
            </Group>
            <Stack gap={10}>
              <Group gap={8} wrap="nowrap"><ThemeIcon variant="light" color="teal" radius="xl" size={22}><IconPhone size={12} /></ThemeIcon><Text fz={11} c="#667085" w={78} style={{ flexShrink: 0 }}>Student</Text><Text fz={12} fw={700} c="#172033" style={{ minWidth: 0, overflowWrap: "anywhere" }}>{props.student.phoneNumber[0] ?? "N/A"}</Text></Group>
              <Group gap={8} wrap="nowrap"><ThemeIcon variant="light" color="blue" radius="xl" size={22}><IconPhoneCall size={12} /></ThemeIcon><Text fz={11} c="#667085" w={78} style={{ flexShrink: 0 }}>Guardian</Text><Text fz={12} fw={700} c="#172033" style={{ minWidth: 0, overflowWrap: "anywhere" }}>{props.student.parentNumber ?? "N/A"}</Text></Group>
              <Group gap={8} wrap="nowrap"><ThemeIcon variant="light" color="blue" radius="xl" size={22}><IconRecordMail size={12} /></ThemeIcon><Text fz={11} c="#667085" w={78} style={{ flexShrink: 0 }}>Email</Text><Text fz={12} fw={700} c="#172033" style={{ minWidth: 0, overflowWrap: "anywhere" }}>{props.student.email ?? "N/A"}</Text></Group>
              <Group gap={8} wrap="nowrap"><ThemeIcon variant="light" color="teal" radius="xl" size={22}><IconHome size={12} /></ThemeIcon><Text fz={11} c="#667085" w={78} style={{ flexShrink: 0 }}>Address</Text><Text fz={12} fw={700} c="#172033" style={{ minWidth: 0, overflowWrap: "anywhere" }}>{props.student.address ?? "N/A"}</Text></Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Progress Chart */}
      <Grid gutter="md" w="100%">
        {/* LINE GRAPH */}
        <Grid.Col span={{ base: 12, md: 6 }}>
        <Card radius={10} shadow="0 2px 8px rgba(20, 42, 76, 0.06)" p={{ base: "sm", sm: "md" }} w="100%" style={{ background: "#FFFFFF", border: "1px solid #e5eaf2", minWidth: 0 }}>
          <Text fz={13} fw={500} c="#4B65F6" style={{ fontFamily: "Nunito,Poppins,Greycliff CF, Verdana, sans-serif" }}>
            Off-line class test
          </Text>
          <Flex justify="space-between" align="center" wrap="wrap" gap="sm">
            <Text fw={700} fz={15} mb="sm" c="#172033" style={{ fontFamily: "Poppins" }}>
              {selectedSubjectLine} class test progress
            </Text>

            <Select
              label="Select subject"
              placeholder="Pick subject"
              radius="md"
              data={allsubjects}
              value={selectedSubjectLine}
              onChange={(value) => value && setSelectedSubjectLine(value)}
            />
          </Flex>

          <Divider mb="sm" mt={10} color="#F1F4F9" />

          <Stack h={{ base: 230, sm: 260 }} style={{ minWidth: 0 }}>
            {lineData && lineOptions && (
              <Line data={lineData} options={lineOptions} />
            )}
          </Stack>
        </Card>
        </Grid.Col>

        {/* BAR GRAPH */}
        <Grid.Col span={{ base: 12, md: 6 }}>
        <Card radius={10} shadow="0 2px 8px rgba(20, 42, 76, 0.06)" p={{ base: "sm", sm: "md" }} w="100%" style={{ background: "#FFFFFF", border: "1px solid #e5eaf2", minWidth: 0 }}>
          <Text fz={13} fw={500} c="#4B65F6" style={{ fontFamily: "Nunito,Poppins,Greycliff CF, Verdana, sans-serif" }}>
            Online quiz
          </Text>
          <Flex justify="space-between" align="center" wrap="wrap" gap="sm">
            <Text fw={700} fz={15} mb="sm" c="#172033" style={{ fontFamily: "Poppins" }}>
              {selectedSubjectBar} progress
            </Text>

            <Select
              label="Select subject"
              placeholder="Pick subject"
              radius="md"
              data={quizAllSubjects}
              value={selectedSubjectBar}
              onChange={(value) => value && setSelectedSubjectBar(value)}
            />
          </Flex>

          <Divider mb="sm" mt={10} color="#F1F4F9" />

          <Stack h={{ base: 230, sm: 260 }} style={{ minWidth: 0 }}>
            {barData && barOptions && (
              <Bar data={barData} options={barOptions} />
            )}
          </Stack>
        </Card>
        </Grid.Col>
      </Grid>

      {/* Roll No Modal */}
      <Modal
        opened={openAddRollNoModal}
        onClose={() => setOpenAddRollNoModal(false)}
        title="Add Student Roll No"
        radius="md"
        centered
      >
        <Stack gap="sm">
          <TextInput
            placeholder="Enter Roll no"
            onChange={(e) => setRollNo(e.target.value)}
          />
          <Button variant="filled" onClick={addRollNumber}>
            Add
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default StudentOverview;
