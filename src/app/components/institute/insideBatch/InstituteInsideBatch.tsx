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
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AddNewStudentModal } from "../AddNewStudentModal";
import { AddMoreDetails } from "../student/addMoreDetails/AddMoreDetails";
import { StudentData, TeacherData } from "@/interfaces/batchInterface";
import StudentSection from "./StudentSection";
import FeeRecordSection from "../student/fees/FeeRecord";
import OverView from "./OverView";
import { TakeAttendanceView } from "./TakeAttendanceView";
import { StudentsDataWithBatch } from "@/interfaces/student.interface";
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
import UploadExcelAdmission from "../student/addMoreDetails/UploadExcelAdmission";
import { GetAllTeachersFromBatch } from "@/axios/institute/InstituteGetApi";
import { GetAllSubjectsFromBatch } from "@/axios/batch/BatchGetApi";

// Lazily loaded — each of these is only ever shown for one active tab at a
// time, so there's no reason to ship all of their code (and their heavy
// dependencies like PDF/QR generation, charts, etc.) in the initial bundle.
const tabLoading = () => (
  <Flex justify="center" align="center" mih={300}>
    <LoadingOverlay visible overlayProps={{ blur: 1 }} />
  </Flex>
);

const Tests = dynamic(() => import("./test/Tests"), { loading: tabLoading });
const Marksheet = dynamic(() => import("./Marksheet"), { loading: tabLoading });
const DiaryPage = dynamic(() => import("./DiaryPage"), { loading: tabLoading });
const StudyMaterialPage = dynamic(() => import("./StudyMaterialPage"), { loading: tabLoading });
const SessionsPage = dynamic(() => import("./SessionsPage"), { loading: tabLoading });
const GalleryPage = dynamic(() => import("./GalleryPage"), { loading: tabLoading });
const ExaminationPage = dynamic(() => import("./ExaminationPage"), { loading: tabLoading });
const MeetingsPage = dynamic(() => import("../../meeting/MeetingPage"), { loading: tabLoading });
const TimetablePage = dynamic(() => import("./timetable/TimeTablePage"), { loading: tabLoading });

enum Tabs {
  OVERVIEW = "Overview",
  STUDENT = "Students",
  TEACHER = "Teachers",
  MARKSHEET = "Marksheet",
  TEST = "Tests",
  DIARY = "Daily Diary",
  STUDY_MATERIAL = "Study Material",
  TIME_TABLE = "Time Table",
  GALLERY = "Gallery",
  EXAMINATION = "Examination",
  ASSIGNMENT = "Assignment",
  SESSIONS = "Sessions",
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
  const [subjects, setSubject] = useState<{ _id: string; name: string }[]>(
    props.subjects ?? [],
  );

  const [studentData, setStudentData] = useState<StudentData>({
    name: "",
    parentName: "",
    dateOfBirth: new Date(),
    address: "",
    motherName: "",
    admissionNumber: "",
    van: "",
    phoneNumber: [],
    additionalPhoneNumbers: [],
  });

  const [teacherData, settTeacherData] = useState<TeacherData>({
    _id: "",
    name: "",
    phoneNumber: "",
    subjects: [],
  });

  useEffect(() => {
    if (!props.batchId) return;

    // `teacherData` here is only ever consumed by the Time Table and
    // Assignment tabs (see props passed to TimetablePage / MeetingsPage
    // below) — both lazily loaded. Previously this fetched the entire
    // teacher list on every batch page load regardless of which tab was
    // open. Now it only fetches when one of those tabs is actually
    // visited, and only once (guarded by teacherData._id already being
    // set) rather than refetching every time the tab is revisited.
    const needsTeacherData =
      activeTab === Tabs.TIME_TABLE || activeTab === Tabs.ASSIGNMENT;

    if (needsTeacherData && !teacherData._id) {
      GetAllTeachersFromBatch(props.batchId)
        .then((res: any) => {
          const firstTeacher = res?.teachers?.[0];

          if (firstTeacher) {
            settTeacherData({
              _id: firstTeacher._id,
              name: firstTeacher.name,
              phoneNumber: firstTeacher.phoneNumber,
              subjects: firstTeacher.subjects || [],
            });
          }
        })
        .catch((err) => {
          console.log("Teacher Fetch Error:", err);
        });
    }

    if (props.subjects?.length) return;

    GetAllSubjectsFromBatch(props.batchId)
      .then((res: any) => {
        setSubject(res.subjects.subjects);
      })
      .catch((e: any) => {});
  }, [props.batchId, activeTab]);

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
        w={isMd ? "95%" : props.fromInstituteTeacherSection ? "99%" : "92%"}
        mt={20}
        mx={"auto"}
        mih={"100vh"}
      >
        <Flex
          w={"100%"}
          align={"center"}
          justify={"start"}
          gap={14}
          pb={14}
          style={{ borderBottom: "1px solid #F1F4F9" }}
        >
          <Flex
            align="center"
            justify="center"
            style={{
              width: 34,
              height: 34,
              borderRadius: "8px",
              cursor: "pointer",
              border: "1px solid #E2E8F0",
            }}
            onClick={() => props.onClickBack()}
          >
            <Image
              src={"/backArrow.png"}
              alt="back"
              width={16}
              height={13}
            />
          </Flex>
          <Stack gap={0}>
            <Text fz={12} fw={600} c="#8B96AD" style={{ fontFamily: "sans-serif" }}>
              Academic workspace
            </Text>
            <Text fz={22} fw={700} c="#1B2559" style={{ fontFamily: "sans-serif" }}>
              {props.batchName}
            </Text>
          </Stack>
        </Flex>

