import ApiHelper from "../../ApiHelper";



export function GetBatchOptionalSubjects(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getOptionalSubjects/${id}`)
      .then((response:any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetBatchFee(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getBatchFee/${id}`)
      .then((response:any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetAllStudentsFromBatch(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getStudentsFromBatch/${id}`)
      .then((response:any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetAllTeachersFromBatch(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getTeachersFromBatch/${id}`)
      .then((response:any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetStudent(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getStudent/${id}`)
      .then((response:any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetStudentFeeRecords(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getStudent/${id}`)
      .then((response:any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetInstituteOverview(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getInstituteOverview/${id}`)
      .then((response:any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetAdminByGmail(gmail:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/admin/getAdminByGmail/${gmail}`)
      .then((response:any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetInstituteSubjects(instituteId:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/subject/getAll?instituteId=${instituteId}`)
        .then((response:any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetReferalCode(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getCoupon/${id}`)
      .then((response:any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetBatAllMarksheet(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/marksheet/batchAll/${id}`)
      .then((response:any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}