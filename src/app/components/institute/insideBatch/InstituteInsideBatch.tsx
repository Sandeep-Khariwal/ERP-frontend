"use client";

import { Button, Flex, ScrollArea, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { useState } from "react";
import { AddNewStudentModal } from "../AddNewStudentModal";
import { AddMoreDetails } from "../student/addMoreDetails/AddMoreDetails";
import { StudentData } from "@/interfaces/batchInterface";
import StudentSection from "./StudentSection";
import FeeRecordSection from "../student/fees/FeeRecord";
import { BatchOverviewCards } from "./BatchOverviewCards";
import OverView from "./OverView";

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
}) {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [openAddStudentModal, setOpenAddStudentModal] =
    useState<boolean>(false);
  const [showSelectedScreen, setShowSelectedScreen] = useState<Screen>(
    Screen.NONE
  );
  const [editStudentDetails, setEditStudentDetails] = useState<boolean>(false);
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

  return (
    <>
      {Screen.NONE === showSelectedScreen && (
        <Stack w={isMd ? "95%" : "80%"} mt={20} mx={"auto"} h={"100%"}>
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
                    c={activeTab === item ? "#1B1212" : "#28282B"}
                    fw={600}
                    style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                    fz={19}
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
              <Flex w={"100%"}>
                <Button
                  variant="outline"
                  c={"#111"}
                  style={{ borderColor: "#111" }}
                  onClick={() => {
                    setOpenAddStudentModal(true);
                  }}
                >
                  + Add Student
                </Button>
              </Flex>
              <StudentSection
                batchId={props.batchId}
                setEditStudentDetails={setEditStudentDetails}
                setShowSelectedScreen={setShowSelectedScreen}
                setSelectedStudentId={setSelectedStudentId}
                batchName={props.batchName}
              />
            </Stack>
          )}
          {Tabs.TEACHER === activeTab && (
            <Stack>
              <Text>teacher tab</Text>
            </Stack>
          )}
          {Tabs.STUDY_MATERIAL === activeTab && (
            <Stack>
              <Text>STUDY_MATERIAL tab</Text>
            </Stack>
          )}
          {Tabs.ASSIGNMENT === activeTab && (
            <Stack>
              <Text>ASSIGNMENT tab</Text>
            </Stack>
          )}
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
        <Stack w={"100%"} h={"100%"} align="center">
          <FeeRecordSection
            feeRecords={[
              {
                _id: "62dcd9e2f8f5d0b9c0844c9a",
                batch: {
                  _id: "b12345",
                  name: "Batch A",
                },
                student: "student_001",
                name: "Semester 1 Fee",
                dueDate: new Date("2025-02-28T00:00:00Z"),
                totalAmount: 1500.0,
                type: "Tuition",
                status: "Unpaid",
                amountPaid: 0.0,
                createdAt: new Date("2025-02-28T00:00:00Z"),
                updatedAt: new Date("2025-02-28T00:00:00Z"),
                payments: [],
              },
            ]}
            userType={"teacher"}
            dateOfJoining={new Date()}
            batch={props?.batchId}
            studentId={selectedStudentId}
            onPaymentClick={() => {
              console.log("refreshing page");

              // getStudentnfo();
            }}
            onClickBack={() => {
              setShowSelectedScreen(Screen.NONE);
            }}
            batchName={props.batchName}
          />
        </Stack>
      )}

      {openAddStudentModal && (
        <AddNewStudentModal
          isOpen={openAddStudentModal}
          onNextButtonClicked={() => {
            // setShowAddMoreDetails(true);
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
