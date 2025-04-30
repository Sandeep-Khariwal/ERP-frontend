"use client";

import { GetStudentAttendance } from "@/api/student/StudentGetApi";
import { Card, LoadingOverlay, Stack, Table, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { AttendanceStatus } from "../institute/insideBatch/AttendanceCard";
import AttendanceCard from "./AttendanceCard";

export interface Attendance {
  date: string;
  status: AttendanceStatus;
  studentId: {
    _id: string;
    name: string;
  };
  batchId: {
    _id: string;
    name: string;
  };

  _id: string;
  __v: number;
}

interface AttendanceByMonth {
  [month: string]: Attendance[];
}

const groupAttendanceByMonth = (
  attendance: Attendance[]
): Map<string, Attendance[]> => {
  const attendanceMap = new Map<string, Attendance[]>();

  attendance.forEach((record) => {
    const monthYear = new Date(record.date).toISOString().slice(0, 7); // Format: "YYYY-MM"

    if (!attendanceMap.has(monthYear)) {
      attendanceMap.set(monthYear, []);
    }
    attendanceMap.get(monthYear)?.push(record); // Push the attendance to the respective month
  });

  return attendanceMap;
};

const StudentAttendanceView = (props: { studentId: string }) => {
  const [attendance, setAttendance] = useState<Map<string, Attendance[]>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (props.studentId) {
      setIsLoading(true);
      GetStudentAttendance(props.studentId)
        .then((x: any) => {
          const { attendance } = x.attendance;
          setIsLoading(false);

          const groupedAttendance = groupAttendanceByMonth(attendance);
          setAttendance(groupedAttendance);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    }
  }, [props.studentId]);
  return (
    <Stack w={"100%"}>
      <LoadingOverlay visible={isLoading} />
      <Stack w={"100%"} p={10}>
        <Text ta={"start"} fw={600} ff={"Roboto"} fz={24}>
          Attendance Records
        </Text>

        {Array.from(attendance.keys()).map((monthYear) => {
          const records = attendance.get(monthYear);
          return (
            <AttendanceCard monthYear={monthYear} records={records || []} />
          );
        })}
      </Stack>
    </Stack>
  );
};

export default StudentAttendanceView;
