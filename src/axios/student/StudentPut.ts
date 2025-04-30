import { FeeRecordData } from "@/app/components/institute/student/fees/FeeRecord";
import ApiHelper from "../../ApiHelper";


export function UpdateMultipleFeeRecord(
  installments: Map<string, FeeRecordData>
) {
  const promises = Array.from(installments.entries()).map(([id, data]) => {
    return UpdateFeeRecord(id, data);
  });

  return Promise.all(promises)
    .then((responses) => {
      return { success: true, responses };
    })
    .catch((error) => {
      return { success: false, error: error.message };
    });
}
export function UpdateFeeRecord(id: string, data: FeeRecordData) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/student/updateFeeRecord/${id}`,data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function AddStudentRollNumber(id: string, data:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/student/addStudentRollNumber/${id}`,{rollNo:data})
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export async function UpdateStudentAttendance(data: {
  studentId: string;
  date: Date | null;
  currentAttendanceStatus: string;
}) {
  return ApiHelper.put(`${process.env.URL}/api/v1/instituteStudent/update/attendance`, {
    studentId: data.studentId,
    date: data.date,
    currentAttendanceStatus: data.currentAttendanceStatus,
  });
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
      }
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
