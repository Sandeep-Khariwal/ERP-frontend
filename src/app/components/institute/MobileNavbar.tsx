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
        onClick={() => props.onSelectTab(Tabs.DASHBOARD)}
      >
        <IconHome size={36} style={{ color: "#33415C" }} />
        <Text fw={600} fz={15} c={"#33415C"}>
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
        <PiStudent size={36} style={{ color: "#33415C" }} />
        <Text fw={600} fz={15} c={"#33415C"}>
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
        <LiaChalkboardTeacherSolid size={36} style={{ color: "#33415C" }} />
        <Text fw={600} fz={15} c={"#33415C"}>
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
        <LiaBusAltSolid size={36} style={{ color: "#33415C" }} />
        <Text fw={600} fz={15} c={"#33415C"}>
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
        <AiOutlineLogout size={36} style={{ color: "#33415C" }} />
        <Text fw={600} fz={15} c={"#33415C"}>
          Logout
        </Text>
      </Stack>
    </Flex>
  );
};

export default MobileNavbar;
