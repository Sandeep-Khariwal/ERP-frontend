"use client";

import {
  Button,
  Card,
  Divider,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  Modal,
  NumberInput,
  Container,
  LoadingOverlay,
  Box,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { DateTimePicker } from "@mantine/dates";
import { IconArrowLeft, IconCalendar } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import FeeRecordTable from "./FeeRecordTable";
import { StudentFeesCards } from "./StudentFeesCard";
import { Installment } from "@/interfaces/batchInterface";
import { UserType } from "@/app/components/dashboard/InstituteBatchesSection";
import { UpdateMultipleFeeRecord } from "@/axios/student/StudentPut";
import {
  GetStudentFeeInstallments,
  GetStudentForPdf,
} from "@/axios/student/StudentGetApi";
import { useAppSelector } from "@/app/redux/redux.hooks";
import { createFullFeeOverviewPdf } from "./HtmlToPdf";
import { getBase64Image } from "@/app/helperFunction/Notification";

const convertHtmlIntoPdf = (html: string) => { };

interface FormValues {
  paymentDate: Date;
}
export interface FeeRecordData {
  amount: number;
  paidDate: Date;
  description?: string;
}
const FeeRecordSection = (props: {
  userType: UserType;
  batchName: string;
  dateOfJoining: Date;
  batch?: string;
  studentId: string;
  onPaymentClick: () => void;
  onClickBack: () => void;
  fromBatch: boolean;
}) => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [installments, setInstallments] = useState<Installment[]>([]);

  const [vanFares, setVanFares] = useState<any[]>([]);

  const instituteDetails = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails,
  );

  // const instituteDetails = useSelector<RootState, InstituteDetails | null>(
  //   (state) => state.instituteDetailsSlice.instituteDetails
  // );

  const totalFees = installments?.reduce(
    (sum: number, record: Installment) => sum + record.amount,
    0,
  );
  const totalPaidFees = installments?.reduce(
    (sum: number, record: Installment) => sum + (record.amountPaid ?? 0),
    0,
  );
  const totalOverdue = totalFees - totalPaidFees;

  const [openVanFareModal, setOpenVanFareModal] = useState(false);

  const [openPaymentModel, setOpenPaymentModel] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>({
    paymentDate: new Date(),
  });

  const [feeRecordsMap, setFeeRecordsMap] = useState<
    Map<string, FeeRecordData>
  >(new Map());
  const [vanFareRecordsMap, setVanFareRecordsMap] = useState<
    Map<string, FeeRecordData>
  >(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (key: string, value: any, field = "amount") => {
    if (key === "paymentDate") {
      setFormValues((prev) => ({ ...prev, paymentDate: value }));

      setFeeRecordsMap((prevMap) => {
        const newMap = new Map(prevMap);

        newMap.forEach((record, recordId) => {
          newMap.set(recordId, {
            ...record,
            paidDate: value,
          });
        });

        return newMap;
      });
    } else {
      setFeeRecordsMap((prevMap) => {
        const newMap = new Map(prevMap);

        const existingRecord = newMap.get(key) || {
          amount: 0,
          paidDate: formValues.paymentDate,
          description: "",
        };

        newMap.set(key, {
          ...existingRecord,
          [field]: value,
        });

        return newMap;
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    if (!formValues.paymentDate) {
      showNotification({
        message: "Select date please!!",
      });
      return;
    }
    setIsLoading(true);
    console.log("feeRecordsMap", feeRecordsMap);
    console.log("converted", Array.from(feeRecordsMap.entries()));
    UpdateMultipleFeeRecord(
      instituteDetails._id,
      feeRecordsMap,
      props.studentId,
    )
      .then((resp) => {
        setIsLoading(false);

        setOpenPaymentModel(false);
        setFeeRecordsMap(new Map());
        // props.onPaymentClick();
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const handleVanFareSubmit = () => {
    if (!formValues.paymentDate) {
      showNotification({
        message: "Select date please!!",
      });
      return;
    }

    setIsLoading(true);

    UpdateMultipleFeeRecord(
      instituteDetails._id,
      vanFareRecordsMap,
      props.studentId,
      "vanfare"
    )
      .then(() => {
        setIsLoading(false);
        setOpenVanFareModal(false);
        setVanFareRecordsMap(new Map());

        GetStudentFeeInstallments(props.studentId)
          .then((x: any) => {
            const { feeRecords, vanFares } = x.data;

            setVanFares(vanFares || []);

            const installments = feeRecords.map((f: any) => ({
              _id: f._id,
              name: f.name,
              dueDate: f.dueDate,
              amount: f.totalAmount,
              amountPaid: f.amountPaid,
              updatedAt: f.updatedAt,
              status: f.status,
            }));

            setInstallments(installments);
          });
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (props.studentId) {
      setIsLoading(true);
      GetStudentFeeInstallments(props.studentId)
        .then((x: any) => {
          const { feeRecords, vanFares } = x.data;

          setVanFares(vanFares || []);
          const installments = feeRecords.map((f: any) => {
            return {
              _id: f._id,
              name: f.name,
              dueDate: f.dueDate,
              amount: f.totalAmount,
              amountPaid: f.amountPaid,
              updatedAt: f.updatedAt,
              status: f.status,
            };
          });
          setInstallments(installments);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    }
  }, [props.studentId, openPaymentModel]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Stack
        w={"95%"}
        style={{ backgroundColor: "#ffffff", borderRadius: "1rem" }}
        mih={"100vh"}
        m={"auto"}
        py={isMd ? 0 : 20}
      >
        {props.fromBatch && (
          <Flex w={"100%"} p={10} align={"center"} justify={"start"} gap={3}>
            <IconArrowLeft
              size={32}
              style={{ cursor: "pointer" }}
              onClick={() => props.onClickBack()}
            />
            <Text fw={500} style={{ fontFamily: "sans-serif" }}>
              Back
            </Text>
          </Flex>
        )}
        <Grid p={10} style={{ position: "sticky", top: 50 }}>
          <Grid.Col span={isMd ? 12 : 10}>
            <SimpleGrid
              cols={isMd ? 2 : 4}
              spacing={isMd ? 15 : 40}
              verticalSpacing={20}
            >
              <StudentFeesCards
                totalFees={totalFees}
                totalPaid={totalPaidFees}
                totalOverdue={totalOverdue}
              />
            </SimpleGrid>
          </Grid.Col>
        </Grid>
        <Box p={10}>
          <Flex
            justify={"space-between"}
            align={"center"}
            style={{ position: "sticky", top: 100 }}
          >
            <Text size="sm" c="blue">
              Fee Records
            </Text>

            <Flex gap={10}>
              {/* 🔥 NEW BUTTON */}
              <Button
                color="green"
                onClick={() => {
                  GetStudentForPdf(props.studentId).then(async (x: any) => {
                    console.log("FULL RESPONSE", x);
                    console.log("FEE RECORDS", x.student.feeRecords);
                    const { student } = x;



                    let gst = instituteDetails.gst;
                    if (
                      instituteDetails?.gst?.sgst > 0 ||
                      instituteDetails?.gst?.cgst
                    ) {
                      gst = instituteDetails.gst;
                    } else {
                      gst = {
                        sgst: 0,
                        cgst: 0,
                      };
                    }

                    const formattedData = student.feeRecords.map((f: any) => ({
                      name: f.name,
                      amountPaid: f.amountPaid,
                      totalAmount: f.totalAmount,
                      updatedAt: f.updatedAt,
                      description: f.description,
                    }));

                    console.log(student.feeRecords);

                    const base64Logo = await getBase64Image(
                      student.instituteId.logo,
                    );

                    const base64Signature = await getBase64Image(
                      student.instituteId.signature,
                    );

                    const html = createFullFeeOverviewPdf(
                      student.name,
                      student.parentName,
                      formattedData,
                      student.instituteId.name,

                      base64Logo,

                      student.instituteId.address,
                      student.instituteId.institutePhoneNumber,
                      props.batchName,
                      gst,

                      base64Signature,
                    );

                    console.log("btn clicked......");

                    const printWindow = window.open("", "_blank");

                    if (printWindow) {
                      printWindow.document.open();
                      printWindow.document.write(html);

                      printWindow.document.close();

                      setTimeout(() => {
                        printWindow.focus();

                        printWindow.print();

                        printWindow.onafterprint = () => {
                          printWindow.close();
                        };
                      }, 500);
                    }
                    // convertHtmlIntoPdf(html);
                  });
                }}
              >
                Download Report
              </Button>

              {(props.userType == UserType.OTHERS ||
                props.userType == UserType.TEACHER) && (
                  <Button
                    onClick={() => {
                      if (totalOverdue <= 0) {
                        showNotification({
                          message: "No Pending Payment ",
                        });
                        return;
                      }
                      setOpenPaymentModel(true);
                    }}
                  >
                    Record Payment
                  </Button>
                )}
              <Button
                color="orange"
                onClick={() => {
                  setOpenVanFareModal(true);
                }}
              >
                Van Fare Update
              </Button>
            </Flex>
          </Flex>

          <Divider my="sm" />
          <Flex w={"100%"} justify="space-between" align="center">
            <Text
              size="md"
              fw={700}
              c="#0A0A0AA"
              style={{ fontSize: "14px", fontFamily: "sans-serif" }}
            >
              Batche
            </Text>
            <Flex w={"50%"} justify="space-between" align="center">
              <Text
                size="md"
                fw={700}
                c="#0A0A0AA"
                style={{ fontSize: "14px", fontFamily: "sans-serif" }}
              >
                Fees
              </Text>
              <Text
                size="md"
                fw={700}
                c="#0A0A0AA"
                style={{ fontSize: "14px", fontFamily: "sans-serif" }}
              >
                Pending
              </Text>
              <Text></Text>
            </Flex>
          </Flex>
        </Box>
        <Divider my="sm" />
        <FeeRecordTable
          data={installments}
          dateOfJoining={props.dateOfJoining}
          studentId={props.studentId}
          userType={props.userType}
          batchName={props.batchName}
        />
      </Stack>

      <Modal
        opened={openPaymentModel}
        onClose={() => setOpenPaymentModel(false)}
        title="Record Payment"
        centered
        size="sm"
        zIndex={999}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
            fontFamily: "sans-serif",
          },
        }}
      >
        <Container style={{ width: "100%" }}>
          <DateTimePicker
            label="Payment Date"
            required
            placeholder="Select date"
            leftSection={<IconCalendar size={16} />}
            value={formValues.paymentDate}
            onChange={(date) => handleChange("paymentDate", date)}
          />

          <Divider my="md" />

          {installments.map((record: any) => {
            return (
              <Stack
                key={record?._id}
                gap={8}
                mb={18}
                p={8}
                style={{
                  border: "1px solid #e9ecef",
                  borderRadius: "10px",
                }}
              >
                <Flex justify={"start"} align={"end"} gap={10}>
                  <NumberInput
                    label={record.name}
                    value={feeRecordsMap.get(record._id)?.amount || 0}
                    onChange={(value) => {
                      handleChange(record._id, value || 0, "amount");
                    }}
                    max={record.amount - record.amountPaid}
                    min={0}
                    style={{ flex: 1 }}
                  />

                  <Text
                    fw={700}
                    mb={10}
                    fz="sm"
                    c="black"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    ₹{record.amount - record.amountPaid}
                    <span style={{ fontSize: "10px", color: "gray" }}>
                      {" "}
                      (Pending)
                    </span>
                  </Text>
                </Flex>

                <TextInput
                  label="Description"
                  placeholder="Enter payment description"
                  value={feeRecordsMap.get(record._id)?.description || ""}
                  onChange={(e) =>
                    handleChange(
                      record._id,
                      e.currentTarget.value,
                      "description",
                    )
                  }
                />
              </Stack>
            );
          })}

          <Group p="right" mt="md">
            <Button
              onClick={() => setOpenPaymentModel(false)}
              radius={10}
              variant="outline"
            >
              Cancel
            </Button>
            <Button radius={10} onClick={handleSubmit} type="submit">
              Payment
            </Button>
          </Group>
        </Container>
      </Modal>
      <Modal
        opened={openVanFareModal}
        onClose={() => setOpenVanFareModal(false)}
        title="Van Fare Update"
        centered
        size="sm"
      >
        <Container>
          <DateTimePicker
            label="Payment Date"
            placeholder="Select date"
            value={formValues.paymentDate}
            onChange={(date) => {
              setFormValues((prev) => ({
                ...prev,
                paymentDate: date as Date,
              }));
            }}
          />

          <Divider my="md" />

          {vanFares.map((record: any) => (
            <Stack
              key={record._id}
              gap={8}
              mb={18}
              p={8}
              style={{
                border: "1px solid #e9ecef",
                borderRadius: "10px",
              }}
            >
              <Flex justify="start" align="end" gap={10}>
                <NumberInput
                  label={record.name}
                  value={vanFareRecordsMap.get(record._id)?.amount || 0}
                  onChange={(value) => {
                    setVanFareRecordsMap((prev) => {
                      const newMap = new Map(prev);

                      const existingRecord = newMap.get(record._id) || {
                        amount: 0,
                        paidDate: formValues.paymentDate,
                        description: "",
                      };

                      newMap.set(record._id, {
                        ...existingRecord,
                        amount: Number(value) || 0,
                      });

                      return newMap;
                    });
                  }}
                  max={record.totalAmount - record.amountPaid}
                  min={0}
                  style={{ flex: 1 }}
                />

                <Text fw={700} mb={10} fz="sm">
                  ₹{record.totalAmount - record.amountPaid}
                  <span
                    style={{
                      fontSize: "10px",
                      color: "gray",
                    }}
                  >
                    {" "}
                    (Pending)
                  </span>
                </Text>
              </Flex>

              <TextInput
                label="Description"
                placeholder="Enter payment description"
                value={vanFareRecordsMap.get(record._id)?.description || ""}
                onChange={(e) => {
                  setVanFareRecordsMap((prev) => {
                    const newMap = new Map(prev);

                    const existingRecord = newMap.get(record._id) || {
                      amount: 0,
                      paidDate: formValues.paymentDate,
                      description: "",
                    };

                    newMap.set(record._id, {
                      ...existingRecord,
                      description: e.currentTarget.value,
                    });

                    return newMap;
                  });
                }}
              />
            </Stack>
          ))}
          <Group justify="right" mt="md">
            <Button
              variant="outline"
              onClick={() => setOpenVanFareModal(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleVanFareSubmit}>
              Update Van Fare
            </Button>
          </Group>
        </Container>
      </Modal>
    </>
  );
};

export default FeeRecordSection;
