"use client";

import { Divider, Flex, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { StudentTabs } from "../institute/InstituteStudents";
import FeeRecordSection from "../institute/student/fees/FeeRecord";
import { GetStudentOverview } from "@/api/student/StudentGetApi";
import StudentOverview from "./StudentOverview";
import StudentAttendanceView from "./StudentAttendanceView";
import { ChartOptions } from "chart.js";

export interface StudentOverView {
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
    subject: { _id: string; name: string };
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

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

const StudentPage = (props: {
  onClickBack: () => void;
  activeTab: StudentTabs;
  studentId: string;
}) => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [activeTab, setActiveTab] = useState<StudentTabs>(props.activeTab);

  const [student, setStudent] = useState<StudentOverView>({
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
      { name: "", subject: { _id: "", name: "" }, marks: 0 },
      { name: "", subject: { _id: "", name: "" }, marks: 0 },
      { name: "", subject: { _id: "", name: "" }, marks: 0 },
      { name: "", subject: { _id: "", name: "" }, marks: 0 },
      { name: "", subject: { _id: "", name: "" }, marks: 0 },
      {
        name: "",
        marks: 0,
        subject: { _id: "", name: "" },
      },
    ],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const labels = student.testReports.map((t) => t.subject.name);

    const data: ChartData = {
      labels: labels,
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

    if (data.labels.length > 0) {
      setData(data);
      setOptions(options);
    }
  }, [student]);
  useEffect(() => {
    if (props.studentId) {
      getStudents();
    }
  }, [props.studentId]);

  const getStudents = () => {
    setIsLoading(true);
    GetStudentOverview(props.studentId)
      .then((x: any) => {
        setStudent(x.student);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const [data, setData] = useState<ChartData | null>(null);
  const [options, setOptions] = useState<ChartOptions<"line"> | null>(null);
  return (
    <Stack w={"100%"}>
      <LoadingOverlay visible={isLoading} />
      <Flex w={"100%"} gap={10} align={"center"} justify={"start"}>
        <Image
          onClick={() => props.onClickBack()}
          src={"/backArrow.png"}
          alt="profile"
          width={18}
          height={15}
          style={{ cursor: "pointer" }}
        />
        <Text fw={500} fz={18} ff={"Poppins"} ta={"center"} c={"#2F4F4F"}>
          Students
        </Text>
      </Flex>
      <Flex mt={isMd ? 10 : 20}>
        {Object.values(StudentTabs)
          .filter((item: StudentTabs) => StudentTabs.OTHER !== item)
          .map((item: StudentTabs, i: number) => {
            return (
              <Text
                key={i}
                onClick={() => setActiveTab(item)}
                mx={isMd ? 14 : 30}
                c={activeTab === item ? "#1B1212" : "#2F4F4F"}
                fw={600}
                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                fz={16}
                ff={"Roboto"}
                w={"auto"}
              >
                {item}
                {activeTab === item && <hr color="#4B65F6" />}
              </Text>
            );
          })}
      </Flex>

      <Divider c={"gray"} />
      {StudentTabs.OVERVIEW === activeTab && (
        <Stack mt={10} w={"100%"} bg={"white"} p={10}>
          <StudentOverview
            student={student}
            data={data!!}
            options={options!!}
            refreshStudents={() => getStudents()}
          />
        </Stack>
      )}
      {StudentTabs.FEES === activeTab && (
        <Stack mt={10} w={"100%"} bg={"white"} p={10}>
          <FeeRecordSection
            userType={"teacher"}
            batchName={student.batchId.name}
            dateOfJoining={new Date(student.dateOfBirth)}
            batch={student.batchId._id}
            studentId={student._id}
            onPaymentClick={() => {}}
            onClickBack={props.onClickBack}
            fromBatch={false}
          />
        </Stack>
      )}
      {StudentTabs.ATTENDANCE === activeTab && (
        <Stack mt={10} w={"100%"} bg={"white"} py={10} px={4}>
          <StudentAttendanceView studentId={student._id} />
        </Stack>
      )}
    </Stack>
  );
};

export default StudentPage;
