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
import { Box, Flex, LoadingOverlay } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.DASHBOARD);

  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails,
  );

  const dispatch = useAppDispatch();
  const navigation = useRouter();

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
            phone: "",
            institute: data.institute._id,
          }),
        );

        const instituteDetails = {
          name: data.institute.name,
          _id: data.institute._id,
          phoneNumber: "",
          address: data.institute.address,
          featureAccess: data.institute.accessFeatures,
               email: data.email,
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

  const [hovered, setHovered] = useState(false);

  return (
    <>
      <Notifications />
      <div style={{ width: "100%", minHeight: "100vh" }}>
        <LoadingOverlay visible={isLoading} />

        <DesktopNavbar
          isCollapsed={hovered}
          onClickCollapse={() => {
            setHovered(!hovered);
          }}
          onSelectTab={(val: Tabs) => {
            setSelectedTab(val);
          }}
          activeTab={selectedTab}
        />

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
          style={{
            marginLeft: isMd ? "0px" : hovered ? "250px" : "80px",
            transition: "all 0.3s ease",
            minHeight: "100vh",
            overflowY: "auto",
          }}
          bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
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
      </div>
    </>
  );
};

export default dashboard;
