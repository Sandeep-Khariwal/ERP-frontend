"use client";

import {
  Avatar,
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
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
import VanTracker from "./VanTracker";
import { useAppSelector } from "@/app/redux/redux.hooks";

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
    <Stack>
      <Modal
        opened={mapModal}
        onClose={() => setMapModal(false)}
        closeOnClickOutside
        // fullScreen
        // withCloseButton={false}
        radius={0}
        centered
        transitionProps={{ transition: "fade", duration: 200 }}
        styles={{
          body: { padding: 0 },
          content: { padding: 0, overflow: "hidden" },
        }}
      >
        <VanTracker van={props?.student?.van} />
      </Modal>
      <LoadingOverlay visible={isLoading} />
      <Flex justify={"start"} align="center" gap="md" mt={10}>
        <Avatar
          src={props.student?.profilePic || "/boyStudent.png"}
          size={100}
          radius="xl"
        />
        <Flex direction={"column"} align="start" justify={"start"}>
          <Text fw={600} fz={22} ff={"Roboto"} c={"#2F4F4F"}>
            Welcome, {props.student?.name}
          </Text>
          <Text c="dimmed">
            {props.student.batchId?.name} | Student Roll:{" "}
            {props.student.uniqueRoll}
          </Text>
        </Flex>
        {institute?.featureAccess?.transportManagement && props.student.van && (
          <Button
            onClick={() => {
              setMapModal(true);
            }}
          >
            check Live location
          </Button>
        )}
      </Flex>

      <Flex
        w={"100%"}
        direction={isMd ? "column" : "row"}
        align={"start"}
        justify={"space-between"}
      >
        <Stack w={isMd ? "50%" : "20%"}>
          <Text fw={600} fz={20} ff={"Roboto"} c={"#333"} mt={10}>
            Basic Details
          </Text>
          <Stack
            w={"100%"}
            // style={{ border: "1px solid #BFBFBF", borderRadius: "0.5rem" }}
            p={5}
          >
            <Flex justify={"start"} gap={10} align={"center"}>
              <Text
                fw={600}
                fz={16}
                ff={"Roboto"}
                c={"#333"}
                style={{ whiteSpace: "nowrap" }}
              >
                Roll No :
              </Text>
              <Text fw={500} fz={18} ff={"Poppins"} ta={"center"} c={"#2F4F4F"}>
                {" "}
                {props.student.uniqueRoll
                  ? props.student.uniqueRoll
                  : "N/A"}{" "}
              </Text>
              {UserType.STUDENT !== props.userType && (
                <IconEdit
                  size={20}
                  onClick={() => {
                    setOpenAddRollNoModal(true);
                    setSelectedStudentId(props.student._id);
                  }}
                  style={{ cursor: "pointer", color: "#2F4F4F" }}
                />
              )}
            </Flex>
            <Flex justify={"start"} gap={4} align={"center"}>
              <Text
                fw={600}
                fz={16}
                ff={"Roboto"}
                c={"#333"}
                style={{ whiteSpace: "nowrap" }}
              >
                Name :
              </Text>
              <Text
                fw={500}
                fz={14}
                ff={"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}
                ta={"center"}
                c={"#333"}
                ml={10}
              >
                {props.student.name}{" "}
              </Text>
              {/* <IconEdit style={{ cursor: "pointer",color:"#2F4F4F" }} /> */}
            </Flex>
            <Flex justify={"strat"} gap={10} align={"center"}>
              <Text
                fw={600}
                fz={16}
                ff={"Roboto"}
                c={"#333"}
                style={{ whiteSpace: "nowrap" }}
              >
                Father :{" "}
              </Text>
              <Text
                fw={500}
                fz={14}
                ff={"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}
                ta={"center"}
                c={"#333"}
              >
                {" "}
                {props.student.parentName}{" "}
              </Text>
              {/* <IconEdit style={{ cursor: "pointer",color:"#2F4F4F" }} /> */}
            </Flex>
            <Flex justify={"strat"} gap={10} align={"center"}>
              <Text fw={600} fz={16} ff={"Roboto"} c={"#333"}>
                DOB :{" "}
              </Text>
              <Text
                fw={500}
                fz={14}
                ff={"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}
                ta={"center"}
                c={"#333"}
                ml={8}
              >
                {" "}
                {props.student.dateOfBirth.split("T")[0]}{" "}
              </Text>
              {/* <IconEdit style={{ cursor: "pointer", color:"#2F4F4F" }} /> */}
            </Flex>
            <Flex justify={"strat"} gap={10} align={"center"}>
              <Text fw={600} fz={16} ff={"Roboto"} c={"#333"}>
                Gender :
              </Text>
              <Text
                fw={500}
                fz={14}
                ff={"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}
                ta={"center"}
                c={"#333"}
              >
                {" "}
                {props.student.gender}{" "}
              </Text>
              {/* <IconEdit style={{ cursor: "pointer",color:"#2F4F4F" }} /> */}
            </Flex>
          </Stack>
        </Stack>

        <Stack w={isMd ? "80%" : "20%"}>
          <Text fw={600} fz={18} ff={"Roboto"} c={"#333"} mt={20}>
            Contacts{" "}
          </Text>
          <Stack
            w={"100%"}
            // style={{ border: "1px solid #BFBFBF", borderRadius: "0.5rem" }}
            p={5}
          >
            <Flex justify={"strat"} gap={10} align={"center"}>
              <Text fw={600} fz={16} ff={"Roboto"} c={"#333"}>
                Self :
              </Text>
              <Text
                fw={500}
                fz={14}
                ff={"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}
                ta={"center"}
                c={"#333"}
              >
                {" "}
                {props.student.phoneNumber[0]}{" "}
              </Text>
              <Text></Text>
            </Flex>
            <Flex justify={"strat"} gap={10} align={"center"}>
              <Text fw={600} fz={16} ff={"Roboto"} c={"#333"}>
                Father :
              </Text>
              <Text
                fw={500}
                fz={14}
                ff={"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}
                ta={"center"}
                c={"#333"}
                ml={5}
              >
                {" "}
                {props.student.parentNumber}{" "}
              </Text>
              {/* <IconEdit
                size={20}
                style={{ cursor: "pointer", color: "#2F4F4F" }}
              /> */}
            </Flex>
          </Stack>
        </Stack>

        <Stack w={isMd ? "100%" : "60%"}>
          <Text mt={20} fw={500} fz={18} ff={"Poppins"} c={"#333"}>
            Progress
          </Text>
          <Stack
            w={"100%"}
            h={"60%"}
            style={{ border: "1px solid #BFBFBF", borderRadius: "0.5rem" }}
            p={10}
          >
            {props.data && <Line data={props.data} options={props.options} />}
          </Stack>
        </Stack>
      </Flex>
      <Modal
        opened={openAddRollNoModal}
        onClose={() => setOpenAddRollNoModal(false)}
        title="Add Student Roll No"
      >
        <Text
          ta={"center"}
          mt={20}
          fw={500}
          fz={18}
          ff={"Poppins"}
          c={"#2F4F4F"}
        >
          Add Student Roll No
        </Text>
        <TextInput
          placeholder="Enter Roll no"
          onChange={(e) => setRollNo(e.target.value)}
        />
        <Button mt={10} variant="outline" onClick={addRollNumber}>
          Add
        </Button>
      </Modal>
      <Modal
        opened={openAddRollNoModal}
        onClose={() => setOpenAddRollNoModal(false)}
        title="Add Student Roll No"
        withCloseButton={false}
        radius={0}
        centered
        transitionProps={{ transition: "fade", duration: 200 }}
        styles={{
          body: { padding: 0 },
          content: { padding: 0, overflow: "hidden" },
        }}
      >
        <Text
          ta={"center"}
          mt={20}
          fw={500}
          fz={18}
          ff={"Poppins"}
          c={"#2F4F4F"}
        >
          Add Student Roll No
        </Text>
        <TextInput
          placeholder="Enter Roll no"
          onChange={(e) => setRollNo(e.target.value)}
        />
        <Button mt={10} variant="outline" onClick={addRollNumber}>
          Add
        </Button>
      </Modal>
    </Stack>
  );
};

export default StudentOverview;
