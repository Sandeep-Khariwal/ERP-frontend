"use client";

import {
  AttendanceInterface,
  StudentsDataWithBatch,
} from "@/interface/student.interface";
import { useEffect, useState } from "react";
import {
  AttendanceCard,
  AttendanceStatus,
  SavedAttendanceCard,
} from "./AttendanceCard";
import {
  ErrorNotification,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import {
  Box,
  Button,
  Center,
  Flex,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { IconArrowBack, IconCalendar } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import Image from "next/image";
import {
  CreateAttendance,
  GetAttendanceOnDate,
} from "@/axios/batch/BatchPostApi";

interface TakeAttendanceViewProps {
  students: StudentsDataWithBatch[];
  batchId: string;
  onBackClicked: () => void;
  subjects: {
    label: string;
    value: string;
  }[];
  // addHomework: (description: string, uploadPhoto?: File) => void;
}

export function TakeAttendanceView(props: TakeAttendanceViewProps) {
  const [attendanceDate, setAttendanceDate] = useState<Date | null>(new Date());
  const [todaysDate, setTodaysDate] = useState<Date>(new Date());
  const [singleAttendance, setSingleAttendance] = useState<AttendanceStatus>(
    AttendanceStatus.ABSENT
  );
  const [currentDateStudentAttendanceRecords, setCurrentDateAttendanceRecords] =
    useState<AttendanceInterface[]>([]);
  const [prevDateSttendance, setPrevDateSttendance] = useState<
    {
      _id: string;
      batchId: string;
      studentId: {
        _id: string;
        name: string;
        parentNumber: string;
      };
      status: AttendanceStatus;
      date: Date;
    }[]
  >([]);
  const [openHomeWorkModal, setOpenHomeWorkModal] = useState<boolean>(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    var todayDate = new Date(Date.now());
    // todayDate.setHours(6, 0, 0, 0);
    setTodaysDate(todayDate);
    setAttendanceDate(todayDate);
    if (props.subjects.length > 0) {
      setSelectedSubjectId(props.subjects[0].value);
    }
  }, []);

  useEffect(() => {
    if (attendanceDate) {
      const attendanceTakenDate = new Date(attendanceDate);
      const today = new Date();

        setIsLoading(true);
        GetAttendanceOnDate(props.batchId, new Date(attendanceDate))
          .then((x: any) => {
            const { attendance } = x;
            setPrevDateSttendance(attendance);

            setIsLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
          });
    }
  }, [attendanceDate]);

  // function findAttendanceRecordByDate(
  //   attendanceRecords: AttendanceInterface[]
  // ): AttendanceInterface | null {
  //   if (attendanceRecords?.length > 0) {
  //     for (let i = 0; i < attendanceRecords.length; i++) {
  //       var attDateObject = new Date(attendanceRecords[i].date);
  //       attDateObject.setHours(6, 0, 0, 0);
  //       attendanceRecords[i].date = attDateObject;
  //       if (attDateObject.toDateString() == attendanceDate?.toDateString()) {
  //         return attendanceRecords[i];
  //       }
  //     }
  //     return null;
  //   } else {
  //     return null;
  //   }
  // }

  function submitAttendance() {
    setIsLoading(true);
    CreateAttendance(props.batchId, currentDateStudentAttendanceRecords)
      .then((x: any) => {
        console.log("attendance created");
        setIsLoading(false);
        SuccessNotification("Attendance update!!");
      })
      .catch((e: any) => {
        console.log(e);
        const { message } = e.response.data;
        ErrorNotification(message);
        setIsLoading(false);
      });
    // insertNewAttendance({
    //   attendance: currentDateStudentAttendanceRecords,
    //   date: currentDateStudentAttendanceRecords[0].date!,
    //   instituteClassId: props.batchId,
    // })
    //   .then(() => {
    //     SuccessNotification("Attendance recorded successfully");
    //   })
    //   .catch((e) => {});
    // if (props.subjects.length > 0) {
    //   setOpenHomeWorkModal(true);
    // }
  }

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Stack w={"100%"} mt={16} py={10} px={5} bg={"white"}>
        <Flex align={"center"}>
          <Box
            w="24px"
            h="24px"
            onClick={() => props.onBackClicked()}
            style={{ cursor: "pointer" }}
          >
            <IconArrowBack color="black" />
          </Box>
          <Text ml={24} fw={600} fz={24}>
            View/Take Attendance
          </Text>
        </Flex>
        <DatePickerInput
          rightSection={<IconCalendar stroke={1} />}
          value={attendanceDate}
          onChange={(date: Date | null) => {
            if (date) {
              
              // Set time to 00:00:00 for consistent date storage
              // date.setHours(0, 0, 0, 0);
              const isStringDate = date.toISOString()
              setAttendanceDate(new Date(isStringDate)); // Set date as a valid Date object
            }

            // setAttendanceDate(new Date(date));
          }}
          clearable={false}
          maxDate={new Date(Date.now())}
          radius={50}
          // styles={{
          //   rightSection: {
          //     marginRight: 10,
          //   },
          // }}
          w={200}
        />
      </Stack>
      {props.students.length === 0 && (
        <Center h="65dvh" w="100%" bg={"white"}>
          <Stack align="center" justify="center">
            <Box
              style={{
                // backgroundColor: "#EEF4FF",
                borderRadius: "50%",
                height: 148,
                width: 148,
              }}
            >
              <Center h="100%">
                <Image
                  src={"/empty.png"}
                  alt="empty image"
                  width={100}
                  height={100}
                />
              </Center>
            </Box>
            <Text c="#A4A4A4" fw={500}>
              No student added yet!
            </Text>
          </Stack>
        </Center>
      )}
      {props.students.length !== 0 && (
        <>
          <SimpleGrid
            bg={"white"}
            style={{
              // backgroundColor: "#E4EDFD",
              height: "40px",
              alignContent: "center",
            }}
            fw={450}
            fz={13}
            cols={3}
          >
            <Text ml={10}>Name</Text>
            <Text>Phone Number</Text>
            <Center>
              <Text>
                {" "}
                {attendanceDate == todaysDate
                  ? "Mark Attendance"
                  : "Attendance"}
              </Text>
            </Center>
          </SimpleGrid>
          <ScrollArea h={"50dvh"} px={5} bg={"white"}>
            {prevDateSttendance.length === 0 && props.students.map((student, index) => {
              return (
                attendanceDate?.toDateString() ===
                  todaysDate?.toDateString() && (
                  <AttendanceCard
                    key={index}
                    studentId={student._id || ""}
                    batchId={student.batchId!!}
                    name={student.name}
                    selectedDate={attendanceDate!!}
                    phone={student.phoneNumber[0]}
                    status={singleAttendance}
                    setSingleAttendance={(val: AttendanceInterface) => {

                      setCurrentDateAttendanceRecords((prevRecords) => {
                        const existingIndex = prevRecords.findIndex(
                          (record) => record.studentId === val.studentId
                        );
                        if (existingIndex !== -1) {
                          const updatedRecords = [...prevRecords];
                          updatedRecords[existingIndex] = {
                            ...updatedRecords[existingIndex],
                            ...val,
                          };
                          return updatedRecords;
                        } else {
                          return [...prevRecords, val];
                        }
                      });
                    }}
                    hidePhoneNumbers={false}
                  />
                )
              );
            })}

            {prevDateSttendance.length > 0 &&
              prevDateSttendance.map((att) => (
                <SavedAttendanceCard
                  studentId={att.studentId._id!!}
                  name={att.studentId.name}
                  phone={att.studentId.parentNumber}
                  date={attendanceDate!!}
                  submitHandler={() => {}}
                  status={att.status}
                />
              ))}
          </ScrollArea>
          {attendanceDate?.toDateString() == todaysDate?.toDateString() && (
            <Center>
              <Button
                onClick={() => {
                  submitAttendance();
                }}
                style={{ backgroundColor: "#4B65F6", marginBottom:"20px" }}
                px={100} 
              >
                Submit
              </Button>
            </Center>
          )}
        </>
      )}

      {/* {currentDateStudentAttendanceRecords.length == 0 && (
        <Center h="65dvh" w="100%">
          <Stack align="center" justify="center">
            <Text c="#A4A4A4" fw={500}>
              No Attendance was recorded for this day!
            </Text>
          </Stack>
        </Center>
      )} */}
      {openHomeWorkModal && (
        <Modal
          onClose={() => {
            setOpenHomeWorkModal(false);
          }}
          opened={openHomeWorkModal}
        >
          <Select
            data={props.subjects}
            label="Add any notice/update with the Attedance"
            value={selectedSubjectId}
            onChange={(value) => {
              if (value) setSelectedSubjectId(value);
            }}
          />
          {/* <AddHomeworkModal
              onSubmitClick={(description: string, uploadPhoto?: File) => {
                props.addHomework(description, uploadPhoto);
                setOpenHomeWorkModal(false);
              }}
            /> */}
        </Modal>
      )}
    </>
  );
}
