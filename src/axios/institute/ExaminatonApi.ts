import ApiHelper from "@/ApiHelper";

// 🔹 1. Create Admit Card for Multiple Students
export function CreateAdmitCardBulk(data: {
  batchId: string;
  examName: string;
  session: string;
  studentIds: string[];
  schedules: {
    subjectId?: string;
    subjectName: string;
    subjectType?: string;
    subjectCode?: string;
    examDate: string | null;
    examTime: string;
  }[];
}) {
  return ApiHelper.post(
    `${process.env.URL}/api/v1/admit-card/create`,
    data,
  );
}

// 🔹 2. Get All Generated Admit Cards for a Batch (Admin Table)
export function GetBatchAdmitCards(batchId: string) {
  return ApiHelper.get(
    `${process.env.URL}/api/v1/admit-card/batchAll/${batchId}`,
  );
}

// 🔹 3. Get Logged-in Student's Admit Cards (Student Portal)
export function GetLoggedInStudentAdmitCards(studentId: string) {
  return ApiHelper.get(
    `${process.env.URL}/api/v1/admit-card/student/${studentId}`,
  );
}

// 🔹 4. Get Single Admit Card
export function GetAdmitCardById(id: string) {
  return ApiHelper.get(
    `${process.env.URL}/api/v1/admit-card/${id}`,
  );
}

// 🔹 5. Delete Admit Card By ID
export function DeleteAdmitCard(admitCardId: string) {
  return ApiHelper.delete(
    `${process.env.URL}/api/v1/admit-card/delete/${admitCardId}`,
  );
}