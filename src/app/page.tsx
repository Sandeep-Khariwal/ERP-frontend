"use client";

import {
  BackgroundImage,
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useAppDispatch } from "./redux/redux.hooks";
import { useRouter } from "next/navigation";
import { ErrorNotification } from "./helperFunction/Notification";
import { UserTypes } from "@/enums";
import { setAdminDetails } from "./redux/slices/adminSlice";
import { setTeacherDetails } from "./redux/slices/teacherSlice";
import { setStudentDetails } from "./redux/slices/studentSlice";
import { setDetails } from "./redux/slices/instituteSlice";
import { GetAccountByToken } from "@/axios/institute/instituteSlice";
import Link from "next/link";
import { setUserDetails } from "./redux/slices/userSlice";
import { LocalStorageKey } from "@/axios/LocalStorageUtility";
import { Notifications } from "@mantine/notifications";
import Navbar from "./components/landingpage/Navbar";
import HeroSection from "./components/landingpage/HeroSection";
import Features from "./components/landingpage/Features";
import WhyShouldUse from "./components/landingpage/WhyShouldUse";
import Testimonials from "./components/landingpage/Testimonials";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigation = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("shikshaPayToken"); //"shikshaPayToken"

    if (!token) return;

    setIsLoading(true);
    GetAccountByToken()
      .then((x: any) => {
        const { data, type } = x;

        // navigate on the basis of user type
        if (UserTypes.ADMIN === type) {
          dispatch(
            setAdminDetails({
              name: data.name,
              _id: data._id,
              phone: data.phone,
              institute: data.institute,
            })
          );
          navigation.push(
            `/institute/${data.institute._id}/${data.institute.name}`
          );
        }
        if (UserTypes.USER === type) {
          dispatch(
            setUserDetails({
              name: data.name,
              _id: data._id,
              phone: "",
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
          navigation.push(
            `/user/${data.instituteId._id}/${data.instituteId.name}`
          );
        }
        if (UserTypes.TEACHER === type) {
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
        if (UserTypes.STUDENT === type) {
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
        console.log(e.status, e);
        if (e.status === 404) {
          navigation.push("/auth");
        }
        if (e.status === 401) {
          navigation.push("/auth");
        }
        if (e.status === 403) {
          ErrorNotification("Subscription has been expired!!");
          navigation.push("/pricing");
        }
      });
  }, []);
  return (
    <Stack>
      <Box>
        <Navbar />
        <HeroSection />
        <Features />
        <WhyShouldUse />
        <Testimonials />
      </Box>
      <Notifications />
      <LoadingOverlay visible={isLoading} />
    </Stack>
  );
}
