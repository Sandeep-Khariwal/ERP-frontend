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
import { IconCalendar, IconEdit, IconGenderBigender, IconHome, IconId, IconPhone, IconPhoneCall, IconRecordMail, IconUser } from "@tabler/icons-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { ChartData, StudentOverView } from "./StudentPage";
import { SuccessNotification } from "@/app/helperFunction/Notification";
import { AddStudentRollNumber } from "@/axios/student/StudentPut";
import { useMediaQuery } from "@mantine/hooks";
import { UserType } from "../dashboard/InstituteBatchesSection";
import { GetVanLiveLocation } from "@/axios/student/StudentGetApi";
import { useAppSelector } from "@/app/redux/redux.hooks";
import VanTracker from "./VanTracker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
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
  data: ChartData;
  options: ChartOptions<"line">;
  userType: UserType;
  refreshStudents: () => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openAddRollNoModal, setOpenAddRollNoModal] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [rollNo, setRollNo] = useState<string>("");
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails
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

  return (
<Stack gap="lg" w={"100%"} >
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
        <VanTracker van={props?.student?.van} instituteId={institute?._id ?? ""} />
      </Modal>

      <LoadingOverlay visible={isLoading} />

      {/* Header Section */}
      <Card withBorder radius="lg" shadow="sm" p="md" style={{  background: "linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)",}}>
        <Group align="center" gap="lg">
          <Avatar
            src={props.student?.profilePic || "/boyStudent.png"}
            size={100}
            radius="xl"
          />
          <Stack gap={2} flex={1}>
            <Text fw={700} fz={24} c="dark">
              Welcome, {props.student?.name}
            </Text>
            <Text c="dimmed" fz="sm">
              {props.student.batchId?.name} | Student Roll: {props.student.uniqueRoll}
            </Text>
          </Stack>
          {institute?.featureAccess?.transportManagement && props.student.van && (
            <Button onClick={() => setMapModal(true)} radius="md" style={{backgroundColor:"#305CDE"}} >
              Check Live Location
            </Button>
          )}
        </Group>
      </Card>

   
    <Grid gutter="lg">
      {/* 🎓 Basic Details */}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card
          withBorder
          radius="lg"
          shadow="sm"
          p="lg"
          style={{
            background: "linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)",
          }}
        >
          <Text fw={700} fz="lg" mb="md" c="indigo">
            Basic Details
          </Text>
          <Stack gap="sm">
            {/* <Group>
              <ThemeIcon variant="light" color="blue" radius="xl">
                <IconId size={18} />
              </ThemeIcon>
              <Text fw={600}>Roll No:</Text>
              <Text>{props.student.uniqueRoll || "N/A"}</Text>
            </Group> */}
            <Group>
              <ThemeIcon variant="light" color="violet" radius="xl">
                <IconUser size={18} />
              </ThemeIcon>
              <Text fw={600}>Name:</Text>
              <Text>{props.student.name??"N/A"}</Text>
            </Group>
            <Group>
              <ThemeIcon variant="light" color="cyan" radius="xl">
                <IconUser size={18} />
              </ThemeIcon>
              <Text fw={600}>Father:</Text>
              <Text>{props.student.parentName??"N/A"}</Text>
            </Group>
            <Group>
              <ThemeIcon variant="light" color="green" radius="xl">
                <IconCalendar size={18} />
              </ThemeIcon>
              <Text fw={600}>DOB:</Text>
              <Text>{props.student.dateOfBirth.split("T")[0]??"N/A"}</Text>
            </Group>
            <Group>
              <ThemeIcon variant="light" color="pink" radius="xl">
                <IconGenderBigender size={18} />
              </ThemeIcon>
              <Text fw={600}>Gender:</Text>
              <Text>{props.student.gender??"N/A"}</Text>
            </Group>
          </Stack>
        </Card>
      </Grid.Col>
                  {/* ☎️ Contact Details */}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card
          withBorder
          radius="lg"
          shadow="sm"
          p="lg"
         style={{
            background: "linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)",
          }}
        >
          <Text fw={700} fz="lg" mb="md" c="indigo">
            Contact Details
          </Text>
          <Stack gap="sm">
            <Group>
              <ThemeIcon variant="light" color="teal" radius="xl">
                <IconPhone size={18} />
              </ThemeIcon>
              <Text fw={600}>Self:</Text>
              <Text>{props.student.phoneNumber[0]??"N/A"}</Text>
            </Group>
            <Group>
              <ThemeIcon variant="light" color="red" radius="xl">
                <IconPhoneCall size={18} />
              </ThemeIcon>
              <Text fw={600}>Father:</Text>
              <Text>{props.student.parentNumber??"N/A"}</Text>
            </Group>
            <Group>
              <ThemeIcon variant="light" color="blue" radius="xl">
                <IconRecordMail size={18} />
              </ThemeIcon>
              <Text fw={600}>Email:</Text>
              <Text>{props.student.email??"N/A"}</Text>
            </Group>
            <Group>
              <ThemeIcon variant="light" color="green" radius="xl">
                <IconHome size={18} />
              </ThemeIcon>
              <Text fw={600}>Address:</Text>
              <Text>{props.student.address??"N/A"}</Text>
            </Group>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>

        {/* Progress Chart */}
        <Flex w={"100%"} >
        <Card withBorder radius="md" shadow="sm" p="md" w={isMd ? "100%" : "50%"}>
          <Text fw={600} fz={18} mb="sm">
            Progress
          </Text>
          <Divider mb="sm" />
          <Stack h={300}>
            {props.data && <Line data={props.data} options={props.options} />}
          </Stack>
        </Card>
      </Flex>

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
