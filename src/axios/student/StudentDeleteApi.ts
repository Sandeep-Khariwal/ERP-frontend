import ApiHelper from "../../ApiHelper";


export function RemoveStudentFromBatch(studentId: string, batchId:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/student/removeStudentFromBatch/${batchId}`,{studentId:studentId}
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}