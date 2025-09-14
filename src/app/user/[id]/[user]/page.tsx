"use client";

import { UserType } from "@/app/components/dashboard/InstituteBatchesSection";
import { DesktopNavbar } from "@/app/components/institute/DesktopNavbar";
import { InstituteDashboard } from "@/app/components/institute/InstituteDashboard";
import { InstituteStudents } from "@/app/components/institute/InstituteStudents";
import { InstituteTeachers } from "@/app/components/institute/InstituteTeacher";
import MobileNavbar from "@/app/components/institute/MobileNavbar";
import TransportPage from "@/app/components/institute/transport/TransportPage";
import { useAppDispatch, useAppSelector } from "@/app/redux/redux.hooks";
import { setDetails } from "@/app/redux/slices/instituteSlice";
import { setUserDetails } from "@/app/redux/slices/userSlice";
import { GetAccountByToken } from "@/axios/institute/instituteSlice";
import { Tabs } from "@/enums";
import { Box, Flex, LoadingOverlay, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";

function page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.DASHBOARD);
  const isMd = useMediaQuery(`(max-width: 968px)`);
    const institute = useAppSelector(
      (state: any) => state.instituteSlice.instituteDetails
    );

  useEffect(() => {
    setIsLoading(true);

    GetAccountByToken()
      .then((x: any) => {
        const { data } = x;
        setIsLoading(false);

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
          featureAccess: data.instituteId.accessFeatures,
        };

        dispatch(setDetails(instituteDetails));
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, []);

  return (
    <Flex w={"100%"} mih={"100vh"}>
      <LoadingOverlay visible={isLoading} />
      <Box
        w={isCollapsed ? (isMd ? "100%" : "5%") : isMd ? "0%" : "15%"}
        style={{
          transition: "width 0.3s ease-in-out",
          display: isMd ? "none" : "block",
        }}
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
      <Box style={{ display: !isMd ? "none" : "block" }}>
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
        w={isCollapsed ? (isMd ? "100%" : "95%") : "100%"}
        mah={"100vh"}
        bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
        style={{ transition: "width 0.3s ease-in-out", overflowY: "scroll" }}
      >
        {Tabs.DASHBOARD === selectedTab && (
          <InstituteDashboard isShowTopCard={false} />
        )}
        {Tabs.STUDENT === selectedTab && <InstituteStudents />}
        {Tabs.TEACHER === selectedTab && (
          <InstituteTeachers userType={UserType.OTHERS} />
        )}
         {institute.featureAccess.transportManagement &&
                    Tabs.TRANSPORT === selectedTab && <TransportPage />}
      </Box>
    </Flex>
  );
}

export default page;
