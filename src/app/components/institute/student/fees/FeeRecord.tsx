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
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { DateTimePicker } from "@mantine/dates";
import {
  IconArrowLeft,
  IconCalendar,
} from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import FeeRecordTable from "./FeeRecordTable";
import { StudentFeesCards } from "./StudentFeesCard";
import { Installment } from "@/interfaces/batchInterface";
import { UserType } from "@/app/components/dashboard/InstituteBatchesSection";
import { UpdateMultipleFeeRecord } from "@/axios/student/StudentPut";
import { GetStudentFeeInstallments } from "@/axios/student/StudentGetApi";

interface FormValues {
  paymentDate: Date;
}
export interface FeeRecordData {
  amount: number;
  paidDate: Date;
}
const FeeRecordSection = (props: {
  userType: UserType;
  batchName: string;
  dateOfJoining: Date;
  batch?: string;
  studentId: string;
  onPaymentClick: () => void;
  onClickBack: () => void;
  fromBatch:boolean
}) => {

  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [installments, setInstallments] = useState<Installment[]>([]);

  // const instituteDetails = useSelector<RootState, InstituteDetails | null>(
  //   (state) => state.instituteDetailsSlice.instituteDetails
  // );

  const totalFees = installments?.reduce(
    (sum: number, record: Installment) => sum + record.amount,
    0
  );
  const totalPaidFees = installments?.reduce(
    (sum: number, record: Installment) => sum + (record.amountPaid ?? 0),
    0
  );
  const totalOverdue = totalFees - totalPaidFees;

  const [openPaymentModel, setOpenPaymentModel] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>({
    paymentDate: new Date(),
  });

  const [feeRecordsMap, setFeeRecordsMap] = useState<
    Map<string, FeeRecordData>
  >(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (key: string, value: any) => {
    if (key === "paymentDate") {
      setFormValues((prev) => ({ ...prev, paymentDate: value }));
      setFeeRecordsMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.forEach((record, recordId) => {
          newMap.set(recordId, { ...record, paidDate: value });
        });
        return newMap;
      });
    } else {
      setFeeRecordsMap((prevMap) => {
        const newMap = new Map(prevMap);
        const existingRecord = newMap.get(key) || {
          amount: 0,
          paidDate: formValues.paymentDate,
        };
        newMap.set(key, { ...existingRecord, amount: value });
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
    UpdateMultipleFeeRecord(feeRecordsMap)
      .then((resp) => {
        // setisLoading(false);

        setOpenPaymentModel(false);
        setFeeRecordsMap(new Map());
        // props.onPaymentClick();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (props.studentId) {
      setIsLoading(true);
      GetStudentFeeInstallments(props.studentId)
        .then((x: any) => {
          const { feeRecords } = x.data;
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
        w={ "100%"}
        style={{ backgroundColor: "#ffffff",borderRadius:"1rem" }}
        h={"100%"}
        m={"auto"}
        py={isMd ? 0 : 20}
      >
        {
          props.fromBatch && 
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
        }
        <Grid p={10}>
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
        <Card shadow="sm">
          <Flex justify={"space-between"} align={"center"}>
            <Text size="sm" c="blue">
              Fee Records
            </Text>
            {(props.userType == UserType.OTHERS || props.userType == UserType.TEACHER) && (
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
                fz={13}
                style={{ fontFamily: "sans-serif" }}
              >
                Record Payment
              </Button>
            )}
          </Flex>
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
                fontFamily:"sans-serif"
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
                  <Flex key={record?._id} justify={"start"} align={"end"}>
                    <NumberInput
                      label={record.name}
                      value={feeRecordsMap.get(record._id)?.amount || 0}
                      onChange={(value) => {
                        handleChange(record._id, value || 0);
                      }}
                      max={record.amount - record.amountPaid}
                      min={0}
                    />
                    <Text fw={700} lh={1} ml={4} fz="sm" c="black" style={{ fontFamily:"sans-serif"}} >
                      ₹{record.amount - record.amountPaid + " "}
                      <span style={{ fontSize: "10px", color: "gray" }}>
                        (Pending)
                      </span>
                    </Text>
                  </Flex>
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
          <Divider my="sm" />
          <FeeRecordTable
            data={installments}
            dateOfJoining={props.dateOfJoining}
            studentId={props.studentId}
            userType={props.userType}
            batchName={props.batchName}
          />
        </Card>
      </Stack>
    </>
  );
};

export default FeeRecordSection;
