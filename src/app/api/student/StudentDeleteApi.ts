import ApiHelper from "../ApiHelper";

export function RemoveStudentFromBatch(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `${process.env.URL}/api/v1/student/removeStudentFromBatch/${id}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}