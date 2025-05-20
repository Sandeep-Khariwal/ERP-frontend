"use client";

import { Box, Divider, Flex, Stack, Text } from "@mantine/core";
import { MdOutlineDashboard } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { Tabs } from "@/app/[institute]/[id]/dashboard/page";
import { useMediaQuery } from "@mantine/hooks";
import { LogOut } from "@/axios/LocalStorageUtility";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/redux/redux.hooks";
import { saveToken, setDetails } from "@/app/redux/slices/instituteSlice";

export const DesktopNavbar = (props: {
  isCollapsed: boolean;
  onClickCollapse: () => void;
  onSelectTab: (val: Tabs) => void;
}) => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const navigation = useRouter();
  const dispatch = useAppDispatch()
  return (
    <>
      <Stack
        w={isMd ? "0px" : "100%"}
        c={"white"}
        h={"100vh"}
        bg={"#E6E1FF"}
        p={10}
      >
        <Stack
          w={"100%"}
          c={"white"}
          h={"100vh"}
          style={{ borderRadius: "1rem" }}
          bg={"linear-gradient(135deg, #9C27B0, #3F51B5)"}
        >
          <Text m={"auto"} fw={700} fz={"1.3rem"} my={10}>
            SP
          </Text>

          <Divider size={2} color="gray" />
          <Stack h={"90%"} align="center" justify="space-between">
            <Box w={"90%"}>
              <Flex
                onClick={() => props.onClickCollapse()}
                style={{ cursor: "pointer" }}
                my={10}
                align={"center"}
                justify={props.isCollapsed ? "center" : "start"}
                gap={10}
              >
                {!props.isCollapsed ? (
                  <IoMdClose size={28} />
                ) : (
                  <FaBars size={28} />
                )}
                {!props.isCollapsed && (
                  <Text fw={600} fz={20}>
                    Collapse
                  </Text>
                )}
              </Flex>
              <Flex
                style={{ cursor: "pointer" }}
                my={10}
                align={"center"}
                justify={props.isCollapsed ? "center" : "start"}
                gap={10}
                onClick={() => props.onSelectTab(Tabs.DASHBOARD)}
              >
                <MdOutlineDashboard size={28} />
                {!props.isCollapsed && (
                  <Text fw={600} fz={20}>
                    Dashboard
                  </Text>
                )}
              </Flex>
              <Flex
                style={{ cursor: "pointer" }}
                my={10}
                align={"center"}
                justify={props.isCollapsed ? "center" : "start"}
                gap={10}
                onClick={() => props.onSelectTab(Tabs.STUDENT)}
              >
                <PiStudent size={28} />
                {!props.isCollapsed && (
                  <Text fw={600} fz={20}>
                    Student
                  </Text>
                )}
              </Flex>
              {/* <Flex
                style={{ cursor: "pointer" }}
                my={10}
                align={"center"}
                justify={props.isCollapsed ? "center" : "start"}
                gap={10}
                onClick={()=>props.onSelectTab(Tabs.TEACHER)}
              >
                <LiaChalkboardTeacherSolid size={28}  />
                {!props.isCollapsed && (
                  <Text fw={600} fz={20}>
                    Teacher
                  </Text>
                )}
              </Flex> */}
            </Box>

            <Box w={"100%"}>
              {/* <Flex
                style={{ cursor: "pointer" }}
                my={10}
                align={"center"}
                justify={props.isCollapsed ? "center" : "start"}
                gap={10}
              >
                <IoSettingsOutline size={28}  />
                {!props.isCollapsed && (
                  <Text fw={600} fz={20}>
                    Settings
                  </Text>
                )}
              </Flex> */}
              <Flex
                style={{ cursor: "pointer" }}
                my={10}
                align={"center"}
                justify={props.isCollapsed ? "center" : "start"}
                gap={10}
              >
                <IoSettingsOutline
                  size={28}
                  onClick={() => {
                    LogOut();
                     dispatch(setDetails({
                      name: "",
                      _id: "",
                      phoneNumber: "",
                      address: ""
                    }));
                    dispatch(saveToken(""))
                    navigation.push("/");
                  }}
                />
                {!props.isCollapsed && <Text>sandeep khariwal</Text>}
              </Flex>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
