"use client";

import { LogOut } from "@/axios/LocalStorageUtility";
import { useAppDispatch, useAppSelector } from "@/app/redux/redux.hooks";
import { setDetails } from "@/app/redux/slices/instituteSlice";
import { Flex, Stack, Text } from "@mantine/core";
import {  IconHome } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";
import { PiStudent } from "react-icons/pi";
import { Tabs } from "@/enums";
import { AiOutlineLogout } from "react-icons/ai";
import { LiaBusAltSolid, LiaChalkboardTeacherSolid } from "react-icons/lia";

const MobileNavbar = (props: {
  onClickCollapse: () => void;
  onSelectTab: (val: Tabs) => void;
}) => {
  const navigation = useRouter();
  const dispatch = useAppDispatch();
    const institute = useAppSelector(
      (state: any) => state.instituteSlice.instituteDetails
    );
  return (
    <Flex
      w={"96%"}
      align={"center"}
      justify={"space-between"}
      style={{
        position: "fixed",
        bottom: "1%",
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
        onClick={() => props.onSelectTab(Tabs.DASHBOARD)}
      >
        <IconHome size={36} style={{ color: "#FFFFFF" }} />
        <Text fw={600} fz={15} c={"#FFFFFF"}>
          Home
        </Text>
      </Stack>
      <Stack
        style={{ cursor: "pointer" }}
        my={10}
        align={"center"}
        gap={10}
        onClick={() => props.onSelectTab(Tabs.STUDENT)}
      >
        <PiStudent size={36} style={{ color: "#FFFFFF" }} />
        <Text fw={600} fz={15} c={"#FFFFFF"}>
          Student
        </Text>
      </Stack>
      <Stack
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
      </Stack>
      {
        institute?.featureAccess
?.transportManagement &&
      <Stack
        style={{ cursor: "pointer" }}
        my={10}
        align={"center"}
        gap={10}
        onClick={() => props.onSelectTab(Tabs.TRANSPORT)}
      >
        <LiaBusAltSolid size={36} style={{ color: "#FFFFFF" }} />
        <Text fw={600} fz={15} c={"#FFFFFF"}>
          Transport
        </Text>
      </Stack>
      }
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
            setDetails({
              name: "",
              _id: "",
              phoneNumber: "",
              address: "",
            })
          );
          // dispatch(saveToken(""));
          navigation.push("/");
        }}
      >
        <AiOutlineLogout size={36} style={{ color: "#FFFFFF" }} />
        <Text fw={600} fz={15} c={"#FFFFFF"}>
          Logout
        </Text>
      </Stack>
    </Flex>
  );
};

export default MobileNavbar;
