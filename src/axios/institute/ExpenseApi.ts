
// ✅ CREATE
// export const createExpense = (data: any) =>
//     axios.post(`${BASE_URL}/create`, data);

import ApiHelper from "@/ApiHelper";

// // ✅ GET ALL
// export const getAllExpenses = (instituteId: string) =>
//     axios.get(`${BASE_URL}/getAll/${instituteId}`);

// // ✅ DELETE
// export const deleteExpense = (id: string) =>
//     axios.delete(`${BASE_URL}/delete/${id}`);

// // ✅ UPDATE
// export const updateExpense = (id: string, data: any) =>
//     axios.put(`${BASE_URL}/update/${id}`, data);

export function CreateExpense(data: {
    instituteId: string,
    title: string,
    amount: number,
    category: string,
    paymentMethod: string,
    expenseDate: Date,
    note: string,
}) {
    return new Promise((resolve, reject) => {
        ApiHelper.post(
            `${process.env.URL}/api/v1/expense/create`, data
        )
            .then((response) => resolve(response))
            .catch((error: any) => reject(error));
    });
}

export function GetExpenseData(instituteId:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/expense/getAll/${instituteId}`)
        .then((response:any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

