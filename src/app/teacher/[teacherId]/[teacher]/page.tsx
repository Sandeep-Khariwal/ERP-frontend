"use client";

import { GetTeachersAllBatches } from "@/app/api/teacher/TeacherGetApi";
import { Batch } from "@/app/components/institute/InstituteDashboard";
import { useAppSelector } from "@/app/redux/redux.hooks";
import { Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";

const Teacher = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const teacher = useAppSelector((state:any)=>state.teacherSlice.
  teacherDetails
  )

  useEffect(() => {
    if(teacher){
    GetTeachersAllBatches(teacher._id)
    .then((x: any) => {
      console.log("batches : ",x);
      
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
    })
  }
  }, [teacher]);

  return (
    <Stack
      w={"100%"}
      mih={"100vh"}
      bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
    >
      <Stack w={"80%"} h={"100%"} mx={"auto"} bg={"red"}>
        <Text>dvsdv</Text>
      </Stack>
    </Stack>
  );
};

export default Teacher;
