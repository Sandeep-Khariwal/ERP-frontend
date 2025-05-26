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
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { useSelector } from "react-redux";
import AddStaffModal from "./AddStaffModal";
import { UserType } from "@/enums";

interface InstituteProfileProps {
  users: {
    id: string;
    name: string;
    role: string;
  }[];
  userType: UserType;
  instituteId: string;
  onreloadData: () => void;
}

export function InstituteProfile(props: InstituteProfileProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModel, setIsUserModel] = useState(false);
  const [userData, setUserData] = useState<{ [key: string]: string } | null>(
    null
  );
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

  return (
    <Card
      w={isMd ? "95%" : "80%"}
      mx={"auto"}
      mt={"2rem"}
      shadow="0px 0px 30px 0px rgba(0, 0, 0, 0.10)"
      radius={10}
      p={20}
    >
      <Stack
        bg={"#FFFFFF"}
        style={{ borderRadius: "10px", borderColor: "#0000001A" }}
      >
        <Flex ml={5} align="center">
          <Text fz={18} fw={700} c={"#1B1212"} ff={"Roboto"}>
            Create/View Profile
          </Text>
          <Button
            onClick={handleOpenModal}
            size="sm"
            variant="default"
            ml={16}
            fw={700}
            c={"#353935"}
            ff={"Poppins"}
            style={{
              fontSize: "16px",
              borderRadius: "24px",
              borderColor: "##808080",
              borderWidth: "1px",
            }}
          >
            + Add Staff
          </Button>
        </Flex>
        {isModalOpen && (
          <AddStaffModal
            instituteId={props?.instituteId}
            isOpen={isModalOpen}
            userType={props.userType}
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
