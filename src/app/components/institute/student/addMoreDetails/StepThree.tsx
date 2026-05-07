"use client";

import { GetBatchFee } from "@/axios/institute/InstituteGetApi";

import { Installment } from "@/interfaces/batchInterface";

import {
  ActionIcon,
  Box,
  Flex,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";

import { IconCaretDownFilled, IconTrash } from "@tabler/icons-react";

import React, { useEffect, useState } from "react";

const StepThree = (props: {
  batchName: string;
  batchId: string;
  feeType: string;
  isEditable: boolean;
  studentInstallments: Installment[];
  setInstallments: React.Dispatch<React.SetStateAction<Installment[]>>;
  setCustomOrBatch: React.Dispatch<React.SetStateAction<string>>;
  setSelectedBatchId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const isMd = useMediaQuery("(max-width: 980px)");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // currently selected type in UI
  const [selectedType, setSelectedType] = useState<string>("");

  // ORIGINAL fee type
  // IMPORTANT: never changes
  const [originalFeeType] = useState(props.feeType);

  const defaultInstallment: Installment = {
    _id: "",
    name: "Installment 1",
    dueDate: new Date().toISOString().split("T")[0],
    amount: 0,
    isDeleted: false,
  };

  // currently visible installments
  const [installments, setInstallments] = useState<Installment[]>([
    defaultInstallment,
  ]);

  // preserve original batch installments
  const [batchInstallments, setBatchInstallments] = useState<Installment[]>([]);

  // preserve original custom installments
  const [customInstallments, setCustomInstallments] = useState<Installment[]>([
    defaultInstallment,
  ]);

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    if (!originalFeeType) return;

    // =========================================
    // EDIT MODE
    // =========================================

    if (props.isEditable) {
      // ORIGINAL = BATCH
      if (originalFeeType === "Batch") {
        setBatchInstallments(props.studentInstallments);

        setInstallments(props.studentInstallments);

        setSelectedType("Batch");

        props.setInstallments(props.studentInstallments);

        props.setCustomOrBatch("Batch");

        props.setSelectedBatchId(props.batchId);
      }

      // ORIGINAL = CUSTOM
      else {
        setCustomInstallments(props.studentInstallments);

        setInstallments(props.studentInstallments);

        setSelectedType("Custom");

        props.setInstallments(props.studentInstallments);

        props.setCustomOrBatch("Custom");
      }

      return;
    }

    // =========================================
    // CREATE MODE
    // =========================================

    onClickCustomOrBatch(originalFeeType);
  }, []);

  // =========================================
  // UPDATE PARENT INSTALLMENTS
  // =========================================

  useEffect(() => {
    props.setInstallments(installments);
  }, [installments]);

  // =========================================
  // SWITCH TYPE
  // =========================================

  const onClickCustomOrBatch = async (type: string) => {
    setSelectedType(type);

    props.setCustomOrBatch(type);

    // =========================================
    // CUSTOM
    // =========================================

    if (type === "Custom") {
      // restore original custom installments
      if (props.isEditable && originalFeeType === "Custom") {
        setInstallments(customInstallments);
      } else {
        // batch student switching to custom
        setInstallments([defaultInstallment]);
      }

      return;
    }

    // =========================================
    // BATCH
    // =========================================

    props.setSelectedBatchId(props.batchId);

    // restore original batch installments
    if (props.isEditable && originalFeeType === "Batch") {
      setInstallments(batchInstallments);

      return;
    }

    // fetch batch installments
    try {
      setIsLoading(true);

      const x: any = await GetBatchFee(props.batchId);

      const { feeInstallments } = x.batchFee;

      const newInstallments = feeInstallments.map((f: any) => ({
        _id: f._id || "",
        name: f.name,
        dueDate: new Date(f.dueDate).toISOString().split("T")[0],
        amount: f.amount,
        isDeleted: false,
      }));

      // save batch installments
      setBatchInstallments(newInstallments);

      setInstallments(newInstallments);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================
  // CHANGE INSTALLMENT
  // =========================================

  const handleInstallmentChange = (
    index: number,
    field: string,
    value: any,
  ) => {
    const updatedInstallments = [...installments];

    updatedInstallments[index] = {
      ...updatedInstallments[index],
      [field]: value,
    };

    setInstallments(updatedInstallments);

    // preserve custom state
    if (selectedType === "Custom") {
      setCustomInstallments(updatedInstallments);
    }

    // preserve batch state
    if (selectedType === "Batch") {
      setBatchInstallments(updatedInstallments);
    }
  };

  // =========================================
  // ADD INSTALLMENT
  // =========================================

  const handleAddInstallment = () => {
    const updatedInstallments = [
      ...installments,
      {
        _id: "",
        name: `Installment ${installments.length + 1}`,
        dueDate: new Date().toISOString().split("T")[0],
        amount: 0,
        isDeleted: false,
      },
    ];

    setInstallments(updatedInstallments);

    setCustomInstallments(updatedInstallments);
  };

  // =========================================
  // REMOVE INSTALLMENT
  // =========================================

  const handleRemoveInstallment = (index: number) => {
    const updatedInstallments = installments.filter((_, i) => i !== index);

    setInstallments(updatedInstallments);

    setCustomInstallments(updatedInstallments);
  };

  return (
    <Stack bg={"white"}>
      <LoadingOverlay visible={isLoading} />

      <Flex align={"center"} mt={15} gap={15}>
        <Text>{props.batchName}</Text>
        <Text ff={"Roboto"}>Fee Information</Text>
      </Flex>

      <Select
        ff={"Roboto"}
        w={"10rem"}
        label="Fee Scheme"
        placeholder="select scheme"
        data={["Custom", "Batch"]}
        rightSection={<IconCaretDownFilled style={{ cursor: "pointer" }} />}
        value={selectedType}
        onChange={(value) => {
          if (value) {
            onClickCustomOrBatch(value);
          }
        }}
      />

      {selectedType && (
        <Box style={{ width: "100%", overflowX: "auto" }}>
          <Table style={{ marginTop: "2rem" }} ff={"Roboto"}>
            <thead>
              <tr>
                <th
                  style={{
                    border: "0.5px solid #D3D3D3",
                    padding: "8px",
                  }}
                >
                  S No.
                </th>

                <th
                  style={{
                    border: "0.5px solid #D3D3D3",
                    padding: "8px",
                  }}
                >
                  Name
                </th>

                <th
                  style={{
                    border: "0.5px solid #D3D3D3",
                    padding: "8px",
                  }}
                >
                  Due Date
                </th>

                <th
                  style={{
                    border: "0.5px solid #D3D3D3",
                    padding: "8px",
                  }}
                >
                  Amount in ₹
                </th>

                {selectedType !== "Batch" && (
                  <th
                    style={{
                      border: "0.5px solid #D3D3D3",
                      padding: "8px",
                    }}
                  >
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {installments.map((installment, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "0.5px solid #D3D3D3",
                      padding: "8px",
                    }}
                  >
                    {index + 1}
                  </td>

                  <td
                    style={{
                      border: "0.5px solid #D3D3D3",
                      padding: "8px",
                    }}
                  >
                    <TextInput
                      w={isMd ? "10rem" : "auto"}
                      value={installment.name}
                      readOnly={selectedType === "Batch"}
                      onChange={(event) =>
                        handleInstallmentChange(
                          index,
                          "name",
                          event.currentTarget.value,
                        )
                      }
                    />
                  </td>

                  <td
                    style={{
                      border: "0.5px solid #D3D3D3",
                      padding: "8px",
                    }}
                  >
                    <TextInput
                      type="date"
                      value={installment.dueDate}
                      readOnly={selectedType === "Batch"}
                      onChange={(event) =>
                        handleInstallmentChange(
                          index,
                          "dueDate",
                          event.currentTarget.value,
                        )
                      }
                    />
                  </td>

                  <td
                    style={{
                      border: "0.5px solid #D3D3D3",
                      padding: "8px",
                    }}
                  >
                    <NumberInput
                      w={isMd ? "6rem" : "auto"}
                      value={installment.amount}
                      min={0}
                      max={1000000}
                      hideControls
                      readOnly={selectedType === "Batch"}
                      onChange={(value) =>
                        handleInstallmentChange(index, "amount", value)
                      }
                    />
                  </td>

                  {selectedType !== "Batch" && (
                    <td
                      style={{
                        border: "0.5px solid #D3D3D3",
                        padding: "8px",
                      }}
                    >
                      {index !== 0 && (
                        <ActionIcon
                          color="red"
                          onClick={() => handleRemoveInstallment(index)}
                        >
                          <IconTrash size={24} />
                        </ActionIcon>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>

          {selectedType !== "Batch" && (
            <Text
              onClick={handleAddInstallment}
              c="blue"
              mt="md"
              style={{
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              + Add Installment
            </Text>
          )}
        </Box>
      )}
    </Stack>
  );
};

export default StepThree;
