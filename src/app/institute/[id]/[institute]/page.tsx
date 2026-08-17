"use client";
import { UserType } from "@/app/components/dashboard/InstituteBatchesSection";
import { DesktopNavbar } from "@/app/components/institute/DesktopNavbar";
import { InstituteDashboard } from "@/app/components/institute/InstituteDashboard";
import { InstituteStudents } from "@/app/components/institute/InstituteStudents";
import { InstituteTeachers } from "@/app/components/institute/InstituteTeacher";
import MobileNavbar from "@/app/components/institute/MobileNavbar";
import InstituteEarnings from "@/app/components/institute/student/earnings/InstituteEarnings";
import InstituteExpanse from "@/app/components/institute/student/expense/InstituteExpense";
import TransportPage from "@/app/components/institute/transport/TransportPage";
import IntegrationsPage from "@/app/components/marketing/meta/IntegrationPage";
import LeadsPage from "@/app/components/marketing/meta/LeadsDashboard";
import WhatsAppPage from "@/app/components/marketing/whatsapp/WhatsappLeads";
import { ErrorNotification } from "@/app/helperFunction/Notification";
import { useAppDispatch, useAppSelector } from "@/app/redux/redux.hooks";
import { setAdminDetails } from "@/app/redux/slices/adminSlice";
import { setDetails } from "@/app/redux/slices/instituteSlice";
import { GetAccountByToken } from "@/axios/institute/instituteSlice";
import { LocalStorageKey } from "@/axios/LocalStorageUtility";
import { Tabs } from "@/enums";
import { Box, Flex, LoadingOverlay, AppShell, Burger, Group, Text } from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const dashboard = () => {

  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails,
  );

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

  useEffect(() => {
    setIsLoading(true);
    GetAccountByToken()
      .then((x: any) => {
        const { data } = x;
        setIsLoading(false);

        dispatch(
          setAdminDetails({
            name: data.name,
            _id: data._id,
            phone: data.institute.institutePhoneNumber,
            institute: data.institute._id,
          }),
        );

        const instituteDetails = {
          name: data.institute.name,
          _id: data.institute._id,
          phoneNumber: data.institute.institutePhoneNumber,
          address: data.institute.address,
          featureAccess: data.institute.accessFeatures,
          email: data.email,
          gst:data.institute.gst,
          isAcadmy:data.institute.isAcadmy,
        };

        dispatch(setDetails(instituteDetails));
      })
      .catch((e) => {
        console.log(e);
        if (e.status === 404) {
          window.location.reload();
        }
        if (e.status === 401) {
          navigation.push("/auth");
        }
        if (e.status === 403) {
          ErrorNotification("Subscription has been expired!!");
          navigation.push("/pricing");
        }
        setIsLoading(false);
      });
  }, []);

  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <Notifications />
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
            {Tabs.DASHBOARD === selectedTab && <InstituteDashboard />}
            {Tabs.STUDENT === selectedTab && <InstituteStudents />}
            {Tabs.EXPENSE === selectedTab && <InstituteExpanse />}
            {Tabs.EARNING === selectedTab && <InstituteEarnings />}
            {Tabs.LEADS === selectedTab && <LeadsPage />}
            {Tabs.WHATSAPPLEADS === selectedTab && <WhatsAppPage />}
            {Tabs.INTEGRATION === selectedTab && <IntegrationsPage />}

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
};

export default dashboard;
