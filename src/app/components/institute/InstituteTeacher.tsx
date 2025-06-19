"use client";

import {
  Button,
  Center,
  Flex,
  LoadingOverlay,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import TeachersSection from "./insideBatch/TeacherSection";
import { GetAllTeacherStaff } from "@/axios/teacher/TeacherGetApi";
import { useAppSelector } from "@/app/redux/redux.hooks";
import { GetInstituteBatches } from "@/axios/institute/instituteSlice";
import { GetAllSubjectsFromBatch } from "@/axios/batch/BatchGetApi";
import { IconFilterCheck } from "@tabler/icons-react";
import TeacherProfile from "./teacher/TeacherProfile";
import { useMediaQuery } from "@mantine/hooks";
import { UserType } from "../dashboard/InstituteBatchesSection";

export const InstituteTeachers = (props: { userType: UserType }) => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectTeacherId, setSelectTeacherId] = useState<string>("");
  const [originalArrayOfTeachers, setOriginalArrayOfTeachers] = useState<
    {
      _id: string;
      name: string;
      phoneNumber: string;
      instituteBatches: string[];
      subjects: { _id: string; name: string , batchId:string }[];
    }[]
  >([]);
  const [teachers, setTeachers] = useState<
    {
      _id: string;
      name: string;
      phoneNumber: string;
      instituteBatches: string[];
      subjects: { _id: string; name: string,batchId:string }[];
    }[]
  >([]);
  const [batches, setBatches] = useState<{ _id: string; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ _id: string; name: string }[]>([]);
  const isMd = useMediaQuery(`(max-width: 968px)`);

  const institute = useAppSelector(
    (state) => state.instituteSlice.instituteDetails
  );

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

  useEffect(() => {
    getAllTeachers();
    getAllInstituteBatches();
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
      h={"100vh"}
      bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
      mb={isMd ? 100 : 0}
    >
      <LoadingOverlay visible={isLoading} />
      <Flex
        w={"90%"}
        style={{
          borderRadius: "1rem",
          position: "sticky",
          top: 10,
          zIndex: 123,
        }}
        bg={"white"}
        align={"center"}
        justify={"space-between"}
        p={10}
        py={20}
        mt={10}
        mx={"auto"}
      >
        <Text
          bg={"white"}
          fw={600}
          style={{ fontFamily: "sans-serif" }}
          fz={22}
        >
          Teacher
        </Text>
        <LiaChalkboardTeacherSolid size={30} />
      </Flex>

      {!selectTeacherId ? (
        <Stack
          w={"90%"}
          style={{ borderRadius: "1rem" }}
          bg={"white"}
          p={10}
          py={20}
          mt={10}
          mx={"auto"}
        >
          <Flex w={"100%"} align={"center"} gap={20}>
            <Select
              placeholder="Select Class"
              label="Select Teacher by class"
              value={selectedClass}
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
            {/* <Text>And</Text> */}
            <Select
              disabled={!selectedClass}
              placeholder="Select Subject"
              label="Select Teacher by Subject"
              value={selectedSubject}
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
              style={{ alignSelf: "end" }}
              onClick={() => {
                setSelectedSubject("");
                setSelectedClass("");
              }}
            >
              <IconFilterCheck size={18} style={{ margin: "0px 4px" }} />
              Clear filter
            </Button>
          </Flex>
          <Stack w={"100%"}>
            <TeachersSection
              userType={props.userType}
              teachers={teachers}
              batchId={selectedClass}
              isTeacherDashboard={true}
              setOriginalArrayOfTeachers={setOriginalArrayOfTeachers}
              setTeachersInDashboard={setTeachers}
              setSelectTeacherId={setSelectTeacherId}
            />
          </Stack>
        </Stack>
      ) : (
        <>
          <TeacherProfile
            teacherId={selectTeacherId}
            onClickBack={() => setSelectTeacherId("")}
            userType={UserType.OTHERS}
          />
        </>
      )}
    </Stack>
  );
};
