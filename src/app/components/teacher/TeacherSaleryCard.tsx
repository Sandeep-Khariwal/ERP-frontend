// components/SalaryCard.tsx

"use client";

import { GetTeacherPaymentHistory } from "@/axios/teacher/TeacherGetApi";
import { Box, Flex, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export interface Salary {
  month: string;
  baseSalary: number;
  netSalary: number;
  amountPaid: number;
  salleryDate: string;
  transactionReference: string;
  salleryStatus: string;
  salleryMode: string;
  createdAt: string;
  updatedAt: string;
}

export default function SalaryCard(props: { teacherId: string }) {
  const [salary, setSalary] = useState<Salary[]>([]);

  useEffect(() => {
    if (props.teacherId) {
      GetTeacherPaymentHistory(props.teacherId)
        .then((x: any) => {
          const { sallery } = x;
          setSalary(sallery);
          console.log(x);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [props.teacherId]);

  return (
    <>
      {salary.map((salary) => (
        <Box
          style={{
            width: "100%",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "12px",
            backgroundColor: "#fafafa",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
          }}
        >
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            wrap="wrap"
            style={{ gap: "10px" }}
          >
            {/* Section 1 */}
            <Stack>
              <Text style={{ fontWeight: 600, fontSize: "16px" }}>
               <span style={{fontWeight:700}}> Month:</span> {salary.month}
              </Text>
              <Text><span style={{fontWeight:700}}>Base Salary: &#8377;</span> {salary.baseSalary}</Text>
              <Text><span style={{fontWeight:700}}>Net Salary: &#8377;</span> {salary.netSalary}</Text>
            </Stack>

            {/* Section 2 */}
            <Stack>
                           <Text>
                <span style={{fontWeight:700}}>Status:</span>
                <span
                  style={{
                    color: salary.salleryStatus === "Paid" ? "green" : "red",
                    fontWeight: 800,
                  }}
                >
                 {" "} {salary.salleryStatus}
                </span>
              </Text>
              <Text> <span style={{fontWeight:700}}>Amount Paid: &#8377; </span> {salary.amountPaid}</Text>
              {/* <Text><span style={{fontWeight:700}}>Payment Mode:</span> {salary.salleryMode}</Text> */}
         <Text>
                <span style={{fontWeight:700}}>Paid On: </span> {new Date(salary.salleryDate).toLocaleDateString()}
              </Text>
            </Stack>

            {/* Section 3 */}
            <Stack>
        
              <Text style={{ fontSize: "12px", color: "#888" }}>
                <span style={{fontWeight:700}} >Created:</span> {new Date(salary.createdAt).toLocaleString()}
              </Text>
            </Stack>
          </Flex>
        </Box>
      ))}
    </>
  );
}
