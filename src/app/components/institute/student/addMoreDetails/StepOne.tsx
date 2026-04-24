"use client";

import ApiHelper from "@/ApiHelper";
import { UploadStudentImage } from "@/axios/student/StudentPut";
import {
  Button,
  Container,
  Grid,
  Select,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus, IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";

interface StudentFormValues {
  name: string;
  email: string;
  phoneNumber: string[];
  parentName: string;
  dateOfBirth: Date | undefined;
  address: string;
  gender: string;
  dateOfJoining: Date;
  parentNumber?: string;
  rollNumber: number;
  photo?: string;
}

const StepOne = (props: {
  formData?: any;
  isEditableData: boolean;
  showError: boolean;
  onClickBack: () => void;
  onChangeInputValue: (field: string, value: any) => void;
  setAdditionalPhoneNumbers: React.Dispatch<React.SetStateAction<string[]>>;
  additionalPhoneNumbers: string[]
}) => {

  const isMobile = useMediaQuery("(max-width: 800px)");

  const handleInputChange = (field: string, value: any) => {
    props.onChangeInputValue(field, value);
  };

  const [imageFile, setImageFile] = useState<File | null>(null);

useEffect(() => {
  if (!imageFile) return;

  UploadStudentImage(imageFile)
    .then((res: any) => {
      console.log("SUCCESS:", res);

      const imageUrl = res?.data?.url; // ⚠️ yaha check karna

      if (imageUrl) {
        handleInputChange("photo", imageUrl);
      }
    })
    .catch((err: any) => {
      console.log("ERROR:", err);
    });

}, [imageFile]);

const [preview, setPreview] = useState<string | null>(null);

  return (
    <Container h={"100%"} w={isMobile ? "98%" : "100%"}>
      <Text fz={"lg"} fw={500} ff={"Fira Sans"} c="#333333" my={10}>
        Student Information
      </Text>
      <Grid>
        <Grid.Col span={isMobile ? 12 : 6}>
          <TextInput
            ff={"Poppins"}
            label="Student Name"
            placeholder="Enter student name here!"
            required
            error={props.showError && "Student name Required"}
            radius={"md"}
            value={props.formData.name}
            onChange={(event) =>
              handleInputChange("name", event.currentTarget.value)
            }
            styles={{ input: { borderWidth: 2 } }}
          />
        </Grid.Col>

        <Grid.Col span={isMobile ? 12 : 6}>
  <Text ff={"Poppins"} mb={5}>
    Student Photo
  </Text>

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // 👈 instant preview
    }
  }}
/>

{props.formData?.photo ? (
  <img
    src={props.formData.photo}
    style={{ width: 100, marginTop: 10, borderRadius: 8 }}
  />
) : preview ? (
  <img
    src={preview}
    style={{ width: 100, marginTop: 10, borderRadius: 8 }}
  />
) : null}

</Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>

          <TextInput
            ff={"Poppins"}
            label="Email"
            placeholder="Enter Email here!"
            required
            error={props.showError && "Email Required"}
            radius={"md"}
            value={props.formData.email}
            onChange={(event) =>
              handleInputChange("email", event.currentTarget.value)
            }
            styles={{ input: { borderWidth: 2 } }}
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <TextInput
            ff={"Poppins"}
            label="Parent Name"
            placeholder="Enter parent name here!"
            value={props.formData.parentName}
            radius={"md"}
            onChange={(event) =>
              handleInputChange("parentName", event.currentTarget.value)
            }
            styles={{ input: { borderWidth: 2 } }}
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <TextInput
            ff={"Poppins"}
            label="Roll Number"
            placeholder="Enter roll number"
            required
            type="number"
            error={props.showError && "Roll number required"}
            radius={"md"}
            value={props.formData.rollNumber || ""}
            onChange={(event) =>
              handleInputChange("rollNumber", Number(event.currentTarget.value))
            }
            styles={{ input: { borderWidth: 2 } }}
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <Text
            fz={14}
            ff={"Poppins"}
            style={{ display: "block", marginBottom: "0.5em" }}
          >
            Phone Number
          </Text>
          <PhoneInput
            country="in"
            value={props.formData?.phoneNumber[0]}
            onChange={(value?: string | undefined) => {
              if (value) {
                var finalPhoneNum = value.toString();
                if (finalPhoneNum[0] == "0") {
                  finalPhoneNum = finalPhoneNum.substring(1);
                }
                handleInputChange("phoneNumber", [`+${finalPhoneNum}`]);
              }
            }}
            containerStyle={{
              height: "36px",
            }}
            inputStyle={{
              width: "100%",
              height: "100%",
              border: "solid 0.5px #00000040",
            }}
          />
          {props.showError && (
            <Text
              fz={14}
              c="red"
              ff={"Poppins"}
              style={{ display: "block", marginBottom: "0.5em" }}
            >
              Phone number required
            </Text>
          )}
          {props.additionalPhoneNumbers.map((phoneNumber, index) => {
            return (
              <Grid grow align="center" style={{ paddingTop: "0.5px" }}>
                <Grid.Col span={10}>
                  <PhoneInput
                    country="in"
                    placeholder="Enter phone number"
                    value={props.additionalPhoneNumbers[index]}
                    onChange={(value?: string | undefined) => {
                      if (value) {
                        var finalPhoneNum = value.toString();
                        if (finalPhoneNum[0] == "0") {
                          finalPhoneNum = finalPhoneNum.substring(1);
                        }

                        props.additionalPhoneNumbers[index] = `+${finalPhoneNum}`;
                        props.setAdditionalPhoneNumbers([
                          ...props.additionalPhoneNumbers,
                        ]);
                      }
                    }}
                    containerStyle={{
                      height: "36px",
                    }}
                    inputStyle={{
                      width: "100%",
                      height: "100%",
                      border: "solid 0.5px #00000040",
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <IconX
                    cursor="pointer"
                    onClick={() => {
                      props.additionalPhoneNumbers.splice(index, 1);
                      props.setAdditionalPhoneNumbers([
                        ...props.additionalPhoneNumbers,
                      ]);
                    }}
                  ></IconX>
                </Grid.Col>
              </Grid>
            );
          })}
          <Button
            mt={8}
            variant="subtle"
            leftSection={<IconPlus size={15} />}
            onClick={() => {
              props.setAdditionalPhoneNumbers([...props.additionalPhoneNumbers, ""]);
            }}
            ff={"Poppins"}
          >
            Add Phone Number
          </Button>
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <Text
            fz={14}
            ff={"Poppins"}
            style={{ display: "block", marginBottom: "0.5em" }}
          >
            Parent Phone Number
          </Text>
          <PhoneInput
            country="in"
            placeholder="Enter phone number"
            value={props.formData.parentNumber}
            onChange={(value?: string | undefined) => {
              if (value) {
                var finalPhoneNum = value.toString();
                if (finalPhoneNum[0] == "0") {
                  finalPhoneNum = finalPhoneNum.substring(1);
                }
                handleInputChange("parentNumber", `+${finalPhoneNum}`);
              }
            }}
            containerStyle={{
              height: "36px",
            }}
            inputStyle={{
              width: "100%",
              height: "100%",
              border: "solid 0.5px #00000040",
            }}
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <DatePickerInput
            label="Date Of Birth"
            ff={"Poppins"}
            placeholder="Select Date"
            radius={"md"}
            value={props.formData.dateOfBirth}
            onChange={(date) => {
              handleInputChange("dateOfBirth", date);
            }}
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <TextInput
            label="Address"
            ff={"Poppins"}
            placeholder="Enter address here!"
            radius={"md"}
            value={props.formData.address}
            onChange={(event) =>
              handleInputChange("address", event.currentTarget.value)
            }
            styles={{ input: { borderWidth: 2 } }}
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <Select
            label="Gender"
            ff={"Poppins"}
            placeholder="Select"
            data={["Male", "Female", "Other"]}
            radius={"md"}
            value={props.formData.gender}
            onChange={(value) => handleInputChange("gender", value)}
          />
        </Grid.Col>
      </Grid>
      <Space h="md" />
    </Container>
  );
};

export default StepOne;
