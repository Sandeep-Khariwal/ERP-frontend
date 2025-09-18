"use client";

import { GetTeacherById } from "@/axios/teacher/TeacherGetApi";
import {
  Box,
  Divider,
  Flex,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Tabs,
  TabsTab,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowLeft } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { Batch } from "../InstituteDashboard";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import {
  InstituteBatchesSection,
  UserType,
} from "../../dashboard/InstituteBatchesSection";
import { InstituteInsideBatch } from "../insideBatch/InstituteInsideBatch";
import PayTeacherPayment from "./PayTeacherPayment";
import { SuccessNotification } from "@/app/helperFunction/Notification";
import { LogOut } from "@/axios/LocalStorageUtility";
import { AiOutlineLogout } from "react-icons/ai";
import { useAppDispatch } from "@/app/redux/redux.hooks";
import { useRouter } from "next/navigation";
import { saveToken } from "@/app/redux/slices/teacherSlice";
import { MdHistoryToggleOff } from "react-icons/md";
import SalaryCard from "../../teacher/TeacherSaleryCard";

interface Institute {
  _id: string;
  name: string;
  address: string;
}

interface Teacher {
  _id: string;
  name: string;
  phoneNumber: string[];
  profilePic: string;
  subjects: { _id: string; name: string }[];
  instituteBatches: any[];
  dateOfBirth: string;
  address: string;
  createdAt: string;
  dateOfJoining: string;
  instituteId: Institute;
}

