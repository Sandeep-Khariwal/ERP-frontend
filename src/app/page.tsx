"use client";

import { LoadingOverlay, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { GetAccountByToken } from "./api/institute/instituteSlice";
import { useAppDispatch } from "./redux/redux.hooks";
import { useRouter } from "next/navigation";
import {
  ErrorNotification,
  SuccessNotification,
} from "./helperFunction/Notification";
import { UserType } from "@/enums";
import { setAdminDetails } from "./redux/slices/adminSlice";
import { setTeacherDetails } from "./redux/slices/teacherSlice";
import { setStudentDetails } from "./redux/slices/studentSlice";
import { setDetails } from "./redux/slices/instituteSlice";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [adminScreen, setAdminScreen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigation = useRouter();

  useEffect(() => {
    setIsLoading(true);
    GetAccountByToken()
      .then((x: any) => {
        const { data, type } = x;
        setIsLoading(false);

        // navigate on the basis of user type
        if (UserType.ADMIN === type) {
          dispatch(
            setAdminDetails({
              name: data.name,
              _id: data._id,
              phone: data.phone,
              institute: data.institute,
            })
          );
          navigation.push(
            `/${data.institute.name}/${data.institute._id}/dashboard`
          );
        }
        if (UserType.USER === type) {
          navigation.push(
            `/${data.institute.name}/${data.institute._id}/dashboard`
          );
        }
        if (UserType.TEACHER === type) {
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
          navigation.push(`/teacher/${data._id}/${data.name}`);
        }
        if (UserType.STUDENT === type) {
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
          };
          dispatch(setDetails(instituteDetails));
          navigation.push(`/student/${data._id}/${data.name}`);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
        ErrorNotification("Error");
      });
  }, []);
  return (
    <Stack w={"100%"} h={"100vh"} align="center" justify="center" bg={"black"}>
      <LoadingOverlay visible={isLoading} />
      <Text c={"white"}>Welcome to ERP</Text>
    </Stack>
  );
}
