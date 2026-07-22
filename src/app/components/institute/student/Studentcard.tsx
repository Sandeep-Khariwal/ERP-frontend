"use client";

import React from "react";
import {
  Avatar,
  Badge,
  Box,
  Card,
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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconUserCircle,
  IconPhone,
  IconMail,
  IconId,
  IconEye,
  IconEdit,
  IconLayersIntersect,
  IconCalendar,
  IconMapPin,
  IconUserCheck,
  IconGenderMale,
  IconBriefcase,
  IconUserHeart,
  IconReceipt,
} from "@tabler/icons-react";

export interface BatchItem {
  _id?: string;
  id?: string;
  name: string;
}

export interface StudentListItem {
  _id?: string;
  id?: string;
  name?: string;
  rollNumber?: string;
  enrollmentNo?: string;
  admissionNumber?: string;
  profilePic?: string;
  phoneNumber?: string[];
  email?: string;
  address?: string;
  
  // Parent & Family Info
  parentName?: string;
  parentNumber?: string;
  motherName?: string;

  // Personal Info
  gender?: string;
  dateOfBirth?: Date | string;
  dateOfJoining?: Date | string;
  createdAt?: Date | string;

  // Batches
  batchId?: string | BatchItem;
  batchIds?: (string | BatchItem)[];
}

interface StudentCardProps {
  student: StudentListItem | any; // 'any' for fallback API safety
  onManageBatches: () => void;
  onEditStudent?: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student = {},
  onManageBatches,
  onEditStudent,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  // ----------------------------------------------------
  // Helper Safe Extractors (Avoids 'Not Provided' bug)
  // ----------------------------------------------------
  const getValue = (val: any, fallback = "Not Provided"): string => {
    if (val === undefined || val === null || val === "" || val === "null" || val === "undefined") {
      return fallback;
    }
    if (typeof val === "string" && val.trim().length === 0) {
      return fallback;
    }
    return String(val);
  };

  // Batches extraction logic
  const getBatchNames = (): string[] => {
    if (student?.batchIds && Array.isArray(student.batchIds) && student.batchIds.length > 0) {
      return student.batchIds.map((b: any) =>
        typeof b === "object" && b !== null ? b.name || "Unnamed Batch" : String(b)
      );
    }
    if (student?.batchId && typeof student.batchId === "object" && student.batchId !== null) {
      return [student.batchId.name || "Unnamed Batch"];
    }
    return [];
  };

  const batchNames = getBatchNames();

  // Safely Extract Field Values (Direct Backend Key Matches)
  const mainPhone =
    Array.isArray(student?.phoneNumber) && student.phoneNumber.length > 0
      ? student.phoneNumber[0]
      : getValue(student?.phoneNumber);

  const email = getValue(student?.email);
  const address = getValue(student?.address);
  const fatherParentName = getValue(student?.parentName);
  const fatherParentNumber = getValue(student?.parentNumber);
  const motherName = getValue(student?.motherName);
  
  // Gender fix (Handles capitalized, small or mixed case values)
  const rawGender = getValue(student?.gender, "Not Specified");
  const gender = rawGender !== "Not Specified" 
    ? rawGender.charAt(0).toUpperCase() + rawGender.slice(1).toLowerCase() 
    : "Not Specified";

  const admissionNo = getValue(student?.admissionNumber || student?.enrollmentNo);

  // Safe Date Formatting Helper
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

  const dob = formatDate(student?.dateOfBirth);
  const dateOfJoining = formatDate(student?.dateOfJoining || student?.createdAt);
  const studentId = getValue(student?._id || student?.id, "N/A");

  return (
    <>
      {/* ---------------- CARD VIEW ---------------- */}
      <Card
        shadow="xs"
        radius="lg"
        p="lg"
        bg="#FFFFFF"
        style={{
          border: "1px solid #E9ECEF",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer",
        }}
        styles={{
          root: {
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.08)",
            },
          },
        }}
        onClick={open}
      >
        <Flex justify="space-between" align="flex-start">
          <Flex gap={12} align="center">
            <Avatar
              src={student?.profilePic || undefined}
              radius="xl"
              size={54}
              color="violet"
            >
              {!student?.profilePic && <IconUserCircle size={36} />}
            </Avatar>
            <Box style={{ overflow: "hidden" }}>
              <Text fz={16} fw={700} c="#212529" lineClamp={1}>
                {getValue(student?.name, "Unnamed Student")}
              </Text>

              {student?.rollNumber ? (
                <Text fz={12} c="#6C757D" fw={500}>
                  Roll No: {student.rollNumber}
                </Text>
              ) : (
                <Text fz={12} c="#ADB5BD">
                  No Roll No
                </Text>
              )}

              <Text fz={13} c="#495057" fw={500} mt={2}>
                {mainPhone}
              </Text>
            </Box>
          </Flex>

          {/* Action Menu */}
          <Menu position="bottom-end" shadow="md" withinPortal>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
              <Menu.Item
                leftSection={<IconEye size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
              >
                View Details
              </Menu.Item>
              <Menu.Item
                leftSection={<IconLayersIntersect size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onManageBatches();
                }}
              >
                Manage Batches
              </Menu.Item>
              {onEditStudent && (
                <Menu.Item
                  leftSection={<IconEdit size={16} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditStudent();
                  }}
                >
                  Edit Profile
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Flex>

        {/* Batches Badges */}
        <Flex mt={16} wrap="wrap" gap={6}>
          {batchNames.length > 0 ? (
            batchNames.map((name, idx) => (
              <Badge
                key={idx}
                variant="light"
                color="violet"
                radius="xl"
                size="sm"
                tt="none"
              >
                {name}
              </Badge>
            ))
          ) : (
            <Badge variant="subtle" color="gray" radius="xl" size="sm" tt="none">
              No batch assigned
            </Badge>
          )}
        </Flex>
      </Card>

      {/* ---------------- FULL STUDENT DETAIL DRAWER ---------------- */}
      <Drawer
        opened={opened}
        onClose={close}
        title={<Text fw={700} fz={18}>Student Full Profile</Text>}
        position="right"
        size="md"
        padding="lg"
      >
        <Stack gap="md">
          {/* Top Profile Header */}
          <Paper p="md" radius="md" withBorder bg="#F8F9FA">
            <Flex direction="column" align="center" justify="center" gap="xs">
              <Avatar
                src={student?.profilePic || undefined}
                radius="xl"
                size={84}
                color="violet"
              >
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

          {/* Contact Details Section */}
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

          {/* Parents & Family Information */}
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

          {/* Personal Information */}
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

          {/* Batches Information */}
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

          {/* System Details */}
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