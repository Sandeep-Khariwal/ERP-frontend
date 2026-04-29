"use client";

import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { useState } from "react";
import { AddNewStudentModal } from "../AddNewStudentModal";
import { AddMoreDetails } from "../student/addMoreDetails/AddMoreDetails";
import { StudentData } from "@/interfaces/batchInterface";
import StudentSection from "./StudentSection";
import FeeRecordSection from "../student/fees/FeeRecord";
import OverView from "./OverView";
import { TakeAttendanceView } from "./TakeAttendanceView";
import { StudentsDataWithBatch } from "@/interface/student.interface";
import {
  SuccessNotification,
  ErrorNotification,
} from "@/app/helperFunction/Notification";
import StudentPage from "../../student/StudentPage";
import { StudentTabs } from "../InstituteStudents";
import TeachersSection from "./TeacherSection";
import AddMarksModal from "./AddMarksModal";
import { UserType } from "../../dashboard/InstituteBatchesSection";
import { CreateStudent } from "@/axios/institute/InstitutePostApi";
import TeacherProfile from "../teacher/TeacherProfile";
import Tests from "./test/Tests";
import Marksheet from "./Marksheet";
import UploadExcelAdmission from "../student/addMoreDetails/UploadExcelAdmission";

enum Tabs {
  OVERVIEW = "Overview",
  STUDENT = "Students",
  TEACHER = "Teachers",
  MARKSHEET = "Marksheet",
  TEST = "Tests",
  STUDY_MATERIAL = "Study Material",
  ASSIGNMENT = "Assignment",
}

export enum Screen {
  VIEWPROFILE = "view profile",
  ADDMORESCREEN = "add details",
  VIEWFEEDETAILS = "fee details",
  NONE = "",
}

export interface Option {
  _id: string;
  name: string;
  answer: boolean;
}

export interface Question {
  _id: string;
  question: string;
  options: Option[];
  correctAns: string;
  explanation?: string;
  isDeleted: boolean;
  attempt: any[];
  testId: string;
  __v: number;
}

export interface Test {
  _id: string;
  batchId: string;
  maxMarks: number;
  name?: string;
  testName?: string;
  subjectId: string;
  testTime?: number;
  totalTime: number;
  questions: Question[];
  resultId: {
    id: string;
    studentId: { _id: string; name: string };
    _id: string;
  }[];
  isDeleted: boolean;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
}

