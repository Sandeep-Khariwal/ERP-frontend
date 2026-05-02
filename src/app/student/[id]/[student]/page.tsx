"use client";

import { UserType } from "@/app/components/dashboard/InstituteBatchesSection";
import { StudentTabs } from "@/app/components/institute/InstituteStudents";
import StudentPage from "@/app/components/student/StudentPage";
import { useAppDispatch, useAppSelector } from "@/app/redux/redux.hooks";
import { setDetails } from "@/app/redux/slices/instituteSlice";
import { setStudentDetails } from "@/app/redux/slices/studentSlice";
import { GetAccountByToken } from "@/axios/institute/instituteSlice";
import { LogOut, GetUserToken } from "@/axios/LocalStorageUtility";
import { Button, Group, LoadingOverlay, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Student = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const student = useAppSelector((state) => state.studentSlice.studentDetails);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // ✅ Set student ID
  useEffect(() => {
    if (student) {
      setSelectedStudentId(student._id);
    }
  }, [student]);

  // ✅ API call only if token exists
  useEffect(() => {
    const token = GetUserToken();

    if (!token) {
      router.replace("/"); // 👈 auto redirect if not logged in
      return;
    }

    setIsLoading(true);

    GetAccountByToken()
      .then((x: any) => {
        const { data } = x;

        dispatch(
          setStudentDetails({
            name: data.name,
            _id: data._id,
            phone: data.phoneNumber[0],
            institute: data.instituteId._id,
          })
        );

        dispatch(
          setDetails({
            name: data.instituteId.name,
            _id: data.instituteId._id,
            phoneNumber: "",
            address: data.instituteId.address,
            featureAccess: data.instituteId.accessFeatures,
          })
        );

        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
        router.replace("/"); // 👈 invalid token → redirect
      });
  }, []);

  // ✅ Proper Logout Handler
  const handleLogout = () => {
    LogOut();

    dispatch(setStudentDetails(null));
    dispatch(setDetails(null));

    // 🔥 guaranteed redirect
    window.location.href = "/";
  };

  return (
    <Stack w={"95%"} mx={"auto"} pt={30}>
      <LoadingOverlay visible={isLoading} />

      <Group justify="flex-end">
        <Button color="red" onClick={handleLogout}>
          Logout
        </Button>
      </Group>

      <StudentPage
        studentId={selectedStudentId}
        onClickBack={() => {}}
        userType={UserType.STUDENT}
        activeTab={StudentTabs.OVERVIEW}
      />
    </Stack>
  );
};

export default Student;