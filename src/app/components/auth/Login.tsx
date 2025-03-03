"use client";

import { LoginAdmin } from "@/app/api/admin/adminSlice";
import { TeacherLogin } from "@/app/api/teacher/TeacherPostApi";
import { useAppDispatch } from "@/app/redux/redux.hooks";
import { saveToken, setAdminDetails } from "@/app/redux/slices/adminSlice";
import { setDetails } from "@/app/redux/slices/instituteSlice";
import { setTeacherDetails } from "@/app/redux/slices/teacherSlice";
import { UserType } from "@/enums";
import {
  Flex,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Stack,
  Tabs,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login(props: { onCreateAccount: () => void }) {
  const [userType, setUserType] = useState<UserType>(UserType.STUDENT);
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const navigation = useRouter();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // LoginAdmin
  const onClickLogin = () => {
    if (userType === UserType.ADMIN) {
      LoginAdmin(loginData)
        .then((x: any) => {
          const { admin, token } = x;
          dispatch(
            setAdminDetails({
              name: admin.name,
              _id: admin._id,
              phone: admin.phone,
              institute: admin.institute._id,
            })
          );
          dispatch(saveToken(token));

          const instituteDetails = {
            name: admin.institute.name,
            _id: admin.institute._id,
            phoneNumber: "",
            address: admin.institute.address,
          };
          dispatch(setDetails(instituteDetails));
          navigation.push(
            `/${admin.institute.name}/${admin.institute._id}/dashboard`
          );
        })
        .catch((e) => {
          console.log(e);
        });
    }

    // for user login
    if (UserType.USER) {

    }
    // for student login
    if (UserType.STUDENT) {
    }
    // for teacher login
    if (UserType.TEACHER) {
      TeacherLogin(loginData)
      .then((x: any) => {
        const { teacher, token } = x;
        console.log("teacher is : ",x);
        
        dispatch(
          setTeacherDetails({
            name: teacher.name,
            _id: teacher._id,
            phone: teacher.phoneNumber[0],
            institute: teacher.instituteId._id,
          })
        );
        dispatch(saveToken(token));

        const instituteDetails = {
          name: teacher.instituteId.name,
          _id: teacher.instituteId._id,
          phoneNumber: "",
          address: teacher.instituteId.address,
        };
        dispatch(setDetails(instituteDetails));
        navigation.push(
          `/teacher/${teacher._id}/${teacher.name}`
        );
      })
      .catch((e) => {
        console.log(e);
      });
    }
  };
  return (
    <>
      <Flex
        style={{
          height: "100vh",
          backgroundImage: `url('/LoginImage.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        p={20}
      >
        <Flex
          w={"80%"}
          mx={"auto"}
          align={"center"}
          justify={"center"}
          bg={"white"}
          p={10}
          style={{ borderRadius: "0.3rem" }}
        >
          {/* Left Section */}
          <Flex
            h={"100%"}
            style={{
              flex: 1,
              backgroundImage: `url('/LoginImage.jpeg')`,
              backgroundSize: "cover",
              color: "white",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: "0.3rem",
            }}
            align={"center"}
          >
            <Text fz="3rem" fw={700}>
              "Time is money"
            </Text>
            <Text fz="2rem">
              Save Your <span style={{ fontWeight: 700 }}>Money</span>
            </Text>
          </Flex>

          {/* Right Section */}
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
              style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }}
            >
              <Stack>
                <Text fz="2rem" fw={700} c={"#9C27B0"} ta="center">
                  Welcome Dear
                </Text>
                <Text ta="center" c="dimmed">
                  Login your account
                </Text>
                <Tabs defaultValue={userType}>
                  <Tabs.List>
                    <Tabs.Tab
                      value="admin"
                      onClick={() => setUserType(UserType.ADMIN)}
                    >
                      Admin
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="user"
                      onClick={() => setUserType(UserType.USER)}
                    >
                      User
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="teacher"
                      onClick={() => setUserType(UserType.TEACHER)}
                    >
                      Teacher
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="student"
                      onClick={() => setUserType(UserType.STUDENT)}
                    >
                      Student
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value={UserType.ADMIN} py={20}>
                    <TextInput
                      label="Email"
                      placeholder="Enter your email"
                      required
                      name="email"
                      value={loginData?.email}
                      onChange={handleChange}
                    />
                    <PasswordInput
                      label="Password"
                      placeholder="Enter your password"
                      required
                      name="password"
                      value={loginData?.password}
                      onChange={handleChange}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel value={UserType.USER} py={20}>
                    <TextInput
                      label="Email"
                      placeholder="Enter your email"
                      required
                      name="email"
                      value={loginData?.email}
                      onChange={handleChange}
                    />
                    <PasswordInput
                      label="Password"
                      placeholder="Enter your password"
                      required
                      name="password"
                      value={loginData?.password}
                      onChange={handleChange}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel value={UserType.STUDENT} py={20}>
                    <TextInput
                      label="Email"
                      placeholder="Enter your email"
                      required
                      name="email"
                      value={loginData?.email}
                      onChange={handleChange}
                    />
                  </Tabs.Panel>
                  <Tabs.Panel value={UserType.TEACHER} py={20}>
                    <TextInput
                      label="Email"
                      placeholder="Enter your email"
                      required
                      name="email"
                      value={loginData?.email}
                      onChange={handleChange}
                    />
                    <PasswordInput
                      label="Password"
                      placeholder="Enter your password"
                      required
                      name="password"
                      value={loginData?.password}
                      onChange={handleChange}
                    />
                  </Tabs.Panel>
                </Tabs>
                <Text>
                  create institute account?{" "}
                  <span
                    onClick={() => props.onCreateAccount()}
                    style={{
                      fontWeight: 600,
                      color: "#9C27B0",
                      cursor: "pointer",
                    }}
                  >
                    Signup
                  </span>
                </Text>
                <Button
                  fullWidth
                  mt="md"
                  bg={"#9C27B0"}
                  c={"white"}
                  onClick={onClickLogin}
                >
                  Login
                </Button>
              </Stack>
            </Paper>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
