"use client";

import React from "react";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  Flex,
  Group,
  ActionIcon,
  Menu,
  Stack,
  Text,
  Paper,
  Grid,
  Table,
  Checkbox,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconUserCircle,
  IconPhone,
  IconMail,
  IconId,
  IconEye,
  IconLayersIntersect,
  IconCalendar,
  IconMapPin,
  IconUserCheck,
  IconGenderMale,
  IconBriefcase,
  IconUserHeart,
  IconReceipt,
} from "@tabler/icons-react";
import { StudentListItem } from "./InstituteStudentsPage";

// ----------------------------------------------------
// Helper Safe Extractors (same as the old StudentCard)
// ----------------------------------------------------
const getValue = (val: any, fallback = "Not Provided"): string => {
  if (
    val === undefined ||
    val === null ||
    val === "" ||
    val === "null" ||
    val === "undefined"
  ) {
    return fallback;
  }
  if (typeof val === "string" && val.trim().length === 0) {
    return fallback;
  }
  return String(val);
};

const formatDate = (dateValue?: Date | string) => {
  if (!dateValue) return "Not Provided";
  const parsedDate = new Date(dateValue);
  if (isNaN(parsedDate.getTime())) return "Not Provided";
  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const StudentTableRow = (props: {
  student: StudentListItem;
  selected: boolean;
  onToggleSelect: () => void;
  onManageBatch: () => void;
}) => {
  const { student } = props;
  const [opened, { open, close }] = useDisclosure(false);

  // Batches extraction logic (same as old StudentCard)
  const getBatchNames = (): string[] => {
    if (student?.batchIds && Array.isArray(student.batchIds) && student.batchIds.length > 0) {
      return student.batchIds.map((b: any) =>
        typeof b === "object" && b !== null ? b.name || "Unnamed Batch" : String(b),
      );
    }
    if (student?.batchId && typeof student.batchId === "object" && student.batchId !== null) {
      return [(student.batchId as any).name || "Unnamed Batch"];
    }
    return [];
  };

  const batchNames = getBatchNames();
  const currentBatchName = batchNames[0];

  const mainPhone =
    Array.isArray(student?.phoneNumber) && student.phoneNumber.length > 0
      ? student.phoneNumber[0]
      : getValue(student?.phoneNumber);

  const email = getValue(student?.email);
  const address = getValue(student?.address);
  const fatherParentName = getValue(student?.parentName);
  const fatherParentNumber = getValue(student?.parentNumber);
  const motherName = getValue(student?.motherName);

  const rawGender = getValue(student?.gender, "Not Specified");
  const gender =
    rawGender !== "Not Specified"
      ? rawGender.charAt(0).toUpperCase() + rawGender.slice(1).toLowerCase()
      : "Not Specified";

  const admissionNo = getValue(student?.admissionNumber || student?.enrollmentNo);
  const dob = formatDate(student?.dateOfBirth);
  const dateOfJoining = formatDate(student?.dateOfJoining || student?.createdAt);
  const studentId = getValue(student?._id, "N/A");

  return (
    <>
      <Table.Tr style={{ cursor: "pointer" }} onClick={open}>
        <Table.Td onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={props.selected} onChange={props.onToggleSelect} />
        </Table.Td>
        <Table.Td>
          <Avatar src={student.profilePic} radius="xl" size={40} color="violet">
            {!student.profilePic && <IconUserCircle size={26} />}
          </Avatar>
        </Table.Td>
        <Table.Td>
          <Text fz={14} fw={600}>
            {getValue(student?.name, "Unnamed Student")}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text fz={13} c={student.rollNumber ? undefined : "dimmed"}>
            {student.rollNumber ? `Roll No: ${student.rollNumber}` : "No Roll No"}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text fz={13}>{mainPhone}</Text>
        </Table.Td>
        <Table.Td>
          {currentBatchName ? (
            <Badge variant="light" color="violet" radius="xl" size="sm" tt="none">
              {currentBatchName}
            </Badge>
          ) : (
            <Badge variant="subtle" color="gray" radius="xl" size="sm" tt="none">
              No batch assigned
            </Badge>
          )}
        </Table.Td>
        <Table.Td>
          <Badge variant="light" color={currentBatchName ? "green" : "gray"} radius="sm">
            {currentBatchName ? "Active" : "Unassigned"}
          </Badge>
        </Table.Td>
        <Table.Td onClick={(e) => e.stopPropagation()}>
          <Menu position="bottom-end" shadow="md" withinPortal>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={16} />} onClick={open}>
                View Details
              </Menu.Item>
              <Menu.Item
                leftSection={<IconLayersIntersect size={16} />}
                onClick={props.onManageBatch}
              >
                Manage Batches
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>

      {/* ---------------- FULL STUDENT DETAIL DRAWER ---------------- */}
      <Drawer
        opened={opened}
        onClose={close}
        title={
          <Text fw={700} fz={18}>
            Student Full Profile
          </Text>
        }
        position="right"
        size="md"
        padding="lg"
      >
        <Stack gap="md">
          <Paper p="md" radius="md" withBorder bg="#F8F9FA">
            <Flex direction="column" align="center" justify="center" gap="xs">
              <Avatar src={student?.profilePic || undefined} radius="xl" size={84} color="violet">
                {!student?.profilePic && <IconUserCircle size={56} />}
              </Avatar>
              <Text fz={20} fw={700} c="#1A1A1A" ta="center">
                {getValue(student?.name, "Unnamed Student")}
              </Text>
              <Group gap="xs">
                <Badge color="violet" variant="filled" radius="sm">
                  {student?.rollNumber ? `Roll No: ${student.rollNumber}` : "No Roll Number"}
                </Badge>
                {admissionNo !== "Not Provided" && (
                  <Badge color="gray" variant="outline" radius="sm">
                    Adm No: {admissionNo}
                  </Badge>
                )}
              </Group>
            </Flex>
          </Paper>

          <Box>
            <Text fz={11} fw={700} c="dimmed" tt="uppercase" mb={6}>
              Contact Information
            </Text>
            <Paper p="sm" radius="md" withBorder>
              <Stack gap="xs">
                <Group gap="sm" wrap="nowrap">
                  <IconPhone size={18} color="#7E57C2" />
                  <Box>
                    <Text fz={11} c="dimmed">Student Phone</Text>
                    <Text fz={13} fw={500}>{mainPhone}</Text>
                  </Box>
                </Group>

                <Divider my={2} />

                <Group gap="sm" wrap="nowrap">
                  <IconMail size={18} color="#7E57C2" />
                  <Box>
                    <Text fz={11} c="dimmed">Email Address</Text>
                    <Text fz={13} fw={500}>{email}</Text>
                  </Box>
                </Group>

                <Divider my={2} />

                <Group gap="sm" wrap="nowrap">
                  <IconMapPin size={18} color="#7E57C2" />
                  <Box>
                    <Text fz={11} c="dimmed">Address</Text>
                    <Text fz={13} fw={500}>{address}</Text>
                  </Box>
                </Group>
              </Stack>
            </Paper>
          </Box>

          <Box>
            <Text fz={11} fw={700} c="dimmed" tt="uppercase" mb={6}>
              Parent & Family Details
            </Text>
            <Paper p="sm" radius="md" withBorder>
              <Grid gutter="xs">
                <Grid.Col span={6}>
                  <Group gap="xs" wrap="nowrap">
                    <IconUserCheck size={18} color="#7E57C2" />
                    <Box>
                      <Text fz={11} c="dimmed">Parent/Father Name</Text>
                      <Text fz={13} fw={500}>{fatherParentName}</Text>
                    </Box>
                  </Group>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Group gap="xs" wrap="nowrap">
                    <IconPhone size={18} color="#7E57C2" />
                    <Box>
                      <Text fz={11} c="dimmed">Parent Number</Text>
                      <Text fz={13} fw={500}>{fatherParentNumber}</Text>
                    </Box>
                  </Group>
                </Grid.Col>

                <Grid.Col span={12} mt="xs">
                  <Group gap="xs" wrap="nowrap">
                    <IconUserHeart size={18} color="#7E57C2" />
                    <Box>
                      <Text fz={11} c="dimmed">Mother Name</Text>
                      <Text fz={13} fw={500}>{motherName}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
              </Grid>
            </Paper>
          </Box>

          <Box>
            <Text fz={11} fw={700} c="dimmed" tt="uppercase" mb={6}>
              Personal Details
            </Text>
            <Paper p="sm" radius="md" withBorder>
              <Grid gutter="xs">
                <Grid.Col span={6}>
                  <Group gap="xs" wrap="nowrap">
                    <IconGenderMale size={18} color="#7E57C2" />
                    <Box>
                      <Text fz={11} c="dimmed">Gender</Text>
                      <Text fz={13} fw={500}>{gender}</Text>
                    </Box>
                  </Group>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Group gap="xs" wrap="nowrap">
                    <IconCalendar size={18} color="#7E57C2" />
                    <Box>
                      <Text fz={11} c="dimmed">Date of Birth</Text>
                      <Text fz={13} fw={500}>{dob}</Text>
                    </Box>
                  </Group>
                </Grid.Col>

                <Grid.Col span={6} mt="xs">
                  <Group gap="xs" wrap="nowrap">
                    <IconBriefcase size={18} color="#7E57C2" />
                    <Box>
                      <Text fz={11} c="dimmed">Date of Joining</Text>
                      <Text fz={13} fw={500}>{dateOfJoining}</Text>
                    </Box>
                  </Group>
                </Grid.Col>

                <Grid.Col span={6} mt="xs">
                  <Group gap="xs" wrap="nowrap">
                    <IconReceipt size={18} color="#7E57C2" />
                    <Box>
                      <Text fz={11} c="dimmed">Admission No.</Text>
                      <Text fz={13} fw={500}>{admissionNo}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
              </Grid>
            </Paper>
          </Box>

          <Box>
            <Text fz={11} fw={700} c="dimmed" tt="uppercase" mb={6}>
              Assigned Batches
            </Text>
            <Paper p="sm" radius="md" withBorder bg="#FAF9FE">
              <Flex wrap="wrap" gap={6}>
                {batchNames.length > 0 ? (
                  batchNames.map((name, idx) => (
                    <Badge key={idx} color="violet" size="md" radius="sm" variant="light">
                      {name}
                    </Badge>
                  ))
                ) : (
                  <Text fz={13} c="dimmed">
                    No batches currently assigned.
                  </Text>
                )}
              </Flex>
            </Paper>
          </Box>

          <Box>
            <Text fz={11} fw={700} c="dimmed" tt="uppercase" mb={6}>
              System Information
            </Text>
            <Paper p="sm" radius="md" withBorder>
              <Group gap="sm" wrap="nowrap">
                <IconId size={18} color="#7E57C2" />
                <Box style={{ overflow: "hidden" }}>
                  <Text fz={11} c="dimmed">Student System ID</Text>
                  <Text fz={12} fw={500} style={{ wordBreak: "break-all" }}>
                    {studentId}
                  </Text>
                </Box>
              </Group>
            </Paper>
          </Box>
        </Stack>
      </Drawer>
    </>
  );
};

export default StudentTableRow;