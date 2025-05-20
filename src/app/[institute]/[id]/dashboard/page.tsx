"use client";
import { DesktopNavbar } from "@/app/components/institute/DesktopNavbar";
import { InstituteDashboard } from "@/app/components/institute/InstituteDashboard";
import { InstituteStudents } from "@/app/components/institute/InstituteStudents";
import MobileNavbar from "@/app/components/institute/MobileNavbar";
import { Box, Flex } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";

export enum Tabs {
  DASHBOARD = "dashboard",
  STUDENT = "student",
  // TEACHER = "teacher",
}

const dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.DASHBOARD);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  return (
    <>
      <Flex w={"100%"} mih={"100vh"} >
        <Box
          w={isCollapsed ? isMd ? "100%":"5%" : isMd ? "0%" : "15%"}
          style={{ transition: "width 0.3s ease-in-out", display:isMd?"none":"block" }}
        >
          <DesktopNavbar
            isCollapsed={isCollapsed}
            onClickCollapse={() => {
              setIsCollapsed(!isCollapsed);
            }}
            onSelectTab={(val: Tabs) => {
              setSelectedTab(val);
            }}
          />
        </Box>
        <Box  style={{display:!isMd?"none":"block" }}>

        <MobileNavbar
          onClickCollapse={() => {
            setIsCollapsed(!isCollapsed);
          }}
          onSelectTab={(val: Tabs) => {
            setSelectedTab(val);
          }}
        />
        
        </Box>
        <Box
          w={isCollapsed ? isMd ? "100%":"95%" : "100%"}
          mah={"100vh"}
          bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
          style={{ transition: "width 0.3s ease-in-out", overflowY: "scroll" }}
        >
          {Tabs.DASHBOARD === selectedTab && <InstituteDashboard />}
          {Tabs.STUDENT === selectedTab && <InstituteStudents />}
          {/* {Tabs.TEACHER === selectedTab && <InstituteTeachers />} */}
        </Box>
      </Flex>
    </>
  );
};

export default dashboard;