const TeacherProfile = (props: {
  teacherId: string;
  onClickBack: () => void;
  userType: UserType;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const isLg = useMediaQuery(`(max-width: 1024px)`);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>();
  const [batchId, setBatchId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigation = useRouter();
  const [teacher, setTeacher] = useState<Teacher>({
    _id: "",
    name: "John Doe",
    phoneNumber: ["+1 234 567 890", "+1 234 567 891"],
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg", // Sample URL for profile image
    subjects: [{ _id: "h kjfdhkj", name: "science" }],
    instituteBatches: [],
    dateOfBirth: "1985-07-15",
    address: "456 Teacher Lane, Education City, NY",
    createdAt: "2020-05-15T10:00:00Z",
    dateOfJoining: "2018-08-01T08:30:00Z",
    instituteId: {
      _id: "inst001",
      name: "Global Tech Academy",
      address: "123 Tech Street, Silicon Valley, CA",
    },
  });

  useEffect(() => {
    if (props.teacherId) {
      setIsLoading(true);
      GetTeacherById(props.teacherId)
        .then((x: any) => {
          const { teacher } = x;

          setTeacher(teacher);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    }
  }, [props.teacherId]);

  return (
    <Stack
      w={UserType.OTHERS === props.userType ? "100%" : "100%"}
      // mx={"auto"}
      px={0}
      bg={"white"}
      mih={"100vh"}
      py={20}
      
    >
      <LoadingOverlay visible={isLoading} />
      {UserType.OTHERS === props.userType && (
        <Flex w={"100%"} p={10} align={"center"} justify={"start"} gap={3}>
          <IconArrowLeft
            size={32}
            style={{ cursor: "pointer" }}
            onClick={() => props.onClickBack()}
          />
          <Text fw={500} style={{ fontFamily: "sans-serif" }}>
            Back
          </Text>
        </Flex>
      )}
      <Box
        h={"100%"}
        w={UserType.OTHERS === props.userType ? "100%" : "100%"}
        bg={"white"}
        style={{ margin: "0 auto", padding: "20px" }}
      >
        <Flex align="start" justify={"start"} gap="2rem" wrap="wrap">
          {/* Teacher Profile Picture */}
          <Box
            w={"10%"}
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={teacher?.profilePic || "/boyStudent.png"}
              alt={""}
              style={{ width: isMd ? "100%" : "70%", objectFit: "cover" }}
            />
            {/* Address and Institute Info */}
          </Box>

          {/* Teacher Details */}
          <Flex w={"25%"} direction="column" gap="sm" style={{ flexGrow: 1 }}>
            <Text fw={700} size="xl" c="blue">
              {teacher?.name}
            </Text>
            <Text size="sm" c="dimmed">
              {teacher?.instituteId.name}
            </Text>
            <Text size="sm" c="dimmed">
              Subjects: {teacher?.subjects.map((s) => s.name).join(", ")}
            </Text>
            <Text size="sm" c="dimmed">
              Date of Birth:{" "}
              {teacher?.dateOfBirth
                ? new Date(teacher?.dateOfBirth).toLocaleDateString()
                : ""}
            </Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex w={"25%"} direction="column" gap="sm" style={{ flexGrow: 1 }}>
            <Text fw={500} size="lg">
              Other Information
            </Text>
            <Text size="sm" c="dimmed">
              Phone Number: {teacher?.phoneNumber.join(", ")}
            </Text>
            <Text size="sm" c="dimmed">
              Address: {teacher?.address}
            </Text>
            <Text size="sm" c="dimmed">
              Joined: {new Date(teacher?.dateOfJoining!!).toLocaleDateString()}
            </Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex w={"25%"} direction="column" gap="sm" style={{ flexGrow: 1 }}>
            <Text fw={500} size="lg">
              Institute Information
            </Text>
            <Text size="sm" c="dimmed">
              Institute: {teacher?.instituteId.name}
            </Text>
            <Text size="sm" c="dimmed">
              Address: {teacher?.instituteId.address}
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Stack
        mih={"100vh"}
        bg={"white"}
        w={UserType.OTHERS === props.userType ? "100%" : "100%"}
        mx={"auto"}
        py={20}
      >
        <Tabs w={"objectFit"} style={{ padding: "0px" }} allowTabDeactivation>
          <Tabs.List>
            {UserType.OTHERS === props.userType && (
              <Tabs.Tab
                value={"sallery"}
                onClick={() => setSelectedTab("sallery")}
                leftSection={<RiMoneyRupeeCircleLine size={16} />}
              >
                Pay Sallery
              </Tabs.Tab>
            )}
            <Tabs.Tab
              value="history"
              leftSection={<MdHistoryToggleOff size={16} />}
            >
              History
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="sallery">
            <PayTeacherPayment
              teacherId={teacher._id}
              instituteId={teacher.instituteId._id}
              setSelectedTab={setSelectedTab}
            />
          </Tabs.Panel>

          <Tabs.Panel value="history">
            <Stack mt={10} >
              <SalaryCard teacherId={teacher._id} />
            </Stack>
          </Tabs.Panel>
        </Tabs>
        {batchId === null && (
          <Stack w={"100%"} h={"100%"} mx={"auto"} p={isMd?5:20}>
            <Flex
              w={"100%"}
              align={"center"}
              justify={"space-between"}
              gap={20}
            >
              <Text
                fz={22}
                fw={500}
                c={"#36431F"}
                style={{
                  whiteSpace: "nowrap",
                  maxWidth: "70%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontFamily: "Roboto",
                }}
              >
                All Batches
              </Text>

              {UserType.TEACHER === props.userType && (
                <Flex
                  style={{ cursor: "pointer" }}
                  my={10}
                  align={"center"}
                  gap={10}
                >
                  <AiOutlineLogout
                    size={20}
                    onClick={() => {
                      SuccessNotification("Log out!!");
                      LogOut();
                      dispatch(saveToken(""));
                      setTimeout(() => {
                        navigation.push("/");
                      }, 2000);
                    }}
                  />
                  <Text>Logout</Text>
                </Flex>
              )}
            </Flex>

            {
              <SimpleGrid
                cols={isMd ? 1 : isLg ? 2 : 4}
                w={isMd ? "95%" : "100%"}
                mx={"auto"}
                spacing={20}
                verticalSpacing={20}
              >
                <InstituteBatchesSection
                  batches={teacher.instituteBatches.map((batch: any) => ({
                    id: batch?._id || "",
                    name: batch?.name || "",
                    subjects: batch?.subjects || [],
                    noOfTeachers: batch?.teachers.length || 0,
                    noOfStudents: batch?.students.length || 0,
                    firstThreeStudents: batch?.students.slice(0, 3) || [],
                    firstThreeTeachers: batch?.teachers.slice(0, 3) || [],
                  }))}
                  userType={UserType.OTHERS}
                  setDeleteBatchId={(val: string) => {
                    //  setDeleteBatchId(val);
                    //  setBatchDeleteWarning(true);
                  }}
                  setDeleteModal={(val) => {}}
                  onEditBatchName={(id: string, val: string) => {
                    //  updateTheBatchName(id, val);
                  }}
                  onbatchCardClick={(val) => {
                    console.log("onbatchCardClick : ", val);

                    setBatchId(val.id);
                    setSelectedBatch(val);
                  }}
                  onEditCourseFees={(val: any) => {
                    //  setBatchId(val._id);
                    //  setOpenEditCourseFee(true);
                    // setisCourseFeesEdit(val);
                  }}
                  onAddBatchButtonClick={() => {
                    //  setOpenAddBatchModal(true);
                  }}
                  onEditBatchButtonClick={function (batchId: string): void {
                    //  setEditBatchDetails(true)
                    //  setOpenAddBatchModal(true)
                    //  editBatch(batchId)
                  }}
                  showAddBatch={false}
                />
              </SimpleGrid>
            }
          </Stack>
        )}
        {batchId != null && (
          <Stack
            w={"100%"}
            h={"100%"}
            bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
          >
            <InstituteInsideBatch
              batchId={batchId}
              batchName={selectedBatch?.name!!}
              instituteId={""}
              subjects={teacher.subjects}
              onClickBack={() => {
                // getTechersBatches();
                setBatchId(null);
              }}
              userType={props.userType}
              fromInstituteTeacherSection={true}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default TeacherProfile;
