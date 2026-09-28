"use client";

import { useState } from "react";

import {
  ActionIcon,
  Box,
  Button,
  Drawer,
  Flex,
  Group,
  Menu,
  Pagination,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";

import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import {
  IconDotsVertical,
  IconDownload,
  IconEye,
  IconSchool,
} from "@tabler/icons-react";

const PAGE_SIZE = 10;

// const studentsData = Array.from({ length: 32 }).map((_, i) => ({
//   id: i + 1,
//   name: `Student ${i + 1}`,
//   contact: "9876543210",
//   father: "Ramesh Kumar",
//   totalFees: "₹25,000",
//   pendingFees: i % 2 === 0 ? "₹5,000" : "₹0",
// }));

export default function SessionsPage(props: {
  batchId: string;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const studentsData:any = []

  const [selectedSession, setSelectedSession] =
    useState("2025-26");

  const [selectedStudent, setSelectedStudent] =
    useState<any>(null);

  const [page, setPage] = useState(1);

  const [
    opened,
    { open, close },
  ] = useDisclosure(false);

  const totalPages = Math.ceil(
    studentsData.length / PAGE_SIZE
  );

  const paginatedStudents = studentsData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <Box
      p={isMobile ? "sm" : "md"}
      style={{
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* HEADER */}
      <Paper
        radius="16px"
        p="xl"
        mb="xl"
        style={{
          background: "#EEF3FF",
          border: "1px solid #DCE7FF",
        }}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap="md">
          <Group>
            <Flex
              align="center"
              justify="center"
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: "#FFFFFF",
              }}
            >
              <IconSchool size={22} color="#2F6FED" />
            </Flex>

            <div>
              <Text fz={12} fw={600} c="#2F6FED" tt="uppercase" style={{ letterSpacing: 0.4 }}>
                Class records
              </Text>
              <Title order={3} c="#1B2559">
                Sessions
              </Title>
              <Text c="#5B6B8C" fz={13}>
                Review pass-out students and their final fee records by academic session.
              </Text>
            </div>
          </Group>

          <Paper radius="12px" p="sm" style={{ background: "#FFFFFF", border: "1px solid #DCE7FF" }}>
            <Text fz={12} c="#5B6B8C" fw={600}>
              Archived learners
            </Text>
            <Text fz={20} fw={700} c="#2F6FED">
              {studentsData.length} students
            </Text>
          </Paper>
        </Flex>
      </Paper>

      {/* SESSION SELECT */}
      <Paper
        radius="16px"
        p="lg"
        mb="xl"
        style={{
          background: "#fff",
          border: "1px solid #F1F4F9",
        }}
      >
        <Text fw={700} mb={2} c="#1B2559">
          Select session
        </Text>
        <Text fz={13} c="#5B6B8C" mb="md">
          Choose an academic year to view completed Class records.
        </Text>

        <Flex gap="sm">
          <Button
            radius="xl"
            color={
              selectedSession === "2025-26"
                ? "blue"
                : "gray"
            }
            variant={
              selectedSession === "2025-26"
                ? "filled"
                : "light"
            }
            onClick={() =>
              setSelectedSession("2025-26")
            }
          >
            2025-26
          </Button>

          <Button
            radius="xl"
            color={
              selectedSession === "2026-27"
                ? "blue"
                : "gray"
            }
            variant={
              selectedSession === "2026-27"
                ? "filled"
                : "light"
            }
            onClick={() =>
              setSelectedSession("2026-27")
            }
          >
            2026-27
          </Button>
        </Flex>
      </Paper>

      {/* TABLE */}
      <Paper
        radius="16px"
        p="lg"
        style={{
          background: "#fff",
          border: "1px solid #F1F4F9",
        }}
      >
        <Text fw={700} mb={2} c="#1B2559">
          Pass-out student register
        </Text>
        <Text fz={13} c="#5B6B8C" mb="md">
          Final enrollment and fee status for the selected session.
        </Text>
        <ScrollArea>
          <Table
            highlightOnHover
            verticalSpacing="md"
            horizontalSpacing="lg"
            style={{ minWidth: 950 }}
          >
            <Table.Thead>
              <Table.Tr
                style={{
                  background: "#F7F9FC",
                }}
              >
                {[
                  "Name",
                  "Contact",
                  "Father",
                  "Total Fees",
                  "Pending Fees",
                  "Action",
                ].map((item) => (
                  <Table.Th
                    key={item}
                    style={{
                      color: "#64748B",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {item}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {paginatedStudents.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={6} style={{ border: "none" }}>
                    <Stack align="center" gap={6} py={40}>
                      <ThemeIcon size={44} radius="xl" variant="light" color="blue">
                        <IconSchool size={22} />
                      </ThemeIcon>
                      <Text fw={600} c="#1B2559">
                        No pass-out students yet
                      </Text>
                      <Text fz={13} c="#5B6B8C">
                        Completed student records for {selectedSession} will appear here.
                      </Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              )}
              {paginatedStudents.map((student:any) => (
                <Table.Tr key={student.id}>
                  <Table.Td>
                    {student.name}
                  </Table.Td>

                  <Table.Td>
                    {student.contact}
                  </Table.Td>

                  <Table.Td>
                    {student.father}
                  </Table.Td>

                  <Table.Td>
                    {student.totalFees}
                  </Table.Td>

                  <Table.Td>
                    <Text
                      fw={700}
                      c={
                        student.pendingFees === "₹0"
                          ? "green"
                          : "red"
                      }
                    >
                      {student.pendingFees}
                    </Text>
                  </Table.Td>

                  <Table.Td>
                    <Menu
                      shadow="md"
                      width={180}
                      position="bottom-end"
                    >
                      <Menu.Target>
                        <ActionIcon
                          variant="light"
                          color="blue"
                        >
                          <IconDotsVertical size={18} />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={
                            <IconEye size={16} />
                          }
                          onClick={() => {
                            setSelectedStudent(student);
                            open();
                          }}
                        >
                          View Fees
                        </Menu.Item>

                        <Menu.Item
                          leftSection={
                            <IconDownload size={16} />
                          }
                        >
                          Download Marksheet
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        {/* PAGINATION */}
        <Flex
          justify="space-between"
          align="center"
          mt="xl"
          direction={
            isMobile ? "column" : "row"
          }
          gap="sm"
        >
          <Text size="sm" c="dimmed">
            Showing{" "}
            {Math.min(
              (page - 1) * PAGE_SIZE + 1,
              studentsData.length
            )}{" "}
            to{" "}
            {Math.min(
              page * PAGE_SIZE,
              studentsData.length
            )}{" "}
            of {studentsData.length} students
          </Text>

          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
            radius="xl"
            styles={{
              control: {
                "&[data-active]": {
                  background: "#2F6FED",
                  borderColor: "#2F6FED",
                },
              },
            }}
          />
        </Flex>
      </Paper>

      {/* DRAWER */}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size={isMobile ? "100%" : 420}
        title={
          <Text fw={700}>
            Student Details
          </Text>
        }
      >
        {selectedStudent && (
          <Stack>
            <Paper
              p="md"
              radius="lg"
              withBorder
            >
              <Text fw={700} mb={10}>
                {selectedStudent.name}
              </Text>

              <Text size="sm">
                Contact :{" "}
                {selectedStudent.contact}
              </Text>

              <Text size="sm">
                Father :{" "}
                {selectedStudent.father}
              </Text>

              <Text size="sm">
                Total Fees :{" "}
                {selectedStudent.totalFees}
              </Text>

              <Text
                size="sm"
                fw={700}
                c="red"
              >
                Pending Fees :{" "}
                {selectedStudent.pendingFees}
              </Text>
            </Paper>

            <Button
              radius="xl"
              leftSection={
                <IconDownload size={18} />
              }
              style={{
                background:
                  "linear-gradient(135deg, #2F6FED, #4F7CFB)",
              }}
            >
              Download Marksheet
            </Button>
          </Stack>
        )}
      </Drawer>
    </Box>
  );
}