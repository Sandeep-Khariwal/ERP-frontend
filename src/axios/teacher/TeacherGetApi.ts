import ApiHelper from "../../ApiHelper";


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