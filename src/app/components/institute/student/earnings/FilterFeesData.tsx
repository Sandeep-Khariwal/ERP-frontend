import { useAppSelector } from "@/app/redux/redux.hooks";
import { GetDayWiseEarnings } from "@/axios/institute/InstituteGetApi";
import {
  Button,
  Card,
  Flex,
  Grid,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

//   const dummyStudents = [
//   {
//     name: "Neha Singh",
//     address: "Lucknow",
//     phoneNumber: "9876501234",
//     batch: { name: "MCA" },
//     paidFees: 25000,
//   },
//   {
//     name: "Neha Singh",
//     address: "Lucknow",
//     phoneNumber: "9876501234",
//     batch: { name: "MCA" },
//     paidFees: 25000,
//   },
//   {
//     name: "Neha Singh",
//     address: "Lucknow",
//     phoneNumber: "9876501234",
//     batch: { name: "MCA" },
//     paidFees: 25000,
//   },
//   {
//     name: "Neha Singh",
//     address: "Lucknow",
//     phoneNumber: "9876501234",
//     batch: { name: "MCA" },
//     paidFees: 25000,
//   },
// ];

export default function EarningsSummary({}) {
  const [FilterFeesStudents, setFilterFeesStudents] = useState<any[]>([]);
  //     const [FilterFeesStudents, setFilterFeesStudents] =
  //   useState<any[]>(dummyStudents);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());

  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedStudents = FilterFeesStudents.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const totalPages = Math.ceil(FilterFeesStudents.length / itemsPerPage);

  const totalPaidFees = FilterFeesStudents.reduce(
    (sum, student) => sum + student.paidFees,
    0,
  );

  const tableHeaderStyle = {
    padding: "16px",
    textAlign: "left" as const,
    fontWeight: 700,
    fontSize: "15px",
    color: "white",
  };

  const tableCellStyle = {
    padding: "14px",
    fontSize: "14px",
    color: "#4B5563",
  };

  const totalStudents = FilterFeesStudents.length;

  const emptyRows = Math.max(0, itemsPerPage - paginatedStudents.length);

  const GetDayWiseData = () => {
    if (!fromDate || !toDate) return;

    setIsLoading(true);

    GetDayWiseEarnings(
      institute._id,
      dayjs(fromDate).format("YYYY-MM-DD"),
      dayjs(toDate).format("YYYY-MM-DD"),
    )
      .then((res: any) => {
        console.log("api res : ",res);
        
        setFilterFeesStudents(res.data || []);
        setCurrentPage(1);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (fromDate || toDate){
      GetDayWiseData()
    }
  }, []);

  return (
    <Stack
      w={isMd ? "95%" : "100%"}
      // mih={"120vh"}
      // h={isMd ? "300%" : "500%"}

      // mx={"auto"}
      // bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
      mb={isMd ? 20 : 20}
    >
      <LoadingOverlay visible={isLoading} />
      <Stack
        w={"100%"}
        bg={"white"}
        p={15}
        mt={10}
        style={{ borderRadius: "1rem" }}
      >
        <Flex
          w={"100%"}
          justify={"space-between"}
          align={"center"}
          mb={25}
          wrap="wrap"
          gap={10}
        >
          <Text
            fw={700}
            fz={32}
            style={{ fontFamily: "sans-serif", lineHeight: 1 }}
          >
            Days-wise Earning
          </Text>
        </Flex>

        <Flex gap={18} align={"center"} wrap={"wrap"} mt={15} mb={20}>
          <DatePickerInput
            placeholder="From Date"
            value={fromDate}
            onChange={(date:any)=>setFromDate(date?? new Date())}
          />

          <DatePickerInput
            placeholder="To Date"
            value={toDate}
            onChange={(date:any)=>setToDate((date?? new Date()))}
          />

          <Button
            onClick={GetDayWiseData}
            styles={{
              root: {
                background: "linear-gradient(135deg, #C850C0, #4158D0)",
                border: 0,
                borderRadius: "10px",
                height: "44px",
                minWidth: "120px",
              },
            }}
          >
            Search
          </Button>

          <Text fw={600}>Total Students : {totalStudents}</Text>
        </Flex>

        <Stack mt={25}>
          {/* {FilterFeesStudents.length > 0 ? ( */}
          <div
            style={{
              overflowX: "auto",
              minHeight: "430px",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              //  paddingBottom: "100px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "white",
              }}
            >
              <thead
                style={{
                  background: "linear-gradient(135deg, #C850C0, #4158D0)",
                  color: "white",
                }}
              >
                <tr>
                  <th style={tableHeaderStyle}>Name</th>
                  <th style={tableHeaderStyle}>Address</th>
                  <th style={tableHeaderStyle}>Phone</th>
                  <th style={tableHeaderStyle}>Batch</th>
                  <th style={tableHeaderStyle}>Paid Fees</th>
                </tr>
              </thead>
              {/* <tbody>
                        {paginatedStudents.map((s: any, index: number) => (
                          <tr
                            key={index}
                            style={{
                              borderBottom: "1px solid #ECECEC",
                              height: "65px",
                            }}
                          >
                            <td style={tableCellStyle}>{s.name}</td>
                            <td style={tableCellStyle}>{s.address || "N/A"}</td>
                            <td style={tableCellStyle}>{s.phoneNumber || "N/A"}</td>
                            <td style={tableCellStyle}>{s.batch?.name || "N/A"}</td>
                            <td
                              style={{
                                ...tableCellStyle,
                                color: "green",
                                fontWeight: 700,
                              }}
                            >
                              ₹{s.paidFees}
                            </td>
                          </tr>
                        ))}
                      </tbody> */}
              <tbody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((s: any, index: number) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: "1px solid #ECECEC",
                        height: "65px",
                      }}
                    >
                      <td style={tableCellStyle}>{s.name}</td>
                      <td style={tableCellStyle}>{s.address || "N/A"}</td>
                      <td style={tableCellStyle}>{s.phoneNumber || "N/A"}</td>
                      <td style={tableCellStyle}>{s.batch?.name || "N/A"}</td>

                      <td
                        style={{
                          ...tableCellStyle,
                          color: "green",
                          fontWeight: 700,
                        }}
                      >
                        ₹{s.paidFees}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    {/* <td
        colSpan={5}
        style={{
          textAlign: "center",
          padding: "40px",
          color: "#888",
          fontWeight: 600,
        }}
      >
        No Students Found
      </td> */}
                  </tr>
                )}

                {Array.from({ length: emptyRows }).map((_, index) => (
                  <tr
                    key={index}
                    style={{
                      height: "65px",
                      borderBottom: "1px solid #ECECEC",
                    }}
                  >
                    <td>&nbsp;</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <Flex justify="center" mt="md" gap="xs">
                <Button
                  size="xs"
                  variant="light"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </Button>

                <Text size="sm" fw={600}>
                  Page {currentPage} of {totalPages}
                </Text>

                <Button
                  size="xs"
                  variant="light"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </Flex>
            )}
            <Flex justify="flex-end" mt={20}>
              <Card shadow="sm" p="md" radius="md">
                <Text fw={700} size="lg">
                  Total Paid Fees : ₹{totalPaidFees.toLocaleString()}
                </Text>
              </Card>
            </Flex>
          </div>
          {/* ) : (
                  <Stack align="center" py={40}>
                    <Text fw={600} c="dimmed">
                      No Students Found
                    </Text>
                  </Stack>
                )} */}
        </Stack>
      </Stack>
    </Stack>
  );
}
