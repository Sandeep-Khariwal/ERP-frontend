"use client"
import {
    Button,
    Flex,
    Grid,
    Modal,
    Stack,
    Text,
    TextInput,
  } from "@mantine/core";
  import { useMediaQuery } from "@mantine/hooks";
  import { DatePickerInput } from "@mantine/dates";
  import { Dispatch, SetStateAction, useState } from "react";
  
  import PhoneInput from "react-phone-input-2";
  import "react-phone-input-2/lib/style.css";
import {  IconPlus, IconX } from "@tabler/icons-react";
import { Screen } from "./insideBatch/InstituteInsideBatch";
  
  interface FormData {
    name: string;
    parentName: string;
    phoneNumber: string[];
    dateOfBirth: Date;
    address: string;
    additionalPhoneNumbers: string[];
    instituteId?: string;
  }
  
  type SetFormDataAction = React.Dispatch<
    React.SetStateAction<FormData | undefined>
  >;
  
  interface AddNewStudentModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onNextButtonClicked: (studentToCreate: any) => void;
    setShowSelectedScreen?: (addMoreDetails: Screen) => void;
    setFormData?: Dispatch<SetStateAction<any | undefined>>;
    instituteId?: string;
    batchId?:string;
  }
  
  export const AddNewStudentModal: React.FC<AddNewStudentModalProps> = ({
    isOpen,
    setIsOpen,
    onNextButtonClicked,
    setShowSelectedScreen,
    setFormData,
    instituteId,
    batchId,
  }) => {
    // const isMd = useMediaQuery(`(max-width: 820px)`);
    const [additionalPhoneNumbers, setAdditionalPhoneNumbers] = useState<
      string[]
    >([]);
  
    const [studentName, setStudentName] = useState<string>("");
    const [parentName, setParentName] = useState<string>("");
    const [dateofBirth, setDateOfBirth] = useState<Date | null>(new Date());
    const [address, setAddress] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
  
    const [datePickerValue, setDatePickerValue] = useState<Date>(new Date());
  
    const isFormFilled = () => {
      if (phoneNumber.length == 0) return false;
  
      return studentName.trim().length !== 0 && parentName.trim().length !== 0
        ? true
        : false;
    };
  
    const handleAddMoreDetails = () => {
      const formData: FormData = {
        name: studentName,
        parentName: parentName,
        dateOfBirth: datePickerValue!!,
        address: address,
        phoneNumber: [phoneNumber],
        additionalPhoneNumbers: additionalPhoneNumbers,
      };
      if (setFormData) {
        setFormData(formData);
      }
      setShowSelectedScreen && setShowSelectedScreen(Screen.ADDMORESCREEN);
      setIsOpen(false);
    };
  
    return (
      <>
        <Modal
          radius="sm"
          size={"md"}
          opened={isOpen}
          centered
          onClose={() => {
            setIsOpen(false);
          }}
          closeOnClickOutside={false}
          withCloseButton={false}
          mx={10}
        >
          <Stack>
            <Grid grow align="center">
              <Grid.Col span={10}>
                <Text c="#000000" fz={20} ff={"Roboto"} fw={700}>
                  Add New Student
                </Text>
              </Grid.Col>
              <Grid.Col span={1} mt={4}>
                <IconX
                  size={22}
                  cursor="pointer"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                />
              </Grid.Col>
            </Grid>
            <TextInput
            ff={"Poppins"}
              placeholder="Enter Student Name"
              label="Student Name"
              value={studentName}
              onChange={(event) => setStudentName(event.currentTarget.value)}
              withAsterisk
            />

  
            <TextInput
              ff={"Poppins"}
              placeholder="Enter Parent's Name"
              label="Parent Name"
              value={parentName}
              onChange={(event) => setParentName(event.currentTarget.value)}
              withAsterisk
            />
  
            <TextInput
              placeholder="Enter your Address Here"
              label="Address"
              ff={"Poppins"}
              value={address}
              onChange={(event) => setAddress(event.currentTarget.value)}
            />
  
            <Text fz={14}   ff={"Poppins"}>Phone Number *</Text>
  
            <PhoneInput
              country="in"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(value?: string | undefined) => {
                if (value) {
                  var finalPhoneNum = value.toString();
                  if (finalPhoneNum[0] == "0") {
                    finalPhoneNum = finalPhoneNum.substring(1);
                  }
                  setPhoneNumber(`+${finalPhoneNum}`);
                }
              }}
              containerStyle={{
                height: "36px",
              }}
              inputStyle={{
                width: "100%",
                height: "100%",
                border: "solid 1px #00000040",
              }}
            />

                      <DatePickerInput
                        label="Date Of Birth"
                        ff={"Poppins"}
                        placeholder="Select Date"
                        radius={"md"}
                        value={dateofBirth}
                        onChange={(date) => {
                          setDateOfBirth(date || null)
                        }}
                      />
  
            {additionalPhoneNumbers.map((phoneNumber, index) => {
              return (
                <Grid grow align="center">
                  <Grid.Col span={10}>
                    <PhoneInput
                      country="in"
                      placeholder="Enter phone number"
                      value={additionalPhoneNumbers[index]}
                      onChange={(value?: string | undefined) => {
                        if (value) {
                          var finalPhoneNum = value.toString();
                          if (finalPhoneNum[0] == "0") {
                            finalPhoneNum = finalPhoneNum.substring(1);
                          }
                          additionalPhoneNumbers[index] = `+${finalPhoneNum}`;
                          setAdditionalPhoneNumbers([...additionalPhoneNumbers]);
                        }
                      }}
                      containerStyle={{
                        height: "36px",
                      }}
                      inputStyle={{
                        width: "100%",
                        height: "100%",
                        border: "solid 1px #00000040",
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={1}>
                    <IconX
                      cursor="pointer"
                      onClick={() => {
                        additionalPhoneNumbers.splice(index, 1);
                        setAdditionalPhoneNumbers([...additionalPhoneNumbers]);
                      }}
                    ></IconX>
                  </Grid.Col>
                </Grid>
              );
            })}
            <Stack align="flex-end">
              <Button
                mt={8}
                variant="subtle"
                ff={"Fira Sans"}
                leftSection={<IconPlus size={20} />}
                onClick={() => {
                  setAdditionalPhoneNumbers([...additionalPhoneNumbers, ""]);
                }}
              >
                Add Phone Number
              </Button>
            </Stack>

            <Button
              fullWidth
              variant="outline"
              mb="md"
              radius="xl"
              color="gray"
              onClick={handleAddMoreDetails}
              ff={"Fira Sans"}
            >
              Add More Details
            </Button>
            <Flex justify="flex-end" pr={4}>
              <Button
                id="cancel-btn"
                onClick={() => {
                  setIsOpen(false);
                }}
                size="md"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #808080",
                  padding: "11px, 13px, 11px, 13px",
                  borderRadius: "20px",
                }}
              >
                <Text fz={14} fw={700} ff={"Fira Sans"}>
                  Cancel
                </Text>
              </Button>
  
              <Button
                onClick={() => {
                  if (isFormFilled()) {
                    onNextButtonClicked({
                      name: studentName,
                      phoneNumber: [...additionalPhoneNumbers, phoneNumber],
                      parentName: parentName,
                      instituteId,
                      batchId: batchId || "",
                      dateOfBirth: dateofBirth,
                      address: address,
                      totalRewardpoints: 0,
                      noofGivenTests: 0,
                    });
                  } else {
                    // showNotification({
                    //   message: "Enter Valid Form Details",
                    // });
                  }
                  setStudentName("");
                  setParentName("");
                  setPhoneNumber("");
                  setParentName("");
                  setAdditionalPhoneNumbers([]);
                  setDatePickerValue(new Date());
                  setAddress("");
                }}
                py={5}
                style={{
                  backgroundColor: "",
                  borderRadius: "20px",
                  marginLeft: "8px",
                  cursor: "pointer",
                }}
                px={40}
                bg="#4B65F6"
                size="md"
        
              >
                <Text fz={14} fw={700} ff={"Fira Sans"}>
                  Next
                </Text>
              </Button>
            </Flex>
          </Stack>
        </Modal>
      </>
    );
  };
  