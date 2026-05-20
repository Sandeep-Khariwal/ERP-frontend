"use client";

import {
  AttendanceInterface,
  StudentsDataWithBatch,
} from "@/interface/student.interface";
import { useCallback, useEffect, useMemo, useState } from "react";
import AttendanceCard, {
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
import {
  IconArrowBack,
  IconCalendar,
  IconBellFilled,
} from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import Image from "next/image";
import {
  CreateAttendance,
  GetAttendanceOnDate,
  GetBatchLeave,
} from "@/axios/batch/BatchPostApi";
import StudentLeave from "./StudentLeave";
import { useMediaQuery } from "@mantine/hooks";

interface TakeAttendanceViewProps {
  students: StudentsDataWithBatch[];
  batchId: string;
  onBackClicked: () => void;
  subjects: {
    label: string;
    value: string;
  }[];
}

export function TakeAttendanceView(props: TakeAttendanceViewProps) {
  const [attendanceDate, setAttendanceDate] = useState<Date | null>(
    new Date(),
  );

  const [todaysDate] = useState<Date>(new Date());

  const [isTodayAttendance, setIsTodayAttendance] =
    useState<boolean>(false);

  const [currentDateStudentAttendanceRecords,
    setCurrentDateAttendanceRecords] = useState<AttendanceInterface[]>([]);

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

  const [openHomeWorkModal, setOpenHomeWorkModal] =
    useState<boolean>(false);

  const [selectedSubjectId, setSelectedSubjectId] =
    useState<string>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [leaveModalOpen, setLeaveModalOpen] =
    useState(false);

  const [leaveCount, setLeaveCount] =
    useState<number>(0);

  const [leaveData, setLeaveData] = useState<any[]>([]);

  const isMobile = useMediaQuery("(max-width: 768px)");

  // =========================
  // MEMOIZED VALUES
  // =========================

  const isTodaySelected = useMemo(() => {
    if (!attendanceDate) return false;

    return (
      attendanceDate.toDateString() ===
      todaysDate.toDateString()
    );
  }, [attendanceDate, todaysDate]);

  const attendanceDateString = useMemo(() => {
    return attendanceDate
      ? attendanceDate.toISOString().split("T")[0]
      : "";
  }, [attendanceDate]);

  const attendanceMap = useMemo(() => {
    const map = new Map();

    prevDateSttendance.forEach((att) => {
      map.set(att.studentId._id, att);
    });

    return map;
  }, [prevDateSttendance]);

  // =========================
  // INITIAL SUBJECT
  // =========================

  useEffect(() => {
    if (props.subjects.length > 0) {
      setSelectedSubjectId(props.subjects[0].value);
    }
  }, [props.subjects]);

  // =========================
  // FETCH ATTENDANCE
  // =========================

  useEffect(() => {
    if (!attendanceDateString || !props.batchId) return;

    let ignore = false;

    async function fetchAttendance() {
      try {
        setIsLoading(true);

        const response: any = await GetAttendanceOnDate(
          props.batchId,
          new Date(attendanceDateString),
        );

        if (ignore) return;

        const { attendance } = response;

        setPrevDateSttendance(attendance);

        if (attendance.length > 0) {
          const attendanceDay = new Date(attendance[0].date)
            .toISOString()
            .split("T")[0];

          const today = new Date()
            .toISOString()
            .split("T")[0];

          setIsTodayAttendance(today === attendanceDay);
        } else {
          setIsTodayAttendance(false);
        }
      } catch (e) {
        console.log(e);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchAttendance();

    return () => {
      ignore = true;
    };
  }, [attendanceDateString, props.batchId]);

  // =========================
  // FETCH LEAVES
  // =========================

  useEffect(() => {
    if (!props.batchId) return;

    async function fetchLeaves() {
      try {
        const x: any = await GetBatchLeave(props.batchId);

        const leaves = x?.leaves || [];

        setLeaveData(leaves);
        setLeaveCount(leaves.length);
      } catch (e) {
        console.log("Leave API Error =>", e);
      }
    }

    fetchLeaves();
  }, [props.batchId]);

  // =========================
  // CALLBACKS
  // =========================

  const handleSingleAttendance = useCallback(
    (val: AttendanceInterface) => {
      setCurrentDateAttendanceRecords((prevRecords) => {
        const existingIndex = prevRecords.findIndex(
          (record) => record.studentId === val.studentId,
        );

        if (existingIndex !== -1) {
          const updatedRecords = [...prevRecords];

          updatedRecords[existingIndex] = {
            ...updatedRecords[existingIndex],
            ...val,
          };

          return updatedRecords;
        }

        return [...prevRecords, val];
      });
    },
    [],
  );

  const submitAttendance = useCallback(async () => {
    try {
      setIsLoading(true);

      const x = await CreateAttendance(
        props.batchId,
        currentDateStudentAttendanceRecords,
      );

      console.log("attendance created", x);

      SuccessNotification("Attendance updated!!");
    } catch (e: any) {
      console.log(e);

      const { message } = e.response.data;

      ErrorNotification(message);
    } finally {
      setIsLoading(false);
    }
  }, [
    props.batchId,
    currentDateStudentAttendanceRecords,
  ]);

  // =========================
  // MEMOIZED STUDENT LIST
  // =========================

  const renderedStudents = useMemo(() => {
    if (!isTodaySelected) return null;

    return props.students.map((student) => {
      const attendance = attendanceMap.get(student._id);

      return (
        <AttendanceCard
          key={student._id}
          studentId={student._id || ""}
          batchId={student.batchId!!}
          name={student.name}
          selectedDate={attendanceDate!!}
          phone={student.phoneNumber[0]}
          status={attendance?.status}
          setSingleAttendance={handleSingleAttendance}
          hidePhoneNumbers={false}
          studentAttendance={attendance}
        />
      );
    });
  }, [
    props.students,
    attendanceMap,
    attendanceDate,
    handleSingleAttendance,
    isTodaySelected,
  ]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />

      <Stack w={"100%"} mt={16} py={10} px={5} bg={"white"}>
        <Flex align={"center"} justify={"space-between"}>
          <Flex align={"center"}>
            <Box
              w="24px"
              h="24px"
              onClick={props.onBackClicked}
              style={{ cursor: "pointer" }}
            >
              <IconArrowBack color="black" />
            </Box>

            <Text ml={24} fw={600} fz={24}>
              View/Take Attendance
            </Text>
          </Flex>

          <Box
            onClick={() => setLeaveModalOpen(true)}
            style={{
              cursor: "pointer",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "10px",
            }}
          >
            <IconBellFilled size={28} color="#4B65F6" />

            {leaveCount > 0 && (
              <Box
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-8px",
                  backgroundColor: "#FF3B30",
                  borderRadius: "50%",
                  minWidth: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px",
                }}
              >
                {leaveCount}
              </Box>
            )}
          </Box>
        </Flex>

        <DatePickerInput
          rightSection={<IconCalendar stroke={1} />}
          value={attendanceDate}
          onChange={setAttendanceDate}
          clearable={false}
          maxDate={new Date()}
          radius={50}
          w={200}
        />
      </Stack>

      {props.students.length === 0 && (
        <Center h="65dvh" w="100%" bg={"white"}>
          <Stack align="center" justify="center">
            <Box
              style={{
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
            cols={3}
            py={12}
            style={{
              alignItems: "center",
              height: "50px",
            }}
          >
            <Text
              ta={isMobile ? "center" : "left"}
              ml={isMobile ? 0 : 10}
              fw={700}
              fz={isMobile ? 15 : 14}
            >
              Name
            </Text>

            <Text
              ta={isMobile ? "center" : "left"}
              fw={700}
              fz={isMobile ? 15 : 14}
            >
              Phone Number
            </Text>

            <Center>
              <Text fw={700} fz={isMobile ? 15 : 14} ta="center">
                {isMobile
                  ? "Attendance"
                  : isTodaySelected
                  ? "Mark Attendance"
                  : "Attendance"}
              </Text>
            </Center>
          </SimpleGrid>

          <ScrollArea
            h={isMobile ? "calc(100dvh - 340px)" : "50dvh"}
            px={5}
            bg={"white"}
            pb={isMobile ? 100 : 0}
          >
            {(prevDateSttendance.length === 0 ||
              isTodayAttendance) &&
              renderedStudents}

            {prevDateSttendance.length > 0 &&
              !isTodayAttendance &&
              prevDateSttendance.map((att) => (
                <SavedAttendanceCard
                  key={att._id}
                  studentId={att.studentId._id}
                  name={att.studentId.name}
                  phone={att.studentId.parentNumber}
                  date={attendanceDate}
                  submitHandler={() => {}}
                  status={att.status}
                />
              ))}
          </ScrollArea>

          {isTodaySelected && (
            <Center>
              <Button
                onClick={submitAttendance}
                style={{
                  backgroundColor: "#4B65F6",
                  marginBottom: isMobile
                    ? "150px"
                    : "20px",
                }}
                px={100}
              >
                Submit
              </Button>
            </Center>
          )}
        </>
      )}

      {openHomeWorkModal && (
        <Modal
          onClose={() => {
            setOpenHomeWorkModal(false);
          }}
          opened={openHomeWorkModal}
        >
          <Select
            data={props.subjects}
            label="Add any notice/update with the Attendance"
            value={selectedSubjectId}
            onChange={(value) => {
              if (value) setSelectedSubjectId(value);
            }}
          />
        </Modal>
      )}

      <StudentLeave
        opened={leaveModalOpen}
        onClose={(leaveId: string) => {
          if (leaveId) {
            setLeaveData((prev) =>
              prev.filter(
                (leave: any) => leave._id !== leaveId,
              ),
            );

            setLeaveCount((prev) => prev - 1);
          }

          setLeaveModalOpen(false);
        }}
        batchId={props.batchId}
        leaveData={leaveData}
      />
    </>
  );
}