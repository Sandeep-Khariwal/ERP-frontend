"use client";

import { useEffect, useState } from "react";
import {
  Stepper,
  Button,
  Group,
  Stack,
  Text,
  Flex,
  Divider,
  LoadingOverlay,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowLeft } from "@tabler/icons-react";
import StepOne from "./StepOne";
import {
  CreateStudent,
  CreateStudentFeeRecords,
} from "@/axios/institute/InstitutePostApi";
import AssignBatch from "./StepTwo";
import {
  UpdateStudent,
  UpdateStudentBasicInfo,
} from "@/axios/institute/InstitutePutApi";
import StepThree from "./StepThree";
import { Installment } from "@/interfaces/batchInterface";
import { GetStudent } from "@/axios/institute/InstituteGetApi";
import { ErrorNotification } from "@/app/helperFunction/Notification";

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
  van?: string;
  rollNumber: number;
}

export function AddMoreDetails(props: {
  formData?: any;
  batchId: string;
  instituteId: string;
  batchName: string;
  isEditableData: boolean;
  selectedStudentId?: string;
  onClickBack: () => void;
}) {
  const [active, setActive] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedVan, setSelectedVan] = useState<string>("");

  const [showError, setShowError] = useState<boolean>(false);
  const isMd = useMediaQuery("(max-width: 980px)");
  const [additionalPhoneNumbers, setAdditionalPhoneNumbers] = useState<
    string[]
  >(props.formData?.additionalPhoneNumbers || []);
  const [optionalSubjects, setOptionalSubjects] = useState<string[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");

  const [formValues, setFormValues] = useState<StudentFormValues>({
    name: props.formData?.name || "",
    email: props.formData?.email || "",
    parentName: props.formData?.parentName || "",
    phoneNumber: props.formData?.phoneNumber || [],
    dateOfBirth: props.formData?.dateOfBirth
      ? new Date(props.formData.dateOfBirth)
      : new Date(),
    address: props.formData?.address || "",
    parentNumber: props.formData?.parentNumber || "",
    gender: props.formData?.gender || "",
    dateOfJoining: props.formData?.dateOfJoining || new Date(),
    van: props.formData.van,
    rollNumber: props.formData?.rollNumber || 0,
  });


  useEffect(() => {
    console.log("formValues.van  : ", formValues.van);

    setSelectedVan(formValues.van ?? "")
  }, [formValues])

  const [studentInstallments, setStudentInstallments] = useState<Installment[]>(
    [
      {
        _id: "",
        name: "Installment 1",
        dueDate: new Date().toISOString().split("T")[0],
        amount: 0,
        isDeleted: false,
      },
    ]
  );
  const [installments, setInstallments] = useState<Installment[]>([
    {
      _id: "",
      name: "Installment 1",
      dueDate: new Date().toISOString().split("T")[0],
      amount: 0,
      isDeleted: false,
    },
  ]);
  const [customOrBatch, setCustomOrBatch] = useState<string>("0");

  useEffect(() => {
    if (props.selectedStudentId) {
      GetStudent(props.selectedStudentId)
        .then((x: any) => {
          const { student } = x;
          setSelectedBatch(student.batchId);
          setStudentId(student._id);
          const additionalPhoneNumbers = student.phoneNumber || [];
          const val = new Date(student.dateOfBirth).setDate(
            new Date(student.dateOfBirth)!!.getDate() - 1
          );

          console.log("student : ", student);


          const studentData = {
            name: student.name,
            email: student.email,
            parentName: student.parentName,
            phoneNumber: [...student.phoneNumber],
            dateOfBirth: student.dateOfBirth ? new Date(val) : new Date(),
            address: student.address,
            parentNumber: student.parentNumber,
            gender: student.gender,
            dateOfJoining: student.dateOfJoining
              ? new Date(student.dateOfJoining)
              : new Date(),
            van: student.van,
            rollNumber: student.rollNumber,
          };

          const newInstallments = student.feeRecords.map((f: any) => {
            return {
              _id: f._id,
              name: f.name,
              dueDate: new Date(f.dueDate).toISOString().split("T")[0],
              amount: f.totalAmount,
            };
          });
          if (props.isEditableData) {
            setStudentInstallments(newInstallments);
          }
          setCustomOrBatch(student.feeType);
          setFormValues(studentData);
          additionalPhoneNumbers.shift();
          setAdditionalPhoneNumbers(additionalPhoneNumbers);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [props.selectedStudentId]);

  const handleInputChange = (field: string, value: any) => {
    console.log(value);

    if (field === "dateOfBirth") {
      setFormValues((p) => ({ ...p, dateOfBirth: value ? value : null }));
    } else if (field === "dateOfJoining") {
      setFormValues((p) => ({ ...p, dateOfJoining: value ? value : null }));
    } else {
      setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
    }
  };

  const nextStep = () => {
    if (active === 0) {
      if (!formValues.name && formValues.phoneNumber.length === 0) {
        setShowError(true);
        return;
      }

      const studentPayload = {
        name: formValues.name,
        parentName: formValues.parentName,
        phoneNumber: [
          ...formValues.phoneNumber,
          ...additionalPhoneNumbers,
        ].filter((phone, index, self) => self.indexOf(phone) === index),
        parentNumber: formValues.parentNumber || "",
        dateOfBirth: new Date(
          new Date(formValues.dateOfBirth!!).setDate(
            formValues.dateOfBirth!!!!.getDate() + 1
          )
        ),
        address: formValues.address,
        gender: formValues.gender,
        instituteId: props.instituteId,
        batchId: props.batchId,
        email: formValues.email,
        van: selectedVan ?? formValues.van,
        rollNumber: formValues.rollNumber,
      };


      if (props.isEditableData) {
        UpdateStudentBasicInfo(studentId, studentPayload)
          .then((x: any) => {
            const { student } = x;
            setStudentId(student._id);
            setIsLoading(false);
            setActive((current) => (current < 2 ? current + 1 : current));
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
          });
      } else {
        CreateStudent(studentPayload)
          .then((x: any) => {
            const { student } = x;
            setStudentId(student._id);
            setIsLoading(false);
            setActive((current) => (current < 2 ? current + 1 : current));
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }

    if (active === 1) {
      if (!selectedBatch) {
        ErrorNotification("Select a batch!!");
        return;
      }
      setIsLoading(true);
      UpdateStudent(studentId, {
        batchId: props.batchId,
        dateOfJoining: formValues.dateOfJoining,
        optionalSubjects: optionalSubjects,
        van: selectedVan ?? formValues.van
      })
        .then((x: any) => {
          setIsLoading(false);
          setActive((current) => (current < 2 ? current + 1 : current));
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (active === 2) {
      CreateStudentFeeRecords({
        studentId,
        installments,
        batchId: selectedBatch || selectedBatchId,
        type: customOrBatch,
      })
        .then((x: any) => {
          setIsLoading(false);
          setActive((current) => (current < 2 ? current + 1 : current));
          props.onClickBack();
          setFormValues({
            name: "",
            email: "",
            parentName: "",
            phoneNumber: [],
            dateOfBirth: new Date(),
            address: "",
            parentNumber: "",
            gender: "",
            dateOfJoining: new Date(),
            rollNumber: 0,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Stack
        w={"100%"}
        className="addMoreDetails"
        bg={"white"}
        style={{ overflowY: "scroll", borderRadius: "1rem" }}
        align="center"
        mih={"100%"}
        m={"auto"}
        my={isMd ? 0 : 20}
        p={10}
        pb={isMd ? 130 : 10}
      >
        <Flex w={"80%"} align={"center"} justify={"start"} gap={10}>
          <IconArrowLeft
            size={32}
            onClick={() => {
              props.onClickBack();
              setFormValues({
                name: "",
                email: "",
                parentName: "",
                phoneNumber: [],
                dateOfBirth: new Date(),
                address: "",
                parentNumber: "",
                gender: "",
                dateOfJoining: new Date(),
                rollNumber: 0,
              });
            }}
            style={{ cursor: "pointer" }}
          />
          <Text fz={22} ff={"Poppins"}>
            Back
          </Text>
        </Flex>
        <Stepper
          size="xs"
          iconSize={24}
          active={active}
          w={isMd ? "100%" : "80%"}
        >
          <Stepper.Step
            // w={"100%"}
            ff={"Roboto"}
            label="Basic Details"
            description="Create an account"
          >
            <StepOne
              formData={formValues}
              isEditableData={false}
              onClickBack={() => {
                props.onClickBack();
              }}
              showError={showError}
              onChangeInputValue={(field: string, value: any) => {
                handleInputChange(field, value);
              }}
              setAdditionalPhoneNumbers={setAdditionalPhoneNumbers}
              additionalPhoneNumbers={additionalPhoneNumbers}
            />
          </Stepper.Step>
          <Stepper.Step
            ff={"Roboto"}
            label="Assign Batch"
            description="Assign batch to student"
          >
            <AssignBatch
              instituteId={props.instituteId}
              formValues={formValues}
              selectedBatch={selectedBatch}
              selectedVan={selectedVan || formValues.van!!}
              optionalSubjects={optionalSubjects}
              batchId={props.batchId}
              onChangeAssigningBatch={(val: string) => {
                setSelectedBatch(val);
              }}
              onChangeAssigningVan={(val: string) => {
                setSelectedVan(val);
                setFormValues((prev) => ({ ...prev, van: val }))
              }}
              handleInputChange={(field: string, value: any) => {
                handleInputChange(field, value);
              }}
              onChangeAssigningOptionalSubjects={(val: string[]) => {
                setOptionalSubjects(val);
              }}
            />
          </Stepper.Step>
          <Stepper.Step
            ff={"Roboto"}
            label="Fee Details"
            description="set fee details"
          >
            <StepThree
              batchName={props.batchName}
              batchId={selectedBatch || selectedBatchId}
              setInstallments={setInstallments}
              setCustomOrBatch={setCustomOrBatch}
              setSelectedBatchId={setSelectedBatchId}
              feeType={customOrBatch}
              isEditable={props.isEditableData}
              studentInstallments={studentInstallments}
            />
          </Stepper.Step>
        </Stepper>
        <Stack w={"100%"} mt={"auto"}>
          <Divider size={1} color="#BABABA" />
        </Stack>
        <Group
          align={isMd ? "center" : "end"}
          justify={isMd ? "center" : "end"}
        >
          <Button variant="default" disabled={active === 0} onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>
            {props.isEditableData ? "Save & Next" : "Next step"}
          </Button>
        </Group>
      </Stack>
    </>
  );
}
