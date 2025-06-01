"use client";
import {
  ErrorNotification,
  GetMonthYear,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import { PayTeacherSallery } from "@/axios/teacher/TeacherPostApi";
import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  NumberInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import React, { useEffect, useState } from "react";

// types/SalaryFormValues.ts

export interface SalaryFormValues {
  teacherId: string;
  instituteId: string;
  month: string;
  baseSalary: number;
  pf: number;
  netSalary: number;
  amountPaid: number;
  salleryDate?: Date;
  salleryMode: string;
}

const PayTeacherPayment = (props: {
  teacherId: string;
  instituteId: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<SalaryFormValues>({
    teacherId: "",
    instituteId: "",
    month: "",
    baseSalary: 0,
    amountPaid: 0,
    pf: 0,
    netSalary: 0,
    salleryDate: new Date(),
    salleryMode: "Cash",
  });

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      netSalary: prev.baseSalary - prev.pf,
    }));
  }, [formValues.baseSalary, formValues.pf]);

  useEffect(() => {
    setFormValues((prev) => {
      return {
        ...prev,
        teacherId: props.teacherId,
        instituteId: props.instituteId,
      };
    });
  }, [props.teacherId, props.instituteId]);

  // Example: Updating a field
  const handleChange = (field: keyof SalaryFormValues, value: any) => {
    if (field === "salleryDate") {
      setFormValues((prev) => ({
        ...prev,
        salleryDate: value,
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = () => {
    if (formValues.baseSalary === 0 || formValues.amountPaid === 0) {
      ErrorNotification("Base sallery and amount paid is required");
      return;
    }
    setIsLoading(true);
    const getMoth = GetMonthYear(formValues.salleryDate!!) || "";
    PayTeacherSallery({ ...formValues, month: getMoth })
      .then((x: any) => {
        setIsLoading(false);
        props.setSelectedTab("");
        setFormValues({
          ...formValues,
          month: "",
          baseSalary: 0,
          amountPaid: 0,
          pf: 0,
          netSalary: 0,
          salleryDate: new Date(),
          salleryMode: "Cash",
        });
        SuccessNotification("Payment added!!");
      })
      .catch((e) => {
        setIsLoading(false);
      });
    // Submit logic here (e.g. API call)
  };

  return (
    <Stack w={"100%"} h={"100%"}>
      <Notifications />
      <LoadingOverlay visible={isLoading} />
      <Box maw={600} p="md">
        <Title order={3} mb="md">
          Create Salary Record
        </Title>

        <Flex w={"100%"} gap={20} align={"center"} justify={"start"}>
          <NumberInput
            w={"45%"}
            label="Base Salary"
            value={formValues.baseSalary}
            onChange={(value) => handleChange("baseSalary", value || 0)}
            required
          />

          <NumberInput
            w={"45%"}
            label="PF Deduction"
            value={formValues.pf}
            onChange={(value) => handleChange("pf", value || 0)}
           
          />
        </Flex>

        <Flex w={"100%"} gap={20} mt={10} align={"center"} justify={"start"}>
          <NumberInput
            w={"45%"}
            label="Amount paying"
            value={formValues.amountPaid}
            onChange={(value) => handleChange("amountPaid", value || 0)}
            required
          />

          <DatePickerInput
            w={"45%"}
            label="Salery Date"
            ff={"Poppins"}
            placeholder="Select Date"
            radius={"md"}
            value={new Date(formValues.salleryDate!!)}
            onChange={(date) => {
              handleChange("salleryDate", date!!);
            }}
          />
        </Flex>
        <Button
          mt="md"
          disabled={formValues.baseSalary === 0 || formValues.amountPaid === 0}
          onClick={handleSubmit}
        >
          Pay now
        </Button>
      </Box>
    </Stack>
  );
};

export default PayTeacherPayment;
