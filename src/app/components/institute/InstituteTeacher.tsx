"use client";

import {
  Avatar,
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import TeachersSection from "./insideBatch/TeacherSection";
import { GetAllTeacherStaff } from "@/axios/teacher/TeacherGetApi";
import { useAppSelector } from "@/app/redux/redux.hooks";
import { GetInstituteBatches } from "@/axios/institute/instituteSlice";
import { GetAllSubjectsFromBatch } from "@/axios/batch/BatchGetApi";
import { IconFilterCheck, IconSearch, IconSchool, IconBook } from "@tabler/icons-react";
import { Bell } from "lucide-react";
import TeacherProfile from "./teacher/TeacherProfile";
import { useMediaQuery } from "@mantine/hooks";
import { UserType } from "../dashboard/InstituteBatchesSection";
import { GetAllNotice } from "@/axios/notice/NoticeGetApi";

export const InstituteTeachers = (props: { userType: UserType }) => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectTeacherId, setSelectTeacherId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [noticeCount, setNoticeCount] = useState<number>(0);
  const [originalArrayOfTeachers, setOriginalArrayOfTeachers] = useState<
    {
      _id: string;
      name: string;
      phoneNumber: string;
      instituteBatches: string[];
      subjects: { _id: string; name: string; batchId: string }[];
    }[]
  >([]);
  const [teachers, setTeachers] = useState<
    {
      _id: string;
      name: string;
      phoneNumber: string;
      instituteBatches: string[];
      subjects: { _id: string; name: string; batchId: string }[];
    }[]
  >([]);
  const [batches, setBatches] = useState<{ _id: string; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ _id: string; name: string }[]>([]);
  const isMd = useMediaQuery(`(max-width: 968px)`);

  const institute = useAppSelector(
    (state) => state.instituteSlice.instituteDetails
  );
  const adminDetails = useAppSelector(
    (state: any) => state.adminSlice.adminDetails
  );

  const batchMap = useMemo(() => {
    const map = new Map<string, string>();
    batches.forEach((b) => map.set(b._id, b.name));
    return map;
  }, [batches]);

  useEffect(() => {
    if (selectedClass) {
      setIsLoading(true);

      const teacherByInstituteBatch = originalArrayOfTeachers.filter((teach) =>
        teach.instituteBatches.includes(selectedClass)
      );

      GetAllSubjectsFromBatch(selectedClass)
        .then((x: any) => {
          const { subjects } = x.subjects;
          setSubjects(subjects);

          setTeachers(teacherByInstituteBatch);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    } else {
      setSelectedSubject("");
      setTeachers(originalArrayOfTeachers);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedSubject) {
      const teacherBySubjects = originalArrayOfTeachers.filter((teach) =>
        teach.subjects.map((i) => i._id).includes(selectedSubject)
      );

      setTeachers(teacherBySubjects);
    } else if (selectedClass) {
      const teacherByInstituteBatch = originalArrayOfTeachers.filter((teach) =>
        teach.instituteBatches.includes(selectedClass)
      );
      setTeachers(teacherByInstituteBatch);
    } else {
      setTeachers(originalArrayOfTeachers);
    }
  }, [selectedSubject]);

  // Real client-side search across name / phone / subject name.
  useEffect(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      if (!selectedClass && !selectedSubject) setTeachers(originalArrayOfTeachers);
      return;
    }
    const base = selectedClass
      ? originalArrayOfTeachers.filter((t) => t.instituteBatches.includes(selectedClass))
      : originalArrayOfTeachers;

    setTeachers(
      base.filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          (t.phoneNumber || "").toLowerCase().includes(term) ||
          t.subjects.some((s) => s.name.toLowerCase().includes(term))
      )
    );
  }, [search]);

  useEffect(() => {
    getAllTeachers();
    getAllInstituteBatches();
  }, [institute?._id]);

  useEffect(() => {
    if (!institute?._id) return;
    GetAllNotice(institute._id)
      .then((res: any) => {
        const list = res?.data?.notices || res?.notices || [];
        setNoticeCount(Array.isArray(list) ? list.length : 0);
      })
      .catch(() => {});
  }, [institute?._id]);

  const getAllTeachers = () => {
    setIsLoading(true);
    GetAllTeacherStaff(institute?._id || "")
      .then((x: any) => {
        const { teachers } = x;

        const teachersData = teachers.map((s: any) => {
          return {
            _id: s._id,
            name: s.name,
            phoneNumber: s.phoneNumber,
            instituteBatches: s.instituteBatches,
            subjects: s.subjects,
          };
        });

        setTeachers(teachersData);
        setOriginalArrayOfTeachers(teachersData);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const getAllInstituteBatches = () => {
    setIsLoading(true);
    GetInstituteBatches(institute?._id || "")
      .then((x: any) => {
        setIsLoading(false);
        setBatches(x.batches);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  return (
    <Stack
      w={"100%"}
      mih={"100vh"}
      bg={"transparent"}
      mb={isMd ? 100 : 0}
      py={20}
    >
      <LoadingOverlay visible={isLoading} />

      {!selectTeacherId ? (
        <>
          {/* ── Top Header: Title + Search + Notifications + Profile ── */}
          <Flex
            w={isMd ? "95%" : "92%"}
            mx={"auto"}
            align={isMd ? "flex-start" : "center"}
            justify="space-between"
            direction={isMd ? "column" : "row"}
            gap={16}
          >
            <Stack gap={2}>
              <Text fz={26} fw={700} c="#1B2559" style={{ fontFamily: "sans-serif" }}>
                Teacher Directory
              </Text>
              <Text fz={13} c="#8B96AD">
                Manage and view all your teachers in one place
              </Text>
            </Stack>

            <Flex align="center" gap={14} wrap="wrap">
              <TextInput
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                placeholder="Search teachers by name, phone or subject..."
                leftSection={<IconSearch size={16} color="#8B96AD" />}
                radius={12}
                w={isMd ? "100%" : 300}
                styles={{
                  input: {
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0px 2px 8px rgba(15,23,42,0.05)",
                    height: 42,
                  },
                }}
              />

              <Box style={{ position: "relative" }}>
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0px 2px 8px rgba(15,23,42,0.05)",
                  }}
                >
                  <Bell size={18} color="#5B6B8C" />
                </Flex>
                {noticeCount > 0 && (
                  <Flex
                    align="center"
                    justify="center"
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      minWidth: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#EF4444",
                      color: "white",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "0 4px",
                      border: "2px solid white",
                    }}
                  >
                    {noticeCount > 9 ? "9+" : noticeCount}
                  </Flex>
                )}
              </Box>

              <Flex
                align="center"
                gap={10}
                py={6}
                px={12}
                style={{
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0px 2px 8px rgba(15,23,42,0.05)",
                  background: "#FFFFFF",
                }}
              >
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#EAF1FF",
                    color: "#2F6FED",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {(adminDetails?.name || "A").charAt(0).toUpperCase()}
                </Flex>
                <Stack gap={0}>
                  <Text fz={13} fw={700} c="#1B2559" style={{ lineHeight: 1.1 }}>
                    {adminDetails?.name || "Admin"}
                  </Text>
                  <Text fz={11} c="#8B96AD" style={{ lineHeight: 1.1 }}>
                    {adminDetails?.role || "Admin"}
                  </Text>
                </Stack>
              </Flex>
            </Flex>
          </Flex>

          <Stack
            w={isMd ? "95%" : "92%"}
            style={{
              borderRadius: "1rem",
              border: "1px solid #F1F4F9",
              boxShadow: "0px 6px 20px rgba(15,23,42,0.05)",
            }}
            bg={"white"}
            p={16}
            py={20}
            mx={"auto"}
          >
            <Flex w={"100%"} align={"end"} gap={20} wrap="wrap">
              <Select
                placeholder="Select Class"
                label="Select Teacher by class"
                leftSection={<IconSchool size={16} color="#8B96AD" />}
                value={selectedClass}
                radius={10}
                data={[{ _id: "", name: "Select Class" }, ...batches].map(
                  (batch) => ({
                    value: batch._id,
                    label: batch.name,
                  })
                )}
                onChange={(selectedValues) => {
                  setSelectedClass(selectedValues!!);
                }}
              />
              <Select
                disabled={!selectedClass}
                placeholder="Select Subject"
                label="Select Teacher by Subject"
                leftSection={<IconBook size={16} color="#8B96AD" />}
                value={selectedSubject}
                radius={10}
                data={[{ _id: "", name: "Select Subject" }, ...subjects].map(
                  (subject) => ({
                    value: subject._id,
                    label: subject.name,
                  })
                )}
                defaultValue={selectedSubject}
                onChange={(selectedValues) => {
                  setSelectedSubject(selectedValues!!);
                }}
              />
              <Button
                variant="outline"
                color="blue"
                radius={10}
                onClick={() => {
                  setSelectedClass("");
                  setSearch("");
                }}
              >
                <IconFilterCheck size={18} style={{ margin: "0px 4px" }} />
                Clear Filter
              </Button>
            </Flex>
            <Stack w={"100%"}>
              <TeachersSection
                userType={props.userType}
                teachers={teachers}
                batchId={selectedClass}
                isTeacherDashboard={true}
                batchMap={batchMap}
                setOriginalArrayOfTeachers={setOriginalArrayOfTeachers}
                setTeachersInDashboard={setTeachers}
                setSelectTeacherId={setSelectTeacherId}
              />
            </Stack>
          </Stack>
        </>
      ) : (
        <Flex w={"100%"} align={"center"} justify={"center"}>
          <TeacherProfile
            teacherId={selectTeacherId}
            onClickBack={() => setSelectTeacherId("")}
            userType={UserType.OTHERS}
          />
        </Flex>
      )}
    </Stack>
  );
};
