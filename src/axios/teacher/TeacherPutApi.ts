import ApiHelper from "@/ApiHelper";

export function UpdateTeacher(
  teacherId: string,
  data: {
    name: string;
    phoneNumber: string;
    subjects: string[];
  }
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/teacher/update/${teacherId}`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function RemoveTeacherFromBatch(
  teacherId: string,
  batchId: string,
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/teacher/removeTeacherfromBatch/${teacherId}`, {batchId:batchId})
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function DeleteTeacher(
  teacherId: string,
) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(`${process.env.URL}/api/v1/teacher/delete/${teacherId}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