export function InstituteInsideBatch(props: {
  batchId: string;
  batchName: string;
  instituteId: string;
  onClickBack: () => void;
  fromInstituteTeacherSection: boolean;
  subjects?: { _id: string; name: string }[];
  userType: UserType;
}) {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [selectedTeacherId, setSelectTeacherId] = useState<string>("");
  const [openAddStudentModal, setOpenAddStudentModal] =
    useState<boolean>(false);
  const [takeAttendance, setTakeAttandance] = useState<boolean>(false);
  const [openAddMarksModal, setOpenAddMarksModal] = useState<boolean>(false);
  const [openFileAdmissionModal, setOpenFileAdmissionModal] =
    useState<boolean>(false);

  const [showSelectedScreen, setShowSelectedScreen] = useState<Screen>(
    Screen.NONE,
  );
  const [editStudentDetails, setEditStudentDetails] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(Tabs.OVERVIEW);

  const [studentData, setStudentData] = useState<StudentData>({
    name: "",
    parentName: "",
    dateOfBirth: new Date(),
    address: "",
    van: "",
    phoneNumber: [],
    additionalPhoneNumbers: [],
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [students, setStudents] = useState<StudentsDataWithBatch[]>([]);
  const [studentsTable, setStudentsTable] = useState<
    {
      _id: string;
      name: string;
      phoneNumber: string;
      parentName: string;
      feeStatus: string;
    }[]
  >([]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />

      {/* 🔹 Top Bar with Batch Name */}
      <Stack
        w={isMd ? "95%" : props.fromInstituteTeacherSection ? "99%" : "90%"}
        mt={20}
        mx={"auto"}
        mih={"100vh"}
      >
        <Flex w={"100%"} align={"center"} justify={"start"} gap={10}>
          <Image
            onClick={() => props.onClickBack()}
            src={"/backArrow.png"}
            alt="profile"
            width={18}
            height={15}
            style={{ cursor: "pointer" }}
          />
          <Text fz={22} ff={"Roboto"}>
            {props.batchName}
          </Text>
        </Flex>

        {/* 🔹 Tab Bar */}
        <ScrollArea p={10} mih={70}>
          <Flex mt={isMd ? 10 : 20}>
            {Object.values(Tabs).map((item: Tabs, i: number) => {
              return (
                <Box
                  key={i}
                  mx={isMd ? 14 : 30}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab(item)}
                >
                  <Text
                    c={activeTab === item ? "#1B1212" : "#2F4F4F"}
                    fw={600}
                    style={{ whiteSpace: "nowrap" }}
                    fz={16}
                    ff={"Roboto"}
                  >
                    {item}
                  </Text>
                  {activeTab === item && (
                    <Box
                      component="hr"
                      style={{
                        border: "none",
                        height: 2,
                        backgroundColor: "#4B65F6",
                        marginTop: 4,
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Flex>
        </ScrollArea>

        <Flex
          w={"100%"}
          p={3}
          style={{ borderRadius: "1rem" }}
          bg={"linear-gradient(135deg, #9C27B0, #3F51B5)"}
        />

        {/* 🔹 Tab Content */}
        {Tabs.OVERVIEW === activeTab && (
          <Stack w={"100%"}>
            <OverView batchId={props.batchId} />
          </Stack>
        )}

        {Tabs.STUDENT === activeTab && (
          <Stack w={"100%"}>
            {showSelectedScreen === Screen.NONE && (
              <>
                <Flex
                  w="100%"
                  align="center"
                  justify="space-between"
                  wrap="wrap"
                  gap="sm"
                >
                  <Flex gap="sm" wrap="wrap" style={{ flex: 1 }}>
                    {students.length > 0 && (
                      <>
                        <Button
                          variant="outline"
                          color="dark"
                          style={{ whiteSpace: "nowrap" }}
                          onClick={() => {
                            setTakeAttandance(true);
                          }}
                        >
                          Attendance
                        </Button>

                        <Button
                          variant="outline"
                          color="dark"
                          style={{ whiteSpace: "nowrap" }}
                          onClick={() => {
                            setOpenAddMarksModal(true);
                          }}
                        >
                          + Add Marks
                        </Button>
                      </>
                    )}
                  </Flex>
                  <Flex
                    gap="sm"
                    align={"center"}
                    justify={"flex-end"}
                    wrap="wrap"
                    style={{ flex: 1 }}
                  >
                    {students.length > 0 && (
                      <>
                        {!props.fromInstituteTeacherSection && (
                          <Button
                            variant="outline"
                            color="dark"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => {
                              setShowSelectedScreen(Screen.ADDMORESCREEN);
                            }}
                          >
                            + Add Student
                          </Button>
                        )}
                        {!props.fromInstituteTeacherSection && (
                          <Button
                            variant="outline"
                            color="dark"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => {
                              setOpenFileAdmissionModal(true);
                            }}
                          >
                            + Upload File
                          </Button>
                        )}
                      </>
                    )}
                  </Flex>
                </Flex>

                {takeAttendance ? (
                  <Stack>
                    <TakeAttendanceView
                      students={students}
                      batchId={props.batchId}
                      onBackClicked={() => {
                        setTakeAttandance(false);
                      }}
                      subjects={[]}
                    />
                  </Stack>
                ) : (
                  <StudentSection
                    batchId={props.batchId}
                    setEditStudentDetails={setEditStudentDetails}
                    setShowSelectedScreen={setShowSelectedScreen}
                    setSelectedStudentId={setSelectedStudentId}
                    batchName={props.batchName}
                    setStudents={setStudents}
                    userType={props.userType}
                    students={studentsTable}
                  />
                )}
              </>
            )}

            {showSelectedScreen === Screen.VIEWPROFILE && (
              <StudentPage
                onClickBack={() => {
                  setShowSelectedScreen(Screen.NONE);
                  setSelectedStudentId("");
                }}
                studentId={selectedStudentId}
                userType={props.userType}
                activeTab={StudentTabs.OVERVIEW}
              />
            )}

            {showSelectedScreen === Screen.ADDMORESCREEN && (
              <AddMoreDetails
                formData={studentData}
                isEditableData={editStudentDetails}
                selectedStudentId={selectedStudentId}
                onClickBack={() => {
                  setShowSelectedScreen(Screen.NONE);
                  setSelectedStudentId("");
                }}
                batchId={props.batchId}
                batchName={props.batchName}
                instituteId={props.instituteId}
              />
            )}

            {showSelectedScreen === Screen.VIEWFEEDETAILS && (
              <FeeRecordSection
                fromBatch={true}
                userType={UserType.TEACHER}
                dateOfJoining={new Date()}
                batch={props?.batchId}
                studentId={selectedStudentId}
                onPaymentClick={() => {}}
                onClickBack={() => {
                  setSelectedStudentId("");
                  setShowSelectedScreen(Screen.NONE);
                }}
                batchName={props.batchName}
              />
            )}
          </Stack>
        )}

        {openAddMarksModal && (
          <AddMarksModal
            opened={openAddMarksModal}
            batchId={props.batchId}
            students={students}
            setOpenAddMarksModal={setOpenAddMarksModal}
          />
        )}
        {openFileAdmissionModal && (
          <UploadExcelAdmission
            opened={openFileAdmissionModal}
            setOpenAddMarksModal={setOpenFileAdmissionModal}
            batchId={props.batchId}
            instituteId={props.instituteId!}
            setStudents={setStudentsTable}
          />
        )}

        {Tabs.TEACHER === activeTab && (
          <Stack w={"100%"} mt={20} mx={"auto"}>
            {!selectedTeacherId ? (
              <TeachersSection
                batchId={props.batchId}
                batchName={props.batchName}
                userType={props.userType}
                setSelectTeacherId={setSelectTeacherId}
                fromInstituteTeacherSection={props.fromInstituteTeacherSection}
              />
            ) : (
              <TeacherProfile
                teacherId={selectedTeacherId}
                userType={UserType.OTHERS}
                onClickBack={() => {
                  setSelectTeacherId("");
                }}
              />
            )}
          </Stack>
        )}

        {Tabs.MARKSHEET === activeTab && (
          <Marksheet batchId={props.batchId} subjects={props.subjects ?? []} />
        )}

        {Tabs.TEST === activeTab && (
          <Tests batchId={props.batchId} subjects={props.subjects ?? []} />
        )}

        {Tabs.STUDY_MATERIAL === activeTab && (
          <Stack w={"100%"} mih={isMd ? "100vh" : "70vh"} bg={"white"} mt={20}>
            <Text m={"auto"}>STUDY_MATERIAL coming soon</Text>
          </Stack>
        )}

        {Tabs.ASSIGNMENT === activeTab && (
          <Stack w={"100%"} mih={isMd ? "100vh" : "70vh"} bg={"white"} mt={20}>
            <Text m={"auto"}>ASSIGNMENT coming soon</Text>
          </Stack>
        )}
      </Stack>

      {/* 🔹 Add Student Modal */}
      {openAddStudentModal && (
        <AddNewStudentModal
          isOpen={openAddStudentModal}
          onNextButtonClicked={(val) => {
            setIsLoading(true);
            CreateStudent(val)
              .then(() => {
                SuccessNotification("Student created!!");
                setIsLoading(false);
                setOpenAddStudentModal(false);
              })
              .catch((e) => {
                console.log(e);
                ErrorNotification("Failed to create student");
                setIsLoading(false);
                setOpenAddStudentModal(false);
              });
          }}
          batchId={props.batchId}
          instituteId={props.instituteId}
          setFormData={setStudentData}
          setShowSelectedScreen={setShowSelectedScreen}
          setIsOpen={(val: boolean) => {
            setOpenAddStudentModal(val);
          }}
        />
      )}
    </>
  );
}
