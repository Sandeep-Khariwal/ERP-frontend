import ApiHelper from "../ApiHelper";

export function GetBatchOptionalSubjects(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getOptionalSubjects/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetBatchFee(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getBatchFee/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetAllStudentsFromBatch(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getStudentsFromBatch/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetStudent(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getStudent/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetStudentFeeRecords(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getStudent/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetInstituteOverview(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getInstituteOverview/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}