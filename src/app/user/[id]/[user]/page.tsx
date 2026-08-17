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
import { Box, Flex, LoadingOverlay, AppShell, Burger, Group, Text } from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

function page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigation = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const tabQuery = searchParams?.get("tab") as Tabs | null;
  const selectedTab = tabQuery && Object.values(Tabs).includes(tabQuery) ? tabQuery : Tabs.DASHBOARD;

  const handleSelectTab = (val: Tabs) => {
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.set("tab", val);
    navigation.push(`${pathname}?${newParams.toString()}`);
  };
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [opened, { toggle }] = useDisclosure();
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails,
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
          }),
        );

        const instituteDetails = {
          name: data.instituteId.name,
          _id: data.instituteId._id,
          phoneNumber: "",
          address: data.instituteId.address,
          featureAccess: data.instituteId.accessFeatures,
          isAcadmy: data.instituteId.isAcadmy,
        };

        dispatch(setDetails(instituteDetails));
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <AppShell
        header={{ height: isMd ? 60 : 0 }}
        navbar={{
          width: isMd ? 80 : 260,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding={0}
        style={{ minHeight: "100vh" }}
      >
        <LoadingOverlay visible={isLoading} />
        <AppShell.Header style={{ display: isMd ? 'flex' : 'none', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between' }}>
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={700} fz="1.1rem">Shikshapay</Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p={0} style={{ borderRight: "none", zIndex: 1000 }}>
          {!isMd && (
            <DesktopNavbar
              isCollapsed={false}
              onClickCollapse={() => {}}
              onSelectTab={handleSelectTab}
              activeTab={selectedTab}
            />
          )}
          {isMd && (
            <DesktopNavbar
              isCollapsed={opened}
              onClickCollapse={toggle}
              onSelectTab={(val: Tabs) => {
                handleSelectTab(val);
                toggle();
              }}
              activeTab={selectedTab}
            />
          )}
        </AppShell.Navbar>

        <AppShell.Main bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}>
          <Box
            style={{
              transition: "all 0.3s ease",
              minHeight: "100vh",
              overflowY: "auto",
            }}
            p="md"
          >
            {Tabs.DASHBOARD === selectedTab && (
              <InstituteDashboard isShowTopCard={false} />
            )}
            {Tabs.STUDENT === selectedTab && <InstituteStudents />}
            {Tabs.TEACHER === selectedTab && (
              <InstituteTeachers userType={UserType.OTHERS} />
            )}
            {institute?.featureAccess?.transportManagement &&
              Tabs.TRANSPORT === selectedTab && <TransportPage />}
          </Box>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default page;
