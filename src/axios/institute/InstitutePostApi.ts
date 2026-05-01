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
      { batchId: data.batchId, installments: data.installments, type: data.type  }
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


export function CreateExamMarksheet(data: {
  name: string;
  batch: string;
  student: string;
  marks: {
    subjectName: string;
    theory_marks: number;
    practical_marks: number;
    obtained_marks: number;
    grade: string;
  }[];
  date: Date;
  totalMarks: number;
  percentage: number;
  overallGrade: string;
  status: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/marksheet/create`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export async function CreateExamMarksheetForExcel(data: {
  name: string;
  batch: string;
  student: string;
  marks: {
    subjectName: string;
    theory_marks: number;
    practical_marks: number;
    obtained_marks: number;
    grade: string;
  }[];
  date: Date;
  totalMarks: number;
  percentage: number;
  overallGrade: string;
  status: string;
}[]) {

  const allPromises = data.map((payload) =>
    CreateExamMarksheet(payload)
  );

  return Promise.all(allPromises);

}


export function Uploadlogo(data: FormData,  instituteId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/v1/admin/uploadLogo/${instituteId}`,data) 
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function UploadSignature(data: FormData,  instituteId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/v1/admin/uploadSignatute/${instituteId}`,data) 
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}