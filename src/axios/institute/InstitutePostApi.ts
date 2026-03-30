import { Installment, StudentPayload } from "@/interfaces/batchInterface";
import ApiHelper from "../../ApiHelper";

export function CreateStudent(studentPayload: StudentPayload) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/institute/createStudent`, {
      studentData: studentPayload,
    })
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function CreateStudentFeeRecords(data: {
  batchId: string;
  studentId: string;
  type: string;
  installments: Installment[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/v1/institute/createStudentFeeRecords/${data.studentId}`,
      { batchId: data.batchId, installments: data.installments, type: data.type }
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function AddGps(data: {
  gpsToken: string;
  gpsUrl: string; 
  institute: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/institute/gps/${data.institute}`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function AddSubjects(data: {
   _id: string;
  value: string;
  label: string;
  instituteId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/subject/createorupdate`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
