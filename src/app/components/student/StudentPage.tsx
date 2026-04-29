"use client";

import { Box, Divider, Flex, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { StudentTabs } from "../institute/InstituteStudents";
import FeeRecordSection from "../institute/student/fees/FeeRecord";
import StudentOverview from "./StudentOverview";
import StudentAttendanceView from "./StudentAttendanceView";
import { ChartOptions } from "chart.js";
import { GetStudentOverview } from "@/axios/student/StudentGetApi";
import { UserType } from "../dashboard/InstituteBatchesSection";
import StudentTestView from "./StudentTestView";
import StudentTestCard from "./StudentTestCards";

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
  email?: string;
  van: string;
  testReports: {
    name: string;
    subject: { _id: string; name: string };
    marks: number;
  }[];
  resultId: {
    marks: number;
    name: string;
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
  userType: UserType;
}) => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [activeTab, setActiveTab] = useState<StudentTabs>(props.activeTab);

  const [student, setStudent] = useState<StudentOverView>({
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
    van: "",
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
    resultId: [{
      marks: 0,
      name: ""
    }]
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [testReportMap, setTestReportMap] = useState<Map<string, number[]>>(new Map())

  const [testOnlineMap, settestOnlineMap] = useState<Map<string, number[]>>(new Map())

  useEffect(() => {
    const newMap = new Map()
    const newMap1 = new Map()

    student.resultId.forEach((result) => {

      if (newMap1.has(result.name)) {
        const arr = newMap1.get(result.name)
        arr.push(result.marks)
      } else {
        newMap1.set(result.name, [result.marks])
      }
    })
    settestOnlineMap(newMap1)

    student.testReports.forEach((test) => {

      if (newMap.has(test.subject.name)) {
        const arr = newMap.get(test.subject.name)
        arr.push(test.marks)
      } else {
        newMap.set(test.subject.name, [test.marks])
      }
    })
    setTestReportMap(newMap)
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

  return (
    <Stack w={"100%"}>
      <LoadingOverlay visible={isLoading} />
      <Flex w={"100%"} gap={10} align={"center"} justify={"start"}>
        {
          props.userType !== UserType.STUDENT ?

            (<> <Image
              onClick={() => props.onClickBack()}
              src={"/backArrow.png"}
              alt="profile"
              width={18}
              height={15}
              style={{ cursor: "pointer" }}
            />
              <Text fw={500} fz={18} ff={"Poppins"} ta={"center"} c={"#2F4F4F"}>
                Students
              </Text> </>) :
            (<>
              <Text fw={500} fz={24} ff={"Poppins"} ta={"center"} c={"#2F4F4F"}>
                Students
              </Text>
            </>)
        }
      </Flex>
      <Flex mt={isMd ? 10 : 20}>
        {Object.values(StudentTabs)
          .filter((item: StudentTabs) => StudentTabs.OTHER !== item)
          .map((item: StudentTabs, i: number) => {
            return (
              <Box key={i} >
                {
                  !(item === StudentTabs.FEES && UserType.TEACHER === props.userType) &&

                  <Text
                    key={i}
                    onClick={() => setActiveTab(item)}
                    mx={isMd ? 14 : 30}
                    c={activeTab === item ? "#1B1212" : "#2F4F4F"}
                    fw={600}
                    style={{
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      border: "none",
                      borderBottom: "2px solid",
                      borderColor: activeTab === item ? "#4B65F6" : "white",
                    }}
                    fz={16}
                    ff={"Roboto"}
                    w={"auto"}
                  >
                    {item}
                    {/* {activeTab === item && <><hr color="#4B65F6" /></>} */}
                  </Text>
                }
              </Box>);
          })}
      </Flex>

      <Divider c={"gray"} />
      {StudentTabs.OVERVIEW === activeTab && (
        <Stack mt={10} w={"100%"} bg={"white"} p={10}>
          <StudentOverview
            student={student}

            testReportMap={testReportMap}
            testOnlineMap={testOnlineMap}
            refreshStudents={() => getStudents()}
            userType={props.userType}
          />
        </Stack>
      )}
      {StudentTabs.FEES === activeTab && (
        <Stack mt={10} w={"100%"} bg={"white"} p={10}>
          <FeeRecordSection
            userType={props.userType}
            batchName={student.batchId?.name || ""}
            dateOfJoining={new Date(student.dateOfBirth)}
            batch={student.batchId?._id || ""}
            studentId={student._id}
            studentName={student.name}      
            parentName={student.parentName}
            onPaymentClick={() => { }}
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
      {StudentTabs.TEST === activeTab && (
        <Stack mt={10} w={"100vw"} bg={"white"} py={10}>
          <StudentTestCard
            studentId={student._id}
            test={{}}
            batchId={student.batchId._id}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default StudentPage;
