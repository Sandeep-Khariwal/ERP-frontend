"use client";
import { UserType } from "@/app/components/dashboard/InstituteBatchesSection";
import { DesktopNavbar } from "@/app/components/institute/DesktopNavbar";
import { InstituteDashboard } from "@/app/components/institute/InstituteDashboard";
import { InstituteStudents } from "@/app/components/institute/InstituteStudents";
import { InstituteTeachers } from "@/app/components/institute/InstituteTeacher";
import MobileNavbar from "@/app/components/institute/MobileNavbar";
import TransportPage from "@/app/components/institute/transport/TransportPage";
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
    (state: any) => state.instituteSlice.instituteDetails
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
          })
        );

        const instituteDetails = {
          name: data.institute.name,
          _id: data.institute._id,
          phoneNumber: "",
          address: data.institute.address,
          featureAccess: data.institute.accessFeatures,
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
  return (
    <>
      <Notifications />
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
             activeTab={selectedTab}  //  ye add kri highlight ke liye 
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
          {Tabs.DASHBOARD === selectedTab && <InstituteDashboard />}
          {Tabs.STUDENT === selectedTab && <InstituteStudents />}
          {Tabs.TEACHER === selectedTab && (
            <InstituteTeachers userType={UserType.OTHERS} />
          )}
          {institute?.featureAccess?.transportManagement &&
            Tabs.TRANSPORT === selectedTab && <TransportPage />}
        </Box>
      </Flex>
    </>
  );
};

export default dashboard;
