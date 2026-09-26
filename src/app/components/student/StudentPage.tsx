"use client";

import { Box, Divider, Flex, LoadingOverlay, Stack, Text, AppShell, Burger, Group, Button } from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { StudentTabs } from "../institute/InstituteStudents";
import FeeRecordSection from "../institute/student/fees/FeeRecord";
import StudentOverview from "./StudentOverview";
import StudentAttendanceView from "./StudentAttendanceView";
import { ChartOptions } from "chart.js";
import { GetStudentOverview } from "@/axios/student/StudentGetApi";
import { UserType } from "../dashboard/InstituteBatchesSection";
import StudentTestView from "./StudentTestView";
import StudentTestCard from "./StudentTestCards";
import StudentMeetingsPage from "./AllMeetings";

export interface StudentOverView {
  _id: string;
  name: string;
  rollNumber: string;
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

export interface StudentPageProps {
  studentId: string;
  initialStudent?: StudentOverView;
  onStudentLoaded?: (student: StudentOverView) => void;
  onClickBack: () => void;
  userType: UserType;
  activeTab?: StudentTabs;
  onLogout?: () => void;
}

const studentTabLabels: Record<string, string> = {
  Overview: "Overview",
  "Fees Records": "Fee Record",
  Attendance: "Attendance",
  TEST: "Test",
  Meetings: "Meeting",
};

const StudentPage = (props: StudentPageProps) => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const tabQuery = searchParams?.get("studentTab") as StudentTabs | null;
  const urlTab = tabQuery && Object.values(StudentTabs).includes(tabQuery) ? tabQuery : null;
  const [activeTabState, setActiveTabState] = useState<StudentTabs>(props.activeTab || StudentTabs.OVERVIEW);

  const activeTab = urlTab || activeTabState;

