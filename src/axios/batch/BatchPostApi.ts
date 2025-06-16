import { AttendanceInterface } from "@/interface/student.interface";
import ApiHelper from "../../ApiHelper";


export function CreateAttendance(batchId: string, data: AttendanceInterface[]) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/batch/updateAttendance/${batchId}`,
      data.map((a)=>{return{...a,date: new Date(a.date).toISOString()}})
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetAttendanceOnDate(batchId: string, data: Date) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/batch/getAttendanceOnDate/${batchId}?date=${data}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function CreateTest(data: {
  batchId: string;
  maxNumber: number;
  subjectId: string;
  testName: string;
  marks: { studentId: string; name: string; marks: number }[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/batch/createTest`, { data })
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
