"use client";

import {
  Button,
  Avatar,
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

import React, { useCallback, useEffect, useState, useRef, } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { DateTimePicker } from "@mantine/dates";
import { IconArrowLeft, IconCalendar, IconTrash } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import FeeRecordTable from "./FeeRecordTable";
import { StudentFeesCards } from "./StudentFeesCard";
import { Installment } from "@/interfaces/batchInterface";
import { UserType } from "@/app/components/dashboard/InstituteBatchesSection";
import {
  DeletePendingFeeRecords,
  UpdateMultipleFeeRecord,
} from "@/axios/student/StudentPut";
import {
  GetStudentFeeInstallments,
  GetStudentForPdf,
} from "@/axios/student/StudentGetApi";
import { useAppSelector } from "@/app/redux/redux.hooks";
import { createFullFeeOverviewPdf } from "./HtmlToPdf";
import {
  ErrorNotification,
  getBase64Image,
  SuccessNotification,
} from "@/app/helperFunction/Notification";

const convertHtmlIntoPdf = (html: string) => {};

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
  studentName?: string;
  studentProfilePic?: string;
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
  const nextDueInstallment = installments.find(
    (installment) => installment.amount - (installment.amountPaid ?? 0) > 0,
  );

  const [openVanFareModal, setOpenVanFareModal] = useState(false);

  const [openPaymentModel, setOpenPaymentModel] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);



  const refreshInstallments = useCallback(async () => {
    const response: any = await GetStudentFeeInstallments(props.studentId);
    const { feeRecords, vanFares } = response.data;

    setVanFares(vanFares || []);
    setInstallments(
      feeRecords.map((fee: any) => ({
        _id: fee._id,
        name: fee.name,
        dueDate: fee.dueDate,
        amount: fee.totalAmount,
        amountPaid: fee.amountPaid,
        updatedAt: fee.updatedAt,
        status: fee.status,
        paidHistory: fee.paidHistory || [],
      })),
    );
  }, [props.studentId]);

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

  const handleDeletePendingRecords = async () => {
    setIsLoading(true);
    try {
      const feeRecordIds = installments.map((item: any) => item._id);
      await DeletePendingFeeRecords(props.studentId, feeRecordIds);
      setOpenDeleteModal(false);
      SuccessNotification("Pending records deleted successfully.");
      refreshInstallments().catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
      ErrorNotification("Unable to delete records.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (!formValues.paymentDate) {
      showNotification({
        message: "Select date please!!",
      });
      return;
    }
    setIsLoading(true);
    try {
      await UpdateMultipleFeeRecord(
        instituteDetails._id,
        feeRecordsMap,
        props.studentId,
      );
      setOpenPaymentModel(false);
      setFeeRecordsMap(new Map());
      await refreshInstallments();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVanFareSubmit = async () => {
    if (!formValues.paymentDate) {
      showNotification({
        message: "Select date please!!",
      });
      return;
    }

    setIsLoading(true);

    try {
      await UpdateMultipleFeeRecord(
        instituteDetails._id,
        vanFareRecordsMap,
        props.studentId,
        "vanfare",
      );
      setOpenVanFareModal(false);
      setVanFareRecordsMap(new Map());
      await refreshInstallments();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!props.studentId) return;

    setIsLoading(true);
    refreshInstallments()
      .catch((e) => console.log(e))
      .finally(() => setIsLoading(false));
  }, [props.studentId, refreshInstallments]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Stack
        w="100%"
        style={{ backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e5eaf2", minWidth: 0 }}
        m="auto"
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
        <Card
          radius={10}
          p={{ base: "sm", sm: "md" }}
          mx={10}
          mt="sm"
          shadow="0 2px 8px rgba(20, 42, 76, 0.06)"
          style={{
            background: "linear-gradient(105deg, #e8efff 0%, #f7f9ff 100%)",
            border: "1px solid #e1e8f4",
          }}
        >
          <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
            <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
              <Avatar src={props.studentProfilePic || "/boyStudent.png"} size={44} radius="xl" />
              <Stack gap={2} style={{ minWidth: 0 }}>
                <Text fz={10} fw={700} c="#0755d9">Student fee account</Text>
                <Text fz={14} fw={700} c="#172033" style={{ overflowWrap: "anywhere" }}>{props.studentName}</Text>
                <Text fz={11} c="#667085" style={{ overflowWrap: "anywhere" }}>{props.batchName}</Text>
              </Stack>
            </Group>
            {nextDueInstallment && (
              <Box
                p="xs"
                style={{ background: "#ffffff", border: "1px solid #e7ebf2", borderRadius: 8, minWidth: 128 }}
              >
                <Text fz={9} fw={700} c="#667085">Next due date</Text>
                <Text fz={12} fw={700} c="#172033">
                  {new Date(nextDueInstallment.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </Text>
                <Text fz={10} fw={700} c="#d92d20">
                  ₹{nextDueInstallment.amount - (nextDueInstallment.amountPaid ?? 0)} pending
                </Text>
              </Box>
            )}
          </Flex>
        </Card>
        <Grid p={10}>
          <Grid.Col span={12}>
            <SimpleGrid
              cols={{ base: 1, xs: 2, sm: 3 }}
              spacing={isMd ? 12 : 16}
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
          <Flex justify="space-between" align="center" wrap="wrap" gap="sm">
            <Text size="lg" fw={700} c="#1d2939">
              Fee Records
            </Text>

            <Flex gap={8} wrap="wrap" justify="flex-end" style={{ minWidth: 0 }}>
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

                    const vanfarePayload = student.vanfare || [];

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
                      vanfarePayload,
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
                size="sm"
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
                  size="sm"
                >
                  Record Payment
                </Button>
              )}
              <Button
                color="orange"
                onClick={() => {
                  setOpenVanFareModal(true);
                }}
                size="sm"
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
        size="md"
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
            {/* <Button radius={10} onClick={handleSubmit} type="submit">
              Payment
            </Button> */}
          <Button
  radius={10}
  onClick={handleSubmit}
  type="button"
  loading={isSubmitting}
  disabled={isSubmitting}
>
  {isSubmitting ? "Processing..." : "Payment"}
</Button>

            <Button
              color="red"
              radius={10}
              onClick={() => {
                setOpenPaymentModel(false);

                setTimeout(() => {
                  setOpenDeleteModal(true);
                }, 100);
              }}
            >
              <IconTrash color="#fff" size={20} style={{marginRight:5}} /> Pending Fees
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

            <Button onClick={handleVanFareSubmit}>Update Van Fare</Button>
          </Group>
        </Container>
      </Modal>
      <Modal
        opened={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        centered
        title="Delete Pending Records"
        size="sm"
      >
        <Text mb="lg">Are you sure to delete this records?</Text>

        <Group justify="right">
          <Button
            variant="outline"
            onClick={() => {
              setOpenDeleteModal(false);
              setOpenPaymentModel(true);
            }}
          >
            No
          </Button>

          <Button color="red" onClick={handleDeletePendingRecords}>
            Yes
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default FeeRecordSection;
