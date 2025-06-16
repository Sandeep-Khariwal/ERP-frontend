"use client";

import { InstituteBatchesSection, UserType } from "@/app/components/dashboard/InstituteBatchesSection";
import { InstituteInsideBatch } from "@/app/components/institute/insideBatch/InstituteInsideBatch";
import { Batch } from "@/app/components/institute/InstituteDashboard";
import { InstituteTeachers } from "@/app/components/institute/InstituteTeacher";
import TeacherProfile from "@/app/components/institute/teacher/TeacherProfile";
import TeacherMobileNavbar, {
  TeacherTabs,
} from "@/app/components/teacher/TeacherMobileNavbar";
import { useAppDispatch, useAppSelector } from "@/app/redux/redux.hooks";
import { setDetails } from "@/app/redux/slices/instituteSlice";
import {
  setTeacherDetails,
  TeacherLogOut,
} from "@/app/redux/slices/teacherSlice";
import { GetAccountByToken } from "@/axios/institute/instituteSlice";
import { LogOut } from "@/axios/LocalStorageUtility";
import { GetTeachersAllBatches } from "@/axios/teacher/TeacherGetApi";
import { LoadingOverlay, SimpleGrid, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCircle0 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Teacher = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const teacher = useAppSelector(
    (state: any) => state.teacherSlice.teacherDetails
  );
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const isLg = useMediaQuery(`(max-width: 1024px)`);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>();
  const [batchId, setBatchId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigation = useRouter();
  const [selectedTeacherId,setSelectedTeacherId] = useState<string>("")

  useEffect(() => {
    if (teacher) {
      getTechersBatches();
setSelectedTeacherId(teacher._id)
      
    }
  }, [teacher]);

  useEffect(() => {
    setIsLoading(true);
    GetAccountByToken()
      .then((x: any) => {
        const { data, type } = x;
        setIsLoading(false);

        dispatch(
          setTeacherDetails({
            name: data.name,
            _id: data._id,
            phone: data.phoneNumber[0],
            institute: data.instituteId._id,
          })
        );
        const instituteDetails = {
          name: data.instituteId.name,
          _id: data.instituteId._id,
          phoneNumber: "",
          address: data.instituteId.address,
        };
        dispatch(setDetails(instituteDetails));
      })
      .catch((e) => {
        console.log(e);
             setIsLoading(false);
      });
  }, []);

  const getTechersBatches = () => {
    setIsLoading(true);
    GetTeachersAllBatches(teacher._id)
      .then((x: any) => {
        setIsLoading(false);
        const { batches } = x;
        const allBatches = batches.map((b: any) => {
          return {
            id: b._id,
            name: b.name,
            subjects: b.subjects,
            optionalSubjects: b.optionalSubjects,
            noOfTeachers: b.teachers.length,
            noOfStudents: b.students.length,
            firstThreeTeachers: b.teachers.slice(0, 2),
            firstThreeStudents: b.students.slice(0, 2),
          };
        });
        setBatches(allBatches);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Stack
      w={"100%"}
      mih={"100vh"}
      bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
    >
      <LoadingOverlay visible={isLoading} />
             <TeacherProfile
            teacherId={selectedTeacherId}
            onClickBack={() => {}}
            userType={UserType.TEACHER}
          />
      {/* {batchId === null && (
        <Stack w={!isMd ? "80%" : "100%"} h={"100%"} mx={"auto"} p={20}>
          <Text
            fz={22}
            fw={500}
            c={"#36431F"}
            style={{
              whiteSpace: "nowrap",
              maxWidth: "70%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontFamily: "Roboto",
            }}
          >
            All Batches
          </Text>
          {
            <SimpleGrid
              cols={isMd ? 1 : isLg ? 2 : 4}
              w={isMd ? "95%" : "100%"}
              mx={"auto"}
              spacing={20}
              verticalSpacing={20}
            >
              <InstituteBatchesSection
                batches={batches.map((batch: any) => ({
                  id: batch?.id || "",
                  name: batch?.name || "",
                  subjects: batch?.subjects || [],
                  noOfTeachers: batch?.noOfTeachers || 0,
                  noOfStudents: batch?.noOfStudents || 0,
                  firstThreeStudents: batch?.firstThreeStudents || [],
                  firstThreeTeachers: batch?.firstThreeTeachers || [],
                }))}
                userType={UserType.TEACHER}
                setDeleteBatchId={(val: string) => {
                  //  setDeleteBatchId(val);
                  //  setBatchDeleteWarning(true);
                }}
                setDeleteModal={(val) => {}}
                onEditBatchName={(id: string, val: string) => {
                  //  updateTheBatchName(id, val);
                }}
                onbatchCardClick={(val) => {
                  setBatchId(val.id);
                  setSelectedBatch(val);
                }}
                onEditCourseFees={(val: any) => {
                  //  setBatchId(val._id);
                  //  setOpenEditCourseFee(true);
                  // setisCourseFeesEdit(val);
                }}
                onAddBatchButtonClick={() => {
                  //  setOpenAddBatchModal(true);
                }}
                onEditBatchButtonClick={function (batchId: string): void {
                  //  setEditBatchDetails(true)
                  //  setOpenAddBatchModal(true)
                  //  editBatch(batchId)
                }}
                 showAddBatch={false}
              />
            </SimpleGrid>
          }
        </Stack>
      )}
      {batchId != null && (
        <Stack
          w={"100%"}
          h={"100%"}
          bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
        >
          <InstituteInsideBatch
            batchId={batchId}
            batchName={selectedBatch?.name!!}
            instituteId={""}
            onClickBack={() => {
              getTechersBatches();
              setBatchId(null);
            }}
            fromInstituteTeacherSection={false}
          />
        </Stack>
      )}

      {/* <TeacherMobileNavbar
        onClickCollapse={() => {
          // setIsCollapsed(!isCollapsed);
        }}
        onSelectTab={(val: TeacherTabs) => {
          // setSelectedTab(val);
        }}
      /> 
      <Stack
        style={{ cursor: "pointer" }}
        my={10}
        align={"center"}
        gap={10}
        onClick={() => {
          LogOut();
          dispatch(
            setTeacherDetails({
              name: "",
              _id: "",
              phone: "",
              institute: "",
            })
          );
          dispatch(TeacherLogOut(""));
          navigation.push("/");
        }}
      >
        <IconCircle0 size={36} style={{ color: "#FFFFFF" }} />
        <Text fw={600} fz={15} c={"#FFFFFF"}>
          Log out
        </Text>
      </Stack> */}
    </Stack>
  );
};

export default Teacher;
