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
import React, { useState } from "react";
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
import { AddStudentRollNumber } from "@/app/api/student/StudentPut";
import { SuccessNotification } from "@/app/helperFunction/Notification";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const StudentOverview = (props: {
  student: StudentOverView;
  data: ChartData;
  options:ChartOptions<'line'>;
  refreshStudents:()=>void
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openAddRollNoModal, setOpenAddRollNoModal] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [rollNo, setRollNo] = useState<string>("");

  const addRollNumber = () => {
    setIsLoading(true);
    AddStudentRollNumber(selectedStudentId, rollNo)
      .then((x: any) => {
        setIsLoading(false);
        SuccessNotification("Roll No Updated Success!!")
        setOpenAddRollNoModal(false)
        props.refreshStudents()
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };
  return (
    <Stack>
      <LoadingOverlay visible={isLoading} />
      <Flex justify={"start"} align="center" gap="md" mt={10}>
        <Avatar
          src={
            props.student?.profilePic ||
            "https://randomuser.me/api/portraits/women/45.jpg"
          }
          size={100}
          radius="xl"
        />
        <Flex direction={"column"} align="start" justify={"start"}>
          <Text fw={600} fz={22} ff={"Roboto"} c={"#2F4F4F"}>
            Welcome, {props.student?.name}
          </Text>
          <Text c="dimmed">
            {props.student.batchId.name} | Student Roll:{" "}
            {props.student.uniqueRoll}
          </Text>
        </Flex>
      </Flex>

      <Flex w={"100%"} align={"start"} justify={"space-between"}>
        <Stack w={"48%"}>
          <Text fw={600} fz={20} ff={"Roboto"} c={"#808080"} mt={20}>
            Basic Details
          </Text>
          <Stack
            w={"100%"}
            style={{ border: "1px solid #BFBFBF", borderRadius: "0.5rem" }}
            p={20}
          >
            <Flex justify={"space-between"} align={"center"} mt={10}>
              <Text fw={600} fz={20} ff={"Roboto"} c={"#808080"}>
                Roll No{" "}
              </Text>
              <Text fw={500} fz={18} ff={"Poppins"} ta={"center"} c={"#2F4F4F"}>
                {" "}
                {props.student.uniqueRoll
                  ? props.student.uniqueRoll
                  : "N/A"}{" "}
              </Text>
              <IconEdit
                onClick={() => {
                  setOpenAddRollNoModal(true);
                  setSelectedStudentId(props.student._id);
                }}
                style={{ cursor: "pointer", color: "#2F4F4F" }}
              />
            </Flex>
            <Flex justify={"space-between"} align={"center"} mt={10}>
              <Text fw={600} fz={20} ff={"Roboto"} c={"#808080"}>
                Name{" "}
              </Text>
              <Text fw={500} fz={18} ff={"Poppins"} ta={"center"} c={"#2F4F4F"}>
                {" "}
                {props.student.name}{" "}
              </Text>
              {/* <IconEdit style={{ cursor: "pointer",color:"#2F4F4F" }} /> */}
            </Flex>
            <Flex justify={"space-between"} align={"center"}>
              <Text fw={600} fz={20} ff={"Roboto"} c={"#808080"}>
                Father :{" "}
              </Text>
              <Text fw={500} fz={18} ff={"Poppins"} ta={"center"} c={"#2F4F4F"}>
                {" "}
                {props.student.parentName}{" "}
              </Text>
              {/* <IconEdit style={{ cursor: "pointer",color:"#2F4F4F" }} /> */}
            </Flex>
            <Flex justify={"space-between"} align={"center"}>
              <Text fw={600} fz={20} ff={"Roboto"} c={"#808080"}>
                DOB :{" "}
              </Text>
              <Text fw={500} fz={18} ff={"Poppins"} ta={"center"} c={"#2F4F4F"}>
                {" "}
                {props.student.dateOfBirth.split("T")[0]}{" "}
              </Text>
              {/* <IconEdit style={{ cursor: "pointer", color:"#2F4F4F" }} /> */}
            </Flex>
            <Flex justify={"space-between"} align={"center"}>
              <Text fw={600} fz={20} ff={"Roboto"} c={"#808080"}>
                Gender{" "}
              </Text>
              <Text fw={500} fz={18} ff={"Poppins"} ta={"center"} c={"#2F4F4F"}>
                {" "}
                {props.student.gender}{" "}
              </Text>
              {/* <IconEdit style={{ cursor: "pointer",color:"#2F4F4F" }} /> */}
            </Flex>
          </Stack>
        </Stack>

        <Stack w={"48%"}>
          <Text fw={600} fz={20} ff={"Roboto"} c={"#808080"} mt={20}>
            Contacts{" "}
          </Text>
          <Stack
            w={"100%"}
            style={{ border: "1px solid #BFBFBF", borderRadius: "0.5rem" }}
            p={20}
          >
            <Flex justify={"space-between"} align={"center"}>
              <Text fw={600} fz={20} ff={"Roboto"} c={"#808080"}>
                Contact{" "}
              </Text>
              <Text fw={500} fz={18} ff={"Poppins"} ta={"center"} c={"#2F4F4F"}>
                {" "}
                {props.student.phoneNumber[0]}{" "}
              </Text>
              <Text></Text>
            </Flex>
            <Flex justify={"space-between"} align={"center"}>
              <Text fw={600} fz={20} ff={"Roboto"} c={"#808080"}>
                Father Contact{" "}
              </Text>
              <Text fw={500} fz={18} ff={"Poppins"} ta={"center"} c={"#2F4F4F"}>
                {" "}
                {props.student.parentNumber}{" "}
              </Text>
              <IconEdit style={{ cursor: "pointer", color: "#2F4F4F" }} />
            </Flex>
          </Stack>
        </Stack>
      </Flex>

      <Text mt={20} fw={500} fz={18} ff={"Poppins"} c={"#2F4F4F"}>
        Progress
      </Text>
      <Stack
        w={"48%"}
        h={"50%"}
        style={{ border: "1px solid #BFBFBF", borderRadius: "0.5rem" }}
        p={10}
      >
        {props.data && <Line data={props.data} options={props.options} />}
      </Stack>
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
        <Button variant="outline" onClick={addRollNumber}>
          Add
        </Button>
      </Modal>
    </Stack>
  );
};

export default StudentOverview;
