"use client";

import { LogOut } from "@/axios/LocalStorageUtility";
import { useAppDispatch } from "@/app/redux/redux.hooks";
import { saveToken, setDetails } from "@/app/redux/slices/instituteSlice";
import { setTeacherDetails, TeacherLogOut } from "@/app/redux/slices/teacherSlice";
import { Flex, Stack, Text } from "@mantine/core";
import { IconCircle0, IconHome } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";
import {  PiUser } from "react-icons/pi";

export enum TeacherTabs {
    HOME = "home",
    PROFILE = "profile",
    // TEACHER = "teacher",
  }

const TeacherMobileNavbar = (props: {
  onClickCollapse: () => void;
  onSelectTab: (val: TeacherTabs) => void;
}) => {
  const navigation = useRouter();
  const dispatch = useAppDispatch();
  return (
    <Flex
      w={"96%"}
      align={"center"}
      justify={"space-around"}
      style={{
        position: "fixed",
        bottom: "0px",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "2rem",
        zIndex: 10,
      }}
      px={15}
      bg={"linear-gradient(135deg, #9C27B0, #3F51B5)"}
    >
      <Stack
        style={{ cursor: "pointer" }}
        my={10}
        align={"center"}
        gap={10}
        onClick={() => props.onSelectTab(TeacherTabs.HOME)}
      >
        <IconHome size={36} style={{ color: "#FFFFFF" }} />
        <Text fw={600} fz={15} c={"#FFFFFF"}>
          Home
        </Text>
      </Stack>
      {/* <Stack
        style={{ cursor: "pointer" }}
        my={10}
        align={"center"}
        gap={10}
        onClick={() => props.onSelectTab(TeacherTabs.PROFILE)}
      >
        <PiUser size={36} style={{ color: "#FFFFFF" }} />
        <Text fw={600} fz={15} c={"#FFFFFF"}>
          Profile
        </Text>
      </Stack> */}
      {/* <Stack
        style={{ cursor: "pointer" }}
        my={10}
        align={"center"}
        gap={10}
        onClick={() => props.onSelectTab(Tabs.TEACHER)}
      >
        <LiaChalkboardTeacherSolid size={36} style={{ color: "#FFFFFF" }} />
        <Text fw={600} fz={15} c={"#FFFFFF"}>
          Teacher
        </Text>
      </Stack> */}
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
      </Stack>
    </Flex>
  );
};

export default TeacherMobileNavbar;
