"use client";

import { GetKey } from "@/axios/payment/get.payment";
import {
  PaymentStart,
  PaymentVerification,
} from "@/axios/payment/post.payment";
import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import {
  ErrorNotification,
  SuccessNotification,
} from "../helperFunction/Notification";
import { UpdateSubscription } from "@/axios/payment/put.payment";
import { useAppDispatch, useAppSelector } from "../redux/redux.hooks";
import { setDetails } from "../redux/slices/instituteSlice";
import { useRouter } from "next/navigation";
import { LocalStorageKey, LogOut } from "@/axios/LocalStorageUtility";
import { GetAccountByToken } from "@/axios/institute/instituteSlice";
import { setAdminDetails } from "../redux/slices/adminSlice";
import { GetAdminByGmail } from "@/axios/institute/InstituteGetApi";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    label: "Pro",
    description:
      "Perfect for institutes looking to streamline finance, staff, and student management with advanced tools.",
    price: "Rs. 5,499",
    duration: "/ half year",
    features: [
      "Finance management",
      "Attendance mark",
      "Student details and progress",
      "Teacher Dashboard",
      "Fee slip generation",
      "Staff management",
    ],
  },
  {
    label: "Pro Plus",
    description:
      "Perfect for institutes looking to streamline finance, staff, and student management with advanced tools.",
    price: "Rs. 9,999",
    duration: "/ yearly",
    features: [
      "Finance management",
      "Attendance mark",
      "Student details and progress",
      "Teacher Dashboard",
      "Fee slip generation",
      "Staff management",
    ],
  },
];

