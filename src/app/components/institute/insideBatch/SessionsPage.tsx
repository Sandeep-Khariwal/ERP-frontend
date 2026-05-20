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

const studentsData = Array.from({ length: 32 }).map((_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  contact: "9876543210",
  father: "Ramesh Kumar",
  totalFees: "₹25,000",
  pendingFees: i % 2 === 0 ? "₹5,000" : "₹0",
}));

export default function SessionsPage(props: {
  batchId: string;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

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
        radius="28px"
        p="xl"
        mb="xl"
        style={{
          background:
            "linear-gradient(135deg, #5c3de8, #7b5ef8)",
          color: "white",
        }}
      >
        <Group>
          <ThemeIcon
            size={50}
            radius="xl"
            variant="light"
            color="white"
          >
            <IconSchool size={26} />
          </ThemeIcon>

          <div>
            <Title order={2} c="white">
              Sessions
            </Title>

            <Text c="rgba(255,255,255,0.8)">
              Previous session passout students
            </Text>
          </div>
        </Group>
      </Paper>

      {/* SESSION SELECT */}
      <Paper
        radius="24px"
        p="lg"
        mb="xl"
        style={{
          background: "#fff",
          border: "1px solid #f1ebff",
        }}
      >
        <Text fw={700} mb="md" c="#3F51B5">
          Select Session
        </Text>

        <Flex gap="sm">
          <Button
            radius="xl"
            color={
              selectedSession === "2025-26"
                ? "violet"
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
                ? "violet"
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
        radius="24px"
        p="lg"
        style={{
          background: "#fff",
          border: "1px solid #f1ebff",
        }}
      >
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
                  background: "#f5f0ff",
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
                      color: "#5c3de8",
                      fontWeight: 700,
                    }}
                  >
                    {item}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {paginatedStudents.map((student) => (
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
                          color="violet"
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
                  background: "#5c3de8",
                  borderColor: "#5c3de8",
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
                  "linear-gradient(135deg, #5c3de8, #7b5ef8)",
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