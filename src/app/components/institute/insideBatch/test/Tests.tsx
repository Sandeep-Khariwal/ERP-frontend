"use client";

import { StudentsDataWithBatch } from "@/interfaces/student.interface";
import React, { useEffect, useState } from "react";
import { Test } from "../InstituteInsideBatch";
import {
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import TestDisplayModal from "./TestDisplayModal";
import AddTestsModal from "./AddtestsModal";
import {
  DeleteTestById,
  GetAllTestsByBatchAndSubject,
  RestoreTestById,
} from "@/axios/tests/TestsGetApi";
import {
  ErrorNotification,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import dayjs from "dayjs";
import SimpleEditTestModal from "./TestOverviewCard";
import { useMediaQuery } from "@mantine/hooks";
import ShowStudentResultsModal from "./ShowStudentResultsModal";
import { IconFlask } from "@tabler/icons-react";

const Tests = (props: {
  batchId: string;
  subjects: { _id: string; name: string }[];
}) => {
  // State management
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAllResultsModal, setShowAllResultsModal] =
    useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 968px)`);

  // Maps for efficient filtering
  const [subjectTestsMap, setSubjectTestsMap] = useState<Map<string, Test[]>>(
    new Map()
  );
  const [subjectsMap, setSubjectsMap] = useState<
    Map<string, { _id: string; name: string }>
  >(new Map());

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTestModalOpen, setEditTestModalOpen] = useState(false);
  const [openAddTestsModal, setOpenAddTestsModal] = useState<boolean>(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    testId: string | null;
    testName: string;
  }>({ isOpen: false, testId: null, testName: "" });

  // Fetch tests and build maps
  useEffect(() => {
    fetchTests();
  }, [props.batchId]);

  // Update displayed tests when subject filter changes
  useEffect(() => {
    if (!selectedSubjectId) {
      // Show all tests
      const allTests: Test[] = [];
      subjectTestsMap.forEach((tests) => {
        allTests.push(...tests);
      });
      setTests(allTests);
    } else {
      // Show tests for selected subject
      const subjectTests = subjectTestsMap.get(selectedSubjectId) || [];
      setTests(subjectTests);
    }
  }, [selectedSubjectId, subjectTestsMap]);

  // Fetch tests using your preferred structure
  const fetchTests = () => {
    setIsLoading(true);

    GetAllTestsByBatchAndSubject(props.batchId, selectedSubjectId ?? "")
      .then((res: any) => {
        let testsData = res.data;
        const newMap = new Map();
        const testMap = new Map();

        testsData.forEach((test: any) => {
          const { subject } = test;

          if (!newMap.has(subject._id)) {
            newMap.set(subject._id, subject);
          }
          if (!testMap.has(subject._id)) {
            testMap.set(subject._id, [test]);
          } else {
            testMap.get(subject._id)?.push(test);
          }
        });

        setSubjectsMap(newMap);
        setSubjectTestsMap(testMap);
        setTests(testsData);
        setIsLoading(false);
      })
      .catch((err) => {
        ErrorNotification("Failed to fetch tests");
        setTests([]);
        setIsLoading(false);
      });
  };

  // Handle subject filter change
  const handleSubjectChange = (value: string | null) => {
    setSelectedSubjectId(value || "");
  };

  // Helper functions
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const formatDuration = (totalTime: number): string => {
    const totalMinutes =
      totalTime > 1000 ? Math.round(totalTime / (1000 * 60)) : totalTime;
    if (!totalMinutes || totalMinutes <= 0) return "N/A";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} mins`;
    if (minutes === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
    return `${hours}:${minutes.toString().padStart(2, "0")} hrs`;
  };

  const calculateMaxMarks = (test: Test): string => {
    return (test.questions?.length || 0).toString();
  };

  // Delete test function - no need for separate refresh function
  const handleDeleteTest = (testId: string) => {
    DeleteTestById(testId)
      .then(() => {
        SuccessNotification("Test deleted successfully");
        setDeleteConfirmModal({ isOpen: false, testId: null, testName: "" });
        fetchTests(); // Just call fetchTests directly
      })
      .catch((error) => {
        ErrorNotification("Failed to delete test");
      });
  };

  // Get subjects for dropdown from map
  const getSubjectsForDropdown = () => {
    const subjectOptions = [{ value: "", label: "All Subjects" }];

    subjectsMap.forEach((subject) => {
      subjectOptions.push({
        value: subject._id,
        label: subject.name,
      });
    });

    return subjectOptions;
  };
  // Get subjects for dropdown from map
  const getSubjectsWithIdName = () => {
    const subjectOptions = [{ _id: "", name: "All Subjects" }];

    subjectsMap.forEach((subject) => {
      subjectOptions.push({
        _id: subject._id,
        name: subject.name,
      });
    });

    return subjectOptions;
  };

  return (
    <>
      <Stack w="100%" mt={20} mx="auto" gap={20}>
        {/* Header with Add Button and Subject Filter */}
        <Box
          p={20}
          style={{
            borderRadius: "16px",
            background: "#EEF3FF",
            border: "1px solid #DCE7FF",
          }}
        >
          <Flex
            justify="space-between"
            direction={isMd ? "column" : "row"}
            align={isMd ? "flex-start" : "center"}
            w="100%"
            gap={16}
          >
            <Flex align="center" gap={14}>
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
                <IconFlask size={22} color="#2F6FED" />
              </Flex>
              <Stack gap={2}>
                <Text fz={22} fw={700} c="#1B2559">
                  Tests
                </Text>
                <Text fz={13} c="#5B6B8C">
                  Build, schedule, and review class assessments.
                </Text>
              </Stack>
            </Flex>
            <Flex gap={10} w={isMd ? "100%" : "auto"} align="end">
              <Select
                placeholder="All Subjects"
                label="Filter by Subject"
                value={selectedSubjectId}
                onChange={handleSubjectChange}
                data={getSubjectsForDropdown()}
                clearable
                radius={10}
                w={isMd ? "60%" : 220}
              />
              <Button
                radius={10}
                styles={{
                  root: {
                    background: "linear-gradient(135deg, #4F7CFB 0%, #2F6FED 100%)",
                    border: 0,
                    fontWeight: 600,
                  },
                }}
                onClick={() => setOpenAddTestsModal(true)}
              >
                + Add Test
              </Button>
            </Flex>
          </Flex>
        </Box>

        {/* Tests List */}
        {isLoading ? (
          <Box p="xl" style={{ textAlign: "center" }}>
            <LoadingOverlay visible={isLoading} />
          </Box>
        ) : tests.length > 0 ? (
          <Stack gap={16}>
            {tests.map((test) => {
              const status =
                test.resultId.length > 0
                  ? { label: "Completed", bg: "#E6F8F1", fg: "#0EA872" }
                  : test.startTime && new Date(test.startTime) > new Date()
                    ? { label: "Scheduled", bg: "#EAF1FF", fg: "#2F6FED" }
                    : { label: "Draft", bg: "#F1F4F9", fg: "#5B6B8C" };
              return (
              <Flex
                key={test._id}
                direction={isMd ? "column" : "row"}
                justify="space-between"
                align="center"
                w={"100%"}
                p={18}
                style={{
                  border: "1px solid #F1F4F9",
                  borderRadius: "14px",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 4px 16px rgba(15,23,42,0.04)",
                }}
              >
                <Box w={isMd ? "100%" : "60%"}>
                  <Flex align="center" gap={10} mb={4}>
                    <Box
                      style={{
                        borderRadius: "999px",
                        background: status.bg,
                        color: status.fg,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                      }}
                    >
                      {status.label}
                    </Box>
                  </Flex>
                  <Text fw={700} fz={17} c="#1B2559">
                    {test.name || test.testName || "Untitled Test"}
                  </Text>
                  <Text size="sm" c="#8B96AD">
                    Max Marks: {calculateMaxMarks(test)}
                  </Text>
                  <Text size="sm" c="#8B96AD">
                    Duration: {formatDuration(test.totalTime)}
                  </Text>
                  <Text size="sm" c="#8B96AD">
                    Questions: {test.questions?.length || 0}
                  </Text>
                  <Text size="sm" c="#8B96AD">
                    Date: {formatDate(test.startTime)}
                  </Text>
                </Box>

                <Flex
                  w={isMd ? "100%" : "40%"}
                  align={"center"}
                  justify={"flex-end"}
                  mt={isMd ? 10 : 0}
                  gap={10}
                >
                  <Button
                    size="xs"
                    radius={8}
                    variant="default"
                    styles={{ root: { fontWeight: 600, color: "#33415C" } }}
                    // p={10}
                    // fullWidth
                    onClick={() => {
                      setSelectedTest(test);
                      setIsModalOpen(true);
                    }}
                  >
                    Quick View
                  </Button>
                  <Button
                    size="xs"
                    radius={8}
                    color="blue"
                  //  fullWidth
                    onClick={() => {
                      setSelectedTest(test);
                      setEditTestModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    radius={8}
                    variant="light"
                    color="red"
                    onClick={() =>
                      setDeleteConfirmModal({
                        isOpen: true,
                        testId: test._id,
                        testName: test.name || test.testName || "Untitled Test",
                      })
                    }
                  >
                    Delete
                  </Button>
                  {test.resultId.length > 0 && (
                    <Button
                      size="xs"
                      radius={8}
                      color="green"
                      onClick={() => {
                        setSelectedTest(test)
                        setShowAllResultsModal(true)
                    }}
                    >
                      See Results
                    </Button>
                  )}
                </Flex>
              </Flex>
            );})}
          </Stack>
        ) : (
          <Box
            p="xl"
            style={{
              textAlign: "center",
              border: "1px dashed #E2E8F0",
              borderRadius: "16px",
            }}
          >
            <Text size="lg" c="dimmed" mb="sm">
              📚 No tests found
            </Text>
            <Text size="sm" c="dimmed">
              {selectedSubjectId
                ? `No tests for ${
                    subjectsMap.get(selectedSubjectId)?.name ||
                    "selected subject"
                  }`
                : "No tests available for this batch"}
            </Text>
          </Box>
        )}
      </Stack>

      {/* Modals */}
      {openAddTestsModal && (
        <AddTestsModal
          opened={openAddTestsModal}
          batchId={props.batchId}
          students={[]}
          setOpenAddTestsModal={setOpenAddTestsModal}
          onCreateTest={()=>{
            fetchTests()
          }}
        />
      )}

      {editTestModalOpen && selectedTest && (
        <SimpleEditTestModal
          opened={editTestModalOpen}
          test={selectedTest}
          onClose={() => setEditTestModalOpen(false)}
          onTestUpdated={fetchTests}
          subjects={getSubjectsWithIdName()}
        />
      )}

      {isModalOpen && selectedTest && (
        <TestDisplayModal
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          test={selectedTest}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteConfirmModal.isOpen}
        onClose={() =>
          setDeleteConfirmModal({ isOpen: false, testId: null, testName: "" })
        }
        title="Delete Test"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete "{deleteConfirmModal.testName}"?
          </Text>
          <Group justify="flex-end">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteConfirmModal({
                  isOpen: false,
                  testId: null,
                  testName: "",
                })
              }
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() =>
                deleteConfirmModal.testId &&
                handleDeleteTest(deleteConfirmModal.testId)
              }
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>

      {showAllResultsModal && (
        <ShowStudentResultsModal
          opened={showAllResultsModal}
          onClose={() => {
            setShowAllResultsModal(false);
          }}
          test={selectedTest!!}
        />
      )}
    </>
  );
};

export default Tests;