  const setActiveTab = (val: StudentTabs) => {
    setActiveTabState(val);
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.set("studentTab", val);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const [student, setStudent] = useState<StudentOverView>({
    _id: "",
    name: "",
    rollNumber: "",
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
    resultId: [
      {
        marks: 0,
        name: "",
      },
    ],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [testReportMap, setTestReportMap] = useState<Map<string, number[]>>(
    new Map(),
  );

  const [testOnlineMap, settestOnlineMap] = useState<Map<string, number[]>>(
    new Map(),
  );

  useEffect(() => {
    const newMap = new Map();
    const newMap1 = new Map();

    student.resultId.forEach((result) => {
      if (newMap1.has(result.name)) {
        const arr = newMap1.get(result.name);
        arr.push(result.marks);
      } else {
        newMap1.set(result.name, [result.marks]);
      }
    });
    settestOnlineMap(newMap1);

    student.testReports.forEach((test) => {
      if (newMap.has(test.subject.name)) {
        const arr = newMap.get(test.subject.name);
        arr.push(test.marks);
      } else {
        newMap.set(test.subject.name, [test.marks]);
      }
    });
    setTestReportMap(newMap);
  }, [student]);

  useEffect(() => {
    if (props.studentId) {
      if (props.initialStudent?._id === props.studentId) {
        setStudent(props.initialStudent);
        return;
      }
      getStudents();
    }
  }, [props.studentId, props.initialStudent, props.onStudentLoaded]);

  const getStudents = () => {
    setIsLoading(true);
    GetStudentOverview(props.studentId)
      .then((x: any) => {
        setStudent(x.student);
        props.onStudentLoaded?.(x.student);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const content = (
    <Stack w={"100%"} style={{ minWidth: 0 }}>
      <LoadingOverlay visible={isLoading} />
      <Flex w={"100%"} gap={10} align={"center"} justify={"start"}>
        {props.userType !== UserType.STUDENT ? (
          <>
            {" "}
            <Image
              onClick={() => props.onClickBack()}
              src={"/backArrow.png"}
              alt="profile"
              width={18}
              height={15}
              style={{ cursor: "pointer" }}
            />
            <Text fw={600} fz={18} ff={"Poppins"} ta={"center"} c={"#182230"}>
              Students
            </Text>{" "}
          </>
        ) : (
          <>
            <Text fw={600} fz={22} ff={"Poppins"} ta={"center"} c={"#182230"}>
              Students
            </Text>
          </>
        )}
      </Flex>
      {props.userType !== UserType.STUDENT && (
        <Flex mt={isMd ? 8 : 16} w="100%" gap={isMd ? 4 : 10} style={{ overflowX: "auto", minWidth: 0, borderBottom: "1px solid #e8edf5" }}>
          {Object.values(StudentTabs)
            .filter((item: StudentTabs) => StudentTabs.OTHER !== item)
            .map((item: StudentTabs, i: number) => {
              return (
                <Box key={i} style={{ flex: "0 0 auto" }}>
                  {!(
                    item === StudentTabs.FEES &&
                    UserType.TEACHER === props.userType
                  ) && (
                    <Text
                      key={i}
                      onClick={() => setActiveTab(item)}
                      c={activeTab === item ? "#0755d9" : "#526176"}
                      fw={activeTab === item ? 700 : 600}
                      style={{
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        padding: isMd ? "9px 10px" : "10px 14px",
                        borderBottom: "2px solid",
                        borderColor: activeTab === item ? "#155eef" : "transparent",
                      }}
                      fz={14}
                      ff={"Nunito"}
                      w={"auto"}
                    >
                      {studentTabLabels[item] ?? item}
                    </Text>
                  )}
                </Box>
              );
            })}
        </Flex>
      )}

      <Divider color={"#e8edf5"} />
      {StudentTabs.OVERVIEW === activeTab && (
        <Stack mt={4} w={"100%"} bg={"white"} p={{ base: 4, sm: 10 }} style={{ minWidth: 0 }}>
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
        <Stack mt={4} w={"100%"} bg={"white"} p={{ base: 4, sm: 10 }} style={{ minWidth: 0 }}>
          <FeeRecordSection
            userType={props.userType}
            batchName={student.batchId?.name || ""}
            studentName={student.name}
            studentProfilePic={student.profilePic}
            dateOfJoining={new Date(student.dateOfBirth)}
            batch={student.batchId?._id || ""}
            studentId={student._id}
            onPaymentClick={() => {}}
            onClickBack={props.onClickBack}
            fromBatch={false}
          />
        </Stack>
      )}
      {StudentTabs.ATTENDANCE === activeTab && (
        <Stack mt={4} w={"100%"} bg={"white"} py={10} px={{ base: 4, sm: 10 }} style={{ minWidth: 0 }}>
          <StudentAttendanceView studentId={student._id} />
        </Stack>
      )}
      {StudentTabs.TEST === activeTab && (
        <Stack mt={4} w={"100%"} bg={"white"} py={10} style={{ minWidth: 0 }}>
          <StudentTestCard
            studentId={student._id}
            test={{}}
            batchId={student.batchId._id}
          />
        </Stack>
      )}
       {StudentTabs.MEETNGS === activeTab && (
        <Stack mt={4} w={"100%"} bg={"white"} py={10} px={{ base: 4, sm: 10 }} style={{ minWidth: 0 }}>
          <StudentMeetingsPage studentId={student._id}  batchId={student.batchId._id} student={student.name} />
        </Stack>
      )}
    </Stack>
  );

  const [opened, { toggle }] = useDisclosure();
  
  if (props.userType === UserType.STUDENT) {
    return (
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 250,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
        bg={"transparent"}
      >
        <AppShell.Header style={{ display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between' }}>
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={700} fz="1.2rem">Student Dashboard - {student.name}</Text>
          </Group>
          {props.onLogout && (
            <Button color="red" variant="light" onClick={props.onLogout}>
              Logout
            </Button>
          )}
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Stack>
            {Object.values(StudentTabs)
              .filter((item: StudentTabs) => StudentTabs.OTHER !== item)
              .map((item: StudentTabs, i: number) => (
                <Text
                  key={i}
                  onClick={() => { setActiveTab(item); toggle(); }}
                  c={activeTab === item ? "#4B65F6" : "#2F4F4F"}
                  fw={600}
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    borderRadius: "8px",
                    background: activeTab === item ? "#E8EDFF" : "transparent"
                  }}
                  fz={16}
                >
                  {studentTabLabels[item] ?? item}
                </Text>
              ))}
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main>
           {content}
        </AppShell.Main>
      </AppShell>
    );
  }

  return content;
};

export default StudentPage;
