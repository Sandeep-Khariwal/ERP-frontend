// InstituteExpanse.tsx (Complete UI with Dummy Data)
import { useState } from "react";
import { Container, Grid, Button, Title, Card, Text, Group, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";

// ================= Interfaces =================

interface Expense {
    _id: string;
    title: string;
    amount: number;
    category: string;
    paymentMethod: string;
    expenseDate: string;
}

interface Filters {
    startDate?: Date | null;
    endDate?: Date | null;
    category?: string | null;
}

// ================= Dummy Data =================

const dummyExpenses: Expense[] = [
    { _id: "1", title: "Teacher Salary", amount: 50000, category: "Salary", paymentMethod: "Bank", expenseDate: "2026-01-10" },
    { _id: "2", title: "Rent", amount: 20000, category: "Rent", paymentMethod: "UPI", expenseDate: "2026-02-12" },
    { _id: "3", title: "Electricity", amount: 8000, category: "Electricity", paymentMethod: "Cash", expenseDate: "2026-03-05" },
    { _id: "4", title: "Transport", amount: 12000, category: "Transport", paymentMethod: "Bank", expenseDate: "2026-03-15" }
];

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

export default function InstituteExpanse() {
    const [expenses] = useState<Expense[]>(dummyExpenses);
    const [filters, setFilters] = useState<Filters>({});

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categoryData = Object.values(
        expenses.reduce((acc: any, curr) => {
            acc[curr.category] = acc[curr.category] || { name: curr.category, value: 0 };
            acc[curr.category].value += curr.amount;
            return acc;
        }, {})
    );

    const monthlyData = expenses.map((e) => ({
        name: new Date(e.expenseDate).toLocaleString("default", { month: "short" }),
        value: e.amount
    }));

    const weeklyData = [
        { name: "Mon", value: 2000 },
        { name: "Tue", value: 4000 },
        { name: "Wed", value: 3000 },
        { name: "Thu", value: 5000 },
        { name: "Fri", value: 2000 }
    ];

    return (
        <Container size="xl" py="md">
            <Group justify="space-between" mb="md">
                <Title order={2}>Expense Analytics</Title>
                <Button radius="xl">+ Add Expense</Button>
            </Group>

            <Card shadow="sm" radius="xl" mb="md">
                <Group>
                    <DateInput placeholder="Start Date" value={filters.startDate} onChange={(val) => setFilters({ ...filters, startDate: val })} />
                    <DateInput placeholder="End Date" value={filters.endDate} onChange={(val) => setFilters({ ...filters, endDate: val })} />
                    <Select placeholder="Category" data={["Salary", "Rent", "Electricity"]} onChange={(val) => setFilters({ ...filters, category: val })} />
                    <Button>Apply</Button>
                </Group>
            </Card>

            <Grid mb="md">
                <Grid.Col span={3}>
                    <Card radius="xl" shadow="md">
                        <Text c="dimmed">Total Expense</Text>
                        <Text size="xl" fw={700}>₹{totalExpense}</Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Card radius="xl" shadow="md">
                        <Text c="dimmed">Monthly Expense</Text>
                        <Text size="xl" fw={700}>₹80,000</Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Card radius="xl" shadow="md">
                        <Text c="dimmed">Top Category</Text>
                        <Text size="xl" fw={700}>Salary</Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Card radius="xl" shadow="md">
                        <Text c="dimmed">Avg Expense</Text>
                        <Text size="xl" fw={700}>₹22,000</Text>
                    </Card>
                </Grid.Col>
            </Grid>

            <Grid>
                <Grid.Col span={6}>
                    <Card radius="xl" shadow="md">
                        <Text mb="sm">Monthly Trend</Text>
                        <LineChart width={400} height={250} data={monthlyData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#4F46E5" />
                        </LineChart>
                    </Card>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Card radius="xl" shadow="md">
                        <Text mb="sm">Category Distribution</Text>
                        <PieChart width={350} height={300}>
                            <Pie
                                data={categoryData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
    ))}
                            </Pie>

                            <Tooltip />
                            <Legend />   {/* 🔥 THIS FIXES YOUR PROBLEM */}
                        </PieChart>
                    </Card>
                </Grid.Col>
            </Grid>

            <Grid mt="md">
                <Grid.Col span={12}>
                    <Card radius="xl" shadow="md">
                        <Text mb="sm">Weekly Expense</Text>
                        <BarChart width={600} height={250} data={weeklyData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#22C55E" />
                        </BarChart>
                    </Card>
                </Grid.Col>
            </Grid>

            <Grid mt="md">
                <Grid.Col span={12}>
                    <Card radius="xl" shadow="md">
                        <Text mb="sm">Recent Expenses</Text>
                        {expenses.map((e) => (
                            <Group key={e._id} justify="space-between" mb={6}>
                                <Text>{e.title}</Text>
                                <Text>{e.category}</Text>
                                <Text>₹{e.amount}</Text>
                            </Group>
                        ))}
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
}