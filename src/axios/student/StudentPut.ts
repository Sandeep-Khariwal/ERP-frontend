import { FeeRecordData } from "@/app/components/institute/student/fees/FeeRecord";
import ApiHelper from "../../ApiHelper";

export function UpdateMultipleFeeRecord(
  instituteId: string,
  installments: Map<string, FeeRecordData>,
  studentId: string,
  type?: "fee" | "vanfare",
  idempotencyKey?: string,
) {
  const entries = Array.from(installments.entries());
  const requestKey = idempotencyKey || crypto.randomUUID();
  if (entries.length === 0) {
    return Promise.resolve({ success: true, responses: [] });
  }

  const promises = entries.map(([id, data]) =>
    type === "vanfare"
      ? UpdateVanfare(id, instituteId, studentId, data, `${requestKey}:${id}`)
      : UpdateFeeRecord(
          id,
          instituteId,
          studentId,
          data,
          `${requestKey}:${id}`,
        ),
  );
  return Promise.all(promises)
    .then((responses) => {
      return { success: true, responses };
    })
    .catch((error) => {
      return { success: false, error: error.message };
    });
}
export function UpdateFeeRecord(
  id: string,
  instituteId: string,
  studentId: string,
  data: FeeRecordData,
  idempotencyKey?: string,
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/student/updateFeeRecord/${id}`, {
      data,
      instituteId,
      studentId,
      idempotencyKey,
    })
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function UpdateVanfare(
  id: string,
  instituteId: string,
  studentId: string,
  data: FeeRecordData,
  idempotencyKey?: string,
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/student/updateVanfare/${id}`,
      {
        data,
        instituteId,
        studentId,
        idempotencyKey,
      }
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function AddStudentRollNumber(id: string, data: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/student/addStudentRollNumber/${id}`,
      { rollNo: data },
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export async function UpdateStudentAttendance(data: {
  studentId: string;
  date: Date | null;
  currentAttendanceStatus: string;
}) {
  return ApiHelper.put(
    `${process.env.URL}/api/v1/instituteStudent/update/attendance`,
    {
      studentId: data.studentId,
      date: data.date,
      currentAttendanceStatus: data.currentAttendanceStatus,
    },
  );
}
export function insertNewAttendance(data: {
  date: Date;
  instituteClassId: string;
  attendance: any;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/v1/instituteClass/insertAttendance/${data.instituteClassId}`,
      {
        date: data.date,
        attendance: data.attendance,
      },
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function UploadStudentImage(file: File) {
  const formData = new FormData();
  formData.append("studentPhoto", file);

  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/student/image`, formData)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function DeletePendingFeeRecords(
  studentId: string,
  feeRecordIds: string[],
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/student/deletefeeRecords/${studentId}`,
      {
        feeRecordIds,
      }
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
  

// added new 2 function  AssignStudentBatch, UnassignStudentBatch

export function AssignStudentBatch(
  studentId: string,
  batchId: string,
  batchName: string,
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/student/assignBatch/${studentId}`,
      { batchId, batchName },
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function UnassignStudentBatch(
  studentId: string,
  batchId: string,
  batchName: string,
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/student/unassignBatch/${studentId}`,
      { batchId, batchName },
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}


// new bulk functions — AssignStudentBatchMultiple, UnassignStudentBatchMultiple

export function AssignStudentBatchMultiple(
  studentIds: string[],
  batchId: string,
  batchName: string,
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/student/assignBatchMultiple`,
      { studentIds, batchId, batchName },
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function UnassignStudentBatchMultiple(
  studentIds: string[],
  batchId: string,
  batchName: string,
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/student/removeBatchMultiple`,
      { studentIds, batchId, batchName },
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}