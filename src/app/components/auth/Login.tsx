"use client";

import { LoginAdmin } from "@/axios/admin/adminSlice";
import {
  ErrorNotification,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import { useAppDispatch } from "@/app/redux/redux.hooks";
import { saveToken, setAdminDetails } from "@/app/redux/slices/adminSlice";
import { setDetails } from "@/app/redux/slices/instituteSlice";
import { setStudentDetails } from "@/app/redux/slices/studentSlice";
import { setTeacherDetails } from "@/app/redux/slices/teacherSlice";
import { UserTypes } from "@/enums";
import {
  Flex,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Stack,
  Tabs,
  Modal,
  LoadingOverlay,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PinInput from "./OtpInput";
import {
  StudentLogin,
  StudentOtpVarification,
  TeacherLogin,
} from "@/axios/teacher/TeacherPostApi";
import Loadable from "next/dist/shared/lib/loadable.shared-runtime";
import { LoginUser } from "@/axios/user/UserPostApi";
import { setUserDetails } from "@/app/redux/slices/userSlice";
import { Notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";
import { LocalStorageKey } from "@/axios/LocalStorageUtility";
import { GetAccountByToken } from "@/axios/institute/instituteSlice";
const loginImage = "/loginImage.webp";

export default function Login(props: { onCreateAccount: () => void }) {
  const [userType, setUserType] = useState<UserTypes>(UserTypes.STUDENT);
  const [studentId, setStudentId] = useState<string>("");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const dispatch = useAppDispatch();
  const navigation = useRouter();
  const [openOtpModal, setOpenOtpModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // setIsLoading(true);
    //  const token = window.localStorage.getItem(LocalStorageKey.Token)
    //  if(token){
    //   window
    //  }
    // GetAccountByToken()
    //   .then((x: any) => {
    //     const { data } = x;
    //     setIsLoading(false);
    //     dispatch(
    //       setAdminDetails({
    //         name: data.name,
    //         _id: data._id,
    //         phone: "",
    //         institute: data.institute._id,
    //       })
    //     );
    //     const instituteDetails = {
    //       name: data.institute.name,
    //       _id: data.institute._id,
    //       phoneNumber: "",
    //       address: data.institute.address,
    //     };
    //     dispatch(setDetails(instituteDetails));
    //     navigation.push(
    //       `/institute/${instituteDetails._id}/${instituteDetails.name}`
    //     );
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //       window.location.reload();
    //     if (e.status === 404) {
    //        navigation.push("/");
    //     }
    //     if (e.status === 401) {
    //       navigation.push("/auth");
    //     }
    //            if (e.status === 403) {
    //         navigation.push("/pricing");
    //       }
    //     setIsLoading(false);
    //   });
  }, []);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // LoginAdmin
  const onClickLogin = () => {
    setIsLoading(true);
    if (userType === UserTypes.ADMIN) {
      LoginAdmin(loginData)
        .then((x: any) => {
          setIsLoading(false);
          SuccessNotification("Login Successfully!!");
          const { admin, token } = x;

          dispatch(
            setAdminDetails({
              name: admin.name,
              _id: admin._id,
              phone: admin.phone,
              institute: admin.institute?._id || "",
            })
          );
          dispatch(saveToken(token));
          localStorage.setItem(LocalStorageKey.Token, token);

          const instituteDetails = {
            name: admin.institute.name,
            _id: admin.institute._id,
            phoneNumber: "",
            address: admin.institute.address,
          };
          dispatch(setDetails(instituteDetails));
          // window.location.reload();
          navigation.push(
            `/institute/${instituteDetails._id}/${instituteDetails.name}`
          );
        })
        .catch((e) => {
          const { message } = e?.response?.data;
          ErrorNotification(message);
          console.log(e);
          if (e.status === 403) {
            navigation.push("/pricing");
          }

          setIsLoading(false);
        });
    }

    // for user login
    if (userType === UserTypes.USER) {
      // LoginUser
      LoginUser(loginData)
        .then((x: any) => {
          SuccessNotification("Login Successfully!!");
          const { user, token } = x;
          setIsLoading(false);
          dispatch(
            setUserDetails({
              name: user.name,
              _id: user._id,
              phone: "",
              institute: user.instituteId._id,
            })
          );
          dispatch(saveToken(token));
          localStorage.setItem(LocalStorageKey.Token, token);
          const instituteDetails = {
            name: user.instituteId.name,
            _id: user.instituteId._id,
            phoneNumber: "",
            address: user.instituteId.address,
          };
          dispatch(setDetails(instituteDetails));
          navigation.push(`/user/${user._id}/${user.name}`);
        })
        .catch((e) => {
          if (e?.response) {
            const { message } = e?.response?.data;
            ErrorNotification(message);
            // SuccessNotification("error found!!");
          }

          setIsLoading(false);
        });
    }
    // for student login
    if (userType === UserTypes.STUDENT) {
      StudentLogin(loginData)
        .then((x: any) => {
          const { studentId, email } = x;
          setStudentEmail(email);
          setStudentId(studentId);
          setOpenOtpModal(true);
          setIsLoading(false);
        })
        .catch((e: any) => {
          const { message } = e.response.data;
          ErrorNotification(message);
          console.log(e);
          setIsLoading(false);
        });
    }
    // for teacher login
    if (userType === UserTypes.TEACHER) {
      TeacherLogin(loginData)
        .then((x: any) => {
          SuccessNotification("Login Successfully!!");
          const { teacher, token } = x;
          setIsLoading(false);
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
          navigation.push(`/teacher/${teacher._id}/${teacher.name}`);
        })
        .catch((e: any) => {
          const { message } = e.response.data;
          ErrorNotification(message);
          // SuccessNotification("error found!!");
          console.log(e);
          setIsLoading(false);
        });
    }
  };

  const varifyStudentOtp = (otp: string) => {
    setIsLoading(true);
    StudentOtpVarification({
      studentId,
      otp,
    })
      .then((x: any) => {
        const { student, token } = x;
        setIsLoading(false);
        SuccessNotification("Login Successfully!!");
        dispatch(
          setStudentDetails({
            name: student.name,
            _id: student._id,
            phone: student.phoneNumber[0],
            institute: student.instituteId._id,
          })
        );
        dispatch(saveToken(token));
        setOpenOtpModal(false);
        const instituteDetails = {
          name: student.instituteId.name,
          _id: student.instituteId._id,
          phoneNumber: "",
          address: student.instituteId.address,
        };
        dispatch(setDetails(instituteDetails));
        navigation.push(`/student/${student._id}/${student.name}`);
      })
      .catch((e: any) => {
        const { message } = e.response.data;
        ErrorNotification(message);
        console.log(e);
        setIsLoading(false);
      });
  };

  return (
    <>
      <Notifications />
      <LoadingOverlay visible={isLoading} />
      <Flex
        style={{
          height: "100vh",
          backgroundImage: `url(${loginImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        p={isMd ? 10 : 20}
      >
        <Flex
          w={isMd ? "100%" : "80%"}
          mx={"auto"}
          align={"center"}
          justify={"center"}
          bg={isMd ? "transparent" : "white"}
          p={isMd ? 0 : 10}
          style={{ borderRadius: "0.3rem" }}
        >
          {/* Left Section */}
          {!isMd && (
            <Flex
              w={isMd ? "100%" : "80%"}
              h={"100%"}
              style={{
                flex: 1,
                backgroundImage: `url(${loginImage})`,
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
          )}

          {/* Right Section */}
          <Flex
            style={{
              flex: 1,
              backgroundColor: "white",
              padding: isMd ? 5 : "2rem",
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
                      onClick={() => setUserType(UserTypes.ADMIN)}
                    >
                      Admin
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="user"
                      onClick={() => setUserType(UserTypes.USER)}
                    >
                      User
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="teacher"
                      onClick={() => setUserType(UserTypes.TEACHER)}
                    >
                      Teacher
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="student"
                      onClick={() => setUserType(UserTypes.STUDENT)}
                    >
                      Student
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value={UserTypes.ADMIN} py={20}>
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

                  <Tabs.Panel value={UserTypes.USER} py={20}>
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

                  <Tabs.Panel value={UserTypes.STUDENT} py={20}>
                    <TextInput
                      label="Email"
                      placeholder="Enter your email"
                      required
                      name="email"
                      value={loginData?.email}
                      onChange={handleChange}
                    />
                  </Tabs.Panel>
                  <Tabs.Panel value={UserTypes.TEACHER} py={20}>
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

                {UserTypes.ADMIN === userType && (
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
                )}
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

      <Modal
        opened={openOtpModal}
        title="OTP Varification!!"
        withCloseButton={false}
        onClose={() => setOpenOtpModal(false)}
      >
        <Flex w={"100%"} align={"center"} justify={"center"} mt={10}>
          <PinInput
            studentEmail={studentEmail}
            onComplete={(otp: string) => {
              varifyStudentOtp(otp);
            }}
          />
        </Flex>
      </Modal>
    </>
  );
}
