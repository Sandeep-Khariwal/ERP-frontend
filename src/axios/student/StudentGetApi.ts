import ApiHelper from "../../ApiHelper";

export function GetStudentFeeInstallments(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/student/getStudentFeeInstallments/${id}`,
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetStudentForPdf(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/student/getStudentForPdf/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function PayRecordWithNumber(
  id: string,
  data: {
    phoneNumber: string;
    fees: number;
    studentIds: string[];
  },
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/student/payWithNumber/${id}`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetStudentForIdCard(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/student/getStudentForIdCard/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetStudentOverview(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/student/getStudentOverview/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetStudentAttendance(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/student/getStudentAttendance/${id}`,
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetVanLiveLocation() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/student/getVanLocation`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}


// new funtion added  GetAllInstituteStudents,  GetStudentBatchHistory

export function GetAllInstituteStudents(
  batchId?: string,
  search?: string,
  page: number = 1,
  limit: number = 10,
) {
  return new Promise((resolve, reject) => {
    let url = `${process.env.URL}/api/v1/student/allByInstitute/me`;
    const params: string[] = [];
    if (batchId) params.push(`batchId=${encodeURIComponent(batchId)}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    params.push(`page=${page}`);   // NEW
    params.push(`limit=${limit}`); // NEW
    if (params.length) url += `?${params.join("&")}`;

    ApiHelper.get(url)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetStudentBatchHistory(studentId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/student/batchHistory/${studentId}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

