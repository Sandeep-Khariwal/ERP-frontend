"use client";

import { Box, Divider, Flex, Stack, Text, Transition } from "@mantine/core";
import { MdKeyboardArrowDown, MdOutlineDashboard } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { AiOutlineLogout } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { useMediaQuery } from "@mantine/hooks";
import { LogOut } from "@/axios/LocalStorageUtility";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/redux.hooks";
import { FaRupeeSign } from "react-icons/fa";
import { useState } from "react";
import { FaArrowTrendUp, FaUsers } from "react-icons/fa6";

import { LiaBusAltSolid, LiaChalkboardTeacherSolid } from "react-icons/lia";
import { Tabs } from "@/enums";
import { SuccessNotification } from "@/app/helperFunction/Notification";
import { Notifications } from "@mantine/notifications";
import { saveToken } from "@/app/redux/slices/adminSlice";

import { FaMoneyBillWave } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { MdBusiness } from "react-icons/md";
import Image from "next/image";
// import {
//   IconUsers,
//   IconPlugConnected,
//   IconLayoutDashboard,
//   IconMoon,
//   IconSun,
//   IconBuildingSkyscraper,
// } from "@tabler/icons-react";
import { TbPlugConnected } from "react-icons/tb";

export const DesktopNavbar = (props: {
  isCollapsed: boolean;
  onClickCollapse: () => void;
  onSelectTab: (val: Tabs) => void;
  activeTab: Tabs; // ye add kri highlight ke liye
}) => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const navigation = useRouter();
  const dispatch = useAppDispatch();
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails,
  );

  const [openBusiness, setOpenBusiness] = useState(false);
  const [openMarketing, setOpenMarketing] = useState(false);
  const [hovered, setHovered] = useState(false);


  return (
    <>
      <Notifications />
      <Stack
        w={isMd ? "0px" : hovered ? "250px" : "80px"}
        h={"100vh"}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1000, // 🔥 ADD THIS
          transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        p={0}
      >
        <Stack
          w={"100%"}
          c={"white"}
          h={"100vh"}
          style={{ borderRadius: "0px" }}
          bg={"linear-gradient(135deg, #9C27B0, #3F51B5)"}
        >
          <Flex
            align="center"
            justify="center"
            direction="column"
            style={{
              height: "80px",
              textAlign: "center",
              transition: "all 0.3s ease",
            }}
          >
            {/* LOGO */}
            <img
              src="/logo1.png"
              alt="logo"
              style={{
                width: "40px",
                height: "40px",
                marginBottom: hovered ? "6px" : "0px",
                transition: "all 0.3s ease",
                transform: hovered ? "scale(1.05)" : "scale(1)",
              }}
            />

            {/* TEXT */}
            <Text
              fw={700}
              fz="1.1rem"
              style={{
                opacity: hovered ? 1 : 0,
                height: hovered ? "auto" : "0px",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              Shikshapay
            </Text>
          </Flex>

          <Divider size={2} color="gray" />
          <Stack h={"90%"} align="center" justify="space-between">
            <Box w={"90%"}>
              {/* <Flex
                onClick={() => props.onClickCollapse()}
                style={{
                  cursor: "pointer",

                  background: props.isCollapsed ? "white" : "transparent",
                  color: props.isCollapsed ? "#3F51B5" : "white",
                  borderLeft: props.isCollapsed
                    ? "5px solid yellow"
                    : "5px solid transparent",
                  borderRadius: "8px",
                  padding: "3px",
                  transition: "all 0.2s",
                }}
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
              </Flex> */}
              <Flex
                style={{
                  cursor: "pointer",

                  background:
                    props.activeTab === Tabs.DASHBOARD
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",

                  border:
                    props.activeTab === Tabs.DASHBOARD
                      ? "1px solid rgba(255,255,255,0.2)"
                      : "1px solid transparent",

                  boxShadow:
                    props.activeTab === Tabs.DASHBOARD
                      ? "0 0 12px rgba(255,215,0,0.6)"
                      : "none",

                  backdropFilter:
                    props.activeTab === Tabs.DASHBOARD ? "blur(10px)" : "none",

                  color: "white",
                  borderRadius: "12px",
                  padding: "8px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow =
                    "0 0 8px rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  if (props.activeTab !== Tabs.DASHBOARD) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                my={10}
                align={"center"}
                justify={!hovered ? "center" : "start"}
                gap={hovered ? 12 : 0}
                onClick={() => props.onSelectTab(Tabs.DASHBOARD)}
              >
                <Box
                  style={{
                    minWidth: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MdOutlineDashboard
                    size={28}
                    style={{
                      transition: "all 0.3s ease",
                      transform: hovered ? "scale(1.08)" : "scale(1.1)",
                    }}
                  />
                </Box>

                <Box
                  style={{
                    overflow: "hidden", // 🔥 IMPORTANT
                    transform: hovered
                      ? "translateX(0px)"
                      : "translateX(-10px)",
                    width: hovered ? "auto" : "0px",
                    opacity: hovered ? 1 : 0,
                    marginLeft: hovered ? 6 : 0,
                    transition: "all 0.3s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Text fw={600} fz={20}>
                    Dashboard
                  </Text>
                </Box>
              </Flex>
              <Flex
                style={{
                  cursor: "pointer",

                  background:
                    props.activeTab === Tabs.STUDENT
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",

                  border:
                    props.activeTab === Tabs.STUDENT
                      ? "1px solid rgba(255,255,255,0.2)"
                      : "1px solid transparent",

                  boxShadow:
                    props.activeTab === Tabs.STUDENT
                      ? "0 0 12px rgba(255,215,0,0.6)"
                      : "none",

                  backdropFilter:
                    props.activeTab === Tabs.STUDENT ? "blur(10px)" : "none",

                  color: "white",
                  borderRadius: "12px",
                  padding: "8px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow =
                    "0 0 8px rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  if (props.activeTab !== Tabs.STUDENT) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                my={10}
                align={"center"}
                justify={!hovered ? "center" : "start"}
                gap={hovered ? 12 : 0}
                onClick={() => props.onSelectTab(Tabs.STUDENT)}
              >
                <Box
                  style={{
                    minWidth: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <PiStudent
                    size={28}
                    style={{
                      transition: "all 0.3s ease",
                      transform: hovered ? "scale(1.08)" : "scale(1.1)",
                    }}
                  />
                </Box>

                <Box
                  style={{
                    overflow: "hidden",
                    width: hovered ? "auto" : "0px",
                    transform: hovered
                      ? "translateX(0px)"
                      : "translateX(-10px)",
                    opacity: hovered ? 1 : 0,
                    marginLeft: hovered ? 6 : 0,
                    transition: "all 0.3s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Text fw={600} fz={20}>
                    Student
                  </Text>
                </Box>
              </Flex>
              <Flex
                style={{
                  cursor: "pointer",

                  background:
                    props.activeTab === Tabs.TEACHER
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",

                  border:
                    props.activeTab === Tabs.TEACHER
                      ? "1px solid rgba(255,255,255,0.2)"
                      : "1px solid transparent",

                  boxShadow:
                    props.activeTab === Tabs.TEACHER
                      ? "0 0 12px rgba(255,215,0,0.6)"
                      : "none",

                  backdropFilter:
                    props.activeTab === Tabs.TEACHER ? "blur(10px)" : "none",

                  color: "white",
                  borderRadius: "12px",
                  padding: "8px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow =
                    "0 0 8px rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  if (props.activeTab !== Tabs.TEACHER) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                my={10}
                align={"center"}
                justify={!hovered ? "center" : "start"}
                gap={hovered ? 12 : 0}
                onClick={() => props.onSelectTab(Tabs.TEACHER)}
              >
                <Box
                  style={{
                    minWidth: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LiaChalkboardTeacherSolid
                    size={28}
                    style={{
                      transition: "all 0.3s ease",
                      transform: hovered ? "scale(1.08)" : "scale(1.1)",
                    }}
                  />
                </Box>

                <Box
                  style={{
                    overflow: "hidden",
                    width: hovered ? "auto" : "0px",
                    transform: hovered
                      ? "translateX(0px)"
                      : "translateX(-10px)",
                    opacity: hovered ? 1 : 0,
                    marginLeft: hovered ? 6 : 0,
                    transition: "all 0.3s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Text fw={600} fz={20}>
                    Teacher
                  </Text>
                </Box>
              </Flex>
              {/* BUSINESS MAIN */}
              <Flex
                style={{
                  cursor: "pointer",

                  background: openBusiness
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",

                  border: openBusiness
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid transparent",

                  boxShadow: openBusiness
                    ? "0 0 12px rgba(255,215,0,0.6)"
                    : "none",

                  backdropFilter: openBusiness ? "blur(10px)" : "none",

                  color: "white",
                  borderRadius: "12px",
                  padding: "8px",
                  transition: "all 0.3s ease",
                }}
                my={10}
                align={"center"}
                justify={!hovered ? "center" : "start"}
                gap={hovered ? 12 : 0}
                onClick={() => setOpenBusiness(!openBusiness)}
              >
                <Box
                  style={{
                    minWidth: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MdBusiness
                    size={28}
                    style={{
                      transition: "all 0.3s ease",
                      transform: hovered ? "scale(1.08)" : "scale(1.1)",
                    }}
                  />
                </Box>

                <Box
                  style={{
                    overflow: "hidden",
                    width: hovered ? "auto" : "0px",
                    transform: hovered
                      ? "translateX(0px)"
                      : "translateX(-10px)",
                    opacity: hovered ? 1 : 0,
                    marginLeft: hovered ? 6 : 0,
                    transition: "all 0.3s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Flex align="center" gap={4}>
                    <Text fw={600} fz={17}>
                      Business
                    </Text>

                    {/* Arrow */}
                    <MdKeyboardArrowDown
                      size={20}
                      style={{
                        transition: "all 0.3s ease",
                        transform: openBusiness
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </Flex>
                </Box>
              </Flex>

              
              {/* DROPDOWN ITEMS */}
              {openBusiness && hovered && (
                <Stack pl={30} gap={5}>
                  {/* LEads */}
                  <Flex
                    style={{
                      cursor: "pointer",
                      background:
                        props.activeTab === Tabs.EXPENSE
                          ? "rgba(255,255,255,0.08)"
                          : "transparent",

                      color: "white",
                      borderRadius: "8px",
                      padding: "6px",
                    }}
                    align="center"
                    gap={10}
                    onClick={() => props.onSelectTab(Tabs.EXPENSE)}
                  >
                     <Image src="/expense.png" width={25} height={25} alt="not found" />
                    <Text fw={500}>Expanse</Text>
                  </Flex>

                  {/* INTEGRATION */}
                  <Flex
                    style={{
                      cursor: "pointer",
                      background:
                        props.activeTab === Tabs.EARNING
                          ? "rgba(255,255,255,0.08)"
                          : "transparent",

                      color: "white",
                      borderRadius: "8px",
                      padding: "6px",
                    }}
                    align="center"
                    gap={10}
                    onClick={() => props.onSelectTab(Tabs.EARNING)}
                  >
                     <Image src="/earnings.png" width={25} height={25} alt="not found" />
                    <Text fw={500}>Earnings</Text>
                  </Flex>
                </Stack>
              )}

              {/* Marketing MAIN */}
              <Flex
                style={{
                  cursor: "pointer",

                  background: openMarketing
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",

                  border: openMarketing
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid transparent",

                  boxShadow: openMarketing
                    ? "0 0 12px rgba(255,215,0,0.6)"
                    : "none",

                  backdropFilter: openMarketing ? "blur(10px)" : "none",

                  color: "white",
                  borderRadius: "12px",
                  padding: "8px",
                  transition: "all 0.3s ease",
                }}
                my={10}
                align={"center"}
                justify={!hovered ? "center" : "start"}
                gap={hovered ? 12 : 0}
                onClick={() => setOpenMarketing(!openMarketing)}
                // direction={"column"}
              >
                <Box
                  style={{
                    minWidth: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FaArrowTrendUp size={25}  />
                  
                </Box>

                <Box
                  style={{
                    overflow: "hidden",
                    width: hovered ? "auto" : "0px",
                    transform: hovered
                      ? "translateX(0px)"
                      : "translateX(-10px)",
                    opacity: hovered ? 1 : 0,
                    marginLeft: hovered ? 6 : 0,
                    transition: "all 0.3s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Flex align="center" gap={4}>
                    <Text fw={600} fz={17}>
                      Marketing
                    </Text>
                       {/* Arrow */}
                    <MdKeyboardArrowDown
                      size={20}
                      style={{
                        transition: "all 0.3s ease",
                        transform: openMarketing
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </Flex>
                </Box>
              </Flex>

              {/* DROPDOWN ITEMS */}
              {openMarketing && hovered && (
                <Stack pl={30} gap={5}>
                  {/* LEads */}
                  <Flex
                    style={{
                      cursor: "pointer",
                      background:
                        props.activeTab === Tabs.LEADS
                          ? "rgba(255,255,255,0.08)"
                          : "transparent",

                      color: "white",
                      borderRadius: "8px",
                      padding: "6px",
                    }}
                    align="center"
                    gap={10}
                    onClick={() => props.onSelectTab(Tabs.LEADS)}
                  >
                    <FaUsers  size={25}  />
                    <Text fw={500}>Leads</Text>
                  </Flex>

                  {/* INTEGRATION */}
                  <Flex
                    style={{
                      cursor: "pointer",
                      background:
                        props.activeTab === Tabs.INTEGRATION
                          ? "rgba(255,255,255,0.08)"
                          : "transparent",

                      color: "white",
                      borderRadius: "8px",
                      padding: "6px",
                    }}
                    align="center"
                    gap={10}
                    onClick={() => props.onSelectTab(Tabs.INTEGRATION)}
                  >
                   <TbPlugConnected  size={25}  />
                    <Text fw={500}>Integration</Text>
                  </Flex>
                </Stack>
              )}
              {institute?.featureAccess?.transportManagement && (
                <Flex
                  style={{
                    cursor: "pointer",

                    background:
                      props.activeTab === Tabs.TRANSPORT
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",

                    border:
                      props.activeTab === Tabs.TRANSPORT
                        ? "1px solid rgba(255,255,255,0.2)"
                        : "1px solid transparent",

                    boxShadow:
                      props.activeTab === Tabs.TRANSPORT
                        ? "0 0 12px rgba(255,215,0,0.6)"
                        : "none",

                    backdropFilter:
                      props.activeTab === Tabs.TRANSPORT
                        ? "blur(10px)"
                        : "none",

                    color: "white",
                    borderRadius: "12px",
                    padding: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow =
                      "0 0 8px rgba(255,255,255,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    if (props.activeTab !== Tabs.TRANSPORT) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                  my={10}
                  align={"center"}
                  justify={!hovered ? "center" : "start"}
                  gap={hovered ? 12 : 0}
                  onClick={() => props.onSelectTab(Tabs.TRANSPORT)}
                >
                  <Box
                    style={{
                      minWidth: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <LiaBusAltSolid
                      size={28}
                      style={{
                        transition: "all 0.3s ease",
                        transform: hovered ? "scale(1.08)" : "scale(1.1)",
                      }}
                    />
                  </Box>

                  <Box
                    style={{
                      overflow: "hidden",
                      width: hovered ? "auto" : "0px",
                      transform: hovered
                        ? "translateX(0px)"
                        : "translateX(-10px)",
                      opacity: hovered ? 1 : 0,
                      marginLeft: hovered ? 6 : 0,
                      transition: "all 0.3s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Text fw={600} fz={20}>
                      Transport
                    </Text>
                  </Box>
                </Flex>
              )}
            </Box>

            <Box w={"100%"} px={10} pb={15}>
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
                gap={hovered ? 12 : 0}
                justify={!hovered ? "center" : "start"}
              >
                <Box
                  style={{
                    minWidth: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
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
                </Box>
                <Box
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    transition: "all 0.3s ease",
                    width: hovered ? "auto" : "0px", // 🔥 FIX
                    opacity: hovered ? 1 : 0,
                    marginLeft: hovered ? 6 : 0,
                  }}
                >
                  <Text
                    fw={600}
                    fz={16}
                    style={{
                      maxWidth: "160px",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {institute?.name}
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
