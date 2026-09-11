"use client";
import { UserType } from "@/app/components/dashboard/InstituteBatchesSection";
import { DesktopNavbar } from "@/app/components/institute/DesktopNavbar";
import MobileNavbar from "@/app/components/institute/MobileNavbar";
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
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazily loaded — only the active tab is ever visible, so none of these
// (and their heavy dependencies, e.g. charting/marketing SDKs) need to be
// part of the JS that ships before the user has even picked a tab.
const InstituteDashboard = dynamic(() =>
  import("@/app/components/institute/InstituteDashboard").then((m) => m.InstituteDashboard),
);
const InstituteStudents = dynamic(() =>
  import("@/app/components/institute/InstituteStudents").then((m) => m.InstituteStudents),
);
const InstituteTeachers = dynamic(() =>
  import("@/app/components/institute/InstituteTeacher").then((m) => m.InstituteTeachers),
);
const InstituteEarnings = dynamic(() => import("@/app/components/institute/student/earnings/InstituteEarnings"));
const InstituteExpanse = dynamic(() => import("@/app/components/institute/student/expense/InstituteExpense"));
const TransportPage = dynamic(() => import("@/app/components/institute/transport/TransportPage"));
const IntegrationsPage = dynamic(() => import("@/app/components/marketing/meta/IntegrationPage"));
const LeadsPage = dynamic(() => import("@/app/components/marketing/meta/LeadsDashboard"));
const WhatsAppPage = dynamic(() => import("@/app/components/marketing/whatsapp/WhatsappLeads"));

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

        <AppShell.Main bg={"linear-gradient(160deg, #F1EEFF 0%, #F7F9FC 22%, #F7F9FC 100%)"}>
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
