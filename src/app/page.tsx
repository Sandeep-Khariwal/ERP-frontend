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
import { UserType } from "@/enums";
import { setAdminDetails } from "./redux/slices/adminSlice";
import { setTeacherDetails } from "./redux/slices/teacherSlice";
import { setStudentDetails } from "./redux/slices/studentSlice";
import { setDetails } from "./redux/slices/instituteSlice";
import { GetAccountByToken } from "@/axios/institute/instituteSlice";
import Link from "next/link";
import { setUserDetails } from "./redux/slices/userSlice";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigation = useRouter();

  useEffect(() => {
    setIsLoading(true);
    GetAccountByToken()
      .then((x: any) => {
        const { data, type } = x;
        // setIsLoading(false);

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
            `/${data.instituteId.name}/${data.instituteId._id}/dashboard`
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
    <Stack
      w={"100%"}
      h={"100vh"}
      align="center"
      justify="center"
      style={{
        backgroundImage: "url(/heroImg.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        position: "relative",
      }}
    >
      <LoadingOverlay visible={isLoading} />
      <Flex
        w={"100%"}
        align={"center"}
        justify={"flex-end"}
        gap={20}
        bg={"transparent"}
        px={50}
        py={30}
        style={{ position: "fixed", top: 0, left: 0, zIndex: 2 }}
      >
        <Link
          style={{ textDecoration: "none", color: "white" }}
          href={"/about"}
        >
          About
        </Link>
        <Link
          style={{ textDecoration: "none", color: "white" }}
          href={"/about"}
        >
          Contact
        </Link>
        <Link
          style={{ textDecoration: "none", color: "white" }}
          href={"/about"}
        >
          Features
        </Link>
        <Button variant="outline" onClick={() => navigation.push("/auth")}>
          Login
        </Button>
      </Flex>
      <Text
        fz={55}
        px={20}
        py={10}
        style={{
          textTransform: "uppercase",
          textShadow: "2px 2px 5px gray",
          position: "relative",
          zIndex: 2,
        }}
        c={"white"}
      >
        Shiksha Pay
      </Text>
      <Box
        style={{
          backgroundImage:
            "linear-gradient(to right bottom, #111111 , transparent)",
          position: "absolute",
          top: 0,
        }}
        h={"100vh"}
        w={"100%"}
      ></Box>
    </Stack>
  );
}
