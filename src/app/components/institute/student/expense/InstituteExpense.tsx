// InstituteExpanse.tsx (Complete UI with Dummy Data)
import { useState } from "react";
import { Container, Grid, Button, Title, Card, Text, Group, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { Modal } from "@mantine/core";
import ExpenseForm from "./AddExpenseModel";
import { useEffect } from "react";
import { useAppSelector } from "@/app/redux/redux.hooks";
import { GetExpenseData } from "@/axios/institute/ExpenseApi";
import { useMemo } from "react";
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

const COLORS = [
    "#6366F1", // Indigo
    "#22C55E", // Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#3B82F6", // Blue
    "#A855F7", // Purple
    "#14B8A6", // Teal
];

export default function InstituteExpanse() {
    const institute = useAppSelector(
        (state: any) => state.instituteSlice.instituteDetails
    );
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [opened, setOpened] = useState(false);
    const [filters, setFilters] = useState<Filters>({});

    const [monthlyExpense, setMonthlyExpense] = useState(0);
    const [topCategory, setTopCategory] = useState("");
    const [avgExpense, setAvgExpense] = useState(0);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [weeklyData, setWeeklyData] = useState<any[]>([]);

    const [totalExpense, setTotalExpense] = useState(0);



    const finalExpenses = useMemo(() => {
        if (!filters.startDate && !filters.endDate && !filters.category) {
            return expenses;
        }

        return expenses.filter((e) => {
            const date = new Date(e.expenseDate);

            const start = filters.startDate
                ? new Date(new Date(filters.startDate).setHours(0, 0, 0, 0))
                : null;

            const end = filters.endDate
                ? new Date(new Date(filters.endDate).setHours(23, 59, 59, 999))
                : null;

            return (
                (!start || date >= start) &&
                (!end || date <= end) &&
                (!filters.category || e.category === filters.category)
            );
        });
    }, [expenses, filters]);



    useEffect(() => {
        const total = finalExpenses.reduce((sum, e) => sum + e.amount, 0);

        setTotalExpense(total);

        setTotalExpense(total);

        // ✅ Monthly Expense (card)
        const currentMonth = new Date().getMonth();

        const monthly = finalExpenses
            .filter(e => new Date(e.expenseDate).getMonth() === currentMonth)
            .reduce((sum, e) => sum + e.amount, 0);

        setMonthlyExpense(monthly);

        // ✅ Category Map
        const categoryMap: any = {};

        finalExpenses.forEach(e => {
            categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
        });

        // ✅ Category Data (Pie Chart)
        const catData = Object.keys(categoryMap).map(key => ({
            name: key,
            value: categoryMap[key]
        }));

        setCategoryData(catData);

        // ✅ Top Category
        let topCat = "";
        let max = 0;

        for (let key in categoryMap) {
            if (categoryMap[key] > max) {
                max = categoryMap[key];
                topCat = key;
            }
        }

        setTopCategory(topCat);

        // ✅ Avg Expense
        setAvgExpense(finalExpenses.length > 0 ? total / finalExpenses.length : 0);

        // ✅ Monthly Trend (Line Chart)
        const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const monthMap: any = {};

        finalExpenses.forEach(e => {
            const month = new Date(e.expenseDate).toLocaleString("default", { month: "short" });
            monthMap[month] = (monthMap[month] || 0) + e.amount;
        });

        // ✅ sorted + only existing months
        const monthData = monthsOrder
            .filter(m => monthMap[m])
            .map(m => ({
                name: m,
                value: monthMap[m]
            }));

        setMonthlyData(monthData);

        // ✅ Weekly Data (Bar Chart)
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weekMap: any = {};

        finalExpenses.forEach(e => {
            const day = days[new Date(e.expenseDate).getDay()];
            weekMap[day] = (weekMap[day] || 0) + e.amount;
        });

        const weekData = days.map(d => ({
            name: d,
            value: weekMap[d] || 0
        }));

        setWeeklyData(weekData);

    }, [finalExpenses]);

    useEffect(() => {
        if (!institute?._id) return;

        GetExpenseData(institute._id)
            .then((res: any) => {
                console.log("expenses:", res);

                const expenseData = res?.expenses;

                setExpenses(expenseData);
            })
            .catch((err: any) => {
                console.log("Error fetching expenses:", err);
            });

    }, [institute]);

    return (
        <Container size="xl" py="md">
            <Group justify="space-between" mb="md">
                <Title order={2}>Expense Analytics</Title>
                <Button radius="xl" onClick={() => setOpened(true)}>
                    + Add Expense
                </Button>

                <Modal
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title="Add Expense"
                    centered
                >
                    <ExpenseForm
                        institute={institute._id}
                        onSuccess={(newExpense: any) => {
                            // ✅ 1. Add new expense instantly
                            setExpenses(prev => [newExpense, ...prev]);

                            // ✅ 2. Close modal
                            setOpened(false);
                        }}
                    />
                </Modal>
            </Group>

            <Card shadow="sm" radius="xl" mb="md">
                <Group>
                    <DateInput
                        placeholder="Start Date"
                        value={filters.startDate}
                        onChange={(val) =>
                            setFilters((prev) => ({ ...prev, startDate: val }))
                        }
                    />

                    <DateInput
                        placeholder="End Date"
                        value={filters.endDate}
                        onChange={(val) =>
                            setFilters((prev) => ({ ...prev, endDate: val }))
                        }
                    />

                    <Select
                        placeholder="Category"
                        data={["Salary", "Rent", "Transport", "Marketing", "Misc"]}
                        value={filters.category}
                        onChange={(val) =>
                            setFilters((prev) => ({ ...prev, category: val }))
                        }
                    />

                    <Button
                        color="red"
                        variant="outline"
                        onClick={() =>
                            setFilters({
                                startDate: null,
                                endDate: null,
                                category: null,
                            })
                        }
                    >
                        Reset
                    </Button>
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
                        <Text size="xl" fw={700}>₹{monthlyExpense}</Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Card radius="xl" shadow="md">
                        <Text c="dimmed">Top Category</Text>
                        <Text size="xl" fw={700}>{topCategory}</Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Card radius="xl" shadow="md">
                        <Text c="dimmed">Avg Expense</Text>
                        <Text size="xl" fw={700}>₹{avgExpense.toFixed(0)}</Text>
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
                    <Card radius="xl" shadow="md" p="lg">

                        {/* Header */}
                        <Group justify="space-between" mb="md">
                            <Text fw={600} size="lg">Recent Expenses</Text>
                            <Text size="sm" c="dimmed">
                                Showing last 10 entries
                            </Text>
                        </Group>

                        {/* List */}
                        {finalExpenses
                            .sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime())
                            .slice(0, 10)
                            .map((e) => (

                                <Group
                                    key={e._id}
                                    align="center"
                                    py="sm"
                                    px="xs"
                                    style={{
                                        borderBottom: "1px solid #f1f1f1",
                                    }}
                                >

                                    {/* Title */}
                                    <Text style={{ flex: 2 }} fw={500}>
                                        {e.title}
                                    </Text>

                                    {/* Category */}
                                    <Text style={{ flex: 1 }} size="sm" c="dimmed">
                                        {e.category}
                                    </Text>

                                    {/* Date */}
                                    <Text style={{ flex: 1 }} size="sm" c="dimmed" ta="center">
                                        {new Date(e.expenseDate).toLocaleDateString()}
                                    </Text>

                                    {/* Amount */}
                                    <Text style={{ flex: 1 }} fw={600} ta="right">
                                        ₹{e.amount}
                                    </Text>

                                </Group>
                            ))}

                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
}