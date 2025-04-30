import ApiHelper from "../../ApiHelper";


export function UpdateStudent(
  studentId: string,
  data: { batchId: string; dateOfJoining: Date; optionalSubjects: string[] }
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/institute/updateStudent/${studentId}`,
      data
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function UpdateStudentBasicInfo(
  studentId: string,
  data: any
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/institute/updateStudentBasicInfo/${studentId}`,
      data
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
