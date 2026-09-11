"use client";
import {
  Box,
  Button,
  Flex,
  Modal,
  SimpleGrid,
  Stack,
  Center,
  Group,
  Text,
  Grid,
  Card,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { useSelector } from "react-redux";
import AddStaffModal from "./AddStaffModal";
import { UserTypes } from "@/enums";
import { AddInstituteSubjects } from "./AddInstituteSubjects";
import ReferCodeModal from "./ReferCodeModal";
import axios from "axios";
import { GetReferalCode } from "@/axios/institute/InstituteGetApi";
import { BookOpen, UserPlus, Gift } from "lucide-react";

interface InstituteProfileProps {
  users: {
    id: string;
    name: string;
    role: string;
  }[];
  userType: UserTypes;
  instituteId: string;
  onreloadData: () => void;
}

export function InstituteProfile(props: InstituteProfileProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openRefer, setOpenRefer] = useState(false);
  const [refCode, setRefCode] = useState<string>("");
  const [isFetchingRef, setIsFetchingRef] = useState(false);
  const [isUserModel, setIsUserModel] = useState(false);
  const [userData, setUserData] = useState<{ [key: string]: string } | null>(
    null,
  );
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);

  // const [editUserData, setEditUserData] = useState<{
  //   selectedImage: string;
  //   name: string;
  //   phoneNo: string;
  //   email: string;
  //   featureAccess: any;
  //   batches: string[];
  //   _id: string;
  // } | null>(null);
  // const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const isMd = useMediaQuery(`(max-width: 768px)`);
  const isLg = useMediaQuery(`(max-width: 1024px)`);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteProfileId, setDeleteProfileId] = useState<string | null>(null);
  // const { isFeatureValid, UserFeature } = useFeatureAccess();
  // const instituteDetails = useSelector<RootState, InstituteDetails | null>(
  //   (state) => {
  //     return state.instituteDetailsSlice.instituteDetails;
  //   }
  // );
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSubjectModal = () => {
    setSubjectModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUserModel(false);
    // setEditUserData(null);
    // setSelectedUserId(null);
    setUserData(null);
  };

  // const handleViewProfile = (userId: string) => {
  //   setSelectedUserId(userId);
  // };

  const handleEditProfile = (userId: string) => {
    setIsModalOpen(true);
  };
  function deleteProfile(deleteProfileId: string) {}
  function addTeacher(data: {
    name: string;
    email: string;
    phoneNo: string;
    featureAccess: any;
    batches: string[];
    role: string;
  }) {}

  function updateTeacher(data: {
    email: string;
    phoneNo: string;
    featureAccess: any;
    batches: string[];
    role: string;
    _id: string;
    name: string;
    removedbatches: string[];
  }) {
    setIsModalOpen(false);
  }

  const handleReferClick = async () => {
    try {
      setIsFetchingRef(true);

      GetReferalCode(props.instituteId)
        .then((res: any) => {
          setRefCode(res.data.couponCode);
        })
        .catch((e: any) => {
          console.log(e);
        });

      setOpenRefer(true);
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetchingRef(false);
    }
  };

  return (
    <Card
      w={isMd ? "95%" : "92%"}
      mx={"auto"}
      mt={"2rem"}
      shadow="0px 10px 30px rgba(15,23,42,0.08)"
      radius={18}
      p={22}
      style={{ border: "1px solid #F1F4F9" }}
    >
      <Stack
        bg={"#FFFFFF"}
        style={{ borderRadius: "10px", borderColor: "#0000001A" }}
      >
        <Flex
          ml={5}
          align={isMd ? "flex-start" : "center"}
          justify="space-between"
          direction={isMd ? "column" : "row"}
          gap={isMd ? 14 : 0}
        >
          <Text fz={18} fw={700} c={"#1B2559"} ff={"Roboto"}>
            Create/View Profile
          </Text>
          <Flex
            gap="sm"
            direction="row"
            wrap="wrap"
            w={isMd ? "100%" : "auto"}
          >
            <Button
              onClick={handleSubjectModal}
              size="md"
              variant="default"
              fw={600}
              px={18}
              py={10}
              leftSection={
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "8px",
                    background: "#F1EBFF",
                  }}
                >
                  <BookOpen size={14} color="#8B5CF6" />
                </Flex>
              }
              styles={{
                root: {
                  fontSize: "15px",
                  borderRadius: "12px",
                  whiteSpace: "nowrap",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0px 2px 8px rgba(15,23,42,0.05)",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    boxShadow: "0px 6px 16px rgba(15,23,42,0.10)",
                    transform: "translateY(-1px)",
                  },
                },
              }}
              w={isMd ? "100%" : "auto"}
            >
              {isMd ? "Subjects" : "Add Subjects"}
            </Button>
            <Button
              onClick={handleOpenModal}
              size="md"
              variant="default"
              fw={600}
              px={18}
              py={10}
              leftSection={
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "8px",
                    background: "#EAF1FF",
                  }}
                >
                  <UserPlus size={14} color="#2F6FED" />
                </Flex>
              }
              styles={{
                root: {
                  fontSize: "15px",
                  borderRadius: "12px",
                  whiteSpace: "nowrap",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0px 2px 8px rgba(15,23,42,0.05)",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    boxShadow: "0px 6px 16px rgba(15,23,42,0.10)",
                    transform: "translateY(-1px)",
                  },
                },
              }}
              w={isMd ? "100%" : "auto"}
            >
              {isMd ? "Staff" : "Add Staff"}
            </Button>

            <Button
              onClick={handleReferClick}
              loading={isFetchingRef}
              size="md"
              variant="default"
              fw={600}
              px={18}
              py={10}
              leftSection={
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "8px",
                    background: "#FFF4E0",
                  }}
                >
                  <Gift size={14} color="#F59E0B" />
                </Flex>
              }
              styles={{
                root: {
                  fontSize: "15px",
                  borderRadius: "12px",
                  whiteSpace: "nowrap",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0px 2px 8px rgba(15,23,42,0.05)",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    boxShadow: "0px 6px 16px rgba(15,23,42,0.10)",
                    transform: "translateY(-1px)",
                  },
                },
              }}
              w={isMd ? "100%" : "auto"}
            >
              Refer & Earn
            </Button>
          </Flex>
          <ReferCodeModal
            isOpen={openRefer}
            onClose={() => setOpenRefer(false)}
            referralCode={refCode}
          />
        </Flex>

        {subjectModalOpen && (
          <AddInstituteSubjects
            isOpen={subjectModalOpen}
            onClose={() => {
              setSubjectModalOpen(false);
            }}
          />
        )}
        {isModalOpen && (
          <AddStaffModal
            instituteId={props?.instituteId}
            isOpen={isModalOpen}
            userType={props.userType}
            onreloadData={() => {
              props.onreloadData();
            }}
            onClose={() => {
              // setEditUserData(null);
              setIsModalOpen(false);
            }}
          />
        )}

        {isUserModel && userData && (
          <Modal
            opened={isUserModel}
            onClose={handleCloseModal}
            title={
              <Text fz={20} fw={700}>
                View Profile
              </Text>
            }
            centered
          >
            <Stack>
              <Center>
                <Grid>
                  <Grid.Col span={4}>
                    <Text fz={14} fw={400}>
                      Name:
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <Text fz={16} fw={700}>
                      {userData.name}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Text fz={14} fw={400}>
                      Phone:
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <Text fz={16} fw={700}>
                      {userData.phoneNumber}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Text fz={14} fw={400}>
                      Login ID:
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <Text fz={16} fw={700}>
                      {" "}
                      {userData.email}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Text fz={14} fw={400}>
                      Password:
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <Text fz={16} fw={700}>
                      {userData.password}
                    </Text>
                  </Grid.Col>
                </Grid>
              </Center>
            </Stack>
          </Modal>
        )}
        <Flex
          direction={isMd ? "column" : "row"}
          justify={"space-between"}
          ml={10}
        >
          {isMd ? (
            <>
              <Box mx={"-5%"}>
                {/* <InstituteUserProfileCarousel
                  users={props.users.map((user) => ({
                    id: user.id,
                    name: user.name,
                    role: user.role,
                  }))}
                  onViewProfile={handleViewProfile}
                  onEditProfile={handleEditProfile}
                  setDeleteProfileId={setDeleteProfileId}
                  setDeleteModal={setDeleteModal}
                /> */}
              </Box>
            </>
          ) : (
            <Flex
              // cols={isLg ? 2 : 4}
              w={"100%"}
              wrap="wrap"
              // verticalSpacing={20}
            >
              {/* <InstituteUserCard
                users={props.users.map((user) => ({
                  id: user.id,
                  name: user.name,
                  role: user.role,
                }))}
                onViewProfile={handleViewProfile}
                onEditProfile={handleEditProfile}
                setDeleteProfileId={setDeleteProfileId}
                setDeleteModal={setDeleteModal}
              /> */}
            </Flex>
          )}
        </Flex>
        <Modal
          opened={deleteModal}
          onClose={() => setDeleteModal(false)}
          centered
          zIndex={999}
          styles={{
            title: {
              fontSize: 20,
              fontWeight: 700,
            },
          }}
        >
          <Text fw={500} fz={20}>
            Are you sure you want to delete this profile?
          </Text>
          <Group mt={20}>
            <Button
              variant="outline"
              color="dark"
              fw={700}
              radius={50}
              onClick={() => {
                setDeleteModal(false);
                setDeleteProfileId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              fw={700}
              radius={50}
              style={{ background: "red " }}
              onClick={() => {
                setDeleteModal(false);
                if (deleteProfileId) deleteProfile(deleteProfileId);
              }}
            >
              Delete
            </Button>
          </Group>
        </Modal>
      </Stack>
    </Card>
  );
}
