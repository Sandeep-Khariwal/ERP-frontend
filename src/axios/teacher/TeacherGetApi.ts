import ApiHelper from "../../ApiHelper";
import { dedupeInFlightRequest } from "../requestDedupe";

export function GetTeachersAllBatches(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/teacher/getAllBatches/${id}`)
      .then((response) => resolve(response))
      .catch((error:any) => reject(error));
  });
}
export function GetAllTeacherStaff(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/teacher/getAllTeacherStaff/${id}`)
      .then((response) => resolve(response))
      .catch((error:any) => reject(error));
  });
}
export function GetTeacherById(id:string) {
  // Fires on every teacher-row click (fresh mount of TeacherProfile) —
  // same dedupe pattern as GetStudentOverview / GetBatchOverview.
  return dedupeInFlightRequest(`teacher-by-id:${id}`, () => {
    return new Promise((resolve, reject) => {
      ApiHelper.get(`${process.env.URL}/api/v1/teacher/${id}`)
        .then((response) => resolve(response))
        .catch((error:any) => reject(error));
    });
  });
}
export function GetTeacherPaymentHistory(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/teacher/getPaymentHistory/${id}`)
      .then((response) => resolve(response))
      .catch((error:any) => reject(error));
  });
}