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
   IconEye,
} from "@tabler/icons-react";
import { Installment } from "@/interfaces/batchInterface";
import { createReceiptPdf } from "./HtmlToPdf";
import { UserType } from "@/app/components/dashboard/InstituteBatchesSection";
import { GetStudentForPdf } from "@/axios/student/StudentGetApi";
import { getBase64Image } from "@/app/helperFunction/Notification";

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
    receiptNumber: string;
    amount: number;
    paymentDate: Date;
  }[];
  paidHistory: {
  _id: string;
  amount: number;
  paidDate: Date;
  description: string;
}[];
}

const FeeRecordTable = (props: {
  dateOfJoining: Date;
  data: Installment[];
  studentId: string;
  userType: UserType;
  batchName: string;
}) => {
  const batchTotalFees = props.data.reduce(
    (sum: number, record: Installment) => sum + record.amount,
    0,
  );
  const batchTotalPaidFees = props.data.reduce(
    (sum: number, record: Installment) => sum + (record.amountPaid ?? 0),
    0,
  );
  const batchTotalPandingFees = batchTotalFees - batchTotalPaidFees;

  const [collapse, setCollapse] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const [selectedFeeRecord, setSelectedFeeRecord] = useState<FeeRecord | null>(
    null,
  );

  const convertHtmlIntoPdf = (id: string) => {
    setisLoading(true);
    GetStudentForPdf(props.studentId)
      .then(async (x: any) => {
        setisLoading(false);
        const { student } = x;
        const { feeRecords, instituteId } = student;

        const studentName = student.name;
        const date = new Date();
        const parentName = student.parentName;

        const InstituteName = instituteId.name;
        const instituteLogo = instituteId.logo;
        const address = instituteId.address;
        const phoneNumber = instituteId.institutePhoneNumber;
        const receiptNo = "R-" + instituteId.receiptCount;
        let paymentRecords;
        let amountPaid;

        if (id) {
          paymentRecords = feeRecords.filter((f: any) => f._id === id);
          amountPaid = paymentRecords[0].amountPaid;
        } else {
          paymentRecords = feeRecords;
          amountPaid = feeRecords.reduce((sum: number, acc: any) => {
            sum += acc.amountPaid;
            return sum;
          }, 0);
        }

        const base64Logo = await getBase64Image(instituteId.logo);

        const base64Signature = await getBase64Image(instituteId.signature);

        const receiptHtml = createReceiptPdf(
          studentName,
          date,
          parentName,
          amountPaid,
          paymentRecords,
          InstituteName,
          base64Logo,
          address,
          phoneNumber,
          receiptNo,
          props.batchName,
          base64Signature,
        );

        const printWindow = window.open("", "_blank");

        if (printWindow) {
          printWindow.document.open();

          printWindow.document.write(receiptHtml);

          printWindow.document.close();

          setTimeout(() => {
            printWindow.focus();

            printWindow.print();

            printWindow.onafterprint = () => {
              printWindow.close();
            };
          }, 500);
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
        height: "100%",
        border: "2px solid #F8F8F8",
        backgroundColor: "#F8F8F8",
        borderRadius: "1rem",
        overflowX: "auto",
        marginBottom: "10px",
        // padding:"0px 5px"
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
      {/* {props.userType === UserType.TEACHER && ( */}
      <>
        <Table.Td
          style={{
            padding: isMd ? "10px" : "5px",
            textAlign: "center",
            fontSize: "12px",
            fontFamily: "sans-serif",
          }}
        >
          {/* {(row.amountPaid ?? 0) > 0 && (
            <IconDownload
              style={{ cursor: "pointer" }}
              onClick={() => convertHtmlIntoPdf(row._id || "")}
            />
          )} */}
          {(row.amountPaid ?? 0) > 0 && (
  <Flex justify="center" gap={8}>
    <IconEye
      style={{ cursor: "pointer" , color:"#5e66de" }}
      onClick={() => setSelectedFeeRecord(row as any)}
    />

    <IconDownload
      style={{ cursor: "pointer" }}
      onClick={() => convertHtmlIntoPdf(row._id || "")}
    />
  </Flex>
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
      {/* )} */}
    </Table.Tr>
  ));

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Stack w={isMd ? "95%" : "100%"} mb={"1rem"}>
        <Flex w={"100%"} p={5} justify="space-between" align="center">
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
          <Box w={isMd ? "100%" : "100%"} h={"100%"} py={20}>
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
                  {props.userType === UserType.STUDENT && (
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
          </Box>
        </Box>
      </Stack>
     <Modal
  opened={selectedFeeRecord != null}
  onClose={() => {
    setSelectedFeeRecord(null);
  }}
  title={
    <Text size="lg" fw={700} c="blue.7">
      Paid History
    </Text>
  }
  centered
  size="lg"
  radius="md" // Premium rounded corners ke liye
  overlayProps={{
    blur: 3, // Background ko blur karke modal ko pop karne ke liye
  }}
>
  <Table 
    horizontalSpacing="md" 
    verticalSpacing="sm" 
    striped 
    highlightOnHover
    style={{ tableLayout: 'fixed', width: '100%' }}
  >
    <thead>
      <tr>
        <th style={{ width: '15%', textAlign: 'left' }}>S No.</th>
        <th style={{ width: '35%', textAlign: 'left' }}>Payment Date</th>
        <th style={{ width: '25%', textAlign: 'left' }}>Amount</th>
        <th style={{ width: '25%', textAlign: 'left' }}>Description</th>
      </tr>
    </thead>
    <tbody>
      {selectedFeeRecord &&
        selectedFeeRecord?.paidHistory?.map(
          (singlePaymentRecord: any, index: number) => {
            return (
              <tr key={index}>
                <td style={{ textAlign: 'left' }}>
                  <Text size="sm" fw={500} c="dimmed">
                    {index + 1}
                  </Text>
                </td>
                <td style={{ textAlign: 'left' }}>
                  <Text size="sm" fw={500}>
                    {new Date(singlePaymentRecord.paidDate).toLocaleDateString()}
                  </Text>
                </td>
                <td style={{ textAlign: 'left' }}>
                  <Text size="sm" fw={600} c="green.7">
                    ₹{singlePaymentRecord.amount}
                  </Text>
                </td>
                <td style={{ textAlign: 'left' }}>
                  <Text size="sm" c="dimmed" style={{ textTransform: 'capitalize' }}>
                    {singlePaymentRecord.description || "-"}
                  </Text>
                </td>
              </tr>
            );
          },
        )}
    </tbody>
  </Table>
</Modal>
    </>
  );
  
};

export default FeeRecordTable;
