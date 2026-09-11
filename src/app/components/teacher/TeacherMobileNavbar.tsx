"use client";

import { LogOut } from "@/axios/LocalStorageUtility";
import { useAppDispatch } from "@/app/redux/redux.hooks";
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
        borderRadius: "1.5rem",
        border: "1px solid #E2E8F0",
        boxShadow: "0px 8px 24px rgba(15,23,42,0.10)",
        zIndex: 10,
      }}
      px={15}
      bg={"#FFFFFF"}
    >
      <Stack
        style={{ cursor: "pointer" }}
        my={10}
        align={"center"}
        gap={10}
        onClick={() => props.onSelectTab(TeacherTabs.HOME)}
      >
        <IconHome size={36} style={{ color: "#33415C" }} />
        <Text fw={600} fz={15} c={"#33415C"}>
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
        <PiUser size={36} style={{ color: "#33415C" }} />
        <Text fw={600} fz={15} c={"#33415C"}>
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
        <LiaChalkboardTeacherSolid size={36} style={{ color: "#33415C" }} />
        <Text fw={600} fz={15} c={"#33415C"}>
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
        <IconCircle0 size={36} style={{ color: "#33415C" }} />
        <Text fw={600} fz={15} c={"#33415C"}>
          Log out
        </Text>
      </Stack>
    </Flex>
  );
};

export default TeacherMobileNavbar;
