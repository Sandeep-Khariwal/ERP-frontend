"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  Button,
  Flex,
  SimpleGrid,
  Stack,
  MultiSelect,
  TextInput,
  PasswordInput,
  LoadingOverlay,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { GetInstituteBatches } from "@/axios/institute/instituteSlice";
import { CreateAdmin } from "@/axios/admin/adminSlice";
import { CreateTeacher } from "@/axios/teacher/TeacherPostApi";
import {
  containsOnlyDigits,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import { CreateUser } from "@/axios/user/UserPostApi";
import { UserType } from "@/enums";
import { GetAllSubjectsFromBatch } from "@/axios/batch/BatchGetApi";

const AddStaffModal = (props: {
  isOpen: boolean;
  onClose: () => void;
  userType: UserType;
  instituteId: string;
  onreloadData: () => void;
}) => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    selectedImage: string | null;
    name: string;
    phoneNo: string;
    email: string;
    password: string;
  }>({
    selectedImage: "",
    name: "",
    phoneNo: "",
    email: "",
    password: "",
  });

  const [allBatches, setAllBatches] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [allSubjects, setAllSubjects] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [selectedSujects, setSelectedSubjects] = useState<string[]>([]);

  // useEffect(() => {
  //   if (initialFormData) {
  //     setSelectedImageIndex(
  //       ["OWNER", "ADMIN", "TEACHER"].indexOf(initialFormData.selectedImage)
  //     );
  //     setSelectedBatches(initialFormData.batches);
  //     setFormData({
  //       selectedImage: initialFormData.selectedImage,
  //       name: initialFormData.name,
  //       phoneNo: initialFormData.phoneNo,
  //       email: initialFormData.email,
  //     });
  //   } else {
  //     setSelectedImageIndex(2);
  //     setSelectedBatches([]);
  //   }
  // }, [initialFormData]);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsLoading(true);
      if (selectedImageIndex === 0) {
        // Add Admin
        CreateAdmin({
          name: formData.name,
          phone: formData.phoneNo,
          email: formData.email,
          password: formData.password,
          institute: props.instituteId,
        })
          .then((x: any) => {
            console.log(x);
            setIsLoading(false);
            props.onClose();
            SuccessNotification("Admin Created Success!!");
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
          });
      } else if (selectedImageIndex === 1) {
        // Add User
        CreateUser({
          name: formData.name,
          phone: formData.phoneNo,
          email: formData.email,
          password: formData.password,
          institute: props.instituteId,
        })
          .then((x: any) => {
            setIsLoading(false);
            props.onClose();
            console.log(x);
            SuccessNotification("User Created Success!!");
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
          });
      } else {
        // Add Teacher
        CreateTeacher({
          name: formData.name,
          phone: formData.phoneNo,
          email: formData.email,
          password: formData.password,
          institute: props.instituteId,
          selectedBatches: selectedBatches,
        })
          .then((x: any) => {
            setIsLoading(false);
            props.onClose();
            props.onreloadData()
            SuccessNotification("Teacher Created Success!!");
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
          });
      }
    }
  };

  //get all batches from institute
  useEffect(() => {
    if (props.instituteId) {
      GetInstituteBatches(props.instituteId)
        .then((x: any) => {
          const { batches } = x;
          const allBatches = batches.map((b: any) => {
            return {
              value: b._id,
              label: b.name,
            };
          });

          setAllBatches(allBatches);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [props.instituteId]);

  // function updateTeacher() {
  //   if (initialFormData) {
  //     let removedbatches: string[] = [];
  //     initialFormData.batches.forEach((batch: any) => {
  //       if (!selectedBatches.includes(batch)) {
  //         removedbatches.push(batch);
  //       }
  //     });
  //     onUpdateprofile({
  //       _id: initialFormData._id,
  //       name: formData.name,
  //       email: formData.email,
  //       phoneNo: formData.phoneNo,
  //       role:
  //         selectedImageIndex === 0
  //           ? "OWNER"
  //           : selectedImageIndex === 1
  //           ? "ADMIN"
  //           : "TEACHER",
  //       batches: selectedBatches,
  //       removedbatches: removedbatches,
  //     });
  //   }
  // }

  const handleImageSelect = (selectedImage: any, index: number) => {
    setFormData({ ...formData, selectedImage });
    setSelectedImageIndex(index);
  };

  function isDisabledNextButton() {
    if (currentStep === 1 && selectedImageIndex === -1) {
      return true;
    }
    if (
      currentStep === 2 &&
      (formData.name === "" ||
        formData.phoneNo === "" ||
        formData.email === "") &&
      selectedBatches.length === 0
    ) {
      return true;
    }
    if (currentStep === 3) {
      return true;
    }
    return false;
  }

  function getRequiredImage(index: number) {
    if (index === 0) {
      return `/admin.png`;
    }
    if (index === 1) {
      return `/user.avif`;
    }
    if (index === 2) {
      return `/teacher.png`;
    }
  }

  const rolesToShow =
    props.userType === UserType.ADMIN
      ? ["ADMIN", "USER", "TEACHER"]
      : ["", "USER", "TEACHER"];

  return (
    <Modal title="Add staff" opened={props.isOpen} onClose={props.onClose}>
      <Stack>
        <LoadingOverlay visible={isLoading} />
        {currentStep === 1 && (
          <SimpleGrid
            cols={3}
            style={{
              marginTop: "20px",
              marginLeft: "20px",
              marginRight: "20px",
            }}
          >
            {rolesToShow.map((role, index) => (
              <>
                {role && (
                  <Stack
                    key={index}
                    style={{
                      border:
                        selectedImageIndex === index
                          ? "1px solid blue"
                          : "1px solid #808080",
                      backgroundColor:
                        selectedImageIndex === -1
                          ? "transparent"
                          : selectedImageIndex === index
                          ? "#EFF1FE"
                          : "transparent",
                      cursor: "pointer",
                      borderRadius: "10px",
                    }}
                    onClick={() => handleImageSelect(role, index)}
                    align="center"
                    justify="center"
                    mr={15}
                    w="100px"
                    h="130px"
                  >
                    <Image
                      src={getRequiredImage(index)!!}
                      alt="Not found"
                      width={40}
                      height={40}
                    />

                    <Text>{role}</Text>
                  </Stack>
                )}
              </>
            ))}
          </SimpleGrid>
        )}

        {currentStep === 2 && (
          <>
            <TextInput
              placeholder="Name"
              title="Name"
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <TextInput
              title="Phone Number"
              label="Phone Number"
              placeholder="Enter Phone Number"
              maxLength={10}
              value={formData.phoneNo}
              onChange={(e) => {
                if (containsOnlyDigits(e.currentTarget.value)) {
                  setFormData({ ...formData, phoneNo: e.target.value });
                }
              }}
              required
            />
            <TextInput
              type="email"
              title="Email"
              label="Email"
              placeholder="Enter Email id here"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <PasswordInput
              type="password"
              title="create password"
              label="Create Account Password"
              placeholder="create teacher password here"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.currentTarget.value })
              }
              required
            />
            {selectedImageIndex === 2 && (
              <MultiSelect
                data={allBatches}
                value={selectedBatches}
                onChange={(value: string[]) => setSelectedBatches(value)}
                placeholder="Select Batches"
                label="Select Batches"
              />
            )}
            {/* {selectedImageIndex === 2 && (
              <MultiSelect
                data={allBatches}
                value={selectedBatches}
                onChange={(value: string[]) => setSelectedBatches(value)}
                placeholder="Select Subject"
                label="Select Subject"
              />
            )} */}
          </>
        )}
      </Stack>

      <Flex justify="flex-end" mt={20} pr={4}>
        <Button
          id="cancel-btn"
          onClick={() => {
            if (currentStep === 1) {
              props.onClose();
            } else {
              setCurrentStep(currentStep - 1);
            }
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
          <Text fz={14} fw={700}>
            {currentStep === 1 ? "Cancel" : "Back"}
          </Text>
        </Button>

        {currentStep !== 3 && (
          <Button
            onClick={handleNext}
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
            variant={isDisabledNextButton() ? "outline" : "filled"}
            disabled={isDisabledNextButton()}
          >
            <Text fz={14} fw={700}>
              Next
            </Text>
          </Button>
        )}
      </Flex>
    </Modal>
  );
};

export default AddStaffModal;
