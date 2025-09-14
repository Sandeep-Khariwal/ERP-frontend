"use client";

import { UserType } from "@/app/components/dashboard/InstituteBatchesSection";
import { StudentTabs } from "@/app/components/institute/InstituteStudents";
import StudentPage from "@/app/components/student/StudentPage";
import { useAppDispatch, useAppSelector } from "@/app/redux/redux.hooks";
import { setDetails } from "@/app/redux/slices/instituteSlice";
import { setStudentDetails } from "@/app/redux/slices/studentSlice";
import { GetAccountByToken } from "@/axios/institute/instituteSlice";
import { LoadingOverlay, Stack } from "@mantine/core";
import React, { useEffect, useState } from "react";

const Student = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const student = useAppSelector((state) => state.studentSlice.studentDetails);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (student) {
      setSelectedStudentId(student._id);
    }
  }, [student]);

  useEffect(() => {
    setIsLoading(true);
    GetAccountByToken()
      .then((x: any) => {
        const { data } = x;
        setIsLoading(false);

        dispatch(
          setStudentDetails({
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
          featureAccess:data.instituteId.accessFeatures
        };
        dispatch(setDetails(instituteDetails));
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, []);
  return (
    <Stack w={"95%"} mx={"auto"} pt={30}>
      <LoadingOverlay visible={isLoading} />
      <StudentPage
        studentId={selectedStudentId}
        onClickBack={() => {
          // setActiveTab(val);
        }}
        userType={UserType.STUDENT}
        activeTab={StudentTabs.OVERVIEW}
      />
    </Stack>
  );
};

export default Student;
