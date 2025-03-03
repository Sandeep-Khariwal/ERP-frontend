"use client";
import {
  GetBatchFee,
} from "@/app/api/institute/InstituteGetApi";
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
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [installments, setInstallments] = useState<Installment[]>([
    {
      _id: "",
      name: "Installment 1",
      dueDate: new Date().toISOString().split("T")[0],
      amount: 0,
      isDeleted: false,
    },
  ]);

  useEffect(() => {
    props.setInstallments(installments);
  }, [installments]);

  useEffect(() => {
    if (props.feeType) {
      onClickCustomOrBatch(props.feeType);
    }
  }, [props.feeType]);

  const [customOrBatch, setCustomOrBatch] = useState<Map<string, string>>(
    new Map()
  );
  const [assignBatchInstallment, setAssignBatchInstallment] = useState<
    Map<string, Installment[]>
  >(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMd = useMediaQuery("(max-width: 980px)");

  useEffect(() => {
    if (selectedBatchId != "0") {
      if (props.feeType !== "Batch" && props.isEditable) {
        setInstallments(props.studentInstallments);
      } else {
        GetBatchFee(selectedBatchId)
          .then((x: any) => {
            const { feeInstallments, feeType } = x.batchFee;
            const newMap = new Map(assignBatchInstallment);
            newMap.set(selectedBatchId, feeInstallments);
            setAssignBatchInstallment(newMap);
            const newInstallments = feeInstallments.map((f: any) => {
              return {
                name: f.name,
                dueDate: new Date(f.dueDate).toISOString().split("T")[0],
                amount: f.amount,
              };
            });
            setInstallments(newInstallments);

            setIsLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
          });
      }
    } else {
      if (props.isEditable && props.studentInstallments.length > 0) {
        setInstallments(props.studentInstallments);
        return;
      }
      setInstallments([
        {
          _id: "",
          name: "Installment 1",
          dueDate: new Date().toISOString().split("T")[0],
          amount: 0,
          isDeleted: false,
        },
      ]);
    }
  }, [selectedBatchId]);

  const handleInstallmentChange = (index: any, field: any, value: any) => {
    const updatedInstallments = [...installments];
    updatedInstallments[index] = {
      ...updatedInstallments[index],
      [field]: value,
    };

    setInstallments(updatedInstallments);

    setAssignBatchInstallment((prevState) => {
      const updatedMap = new Map(prevState);
      updatedMap.set(selectedBatchId, updatedInstallments);
      return updatedMap;
    });
  };
  const handleAddInstallment = () => {
    let index = installments.length + 1;
    setInstallments([
      ...installments,
      {
        name: "Installment " + index,
        dueDate: new Date().toISOString().split("T")[0],
        amount: 0,
      },
    ]);
  };
  const handleRemoveInstallment = (index: number) => {
    const newInstallments = installments.filter((_, i) => i !== index);
    setInstallments(newInstallments);
    props.setInstallments(newInstallments);
    setAssignBatchInstallment((prevState) => {
      const updatedMap = new Map(prevState);
      updatedMap.set(selectedBatchId, newInstallments);
      return updatedMap;
    });
  };
  const onClickCustomOrBatch = (type: string) => {
    setCustomOrBatch((prevMap) => {
      const updatedMap = new Map(prevMap);

      if (type === "Custom") {
        updatedMap.set("0", type);
        setSelectedBatchId("0");
        props.setCustomOrBatch("Custom");
      } else {
        updatedMap.set(props.batchId || "", type);
        setSelectedBatchId(props.batchId || "");
        props.setSelectedBatchId(props.batchId || "");
        props.setCustomOrBatch("Batch");
      }

      return updatedMap;
    });
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
        data={["Custom", "Batch"].map((i) => i)}
        rightSection={<IconCaretDownFilled style={{ cursor: "pointer" }} />}
        value={customOrBatch.get(selectedBatchId)}
        onChange={(i) => onClickCustomOrBatch(i!!)}
      />

      {customOrBatch.get(selectedBatchId) && (
        <Box style={{ width: "100%", overflowX: "auto" }}>
          <Table style={{ marginTop: "2rem" }} ff={"Roboto"}>
            <thead>
              <tr style={{ border: "0.5px solid #D3D3D3", padding: "8px" }}>
                <th
                  style={{
                    border: "0.5px solid #D3D3D3",
                    padding: "8px",
                    whiteSpace: "nowrap",
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
                {customOrBatch.get(selectedBatchId) !== "Batch" && (
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
            <tbody
              style={{
                border: "0.5px solid #D3D3D3",
                padding: "0.5px",
                fontFamily: "Roboto",
              }}
            >
              {installments?.map((installment, index) => (
                <tr
                  style={{
                    border: "0.5px solid #D3D3D3",
                    padding: "8px",
                    fontFamily: "Roboto",
                  }}
                  key={index}
                >
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
                      fontFamily: "Roboto",
                    }}
                  >
                    <TextInput
                      w={isMd ? "10rem" : "auto"}
                      ff={"Roboto"}
                      value={installment.name}
                      onChange={(event) =>
                        handleInstallmentChange(
                          index,
                          "name",
                          event.currentTarget.value
                        )
                      }
                      readOnly={customOrBatch.get(selectedBatchId) === "Batch"}
                    />
                  </td>
                  <td
                    style={{
                      border: "0.5px solid #D3D3D3",
                      padding: "8px",
                    }}
                  >
                    <TextInput
                      ff={"Roboto"}
                      type="date"
                      value={installment.dueDate}
                      onChange={(event) =>
                        handleInstallmentChange(
                          index,
                          "dueDate",
                          event.currentTarget.value
                        )
                      }
                      readOnly={customOrBatch.get(selectedBatchId) === "Batch"}
                    />
                  </td>
                  <td
                    style={{
                      border: "0.5px solid #D3D3D3",
                      padding: "8px",
                    }}
                  >
                    <NumberInput
                      ff={"Roboto"}
                      w={isMd ? "6rem" : "auto"}
                      value={installment.amount}
                      onChange={(value) =>
                        handleInstallmentChange(index, "amount", value)
                      }
                      min={0}
                      max={1000000}
                      hideControls
                      readOnly={customOrBatch.get(selectedBatchId) === "Batch"}
                    />
                  </td>
                  {customOrBatch.get(selectedBatchId) !== "Batch" && (
                    <td
                      style={{
                        border: "0.5px solid #D3D3D3",
                        padding: "8px",
                      }}
                    >
                      {!(index === 0) && (
                        <ActionIcon
                          color="red"
                          onClick={() => {
                            handleInstallmentChange(index, "isDeleted", true);
                            handleRemoveInstallment(index);
                          }}
                        >
                          <IconTrash size={"30"} />
                        </ActionIcon>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {customOrBatch.get(selectedBatchId) !== "Batch" && (
                <Text
                  onClick={handleAddInstallment}
                  c="blue"
                  mt="md"
                  style={{ whiteSpace: "nowrap", cursor: "pointer" }}
                >
                  + Add Installment
                </Text>
              )}
            </tbody>
          </Table>
        </Box>
      )}
    </Stack>
  );
};

export default StepThree;
