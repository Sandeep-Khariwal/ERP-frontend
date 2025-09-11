"use client";

import { Box, Divider, Flex, Stack, Text, Transition } from "@mantine/core";
import { MdOutlineDashboard } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { AiOutlineLogout } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { useMediaQuery } from "@mantine/hooks";
import { LogOut } from "@/axios/LocalStorageUtility";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/redux.hooks";
import { setDetails } from "@/app/redux/slices/instituteSlice";
import {
  LiaBusAltSolid,
  LiaBusSolid,
  LiaChalkboardTeacherSolid,
} from "react-icons/lia";
import { Tabs } from "@/enums";
import { SuccessNotification } from "@/app/helperFunction/Notification";
import { Notifications } from "@mantine/notifications";
import { saveToken } from "@/app/redux/slices/adminSlice";

export const DesktopNavbar = (props: {
  isCollapsed: boolean;
  onClickCollapse: () => void;
  onSelectTab: (val: Tabs) => void;
}) => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const navigation = useRouter();
  const dispatch = useAppDispatch();
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails
  );
  console.log("institute dnav : ",institute);
  
  return (
    <>
      <Notifications />
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
                <Box
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    transition:
                      "width 0.3s ease, opacity 0.3s ease, margin 0.3s ease",
                    width: props.isCollapsed ? 0 : "auto",
                    opacity: props.isCollapsed ? 0 : 1,
                    marginLeft: props.isCollapsed ? 0 : 6,
                  }}
                >
                  <Text fw={600} fz={20}>
                    Collapse
                  </Text>
                </Box>
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
                <Box
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    transition:
                      "width 0.3s ease, opacity 0.3s ease, margin 0.3s ease",
                    width: props.isCollapsed ? 0 : "auto",
                    opacity: props.isCollapsed ? 0 : 1,
                    marginLeft: props.isCollapsed ? 0 : 6,
                  }}
                >
                  <Text fw={600} fz={20}>
                    Dashboard
                  </Text>
                </Box>
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
                <Box
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    transition:
                      "width 0.3s ease, opacity 0.3s ease, margin 0.3s ease",
                    width: props.isCollapsed ? 0 : "auto",
                    opacity: props.isCollapsed ? 0 : 1,
                    marginLeft: props.isCollapsed ? 0 : 6,
                  }}
                >
                  <Text fw={600} fz={20}>
                    Student
                  </Text>
                </Box>
              </Flex>
              <Flex
                style={{ cursor: "pointer" }}
                my={10}
                align={"center"}
                justify={props.isCollapsed ? "center" : "start"}
                gap={10}
                onClick={() => props.onSelectTab(Tabs.TEACHER)}
              >
                <LiaChalkboardTeacherSolid size={28} />
                <Box
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    transition:
                      "width 0.3s ease, opacity 0.3s ease, margin 0.3s ease",
                    width: props.isCollapsed ? 0 : "auto",
                    opacity: props.isCollapsed ? 0 : 1,
                    marginLeft: props.isCollapsed ? 0 : 6,
                  }}
                >
                  <Text fw={600} fz={20}>
                    Teacher
                  </Text>
                </Box>
              </Flex>
              {institute?.featureAccess
?.transportManagement && (
                <Flex
                  style={{ cursor: "pointer" }}
                  my={10}
                  align={"center"}
                  justify={props.isCollapsed ? "center" : "start"}
                  gap={10}
                  onClick={() => props.onSelectTab(Tabs.TRANSPORT)}
                >
                  <LiaBusAltSolid size={28} />
                  <Box
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      transition:
                        "width 0.3s ease, opacity 0.3s ease, margin 0.3s ease",
                      width: props.isCollapsed ? 0 : "auto",
                      opacity: props.isCollapsed ? 0 : 1,
                      marginLeft: props.isCollapsed ? 0 : 6,
                    }}
                  >
                    <Text fw={600} fz={20}>
                      Transport
                    </Text>
                  </Box>
                </Flex>
              )}
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
                <AiOutlineLogout
                  size={28}
                  onClick={() => {
                    SuccessNotification("Log out!!");
                    LogOut();
                    // dispatch(
                    //   setDetails({
                    //     name: "",
                    //     _id: "",
                    //     phoneNumber: "",
                    //     address: "",
                    //   })
                    // );
                    dispatch(saveToken(""));
                    setTimeout(() => {
                      navigation.push("/");
                    }, 2000);
                  }}
                />
                <Box
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    transition:
                      "width 0.3s ease, opacity 0.3s ease, margin 0.3s ease",
                    width: props.isCollapsed ? 0 : "auto",
                    opacity: props.isCollapsed ? 0 : 1,
                    marginLeft: props.isCollapsed ? 0 : 6,
                  }}
                >
                  <Text>sandeep khariwal</Text>
                </Box>
              </Flex>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