        {/* 🔹 Tab Bar */}
        <ScrollArea mih={56} scrollbarSize={4}>
          <Flex gap={0} style={{ borderBottom: "1px solid #F1F4F9" }}>
            {Object.values(Tabs).map((item: Tabs, i: number) => {
              return (
                <Box
                  key={i}
                  mx={isMd ? 12 : 18}
                  py={10}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab(item)}
                >
                  <Text
                    c={activeTab === item ? "#2F6FED" : "#5B6B8C"}
                    fw={activeTab === item ? 700 : 500}
                    style={{ whiteSpace: "nowrap" }}
                    fz={15}
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
                        borderRadius: 2,
                        backgroundColor: "#2F6FED",
                        marginTop: 8,
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
          bg={"transparent"}
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
                          variant="default"
                          radius={10}
                          styles={{
                            root: {
                              whiteSpace: "nowrap",
                              border: "1px solid #E2E8F0",
                              boxShadow: "0px 2px 8px rgba(15,23,42,0.05)",
                              fontWeight: 600,
                              color: "#33415C",
                            },
                          }}
                          onClick={() => {
                            setTakeAttandance(true);
                          }}
                        >
                          Attendance
                        </Button>

                        <Button
                          variant="default"
                          radius={10}
                          styles={{
                            root: {
                              whiteSpace: "nowrap",
                              border: "1px solid #E2E8F0",
                              boxShadow: "0px 2px 8px rgba(15,23,42,0.05)",
                              fontWeight: 600,
                              color: "#33415C",
                            },
                          }}
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
                    <>
                      {!props.fromInstituteTeacherSection && (
                        <Button
                          radius={10}
                          styles={{
                            root: {
                              whiteSpace: "nowrap",
                              background: "linear-gradient(135deg, #4F7CFB 0%, #2F6FED 100%)",
                              border: 0,
                              fontWeight: 600,
                            },
                          }}
                          onClick={() => {
                            setShowSelectedScreen(Screen.ADDMORESCREEN);
                          }}
                        >
                          + Add Student
                        </Button>
                      )}
                      {!props.fromInstituteTeacherSection && (
                        <Button
                          variant="default"
                          radius={10}
                          styles={{
                            root: {
                              whiteSpace: "nowrap",
                              border: "1px solid #E2E8F0",
                              boxShadow: "0px 2px 8px rgba(15,23,42,0.05)",
                              fontWeight: 600,
                              color: "#33415C",
                            },
                          }}
                          onClick={() => {
                            setOpenFileAdmissionModal(true);
                          }}
                        >
                          + Upload File
                        </Button>
                      )}
                    </>
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
        {Tabs.DIARY === activeTab && (
          <DiaryPage batchId={props.batchId} subjects={subjects ?? []} />
        )}

        {Tabs.STUDY_MATERIAL === activeTab && (
          <Stack w={"100%"}>
            <StudyMaterialPage batchId={props.batchId} />
          </Stack>
        )}

        {Tabs.GALLERY === activeTab && (
          <Stack w={"100%"}>
            <GalleryPage batchId={props.batchId} />
          </Stack>
        )}

        {Tabs.TIME_TABLE === activeTab && (
          <Stack w={"100%"}>
            <TimetablePage
              batchId={props.batchId}
              subjects={props.subjects}
              teacherData={teacherData}
              batchName={props.batchName}
            />
          </Stack>
        )}

        {Tabs.EXAMINATION === activeTab && (
          <Stack w={"100%"}>
            <ExaminationPage batchId={props.batchId} />
          </Stack>
        )}

        {Tabs.ASSIGNMENT === activeTab && (
          <Stack w={"100%"} mih={isMd ? "100vh" : "70vh"} bg={"white"} mt={20}>
            <MeetingsPage
              userType={props.userType}
              batchId={props.batchId}
              batchName={props.batchName}
              subjects={props.subjects}
              teacherData={teacherData}
            />
          </Stack>
        )}

        {Tabs.SESSIONS === activeTab && (
          <Stack w={"100%"}>
            <SessionsPage batchId={props.batchId} />
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
