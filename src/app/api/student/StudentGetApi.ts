import ApiHelper from "../ApiHelper";

export function GetStudentFeeInstallments(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/student/getStudentFeeInstallments/${id}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetStudentForPdf(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/student/getStudentForPdf/${id}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
