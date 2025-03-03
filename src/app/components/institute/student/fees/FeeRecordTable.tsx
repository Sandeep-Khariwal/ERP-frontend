"use client";

import {
  Divider,
  Stack,
  Table,
  Text,
  Flex,
  Box,
  Modal,
  LoadingOverlay,
  ScrollArea,
} from "@mantine/core";
import React, { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconArrowLeftFromArc,
  IconArrowUpFromArc,
  IconDownload,
} from "@tabler/icons-react";
import { Installment } from "@/interfaces/batchInterface";
import { createReceiptPdf } from "./HtmlToPdf";
import { GetStudentForPdf } from "@/app/api/student/StudentGetApi";

export interface FeeRecord {
  _id: string;
  batch: {
    _id: string;
    name: string;
  };
  student: string;
  name: string;
  dueDate: Date;
  totalAmount: number;
  type: string;
  status: string;
  amountPaid: number;
  createdAt: Date;
  updatedAt: Date;
  payments: {
    receiptNumber: number;
    amount: number;
    paymentDate: Date;
  }[];
}

const FeeRecordTable = (props: {
  dateOfJoining: Date;
  data: Installment[];
  studentId: string;
  userType: string;
  batchName: string;
}) => {
  const batchTotalFees = props.data.reduce(
    (sum: number, record: Installment) => sum + record.amount,
    0
  );
  const batchTotalPaidFees = props.data.reduce(
    (sum: number, record: Installment) => sum + (record.amountPaid ?? 0),
    0
  );
  const batchTotalPandingFees = batchTotalFees - batchTotalPaidFees;

  const [collapse, setCollapse] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const [selectedFeeRecord, setSelectedFeeRecord] = useState<FeeRecord | null>(
    null
  );


  const convertHtmlIntoPdf = (id:string) => {
    setisLoading(true);
    GetStudentForPdf(props.studentId)
      .then((x: any) => {
        setisLoading(false);
        const { student } = x;
        const { feeRecords, instituteId } = student;
        
        const studentName = student.name;
        const date = new Date();
        const parentName = student.parentName;

        const InstituteName = instituteId.name;
        const address = instituteId.address;
        const phoneNumber = instituteId.institutePhoneNumber;
        const receiptNo = "R-" + instituteId.receiptCount;
        let paymentRecords;
        let totalPrice;
        if (id) {
          paymentRecords = feeRecords.filter(
            (f: any) => f._id === id
          );
          totalPrice = paymentRecords[0].amountPaid;
        } else {
          paymentRecords = feeRecords;
          totalPrice = feeRecords.reduce((sum: number, acc: any) => {
            sum += acc.amountPaid;
            return sum;
          }, 0);
        }

        const receiptHtml = createReceiptPdf(
          studentName,
          date,
          parentName,
          totalPrice,
          paymentRecords,
          InstituteName,
          address,
          phoneNumber,
          receiptNo
        );

        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(receiptHtml);
          printWindow.document.close();
          printWindow.print();
        } else {
          console.error("Failed to open print window.");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const renderRows = props.data.map((row, index) => (
    <Table.Tr
      style={{
        width: "100%",
        border: "2px solid #F8F8F8",
        backgroundColor: "#F8F8F8",
        borderRadius: "1rem",
        overflowX: "auto",
        marginBottom: "10px",
      }}
      key={index}
    >
      <Table.Td
        style={{
          padding: isMd ? "10px" : "5px",
          textAlign: isMd ? "center" : "start",
          fontSize: "12px",
          fontFamily: "sans-serif",
        }}
      >
        {index + 1}
      </Table.Td>
      <Table.Td
        style={{
          padding: isMd ? "10px" : "5px",
          textAlign: isMd ? "center" : "start",
          fontSize: "12px",
          fontFamily: "sans-serif",
        }}
      >
        {`${new Date(row.dueDate).toLocaleDateString()}`}
      </Table.Td>
      <Table.Td
        style={{
          padding: isMd ? "10px" : "5px",
          textAlign: isMd ? "center" : "start",
          fontSize: "12px",
          fontFamily: "sans-serif",
        }}
      >
        <Table.Td
          variant="light"
          style={{
            textAlign: "center",
            borderRadius: "1rem",
            fontSize: "12px",
            fontFamily: "sans-serif",
            whiteSpace: "nowrap",
          }}
          c={"white"}
          bg={
            row.status == "Not paid"
              ? "red"
              : row.status == "Partial paid"
              ? "#93A3FA"
              : "green"
          }
        >
          {row.status}
        </Table.Td>
      </Table.Td>
      <Table.Td
        style={{
          padding: isMd ? "10px" : "5px",
          textAlign: isMd ? "center" : "start",
          fontSize: "12px",
          fontFamily: "sans-serif",
        }}
      >
        {row.amount}
      </Table.Td>
      <Table.Td
        style={{
          padding: isMd ? "10px" : "5px",
          textAlign: isMd ? "center" : "start",
          fontSize: "12px",
          fontFamily: "sans-serif",
        }}
      >
        {row.amount - (row.amountPaid ?? 0)}
      </Table.Td>
      <Table.Td
        style={{
          padding: isMd ? "10px" : "5px",
          textAlign: isMd ? "center" : "start",
          fontSize: "12px",
          fontFamily: "sans-serif",
        }}
      >
        {(row.amountPaid ?? 0) > 0
          ? `${new Date(row.updatedAt || 0).toLocaleDateString()}`
          : "N/A"}
      </Table.Td>
      {props.userType === "teacher" && (
        <>
          <Table.Td
            style={{
              padding: isMd ? "10px" : "5px",
              textAlign: "center",
              fontSize: "12px",
              fontFamily: "sans-serif",
            }}
          >
            {(row.amountPaid ?? 0) > 0 ? (
              <IconDownload
                style={{ cursor: "pointer" }}
                onClick={() => convertHtmlIntoPdf(row._id ||"")}
              />
            ) : (
              ""
            )}
          </Table.Td>
          {/* <Table.Td style={{padding: isMd?"10px":"5px", textAlign: isMd?"center":"start" }}>
            {(row.amountPaid??0) > 0 ? (
              <IconDotsVertical 
              // onClick={() => setSelectedFeeRecord(row)} 
              />
            ) : (
              ""
            )}
          </Table.Td> */}
        </>
      )}
    </Table.Tr>
  ));

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Stack p={5} w={isMd ? "95%" : "100%"} mb={"1rem"}>
        <Flex w={"100%"} justify="space-between" align="center">
          <Stack w={"50%"}>
            <Text fw={500}>{props.batchName}</Text>
            <Text size="sm" c="dimmed">
              {`${new Date(props.dateOfJoining).toLocaleDateString()}`}
            </Text>
          </Stack>
          <Flex w={"50%"} justify="space-between" align="center">
            <Text size="sm" c="green">
              {batchTotalFees}
            </Text>
            <Text size="sm" c="red">
              {batchTotalPandingFees}
            </Text>
            {collapse ? (
              <IconArrowUpFromArc
                style={{ cursor: "pointer" }}
                onClick={() => setCollapse(false)}
              />
            ) : (
              <IconArrowLeftFromArc
                style={{ cursor: "pointer" }}
                onClick={() => setCollapse(true)}
              />
            )}
          </Flex>
        </Flex>
        <Divider my="sm" />
        <Box
          w={"100%"}
          style={{
            display: collapse ? "block" : "none",
            width: "100%",
            overflowX: "hidden",
          }}
        >
          <ScrollArea w={isMd ? "100%" : "100%"}>
            <Table horizontalSpacing="xl">
              <Table.Thead>
                <Table.Tr style={{ border: "none" }}>
                  <Table.Th
                    style={{
                      paddingLeft: isMd ? "10px" : "5px",
                      paddingRight: isMd ? "10px" : "5px",
                      whiteSpace: "nowrap",
                      fontSize: "13px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    S No.
                  </Table.Th>
                  <Table.Th
                    style={{
                      paddingLeft: isMd ? "10px" : "5px",
                      paddingRight: isMd ? "10px" : "5px",
                      whiteSpace: "nowrap",
                      fontSize: "13px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Due Date
                  </Table.Th>
                  <Table.Th
                    style={{
                      paddingLeft: isMd ? "10px" : "5px",
                      paddingRight: isMd ? "10px" : "5px",
                      whiteSpace: "nowrap",
                      textAlign: isMd ? "center" : "start",
                      fontSize: "13px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Status
                  </Table.Th>
                  <Table.Th
                    style={{
                      paddingLeft: isMd ? "10px" : "5px",
                      paddingRight: isMd ? "10px" : "5px",
                      whiteSpace: "nowrap",
                      fontSize: "13px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Amount
                  </Table.Th>
                  <Table.Th
                    style={{
                      paddingLeft: isMd ? "10px" : "5px",
                      paddingRight: isMd ? "10px" : "5px",
                      whiteSpace: "nowrap",
                      fontSize: "13px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Due
                  </Table.Th>
                  <Table.Th
                    style={{
                      paddingLeft: isMd ? "10px" : "5px",
                      paddingRight: isMd ? "10px" : "5px",
                      whiteSpace: "nowrap",
                      fontSize: "13px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Paid On
                  </Table.Th>
                  {props.userType === "teacher" && (
                    <th
                      style={{
                        paddingLeft: isMd ? "10px" : "5px",
                        paddingRight: isMd ? "10px" : "5px",
                        whiteSpace: "nowrap",
                        fontSize: "13px",
                        fontFamily: "sans-serif",
                      }}
                    >
                      Download Receipt
                    </th>
                  )}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{renderRows}</Table.Tbody>
            </Table>
          </ScrollArea>
        </Box>
      </Stack>
      <Modal
        opened={selectedFeeRecord != null}
        onClose={() => {
          setSelectedFeeRecord(null);
        }}
      >
        <Table>
          <thead>
            <tr>
              <th>S No.</th>
              <th>Payment Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {selectedFeeRecord &&
              selectedFeeRecord?.payments?.map(
                (singlePaymentRecord: any, index: number) => {
                  return (
                    <tr>
                      <td>Payment {index + 1}</td>
                      <td>
                        {
                          new Date(singlePaymentRecord.paymentDate.toString())
                            ?.toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td>{singlePaymentRecord.amount}</td>
                      {singlePaymentRecord.amount > 0 ? (
                        <IconDownload
                        
                        />
                      ) : (
                        ""
                      )}
                    </tr>
                  );
                }
              )}
          </tbody>
        </Table>
      </Modal>
    </>
  );
};

export default FeeRecordTable;
