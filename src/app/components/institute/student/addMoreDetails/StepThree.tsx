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
   instituteId: string;
  feeType: string;
  isEditable: boolean;
  transportFees: number;
  setVanFareInstallments: React.Dispatch<
    React.SetStateAction<Installment[]>
  >;
  studentInstallments: Installment[];
  studentVanfare: Installment[];
  setInstallments: React.Dispatch<React.SetStateAction<Installment[]>>;
  setCustomOrBatch: React.Dispatch<React.SetStateAction<string>>;
  setSelectedBatchId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  console.log("transportFees : ", props.transportFees);

  const isMd = useMediaQuery("(max-width: 980px)");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getMonthName = (date: string) => {
    return new Date(date).toLocaleString("default", {
      month: "long",
    });
  };

  // currently selected type in UI
  const [selectedType, setSelectedType] = useState<string>("");

  // ORIGINAL fee type
  // IMPORTANT: never changes
  const [originalFeeType] = useState(props.feeType);

  const defaultInstallment: Installment = {
    _id: "",
    name: getMonthName(new Date().toISOString().split("T")[0]),
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
  const [transportInstallments, setTransportInstallments] = useState<Installment[]>([]);

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {

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
      else if (originalFeeType === "Custom") {

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

    // by default always Batch
    onClickCustomOrBatch("Batch");

  }, []);

  // =========================================
  // UPDATE PARENT INSTALLMENTS
  // =========================================

  useEffect(() => {
    props.setInstallments(installments);
  }, [installments]);

  useEffect(() => {
    if (!props.transportFees) return;

    const currentDate = new Date();

    const months = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + index,
        1
      );

      return {
        _id: "",
        instituteId: props.instituteId,
        type: "vanfare",
        name: date.toLocaleString("default", {
          month: "long",
        }),
        dueDate: date.toISOString().split("T")[0],
        amount: props.transportFees,
        isDeleted: false,
      };
    });

    setTransportInstallments(months);

    props.setVanFareInstallments(months);
  }, [props.transportFees]);

  useEffect(() => {

  if (
    props.isEditable &&
    props.studentVanfare &&
    props.studentVanfare.length > 0
  ) {

    setTransportInstallments(props.studentVanfare);

    props.setVanFareInstallments(props.studentVanfare);

  }

}, [props.studentVanfare]);

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

      const { feeInstallments, vanfareInstallments } = x.batchFee;

      const newInstallments = feeInstallments.map((f: any) => ({
        _id: "",
        name: f.name,
        dueDate: new Date(f.dueDate).toISOString().split("T")[0],
        amount: f.amount,
        isDeleted: false,
      }));

      // save batch installments
      setBatchInstallments(newInstallments);

      setInstallments(newInstallments);
      if (vanfareInstallments?.length > 0) {

  const transportData = vanfareInstallments.map((f: any) => ({
    _id: f._id,
    name: f.name,
    dueDate: new Date(f.dueDate).toISOString().split("T")[0],
    amount: f.amount,
    isDeleted: false,
  }));

  setTransportInstallments(transportData);

  props.setVanFareInstallments(transportData);
}
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
        name: getMonthName(new Date().toISOString().split("T")[0]),
        dueDate: new Date().toISOString().split("T")[0],
        amount: 0,
        isDeleted: false,
      },
    ];

    setInstallments(updatedInstallments);

    setCustomInstallments(updatedInstallments);
  };

  const handleAddTransportInstallment = () => {

    const updatedInstallments = [
      ...transportInstallments,
      {
        _id: "",
        instituteId: props.instituteId,
        name: getMonthName(new Date().toISOString().split("T")[0]),
        dueDate: new Date().toISOString().split("T")[0],
        amount: props.transportFees,
        isDeleted: false,
      },
    ];

    setTransportInstallments(updatedInstallments);

    props.setVanFareInstallments(updatedInstallments);
  };

  // =========================================
  // REMOVE INSTALLMENT
  // =========================================

  const handleRemoveInstallment = (index: number) => {
    const updatedInstallments = installments.filter((_, i) => i !== index);

    setInstallments(updatedInstallments);

    setCustomInstallments(updatedInstallments);
  };

  const handleRemoveTransportInstallment = (index: number) => {

    const updatedInstallments = transportInstallments.filter(
      (_, i) => i !== index
    );

    setTransportInstallments(updatedInstallments);

    props.setVanFareInstallments(updatedInstallments);
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
        <>
          <Flex
            gap={20}
            align="flex-start"
            wrap="nowrap"
            style={{
              width: "100%",
            }}
          >

            {/* LEFT TABLE */}

            <Box
              style={{
                flex: 1,
              }}
            >
              <Flex
                justify="space-between"
                align="center"
                mb="2rem"
              >
                <Text
                  fw={700}
                  ff={"Roboto"}
                >
                  Institute Fee Installments
                </Text>

                {selectedType !== "Batch" && (
                  <Text
                    onClick={handleAddInstallment}
                    c="blue"
                    fw={600}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    + Add
                  </Text>
                )}
              </Flex>

              <Table
                style={{
                  marginTop: "2rem",
                  width: "100%",
                }}
                ff={"Roboto"}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "0.5px solid #D3D3D3",
                        padding: "10px",
                        width: "8%",
                      }}
                    >
                      S No.
                    </th>

                    <th
                      style={{
                        border: "0.5px solid #D3D3D3",
                        padding: "10px",
                        width: "32%",
                      }}
                    >
                      Name
                    </th>

                    <th
                      style={{
                        border: "0.5px solid #D3D3D3",
                        padding: "10px",
                        width: "30%",
                      }}
                    >
                      Due Date
                    </th>

                    <th
                      style={{
                        border: "0.5px solid #D3D3D3",
                        padding: "10px",
                        width: "30%",
                      }}
                    >
                      Amount in ₹
                    </th>


                    {selectedType !== "Batch" && (
                      <th
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "10px",
                          width: "10%",
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
                          padding: "10px",
                          textAlign: "center",
                        }}
                      >
                        {index + 1}
                      </td>

                      <td
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "10px",
                        }}
                      >
                        <TextInput
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
                          padding: "10px",
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
                          padding: "10px",
                        }}
                      >
                        <NumberInput
                          value={installment.amount}
                          min={0}
                          max={1000000}
                          hideControls
                          readOnly={selectedType === "Batch"}
                          onChange={(value) =>
                            handleInstallmentChange(
                              index,
                              "amount",
                              Number(value),
                            )
                          }
                        />
                      </td>

                      {selectedType !== "Batch" && (
                        <td
                          style={{
                            border: "0.5px solid #D3D3D3",
                            padding: "10px",
                            textAlign: "center",
                          }}
                        >
                          {index !== 0 && (
                            <ActionIcon
                              color="red"
                              onClick={() => handleRemoveInstallment(index)}
                            >
                              <IconTrash size={20} />
                            </ActionIcon>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>

            <Box
              style={{
                width: "1px",
                background: "linear-gradient(180deg, #8E2DE2 0%, #4A00E0 100%)",
                alignSelf: "stretch",
                marginLeft: "10px",
                marginRight: "10px",
                boxShadow: "0px 0px 8px rgba(142, 45, 226, 0.4)",
                borderRadius: "10px",
              }}
            />

            {/* RIGHT TABLE */}

            <Box
              style={{
                flex: 1,
              }}
            >
              <Flex
                justify="space-between"
                align="center"
                mb="2rem"
              >
                <Text
                  fw={700}
                  ff={"Roboto"}
                >
                  Transport Fee Installments
                </Text>

                <Text
                  onClick={handleAddTransportInstallment}
                  c="blue"
                  fw={600}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  + Add
                </Text>
              </Flex>
              <Table
                style={{
                  width: "100%",
                }}
                ff={"Roboto"}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "0.5px solid #D3D3D3",
                        padding: "10px",
                        width: "8%",
                      }}
                    >
                      S No.
                    </th>

                    <th
                      style={{
                        border: "0.5px solid #D3D3D3",
                        padding: "10px",
                        width: "32%",
                      }}
                    >
                      Name
                    </th>

                    <th
                      style={{
                        border: "0.5px solid #D3D3D3",
                        padding: "10px",
                        width: "30%",
                      }}
                    >
                      Due Date
                    </th>

                    <th
                      style={{
                        border: "0.5px solid #D3D3D3",
                        padding: "10px",
                        width: "30%",
                      }}
                    >
                      Amount in ₹
                    </th>
                 
                      <th
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "10px",
                          width: "10%",
                        }}
                      >
                        Action
                      </th>
                      
                  </tr>
                </thead>

              <tbody>

  {transportInstallments.length === 0 ? (

    <tr>
      <td
        colSpan={5}
        style={{
          textAlign: "center",
          padding: "30px",
          color: "#666",
          fontWeight: 500,
        }}
      >
        No Transport Selected
      </td>
    </tr>

  ) : (

    transportInstallments.map((installment, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "10px",
                          textAlign: "center",
                        }}
                      >
                        {index + 1}
                      </td>

                      <td
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "10px",
                        }}
                      >
                        <TextInput
                          value={installment.name}
                          onChange={(event) => {

                            const updated = [...transportInstallments];

                            updated[index] = {
                              ...updated[index],
                              name: event.currentTarget.value,
                            };

                            setTransportInstallments(updated);

                            props.setVanFareInstallments(updated);
                          }}
                        />
                      </td>

                      <td
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "10px",
                        }}
                      >
                        <TextInput
                          type="date"
                          value={installment.dueDate}
                          onChange={(event) => {

                            const updated = [...transportInstallments];

                            updated[index] = {
                              ...updated[index],
                              dueDate: event.currentTarget.value,
                            };

                            setTransportInstallments(updated);

                            props.setVanFareInstallments(updated);
                          }}
                        />
                      </td>

                      <td
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "10px",
                        }}
                      >
                        <NumberInput
                          value={installment.amount}
                          min={0}
                          max={1000000}
                          hideControls
                          onChange={(value) => {

                            const updated = [...transportInstallments];

                            updated[index] = {
                              ...updated[index],
                              amount: Number(value),
                            };

                            setTransportInstallments(updated);

                            props.setVanFareInstallments(updated);
                          }}
                        />
                      </td>

                      <td
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "10px",
                          textAlign: "center",
                        }}
                      >
                        {index !== 0 && (
                          <ActionIcon
                            color="red"
                            onClick={() => handleRemoveTransportInstallment(index)}
                          >
                            <IconTrash size={20} />
                          </ActionIcon>
                        )}
                      </td>

                    </tr>
                 ))
  )}

</tbody>
              </Table>
            </Box>

          </Flex>


        </>
      )}
    </Stack>
  );
};

export default StepThree;
