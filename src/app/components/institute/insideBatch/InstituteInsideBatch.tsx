"use client";

import {
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
import { SuccessNotification } from "@/app/helperFunction/Notification";
import StudentPage from "../../student/StudentPage";
import { StudentTabs } from "../InstituteStudents";
import TeachersSection from "./TeacherSection";
import AddMarksModal from "./AddMarksModal";
import { UserType } from "../../dashboard/InstituteBatchesSection";
import { CreateStudent } from "@/axios/institute/InstitutePostApi";
import TeacherProfile from "../teacher/TeacherProfile";

enum Tabs {
  OVERVIEW = "Overview",
  STUDENT = "Students",
  TEACHER = "Teachers",
  STUDY_MATERIAL = "Study Material",
  ASSIGNMENT = "Assignment",
}

export enum Screen {
  VIEWPROFILE = "view profile",
  ADDMORESCREEN = "add details",
  VIEWFEEDETAILS = "fee details",
  NONE = "",
}

export function InstituteInsideBatch(props: {
  batchId: string;
  batchName: string;
  instituteId: string;
  onClickBack: () => void;
  fromInstituteTeacherSection: boolean;
  userType: UserType;
}) {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [selectedTeacherId, setSelectTeacherId] = useState<string>("");
  const [openAddStudentModal, setOpenAddStudentModal] =
    useState<boolean>(false);
  const [takeAttendance, setTakeAttandance] = useState<boolean>(false);
  const [openAddMarksModal, setOpenAddMarksModal] = useState<boolean>(false);
  const [showSelectedScreen, setShowSelectedScreen] = useState<Screen>(
    Screen.NONE
  );
  const [editStudentDetails, setEditStudentDetails] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(Tabs.OVERVIEW);

  const [studentData, setStudentData] = useState<StudentData>({
    name: "",
    parentName: "",
    dateOfBirth: new Date(),
    address: "",
    phoneNumber: [],
    additionalPhoneNumbers: [],
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [students, setStudents] = useState<StudentsDataWithBatch[]>([]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      {Screen.NONE === showSelectedScreen && (
        <Stack
          w={isMd ? "95%" : props.fromInstituteTeacherSection ? "99%" : "90%"}
          mt={20}
          mx={"auto"}
          h={"100%"}
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
          <ScrollArea type="hover" p={10}>
            <Flex mt={isMd ? 10 : 20}>
              {Object.values(Tabs).map((item: Tabs, i: number) => {
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
          </ScrollArea>
          <Flex
            w={"100%"}
            p={3}
            style={{ borderRadius: "1rem" }}
            bg={"linear-gradient(135deg, #9C27B0, #3F51B5)"}
          />

          {Tabs.OVERVIEW === activeTab && (
            <Stack w={"100%"}>
              <OverView batchId={props.batchId} />
            </Stack>
          )}
          {Tabs.STUDENT === activeTab && (
            <Stack w={"100%"}>
              <Flex w={"100%"} gap={10}>
                {!props.fromInstituteTeacherSection && (
                  <Button
                    variant="outline"
                    c={"#111"}
                    style={{ borderColor: "#111" }}
                    onClick={() => {
                      setShowSelectedScreen(Screen.ADDMORESCREEN);
                      // setOpenAddStudentModal(true);
                    }}
                  >
                    + Add Student
                  </Button>
                )}

                {students.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      c={"#111"}
                      style={{ borderColor: "#111" }}
                      onClick={() => {
                        setTakeAttandance(true);
                      }}
                    >
                      Attendance
                    </Button>

                    <Button
                      variant="outline"
                      c={"#111"}
                      style={{ borderColor: "#111" }}
                      onClick={() => {
                        setOpenAddMarksModal(true);
                      }}
                    >
                      + Add Marks
                    </Button>
                  </>
                )}
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
          {Tabs.STUDY_MATERIAL === activeTab && (
            <Stack
              w={"100%"}
              mih={isMd ? "100vh" : "70vh"}
              bg={"white"}
              mt={20}
              mx={"auto"}
            >
              <Text m={"auto"}>STUDY_MATERIAL comming soon</Text>
            </Stack>
          )}
          {Tabs.ASSIGNMENT === activeTab && (
            <Stack
              w={"100%"}
              mih={isMd ? "100vh" : "70vh"}
              bg={"white"}
              mt={20}
              mx={"auto"}
            >
              <Text m={"auto"}>ASSIGNMENT comming soon</Text>
            </Stack>
          )}
        </Stack>
      )}

      {Screen.VIEWPROFILE === showSelectedScreen && (
        <Stack
          w={isMd ? "100%" : "80%"}
          mih={isMd ? "100vh" : "90vh"}
          mt={20}
          mx={"auto"}
          py={30}
        >
          <StudentPage
            onClickBack={() => {
              setShowSelectedScreen(Screen.NONE);

              setSelectedStudentId("");
            }}
            studentId={selectedStudentId}
            userType={props.userType}
            activeTab={StudentTabs.OVERVIEW}
          />
        </Stack>
      )}

      {Screen.ADDMORESCREEN === showSelectedScreen && (
        <Stack w={"100%"} h={"100%"} align="center">
          <AddMoreDetails
            formData={studentData}
            isEditableData={editStudentDetails}
            selectedStudentId={selectedStudentId}
            onClickBack={() => {
              setShowSelectedScreen(Screen.NONE);
            }}
            batchId={props.batchId}
            batchName={props.batchName}
            instituteId={props.instituteId}
          />
        </Stack>
      )}

      {Screen.VIEWFEEDETAILS === showSelectedScreen && (
        <Stack w={"100%"} mih={"100vh"} pt={20} mx={"auto"}>
          <FeeRecordSection
            fromBatch={true}
            userType={UserType.TEACHER}
            dateOfJoining={new Date()}
            batch={props?.batchId}
            studentId={selectedStudentId}
            onPaymentClick={() => {
              console.log("refreshing page");

              // getStudentnfo();
            }}
            onClickBack={() => {
              setSelectedStudentId("");
              setShowSelectedScreen(Screen.NONE);
            }}
            batchName={props.batchName}
          />
        </Stack>
      )}

      {openAddStudentModal && (
        <AddNewStudentModal
          isOpen={openAddStudentModal}
          onNextButtonClicked={(val) => {
            // setShowAddMoreDetails(true);
            setIsLoading(true);
            CreateStudent(val)
              .then(() => {
                SuccessNotification("Student created!!");
                setIsLoading(false);
                setOpenAddStudentModal(false);
              })
              .catch((e) => {
                console.log(e);
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
