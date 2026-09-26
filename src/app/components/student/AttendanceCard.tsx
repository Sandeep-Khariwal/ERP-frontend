import React, { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { Attendance } from "./StudentAttendanceView";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

const AttendanceCard = (props: {
  monthYear: string;
  records: Attendance[];
}) => {
  const [collapse, setCollapse] = useState<boolean>(false);
  const attendanceCount = useMemo(
    () =>
      props.records.reduce(
        (counts, record) => {
          if (record.status === "PRESENT") counts.present += 1;
          if (record.status === "ABSENT") counts.absent += 1;
          return counts;
        },
        { present: 0, absent: 0 },
      ),
    [props.records],
  );
  const [year, month] = props.monthYear.split("-").map(Number);
  const monthStart = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startOffset = (monthStart.getDay() + 6) % 7;
  const recordsByDay = new Map<number, Attendance[]>();
  props.records.forEach((record) => {
    const day = new Date(record.date).getUTCDate();
    recordsByDay.set(day, [...(recordsByDay.get(day) ?? []), record]);
  });
  const calendarCells = Array.from(
    { length: startOffset + daysInMonth },
    (_, index) => (index < startOffset ? null : index - startOffset + 1),
  );

  return (
    <Card
      w="100%"
      shadow="0 2px 8px rgba(20, 42, 76, 0.06)"
      radius={10}
      p={{ base: "sm", sm: "md" }}
      withBorder
      style={{ marginBottom: 16, borderColor: "#e5eaf2", minWidth: 0 }}
    >
      <Flex
        w="100%"
        align="center"
        justify="space-between"
        gap="sm"
        wrap="wrap"
        pb="sm"
        style={{ borderBottom: "1px solid #edf0f5" }}
      >
        <Text fz={14} fw={700} c="#172033">
          {monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </Text>
        <Group gap="xs">
          <Badge color="teal" variant="light" size="sm" radius="xl">
            Present {attendanceCount.present}
          </Badge>
          <Badge color="red" variant="light" size="sm" radius="xl">
            Absent {attendanceCount.absent}
          </Badge>
          <ActionIcon
            variant="white"
            color="blue"
            aria-label={collapse ? "Collapse attendance records" : "Expand attendance records"}
            onClick={() => setCollapse((current) => !current)}
          >
            {collapse ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
          </ActionIcon>
        </Group>
      </Flex>
      <Box mt="md">
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: 5,
          }}
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <Text key={day} ta="center" fz={10} fw={700} c="#667085" py={4}>
              {day}
            </Text>
          ))}
          {calendarCells.map((day, index) => {
            const dayRecords = day ? recordsByDay.get(day) ?? [] : [];
            const isPresent = dayRecords.some((record) => record.status === "PRESENT");
            const isAbsent = dayRecords.some((record) => record.status === "ABSENT");

            return (
              <Box
                key={`${props.monthYear}-${index}`}
                aria-label={day ? `${day}${dayRecords.length ? ` ${dayRecords.map((record) => record.status.toLowerCase()).join(", ")}` : ""}` : undefined}
                style={{
                  aspectRatio: "1 / 1",
                  minHeight: 30,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 7,
                  background: isPresent ? "#07966f" : isAbsent ? "#e42d2d" : day ? "#f0f3fa" : "transparent",
                  color: isPresent || isAbsent ? "#ffffff" : "#526176",
                  fontSize: 11,
                  fontWeight: dayRecords.length > 0 ? 700 : 500,
                }}
              >
                {day}
              </Box>
            );
          })}
        </Box>
      </Box>
      {collapse && (
        <ScrollArea type="auto" offsetScrollbars mt="sm">
          <Table striped highlightOnHover miw={520} verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Student</Table.Th>
                <Table.Th>Batch</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {props.records.map((attendanceRecord) => (
                <Table.Tr key={attendanceRecord._id}>
                  <Table.Td>{attendanceRecord.studentId.name}</Table.Td>
                  <Table.Td>{attendanceRecord.batchId.name}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        attendanceRecord.status === "PRESENT"
                          ? "teal"
                          : attendanceRecord.status === "ABSENT"
                            ? "red"
                            : "gray"
                      }
                      variant="light"
                    >
                      {attendanceRecord.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {new Date(attendanceRecord.date).toLocaleDateString()}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </Card>
  );
};

export default AttendanceCard;
