import ApiHelper from "../../ApiHelper";


export function UpdateStudent(
  studentId: string,
  data: { batchId: string; dateOfJoining: Date; optionalSubjects: string[], van: string }
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
export function UpdateGpsInfo(
  instituteId: string,
  data: { gpsUrl: string; gpsToken: string }
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/institute/updateGpsInfo/${instituteId}`,
      data
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function DeleteSubject(subjectId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `${process.env.URL}/api/v1/subject/delete/${subjectId}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}


export function updateschooldetails(
  instituteId: string,
  data: { name: string; email: string; PhoneNumber: string; address: string }
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/institute/updateInstitute/${instituteId}`,
      data
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}