export default function SubscriptionPlans() {
  const [preFillData, setPreFillData] = useState<{
    name: string;
    email: string;
    phoneNumber: string;
  }>();

  const dispatch = useAppDispatch();
  const navigation = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const paymentHandler = async (amount: number, type: number) => {
    let adminId = "";
    if (!email.includes("@gmail.com")) {
      ErrorNotification("Enter valid email!!");
      return;
    }

    const keyResponse = (await GetKey()) as any;
    const key = keyResponse.key;

    // Get the order details
    const orderResponse = (await PaymentStart(amount)) as any;
    const order = orderResponse.order;

    GetAdminByGmail(email)
      .then((x: any) => {
        const { admin } = x;
        adminId = admin._id;
        // Get the key

        const razor = new window.Razorpay(options);
        razor.open();
      })
      .catch((e) => {
        console.log(e);
        if (e.status) {
          ErrorNotification("Admin not found!!");
        }
      });

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "sandeep khariwal",
      description: "founder of MyLibrary ",
      image:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fin.linkedin.com%2Fin%2Fsandeep-khariwal-95b65522b&psig=AOvVaw3bE6yPryPCPJxiSXqNzFDQ&ust=1729577250149000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMDD6PrnnokDFQAAAAAdAAAAABAE",
      order_id: order.id,
      prefill: {
        name: preFillData?.name,
        email: preFillData?.email,
        contact: preFillData?.phoneNumber,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#232b3d",
      },
      handler: function (response: any) {
        setIsLoading(true);
        PaymentVerification(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature
        )
          .then((x) => {
            SuccessNotification("Payment success!!");
            const today = new Date();

            const nextSubscriptionExpiryDate = new Date(today);
            if (type === 0) {
              nextSubscriptionExpiryDate.setMonth(today.getMonth() + 1);
            } else {
              nextSubscriptionExpiryDate.setFullYear(today.getFullYear() + 1);
            }

            UpdateSubscription(adminId, nextSubscriptionExpiryDate) //authState._id,subscriptionMonths,amount
              .then((x: any) => {
                SuccessNotification("Subscription added!!");
                setIsLoading(false);
                const { institute, token } = x;
                dispatch(setDetails(institute));
                // LogOut()
                localStorage.setItem("shikshaPayToken", token);

                window.location.reload();
              })
              .catch((e) => {
                console.log(e);
                setIsLoading(false);
              });
          })
          .catch((e) => {
            const { message } = e.response.data;
            ErrorNotification(message);
            setIsLoading(false);
            console.log("error in payment varification : ", e);
          });
      },
      modal: {
        ondismiss: function () {
          console.log("Payment popup closed");
        },
      },
    };
  };

  return (
    <Box
      style={(theme) => ({
        maxWidth: 900,
        margin: "0 auto",
        backgroundColor: theme.colors.gray[0],
        padding: "2rem",
        borderRadius: theme.radius.md,
        boxShadow: theme.shadows.md,
      })}
    >
      <LoadingOverlay visible={isLoading} />
      <Notifications />
      {/* Header */}
      <Stack align="center" mb="xl">
        <Text fw={700} fz="2rem">
          Choose your right plan!
        </Text>
        <Text c="dimmed">
          Select from best plans, ensuring a perfect match. Need more or less?
        </Text>
        <Text c="dimmed">Customize your subscription for a seamless fit!</Text>
        <Flex w={"100%"} align={"center"} justify={"center"} gap={7}>
          {/* <Button
            style={{
              backgroundColor: "#111",
              color: "white",
              textAlign: "center",
              padding: "0.75rem",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "0.3s",
              userSelect: "none",
              boxShadow: "0 4px 10px rgba(108, 92, 231, 0.3)",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 28px rgba(89, 70, 193, 0.4)",
              },
              "&:active": {
                transform: "scale(0.96)",
              },
            }}
            onClick={() => navigation.push("/auth")}
          >
            Login now
          </Button> */}
          <Text c={"red"}>**Note : Click on </Text>
          <Button
            style={{
              backgroundColor: "#111",
              color: "white",
              textAlign: "center",
              padding: "0.75rem",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "0.3s",
              userSelect: "none",
              boxShadow: "0 4px 10px rgba(108, 92, 231, 0.3)",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 28px rgba(89, 70, 193, 0.4)",
              },
              "&:active": {
                transform: "scale(0.96)",
              },
            }}
            onClick={() => navigation.push("/")}
          >
            Home
          </Button>
          <Text c={"red"}>after payment </Text>
        </Flex>
      </Stack>

      <TextInput
        placeholder="Enter Admin email"
        label={"Admin Email"}
        w={"50%"}
        required
        onChange={(e) => setEmail(e.target.value)}
        my={20}
        mx={"auto"}
      />
      {/* Plan Cards */}
      <Flex
        wrap="wrap"
        gap="2rem"
        justify="center"
        direction={{ base: "column", sm: "row" }}
      >
        {plans.map((plan, i: number) => (
          <Box
            key={plan.label}
            style={(theme) => ({
              backgroundColor: theme.white,
              padding: "1.5rem",
              borderRadius: theme.radius.md,
              boxShadow: theme.shadows.md,
              width: 280,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "default",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 16px 30px rgba(108, 92, 231, 0.25)",
              },
            })}
          >
            <Box
              style={{
                backgroundColor: "#6c5ce7",
                color: "white",
                padding: "6px 18px",
                width: "fit-content",
                borderRadius: "20px",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              {plan.label}
            </Box>

            <Text c="dimmed" fz="sm" mt="sm">
              {plan.description}
            </Text>

            <Text mt="sm" fw={700} fz="lg">
              {plan.price}{" "}
              <Text component="span" fz="sm" c="dimmed">
                {plan.duration}
              </Text>
            </Text>

            <Box
              style={{
                height: 1,
                backgroundColor: "#eee",
                margin: "1rem 0",
              }}
            />

            <Stack>
              {plan.features.map((feature, index) => (
                <Flex key={index} align="center">
                  <Text mr="xs" c="green" fw={700}>
                    ✓
                  </Text>
                  <Text fz="sm">{feature}</Text>
                </Flex>
              ))}
            </Stack>

            <Box
              style={{
                height: 1,
                backgroundColor: "#eee",
                margin: "1rem 0",
              }}
            />

            <Button
              w={"100%"}
              onClick={() => paymentHandler(i === 0 ? 5499 : 9999, i)}
              style={{
                backgroundColor: "#6c5ce7",
                color: "white",
                textAlign: "center",
                padding: "0.75rem",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "0.3s",
                userSelect: "none",
                boxShadow: "0 4px 10px rgba(108, 92, 231, 0.3)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 28px rgba(89, 70, 193, 0.4)",
                },
                "&:active": {
                  transform: "scale(0.96)",
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
