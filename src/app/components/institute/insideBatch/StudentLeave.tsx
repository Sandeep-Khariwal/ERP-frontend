"use client";

import {
  ErrorNotification,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import { PutLeaveMethod } from "@/axios/batch/BatchPutApi";
import {
  Modal,
  Stack,
  Text,
  Button,
  Avatar,
  Badge,
  Table,
  Group,
  ScrollArea,
  Paper,
  Flex,
} from "@mantine/core";
import { useState } from "react";

interface StudentLeaveProps {
  opened: boolean;
  onClose: (leaveId:string) => void;
  batchId: string;
  leaveData: any[];
}

const leaveStudents = [
  {
    id: 1,
    profile: "https://i.pravatar.cc/150?img=1",
    name: "Rahul Sharma",
    rollNumber: "101",
    reason: "Fever and cold ",
    leaveDate: "12 May 2026",
    status: "Pending",
  },
  {
    id: 2,
    profile: "https://i.pravatar.cc/150?img=2",
    name: "Priya Verma",
    rollNumber: "102",
    reason: "Family Function",
    leaveDate: "13 May 2026",
    status: "Pending",
  },
  {
    id: 3,
    profile: "https://i.pravatar.cc/150?img=3",
    name: "Aman Kumar",
    rollNumber: "103",
    reason: "Medical Checkup",
    leaveDate: "14 May 2026",
    status: "Pending",
  },
  {
    id: 4,
    profile: "https://i.pravatar.cc/150?img=4",
    name: "Sneha Gupta",
    rollNumber: "104",
    reason: "Personal Work",
    leaveDate: "15 May 2026",
    status: "Pending",
  },
];

const truncateReason = (text: string) => {
  if (text.length > 50) {
    return text.substring(0, 50) + "...";
  }

  return text;
};

export default function StudentLeave({
  opened,
  onClose,
  batchId,
  leaveData,
}: StudentLeaveProps) {
  const [declineLoading, setDeclineLoading] = useState<string>("");

  const handleLeaveAction = (leaveId: string, isDecline: boolean) => {
    setDeclineLoading(leaveId);

    PutLeaveMethod(leaveId, isDecline)
      .then((res: any) => {
        console.log("Leave Updated =>", res);

        SuccessNotification(
          isDecline
            ? "Leave Declined Successfully"
            : "Leave Approved Successfully",
        );
        onClose(leaveId);
        setDeclineLoading("");
      })
      .catch((e: any) => {
        console.log("Leave Update Error =>", e);

        ErrorNotification("Something went wrong");

        setDeclineLoading("");
      });
    onClose("");
  };

  return (
    <Modal
      opened={opened}
      onClose={()=>onClose("")}
      centered
      size="80%"
      radius={16}
      title={
        <Text fw={700} fz={22}>
          Student Leave Requests
        </Text>
      }
    >
      <Paper radius={16} p="md" bg="#F8FAFC">
        <ScrollArea>
          <Table
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
            verticalSpacing="md"
          >
            <Table.Thead bg="#EEF2FF">
              <Table.Tr>
                <Table.Th>
                  <Text fw={700}>Student</Text>
                </Table.Th>

                <Table.Th>
                  <Text fw={700}>Roll No.</Text>
                </Table.Th>

                <Table.Th>
                  <Text fw={700}>Reason</Text>
                </Table.Th>

                <Table.Th>
                  <Text fw={700}>Leave Date</Text>
                </Table.Th>

                <Table.Th>
                  <Text fw={700}>Status</Text>
                </Table.Th>

                <Table.Th>
                  <Text fw={700}>Action</Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {leaveData.map((student) => (
                <Table.Tr key={student._id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar
                        src={student.studentId?.profilePic}
                        radius="xl"
                        size={45}
                      />

                      <Text fw={600}>{student.studentId?.name}</Text>
                    </Group>
                  </Table.Td>

                  <Table.Td>
                    <Badge variant="light" color="blue" size="lg">
                      #{student.studentId?.rollNumber}
                    </Badge>
                  </Table.Td>

                  <Table.Td>
                    <Text
                      size="sm"
                      c="dimmed"
                      style={{
                        maxWidth: "300px",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        lineHeight: "1.5",
                      }}
                    >
                      {truncateReason(student.leaveReason)}
                    </Text>
                  </Table.Td>

                  <Table.Td>
                    <Text fw={500}>
                      {new Date(student.leaveDate).toLocaleDateString()}
                    </Text>
                  </Table.Td>

                  <Table.Td>
                    <Badge color="yellow" variant="light">
                      {student.status}
                    </Badge>
                  </Table.Td>

                  <Table.Td>
                    <Flex gap={10}>
                      <Button
                        color="green"
                        radius="md"
                        size="xs"
                        loading={declineLoading === student._id}
                        onClick={() => handleLeaveAction(student._id, false)}
                      >
                        Approve
                      </Button>
                      <Button
                        color="red"
                        radius="md"
                        size="xs"
                        variant="light"
                        loading={declineLoading === student._id}
                        onClick={() => handleLeaveAction(student._id, true)}
                      >
                        Decline
                      </Button>
                    </Flex>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </Modal>
  );
}
