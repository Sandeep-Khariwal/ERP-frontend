"use client";

import {
  Divider,
  Flex,
  LoadingOverlay,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch, IconUserSquareRounded } from "@tabler/icons-react";
import StudentListCard from "./student/components/StudentListCard";
import StudentProfilePage from "./student/components/StudentProfilePage";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/app/redux/redux.hooks";
import StudentPage from "../student/StudentPage";
import { GetInstituteBatches } from "@/axios/institute/instituteSlice";
import { GetAllStudentsFromBatch } from "@/axios/institute/InstituteGetApi";
import { UserType } from "../dashboard/InstituteBatchesSection";

export interface StudentList {
  _id: string;
  name: string;
  profilePic: string;
  dateOfJoining: string;
  uniqueRoll: string;
  batchId: {
    _id: string;
    name: string;
  };
}

export enum StudentTabs {
  OVERVIEW = "Overview",
  FEES = "Fees Records",
  ATTENDANCE = "Attendance",
  OTHER = "Other",
}

export const InstituteStudents = () => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [students, setStudents] = useState<StudentList[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentList[]>([]);
  const [batchMap, setBatchMap] = useState<Map<string, string>>(new Map());
  const [activeTab, setActiveTab] = useState<StudentTabs>(StudentTabs.OTHER);
  const [search, setSearch] = useState<string>("");

    const institute = useAppSelector((state: any) => state.instituteSlice.instituteDetails);

  useEffect(() => {
    if (search) {
      const filteredData = students.filter(
        (s) => s.name.trim().toLowerCase().startsWith(search.trim().toLowerCase())
      );

      setFilteredStudents(filteredData);
    } else {
      setFilteredStudents(students);
    }
  }, [search]);

  useEffect(() => {
    if (institute?._id) {
      setIsLoading(true);
      GetInstituteBatches(institute._id)
        .then((x: any) => {
          const { batches } = x;

          const newMap = new Map(batchMap);
          batches.forEach((b: any) => {
            if (!newMap.has(b._id)) {
              newMap.set(b._id, b.name);
            }
            if (!selectedBatchId) {
              setSelectedBatchId(b._id);
            }
          });
          setBatchMap(newMap);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    }
  }, [institute]);

  useEffect(() => {
    if (selectedBatchId) {
      setIsLoading(true);
      GetAllStudentsFromBatch(selectedBatchId)
        .then((x: any) => {
          const { students } = x.students;
          const studentData = students.map((s: any) => {
            const yearOfJoining = new Date(s.dateOfJoining).getFullYear();
            return {
              _id: s._id,
              name: s.name,
              profilePic: s.profilePic,
              uniqueRoll: s.uniqueRoll,
              dateOfJoining: yearOfJoining.toString(),
              batchId: {
                _id: s.batchId._id,
                name: s.batchId.name,
              },
            };
          });
          setStudents(studentData);
          setFilteredStudents(studentData);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    }
  }, [selectedBatchId]);

  return (
    <Stack
      w={isMd ? "95%" : "90%"}
      mih={"100vh"}
      mx={"auto"}
      bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
      mb={isMd?100:0}
    >
      <LoadingOverlay visible={isLoading} />

      {StudentTabs.OTHER !== activeTab && (
        <Stack
          w={"100%"}
          style={{ borderRadius: "1rem" }}
          bg={"white"}
          align={"center"}
          justify={"space-between"}
          p={10}
          py={20}
          mt={10}
        >
          <StudentPage
            studentId={selectedStudentId}
            userType={UserType.OTHERS}
            activeTab={activeTab}
            onClickBack={() => {
              setActiveTab(StudentTabs.OTHER);
            }}
          />
        </Stack>
      )}

      {StudentTabs.OTHER == activeTab && (
        <>
          <Flex
            w={"100%"}
            style={{ borderRadius: "1rem" }}
            bg={"white"}
            align={"center"}
            justify={"space-between"}
            p={10}
            py={20}
            mt={10}
          >
            <Text fw={600} style={{ fontFamily: "sans-serif" }} fz={22}>
              Students
            </Text>
            <IconUserSquareRounded />
          </Flex>

          <Flex w={"100%"} h={"100%"} gap={10} mt={10}>
            {/* For Small Screens (isMd = true), show only the student list or selected student */}
            {isMd ? (
              !selectedStudentId ? (
                <Stack
                  w={"100%"}
                  bg={"white"}
                  h={"100%"}
                  style={{ borderRadius: "0.5rem" }}
                  p={10}
                >
                  <Text fw={600} style={{ fontFamily: "sans-serif" }} fz={22}>
                    Students
                  </Text>
                  <TextInput
                    placeholder="search name or phone"
                    leftSection={<IconSearch />}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Select
                    my={10}
                    w={"80%"}
                    label="Filter with Batch"
                    placeholder="Filter with batch"
                    data={Array.from(batchMap.entries()).map(
                      ([key, value]) => ({
                        label: value,
                        value: key,
                      })
                    )}
                    value={selectedBatchId}
                    onChange={(value: any) => setSelectedBatchId(value)}
                  />
                  <Divider c={"gray"} w={"100%"} />
                  <Flex w={"100%"} px={5} py={10}>
                    <Flex w={"10%"} align={"start"} justify={"start"}>
                      <Text
                        lh={0}
                        fz={14}
                        style={{ fontFamily: "sans-serif" }}
                        c={"#4F4F4F"}
                      >
                        Pic
                      </Text>
                    </Flex>
                    <Flex w={"50%"}>
                      <Text
                        lh={0}
                        fz={14}
                        style={{ fontFamily: "sans-serif" }}
                        c={"#4F4F4F"}
                      >
                        Name
                      </Text>
                    </Flex>
                    <Flex
                      w={"20%"}
                      align={"center"}
                      justify={"center"}
                      fw={600}
                      c={"#4F4F4F"}
                    >
                      <Text
                        lh={0}
                        fz={14}
                        style={{ fontFamily: "sans-serif" }}
                        c={"#4F4F4F"}
                      >
                        Roll No.
                      </Text>
                    </Flex>
                    <Flex
                      w={"20%"}
                      align={"center"}
                      justify={"center"}
                      fw={600}
                      c={"#4F4F4F"}
                    >
                      <Text
                        lh={0}
                        fz={14}
                        style={{ fontFamily: "sans-serif" }}
                        c={"#4F4F4F"}
                      >
                        Year
                      </Text>
                    </Flex>
                  </Flex>
                  {/* Show list of students and handle student click */}
                  {filteredStudents.map((s: StudentList) => (
                    <StudentListCard
                      key={s._id}
                      student={s}
                      onClickStudent={(s: string) => {
                        setSelectedStudentId(s);
                      }}
                      id={selectedStudentId}
                      selectedStudentId={selectedStudentId}
                    />
                  ))}
                </Stack>
              ) : (
                // If a student is selected, show their profile
                <Stack
                  w={"100%"}
                  h={"100%"}
                  bg={"white"}
                  style={{ borderRadius: "0.5rem" }}
                >
                  <StudentProfilePage
                    selectedStudentId={selectedStudentId}
                    onClickAction={(val: StudentTabs) => {
                      setActiveTab(val);
                    }}
                  />
                </Stack>
              )
            ) : (
              // For Large Screens (isMd = false), show both list and profile side by side
              <>
                <Stack
                  w={"30%"}
                  bg={"white"}
                  h={"100%"}
                  style={{ borderRadius: "0.5rem" }}
                  p={10}
                >
                  <Text fw={600} style={{ fontFamily: "sans-serif" }} fz={22}>
                    Students
                  </Text>
                  <TextInput
                    placeholder="search name or phone"
                    leftSection={<IconSearch />}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Select
                    my={10}
                    w={"50%"}
                    label="Filter with Batch"
                    placeholder="Filter with batch"
                    data={Array.from(batchMap.entries()).map(
                      ([key, value]) => ({
                        label: value,
                        value: key,
                      })
                    )}
                    value={selectedBatchId}
                    onChange={(e: any) => setSelectedBatchId(e)}
                  />
                  <Divider c={"gray"} w={"100%"} />
                  <Flex w={"100%"} px={5} py={10}>
                    <Flex w={"10%"} align={"start"} justify={"start"}>
                      <Text
                        lh={0}
                        fz={14}
                        style={{ fontFamily: "sans-serif" }}
                        c={"#4F4F4F"}
                      >
                        Pic
                      </Text>
                    </Flex>
                    <Flex w={"50%"}>
                      <Text
                        lh={0}
                        fz={14}
                        style={{ fontFamily: "sans-serif" }}
                        c={"#4F4F4F"}
                      >
                        Name
                      </Text>
                    </Flex>
                    <Flex
                      w={"20%"}
                      align={"center"}
                      justify={"center"}
                      fw={600}
                      c={"#4F4F4F"}
                    >
                      <Text
                        lh={0}
                        fz={14}
                        style={{ fontFamily: "sans-serif" }}
                        c={"#4F4F4F"}
                      >
                        Roll No.
                      </Text>
                    </Flex>
                    <Flex
                      w={"20%"}
                      align={"center"}
                      justify={"center"}
                      fw={600}
                      c={"#4F4F4F"}
                    >
                      <Text
                        lh={0}
                        fz={14}
                        style={{ fontFamily: "sans-serif" }}
                        c={"#4F4F4F"}
                      >
                        Year
                      </Text>
                    </Flex>
                  </Flex>
                  {filteredStudents.map((s: StudentList) => (
                    <StudentListCard
                      key={s._id}
                      student={s}
                      onClickStudent={(s: string) => {
                        setSelectedStudentId(s);
                      }}
                      id={selectedStudentId}
                      selectedStudentId={selectedStudentId}
                    />
                  ))}
                </Stack>
                <Stack
                  w={"70%"}
                  bg={"white"}
                  h={"100%"}
                  style={{ borderRadius: "0.5rem" }}
                  p={10}
                >
                  {selectedStudentId ? (
                    <StudentProfilePage
                      selectedStudentId={selectedStudentId}
                      onClickAction={(val: StudentTabs) => {
                        setActiveTab(val);
                      }}
                    />
                  ) : (
                    <Stack
                      w={"100%"}
                      h={"100%"}
                      m={"auto"}
                      align={"center"}
                      justify={"center"}
                    >
                      <Image
                        src={"/empty.png"}
                        alt="empty image"
                        width={150}
                        height={140}
                      />
                      <Text fw={600} c={"#4F4F4F"}>
                        Select a student
                      </Text>
                    </Stack>
                  )}
                </Stack>
              </>
            )}
          </Flex>
        </>
      )}
    </Stack>
  );
};
