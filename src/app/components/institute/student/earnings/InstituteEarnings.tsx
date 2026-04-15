"use client";

import {
  Container,
  Grid,
  Card,
  Text,
  Group,
  Title,
  Box,
  Badge,
  Table,
  ThemeIcon,
  Progress,
  Button,
  Divider,
  Flex,
} from "@mantine/core";

import {
  IconCurrencyRupee,
  IconCalendar,
  IconWallet,
  IconAlertCircle,
  IconClock,
} from "@tabler/icons-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { GetAllEarnings } from "@/axios/institute/InstituteGetApi";
import { useAppSelector } from "@/app/redux/redux.hooks";


// ================= STATIC GRAPH =================
// const monthlyData = [
//   { name: "Jan", earnings: 20000, trend: 18000 },
//   { name: "Feb", earnings: 30000, trend: 25000 },
//   { name: "Mar", earnings: 25000, trend: 23000 },
//   { name: "Apr", earnings: 35000, trend: 30000 },
// ];



export default function InstituteEarnings() {
  const isMobile = useMediaQuery("(max-width: 968px)");
  const [earningsData, setEarningsData] = useState<any>(null);
  const [showAllDue, setShowAllDue] = useState(false);
  const [showAllBatch, setShowAllBatch] = useState(false);
  const [upcomingPage, setUpcomingPage] = useState(1);
const itemsPerPage = 10;
   const institute = useAppSelector(
      (state: any) => state.instituteSlice.instituteDetails,
    );

  // ================= API =================
  useEffect(() => {
    GetAllEarnings(institute._id)
      .then((res: any) => {
        console.log("API RESPONSE 👉", res);
        setEarningsData(res);
      })
      .catch((err) => {
        console.error("API ERROR ❌", err);
      });
  }, []);

  // ================= SAFE DATA =================
  const apiData = earningsData?.data || {};

  const allRecords = apiData.allRecords || [];
  const currentMonthRecords = apiData.currentMonthRecords || [];
  const todayRecords = apiData.todayRecords || [];
  const dueFees = apiData.dueFees || [];
  const overdueFees = apiData.overdueFees || [];
  const upcomingFees = apiData.upcomingFees || [];

  // ================= CALCULATIONS =================
  const totalEarnings = allRecords.reduce(
    (sum: number, item: any) => sum + (item.amountPaid || 0),
    0
  );

  const thisMonthEarnings = currentMonthRecords.reduce(
    (sum: number, item: any) => sum + (item.amountPaid || 0),
    0
  );

  const todayEarnings = todayRecords.reduce(
    (sum: number, item: any) => sum + (item.amountPaid || 0),
    0
  );

  const pendingFees = dueFees.reduce(
    (sum: number, item: any) =>
      sum + ((item.totalAmount || 0) - (item.amountPaid || 0)),
    0
  );

  const overdueAmount = overdueFees.reduce(
    (sum: number, item: any) =>
      sum + ((item.totalAmount || 0) - (item.amountPaid || 0)),
    0
  );

  const visibleDueFees = showAllDue ? dueFees : dueFees.slice(0, 5);


  // ================= BATCH-WISE =================
  const batchDataMap: any = {};
  

  allRecords.forEach((item: any) => {
    const batchName = item.batch?.name || "Unknown";

    if (!batchDataMap[batchName]) {
      batchDataMap[batchName] = {
        collected: 0,
        pending: 0,
      };
    }

    batchDataMap[batchName].collected += item.amountPaid || 0;

    batchDataMap[batchName].pending +=
      (item.totalAmount || 0) - (item.amountPaid || 0);
  });

  const batchData = Object.entries(batchDataMap).map(
    ([name, values]: any) => ({
      name,
      collected: values.collected,
      pending: values.pending,
    })
  );
  const visibleBatchData = showAllBatch ? batchData : batchData.slice(0, 5);

  const startIndex = (upcomingPage - 1) * itemsPerPage;
const paginatedUpcoming = upcomingFees.slice(
  startIndex,
  startIndex + itemsPerPage
);

const totalPages = Math.ceil(upcomingFees.length / itemsPerPage);
  // ================= DYNAMIC MONTHLY DATA (ALL MONTHS) =================
const monthsList = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const monthlyMap: any = {};

// 👉 पहले सब months को 0 से initialize करो
monthsList.forEach((m, index) => {
  monthlyMap[index] = {
    name: m,
    earnings: 0,
    trend: 0,
  };
});

// 👉 अब actual data add करो
(Array.isArray(allRecords) ? allRecords : []).forEach((item: any) => {
  const date = new Date(item.createdAt);
  const monthIndex = date.getMonth();

  monthlyMap[monthIndex].earnings += item.amountPaid || 0;
});

// 👉 final array
const monthlyData = Object.values(monthlyMap);

  return (
    <Box bg="#f3f6fb" style={{ minHeight: "100vh", padding: 20 }}>
      <Container size="xl" px={isMobile ? "xs" : "md"}>
        {/* HEADER */}
        <Title ta="center" fw={700} mb="md">
          Earnings Dashboard
        </Title>

        {/* ================= TOP CARDS ================= */}
        <Grid mb="md">
          {[
            {
              title: "Total Earnings",
              value: `₹${totalEarnings.toLocaleString()}`,
              icon: IconCurrencyRupee,
              color: "blue",
            },
            {
              title: "This Month",
              value: `₹${thisMonthEarnings.toLocaleString()}`,
              icon: IconCalendar,
              color: "green",
            },
            {
              title: "Today's Collection",
              value: `₹${todayEarnings.toLocaleString()}`,
              icon: IconWallet,
              color: "orange",
            },
            {
              title: "Pending Fees",
              value: `₹${pendingFees.toLocaleString()}`,
              icon: IconAlertCircle,
              color: "orange",
            },
            {
              title: "Overdue Fees",
              value: `₹${overdueAmount.toLocaleString()}`,
              icon: IconClock,
              color: "red",
            },
          ].map((item, i) => (
            <Grid.Col span={isMobile ? 6 : 2.4} key={i}>
              <Card radius="xl" shadow="sm" p="md">
                <Group>
                  <ThemeIcon color={item.color} size={42} radius="xl">
                    <item.icon size={20} />
                  </ThemeIcon>

                  <Box>
                    <Text size="xs" c="#6b7280">
                      {item.title}
                    </Text>
                    <Text fw={700} size="lg">
                      {item.value}
                    </Text>
                  </Box>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* ================= CHART ================= */}
        <Card radius="xl" p="xs" mb="md">
          <Text fw={600} mb="xs">
            Monthly Earnings
          </Text>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="earnings" fill="#60a5fa" />
              <Line dataKey="trend" stroke="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card radius="xl" p="md" mb="md">
  <Flex justify="space-between" align="center">
    <Text fw={700}>Upcoming Fees</Text>

    <Badge color="yellow" variant="light">
      {upcomingFees.length} Records
    </Badge>
  </Flex>

  <Divider my="sm" />

  <Table highlightOnHover striped>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Class</Table.Th>
        <Table.Th>Student</Table.Th>
        <Table.Th>Roll No</Table.Th>
        <Table.Th>Total Amount</Table.Th>
        <Table.Th>Due Date</Table.Th>
      </Table.Tr>
    </Table.Thead>

    <Table.Tbody>
      {paginatedUpcoming.map((item: any, i: number) => (
        <Table.Tr key={i}>
          <Table.Td fw={500}>
            {item.batch?.name || "-"}
          </Table.Td>

          <Table.Td>
            {item.student?.name}
          </Table.Td>

          <Table.Td>
            {item.student?.rollNumber || "-"}
          </Table.Td>

          <Table.Td>
            <Text c="blue" fw={600}>
              ₹{(item.totalAmount || 0).toLocaleString()}
            </Text>
          </Table.Td>

          <Table.Td>
            <Badge color="yellow" variant="light">
              {new Date(item.dueDate).toLocaleDateString()}
            </Badge>
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  </Table>

  {/* PAGINATION */}
  {totalPages > 1 && (
    <Flex justify="center" mt="md" gap="xs">
      <Button
        size="xs"
        variant="light"
        disabled={upcomingPage === 1}
        onClick={() => setUpcomingPage((p) => p - 1)}
      >
        Prev
      </Button>

      <Text size="sm">
        Page {upcomingPage} of {totalPages}
      </Text>

      <Button
        size="xs"
        variant="light"
        disabled={upcomingPage === totalPages}
        onClick={() => setUpcomingPage((p) => p + 1)}
      >
        Next
      </Button>
    </Flex>
  )}
</Card>

        {/* ================= TABLES ================= */}
      <Grid>
  {/* LEFT */}
  <Grid.Col span={4} {...(isMobile && { span: 12 })}>
    <Card radius="xl" p="md" shadow="sm">
      
      {/* HEADER */}
      <Flex justify="space-between" align="center">
        <Text fw={700} size="md">
          Due Students
        </Text>

        <Badge color="orange" variant="light">
          {dueFees.length} Students
        </Badge>
      </Flex>

      <Divider my="sm" />

      {/* TABLE */}
      <Table highlightOnHover striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Amount</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {visibleDueFees.map((s: any, i: number) => (
            <Table.Tr key={i}>
              <Table.Td fw={500}>{s.student?.name}</Table.Td>

              <Table.Td>
                <Badge color="blue" variant="light">
                  {new Date(s.dueDate).toLocaleDateString()}
                </Badge>
              </Table.Td>

              <Table.Td>
                <Text c="red" fw={600}>
                  ₹
                  {(
                    (s.totalAmount || 0) - (s.amountPaid || 0)
                  ).toLocaleString()}
                </Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* VIEW MORE / LESS BUTTON */}
      {dueFees.length > 5 && (
        <Flex justify="center" mt="md">
          <Button
            variant="light"
            size="xs"
            onClick={() => setShowAllDue(!showAllDue)}
          >
            {showAllDue ? "View Less" : "View More"}
          </Button>
        </Flex>
      )}
    </Card>
  </Grid.Col>

  {/* RIGHT */}
  <Grid.Col span={8} {...(isMobile && { span: 12 })}>
    
    {/* ✅ BATCH TABLE */}
    <Card radius="xl" p="md">
      <Flex justify="space-between" align="center">
        <Text fw={700}>Batch-wise Earnings</Text>

        <Badge color="blue" variant="light">
          {batchData.length} Batches
        </Badge>
      </Flex>

      <Divider my="sm" />

      <Table highlightOnHover striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Batch</Table.Th>
            <Table.Th>Collected</Table.Th>
            <Table.Th>Pending</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {visibleBatchData.map((b: any, i: number) => (
            <Table.Tr key={i}>
              <Table.Td fw={500}>{b.name}</Table.Td>

              <Table.Td>
                <Text c="green" fw={600}>
                  ₹{b.collected.toLocaleString()}
                </Text>
              </Table.Td>

              <Table.Td>
                <Text c="red" fw={600}>
                  ₹{b.pending.toLocaleString()}
                </Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* VIEW MORE / LESS */}
      {batchData.length > 5 && (
        <Flex justify="center" mt="md">
          <Button
            size="xs"
            variant="light"
            onClick={() => setShowAllBatch(!showAllBatch)}
          >
            {showAllBatch ? "View Less" : "View More"}
          </Button>
        </Flex>
      )}
    </Card>

  
   

  </Grid.Col>
</Grid>
      </Container>
    </Box>
  );
}