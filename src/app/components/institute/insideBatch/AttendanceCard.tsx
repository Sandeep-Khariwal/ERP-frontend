"use client"

import { AttendanceInterface } from "@/interface/student.interface";
import { Box, Center, Flex, Select, SimpleGrid, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
}

const attendanceData = [
  AttendanceStatus.PRESENT,
  AttendanceStatus.ABSENT,
  AttendanceStatus.LATE,
];
export function AttendanceCard(props: {
  studentId: string;
  batchId: { _id: string; name: string };
  selectedDate: Date;
  name: string;
  phone: string;
  status: AttendanceStatus;
  setSingleAttendance: (val: AttendanceInterface) => void;
  hidePhoneNumbers: boolean;
}) {
  const [selectedStatus,setSelectedStatus] = useState<AttendanceStatus>(AttendanceStatus.ABSENT)
  useEffect(()=>{
    
    props.setSingleAttendance({
      _id: "",
      studentId: props.studentId,
      batchId: props.batchId._id,
      date: new Date(props.selectedDate) ,
      status:AttendanceStatus.ABSENT
    } as AttendanceInterface);
  },[])
  return (
    <>
      <Box
        style={{
          width: "100%",
          minHeight: "60px",
          borderBottom: "2px #D3D3D3 solid",
        }}
      >
        <SimpleGrid mt={10} fw={500} fz={13} c={"#7D7D7D"} cols={3}>
          <Flex align={"center"}>
            <Text>{props.name}</Text>
          </Flex>
          {!props.hidePhoneNumbers && (
            <Flex align={"center"}>
              <Text>{props.phone}</Text>
            </Flex>
          )}
          <Center>
            <Select
              data={attendanceData}
              
              onChange={(val) => {
                if (val) {
                  props.setSingleAttendance({
                    _id: "",
                    studentId: props.studentId,
                    batchId: props.batchId._id,
                    date: props.selectedDate,
                    status:val as AttendanceStatus
                  } as AttendanceInterface);
                }
                setSelectedStatus(val as AttendanceStatus)
              }}
              value={selectedStatus}
            />
          </Center>
        </SimpleGrid>
      </Box>
    </>
  );
}
export function SavedAttendanceCard(props: {
  studentId: string;
  name: string;
  phone: string;
  status: AttendanceStatus;
  date: Date | null;
  submitHandler: () => void;
}) {
  return (
    <>
      <Box
        style={{
          width: "100%",
          minHeight: "60px",
          borderBottom: "2px #D3D3D3 solid",
        }}
      >
        <SimpleGrid mt={10} fw={500} fz={13} c={"#7D7D7D"} cols={3}>
          <Text>{props.name}</Text>
          <Text>{props.phone}</Text>
          <Center>
            {props.status !== null && (
              <Box
                h={40}
                w={40}
                style={{
                  borderRadius: "50%",
                }}
                mr={5}
              >
                <Center h={"100%"}>{props.status}</Center>
              </Box>
            )}
          </Center>
        </SimpleGrid>
      </Box>
    </>
  );
}
