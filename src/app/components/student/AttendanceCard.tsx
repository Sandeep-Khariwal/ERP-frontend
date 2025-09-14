import React, { useEffect, useState } from "react";
import {
  Card,
  Divider,
  Flex,
  LoadingOverlay,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { Attendance } from "./StudentAttendanceView";
import { IconArrowLeftFromArc, IconArrowUpFromArc } from "@tabler/icons-react";

const AttendanceCard = (props: {
  monthYear: string;
  records: Attendance[];
}) => {
  const [attendanceCount, setAttendanceCount] = useState({
    present: 0,
    absent: 0,
  });
  const [collapse, setCollapse] = useState<boolean>(false);
  useEffect(() => {
    countAttendance(props.records);
  }, [props.records]);

  const countAttendance = (attendance: Attendance[]) => {
    let presentCount = 0;
    let absentCount = 0;

    attendance.forEach((record) => {
      if (record.status === "PRESENT") {
        presentCount += 1;
      } else if (record.status === "ABSENT") {
        absentCount += 1;
      }
    });

    // Update the state with the new counts
    setAttendanceCount({ present: presentCount, absent: absentCount });
  };
  return (
    <Card
      w={"90%"}
      key={props.monthYear}
      shadow="sm"
      style={{ marginBottom: 20 }}
    >
      <Flex w={"100%"} align={"center"} justify={"space-between"}
       bg={"linear-gradient(135deg, #e6abebff 0%, #b0baefff) 100%"}
       p={5} style={{borderRadius:"0.5rem"}} >
        <Text fz={24} ff={"Poppins"} fw={600}>
          {props.monthYear}
        </Text>
        <Stack align="center">
          <Text lh={0.3} fz={18} ff={"Nunito"} fw={600}>
            Present
          </Text>
          <Text lh={0.3} fz={16} ff={"Nunito"}>
            {attendanceCount.present}
          </Text>
        </Stack>
        <Stack align="center">
          <Text lh={0.3} fz={18} ff={"Nunito"} fw={600}>
            Absent
          </Text>
          <Text lh={0.3} fz={16} ff={"Nunito"}>
            {attendanceCount.absent}
          </Text>
        </Stack>
        <Stack>
          {collapse ? (
            <IconArrowUpFromArc
              style={{ cursor: "pointer" }}
              onClick={() => setCollapse(false)}
            />
          ) : (
            <IconArrowLeftFromArc
              style={{ cursor: "pointer" }}
              onClick={() => setCollapse(true)}
            />
          )}
        </Stack>
      </Flex>
      <Divider c={"gray"} mt={10} />
      {
 collapse &&
      <Table striped highlightOnHover style={{ marginTop: 20 }} >
        <thead>
          <tr>
            <th style={{ textAlign: "start" }}>Student </th>
            <th style={{ textAlign: "start" }}>Batch </th>
            <th style={{ textAlign: "start" }}>Status</th>
            <th style={{ textAlign: "start" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {props.records?.map((attendanceRecord) => (
            <tr key={attendanceRecord._id}>
              <td style={{ textAlign: "start" }}>
                {attendanceRecord.studentId.name}
              </td>
              <td style={{ textAlign: "start" }}>
                {attendanceRecord.batchId.name}
              </td>
              <td style={{ textAlign: "start" }}>{attendanceRecord.status}</td>
              <td style={{ textAlign: "start" }}>
                {new Date(attendanceRecord.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      }
    </Card>
  );
};

export default AttendanceCard;
