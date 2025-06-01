"use client";

import { CreateAdmin } from "@/axios/admin/adminSlice";
import {
  ErrorNotification,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import { useAppDispatch } from "@/app/redux/redux.hooks";
import { setAdminDetails } from "@/app/redux/slices/adminSlice";
import { saveToken, setDetails } from "@/app/redux/slices/instituteSlice";
import {
  Flex,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { CreateInstitute } from "@/axios/institute/instituteSlice";
import { useMediaQuery } from "@mantine/hooks";

const loginImage = "/loginImage.webp";

export default function Signup(props: { onClickLogin: () => void }) {
  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    email: string;
  }>({
    name: "",
    email: "",
    address: "",
  });
  const [adminForm, setAdminForm] = useState<{
    name: string;
    phone: string;
    email: string;
    password: string;
    institute: string;
  }>({
    name: "",
    email: "",
    phone: "",
    password: "",
    institute: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [adminScreen, setAdminScreen] = useState<boolean>(false);
   const isMd = useMediaQuery(`(max-width: 968px)`);
  const institute = useSelector(
    (state: any) => state.instituteSlice.instituteDetails
  );
  const dispatch = useAppDispatch();
  const navigation = useRouter();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAdminFormChange = (event: any) => {
    const { name, value } = event.target;
    setAdminForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignIn = () => {
    setIsLoading(true);
    CreateInstitute(formData)
      .then((x: any) => {
        const { institute, token } = x;
        const instituteDetails = {
          name: institute.name,
          _id: institute._id,
          phoneNumber: "",
          address: institute.address,
        };
        setAdminForm((prev) => ({ ...prev, institute: institute._id }));
        setIsLoading(false);
        setAdminScreen(true);
        dispatch(setDetails(instituteDetails));
        SuccessNotification("Institute created!!");
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
        ErrorNotification("Error on Institute create");
      });
  };

  const handleCreateAdmin = () => {
    setIsLoading(true);
    CreateAdmin(adminForm)
      .then((x: any) => {
        const { admin, token } = x;
        setIsLoading(false);
        SuccessNotification("Admin account created!!");
        dispatch(
          setAdminDetails({
            name: admin.name,
            _id: admin._id,
            phone: admin.phone,
            institute: admin.institute,
          })
        );
        dispatch(saveToken(token));
        navigation.push(`/${institute.name}/${institute._id}/dashboard`);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
        ErrorNotification("Error on admin create");
      });
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Flex
        style={{
          height: "100vh",
          backgroundImage: `url(${loginImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        p={isMd?10:20}
      >
        <Flex
          w={isMd?"100%":"80%"}
          mx={"auto"}
          align={"center"}
          justify={"center"}
          bg={isMd?"transparent":"white"}
          p={isMd?0:10}
          style={{ borderRadius: "1.5rem",  }}
        >
            {
               !isMd &&
   
             <Flex
              w={isMd?"100%":"80%"}
               h={"100%"}
               style={{
                 flex: 1,
                 backgroundImage:  `url(${loginImage})`,
                 backgroundSize: "cover",
                 color: "white",
                 flexDirection: "column",
                 justifyContent: "center",
                 borderRadius: "0.3rem",
                 //  display:isMd?"none":"block"
               }}
               align={"center"}
             >
               <Text fz="3rem" m={"auto"} fw={700}>
                 "Time is money"
               </Text>
               <Text fz="2rem" m={"auto"}>
                 Save Your <span style={{ fontWeight: 700 }}>Money</span>
               </Text>
             </Flex>
             }

          {/* Right Section */}
          {adminScreen ? (
            <Flex
              style={{
                flex: 1,
                backgroundColor: "white",
                padding: "2rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Paper
                shadow="xl"
                p="lg"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  borderRadius: "10px",
                }}
              >
                <Stack>
                  <Text fz="2rem" fw={700} c={"#9C27B0"} ta="center">
                    Create admin account
                  </Text>
                  <TextInput
                    label="Name"
                    placeholder="Enter admin name"
                    required
                    name="name"
                    value={adminForm.name}
                    onChange={handleAdminFormChange}
                  />
                  <TextInput
                    label="Email"
                    placeholder="Enter admin email"
                    required
                    name="email"
                    value={adminForm.email}
                    onChange={handleAdminFormChange}
                  />
                  <TextInput
                    label="Phone"
                    placeholder="Enter admin number"
                    required
                    name="phone"
                    value={adminForm.phone}
                    onChange={handleAdminFormChange}
                  />
                  <PasswordInput
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    onChange={handleAdminFormChange}
                  />
                  <Button
                    onClick={handleCreateAdmin}
                    fullWidth
                    mt="md"
                    bg={"#9C27B0"}
                    c={"white"}
                  >
                    Create
                  </Button>
                </Stack>
              </Paper>
            </Flex>
          ) : (
            <Flex
              style={{
                flex: 1,
                backgroundColor: "white",
                padding: "2rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Paper
                shadow="xl"
                p="lg"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  borderRadius: "10px",
                }}
              >
                <Stack>
                  <Text fz="2rem" fw={700} c={"#9C27B0"} ta="center">
                    Welcome Dear Institute
                  </Text>
                  <Text ta="center" c="dimmed">
                    Create your institute account
                  </Text>
                  <TextInput
                    label="Name"
                    placeholder="Enter institute name"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <TextInput
                    label="Email"
                    placeholder="Enter institute email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <TextInput
                    label="Address"
                    placeholder="Enter institute address"
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <Text>
                    already have any account?{" "}
                    <span
                      onClick={() => props.onClickLogin()}
                      style={{
                        fontWeight: 600,
                        color: "#9C27B0",
                        cursor: "pointer",
                      }}
                    >
                      Login
                    </span>
                  </Text>
                  <Button
                    onClick={handleSignIn}
                    fullWidth
                    mt="md"
                    bg={"#9C27B0"}
                    c={"white"}
                  >
                    Create
                  </Button>
                </Stack>
              </Paper>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
}
