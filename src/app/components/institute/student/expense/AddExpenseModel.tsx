"use client";

import { useState } from "react";
import { TextInput, Button, Select, NumberInput, Textarea, Flex } from "@mantine/core";
import { CreateExpense } from "../../../../../axios/institute/ExpenseApi";
import { useAppSelector } from "@/app/redux/redux.hooks";
import { DatePickerInput } from "@mantine/dates";
// import { Expense } from "@/axios/expense/ExpenseApi";
export default function ExpenseForm({ institute, onSuccess }: any) {
    const [loading, setLoading] = useState(false);
    const [dateofExpense, setDateOfExpense] = useState<Date | null>(new Date());

    const [form, setForm] = useState({
        title: "",
        amount: 0,
        category: "",
        paymentMethod: "",
        note: "",
    });

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

   const handleSubmit = async () => {
    if (!form.title || !form.amount) return;

    setLoading(true);

    CreateExpense({
        ...form,
        instituteId: institute,
        expenseDate: new Date(dateofExpense!!)
    })
        .then((res: any) => {
            onSuccess(res.data)
        })
        .catch((e) => {
            console.log(e);
        })
        .finally(() => {
            setLoading(false); // ✅ correct place
        });
};



    return (
        <div style={{ maxWidth: 500, margin: "auto" }}>

            <TextInput
                label="Title"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
            />

        
            <Flex w={"100%"} align={"center"} justify={"space-between"}>
    <NumberInput
     w={"48%"}
                label="Amount"
                value={form.amount}
                onChange={(value) => handleChange("amount", value)}
                hideControls
            />
                 <DatePickerInput
                  w={"48%"}
                label="Date"
                ff={"Poppins"}
                placeholder="Select Date"
                radius={"md"}
                value={dateofExpense}
                onChange={(date) => {
                    setDateOfExpense(date || null)
                }}
            />
            </Flex>
<Flex w={"100%"} align={"center"} justify={"space-between"}>

    
            <Select
            w={"48%"}
                label="Category"
                data={["Salary", "Rent", "Transport", "Marketing", "Misc"]}
                value={form.category}
                onChange={(value) => handleChange("category", value)}
            />

            <Select
                w={"48%"}
                
                label="Payment Method"
                data={["Cash", "Bank", "UPI"]}
                value={form.paymentMethod}
                onChange={(value) => handleChange("paymentMethod", value)}
                
            />
</Flex>

            <DatePickerInput
                label="Date"
                ff={"Poppins"}
                placeholder="Select Date"
                radius={"md"}
                value={dateofExpense}
                onChange={(date) => {
                    setDateOfExpense(date || null)
                }}
            />

            <Textarea
                label="Note"
                value={form.note}
                onChange={(e) => handleChange("note", e.target.value)}
            />

            {/* ✅ BUTTON */}
            <Button fullWidth mt="md" loading={loading} onClick={handleSubmit}>
                Add Expense
            </Button>
        </div>
    );
}