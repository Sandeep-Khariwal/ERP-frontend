import { Tabs } from "@/app/[institute]/[id]/dashboard/page";
import { Flex, Stack, Text } from "@mantine/core";
import { IconCircle0, IconHome } from "@tabler/icons-react";
import React from "react";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiStudent } from "react-icons/pi";

const MobileNavbar = (props: {
  onClickCollapse: () => void;
  onSelectTab: (val: Tabs) => void;
}) => {
  return (
    <Flex
      w={"96%"}
      align={"center"}
      justify={"space-between"}
      style={{
        position: "absolute",
        bottom: "1%",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "2rem",
        zIndex:10
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
      <Stack
        style={{ cursor: "pointer" }}
        my={10}
        align={"center"}
        gap={10}
        onClick={() => props.onSelectTab(Tabs.TEACHER)}
      >
        <IconCircle0 size={36} style={{ color: "#FFFFFF" }} />
        <Text fw={600} fz={15} c={"#FFFFFF"}>
          Profile
        </Text>
      </Stack>
    </Flex>
  );
};

export default MobileNavbar;
