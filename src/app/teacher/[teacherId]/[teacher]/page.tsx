"use client";


import { InstituteBatchesSection } from "@/app/components/dashboard/InstituteBatchesSection";
import { InstituteInsideBatch } from "@/app/components/institute/insideBatch/InstituteInsideBatch";
import { Batch } from "@/app/components/institute/InstituteDashboard";
import TeacherMobileNavbar, {
  TeacherTabs,
} from "@/app/components/teacher/TeacherMobileNavbar";
import { useAppSelector } from "@/app/redux/redux.hooks";
import { GetTeachersAllBatches } from "@/axios/teacher/TeacherGetApi";
import { LoadingOverlay, SimpleGrid, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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

  useEffect(() => {
    if (teacher) {
      getTechersBatches();
    }
  }, [teacher]);

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
      {batchId === null && (
        <Stack w={"80%"} h={"100%"} mx={"auto"} p={20}>
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
                userType={1}
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
          />
        </Stack>
      )}

      <TeacherMobileNavbar
        onClickCollapse={() => {
          // setIsCollapsed(!isCollapsed);
        }}
        onSelectTab={(val: TeacherTabs) => {
          // setSelectedTab(val);
        }}
      />
    </Stack>
  );
};

export default Teacher;
