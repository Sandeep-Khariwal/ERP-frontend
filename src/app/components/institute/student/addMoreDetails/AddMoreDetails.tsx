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
import { IconArrowLeft} from "@tabler/icons-react";
import StepOne from "./StepOne";
import {
  CreateStudent,
  CreateStudentFeeRecords,
} from "@/api/institute/InstitutePostApi";
import AssignBatch from "./StepTwo";
import {
  UpdateStudent,
  UpdateStudentBasicInfo,
} from "@/api/institute/InstitutePutApi";
import StepThree from "./StepThree";
import { Installment } from "@/interfaces/batchInterface";
import { GetStudent } from "@/api/institute/InstituteGetApi";

interface StudentFormValues {
  name: string;
  phoneNumber: string[];
  parentName: string;
  dateOfBirth: Date | undefined;
  address: string;
  gender: string;
  dateOfJoining: Date;
  parentNumber?: string;
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

  const [showError, setShowError] = useState<boolean>(false);
  const isMd = useMediaQuery("(max-width: 980px)");
  const [additionalPhoneNumbers, setAdditionalPhoneNumbers] = useState<
    string[]
  >(props.formData?.additionalPhoneNumbers || []);
  const [optionalSubjects, setOptionalSubjects] = useState<string[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");

  const [formValues, setFormValues] = useState<StudentFormValues>({
    name: props.formData?.name || "",
    parentName: props.formData?.parentName || "",
    phoneNumber: props.formData?.phoneNumber || [],
    dateOfBirth: props.formData?.dateOfBirth
      ? new Date(props.formData.dateOfBirth)
      : new Date(),
    address: props.formData?.address || "",
    parentNumber: props.formData?.parentNumber || "",
    gender: props.formData?.gender || "",
    dateOfJoining: props.formData?.dateOfJoining || new Date(),
  });

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
  const [customOrBatch, setCustomOrBatch] = useState<string>("");

  useEffect(() => {
    if (props.selectedStudentId) {
      GetStudent(props.selectedStudentId)
        .then((x: any) => {
          const { student } = x;
          setSelectedBatch(student.batchId);
          setStudentId(student._id);
          const additionalPhoneNumbers = student.phoneNumber || [];
          const studentData = {
            name: student.name,
            parentName: student.parentName,
            phoneNumber: [...student.phoneNumber],
            dateOfBirth: new Date(student.dateOfBirth),
            address: student.address,
            parentNumber: student.parentNumber,
            gender: student.gender,
            dateOfJoining: new Date(student.dateOfJoining),
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
        dateOfBirth: new Date(formValues.dateOfBirth!!),
        address: formValues.address,
        gender: formValues.gender,
        instituteId: props.instituteId,
        batchId: props.batchId,
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
      setIsLoading(true);
      UpdateStudent(studentId, {
        batchId: selectedBatch,
        dateOfJoining: formValues.dateOfJoining,
        optionalSubjects: optionalSubjects,
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
        w={isMd ? "100%" : "80%"}
        className="addMoreDetails"
        bg={"white"}
        style={{ overflowY: "scroll" }}
        align="center"
        mih={isMd ? "100vh" : "90vh"}
        m={"auto"}
        my={isMd ? 0 : 20}
        p={10}
        pb={isMd ? 130 : 0}
      >
        <Flex w={"100%"} align={"center"} justify={"start"} gap={10}>
       
          <IconArrowLeft
            size={32}
            onClick={() => props.onClickBack()}
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
          w={isMd ? "100%" : "90%"}
        >
          <Stepper.Step
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
              optionalSubjects={optionalSubjects}
              onChangeAssigningBatch={(val: string) => {
                setSelectedBatch(val);
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
              batchId={selectedBatch}
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
