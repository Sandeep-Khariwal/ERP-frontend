import ApiHelper from "../../ApiHelper";



export function GetBatchOptionalSubjects(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getOptionalSubjects/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetBatchFee(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getBatchFee/${id}`)
      .then((response: any) => {

  console.log("GET BATCH FEE RESPONSE :", response);

  resolve(response);

})
      .catch((error: any) => reject(error));
  });
}
export function GetAllStudentsFromBatch(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getStudentsFromBatch/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetAllTeachersFromBatch(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getTeachersFromBatch/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetStudent(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getStudent/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetStudentMarksheets(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/marksheet/student/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetStudentFeeRecords(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getStudent/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetInstituteOverview(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getInstituteOverview/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetAdminByGmail(gmail: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/admin/getAdminByGmail/${gmail}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetInstituteSubjects() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/subject/getAll`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetReferalCode(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getCoupon/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetBatAllMarksheet(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/marksheet/batchAll/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetMidExamMarksheet(id: string,studentId:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/marksheet/midSemMarksheet/${id}/${studentId}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetAllEarnings(instituteId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/earnings/${instituteId}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetStudentDetail(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/student/getStudentForIdCard/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetMarksheetVerify(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/marksheet/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetPassout(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getPassoutStudents/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetAllDiary(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/diary/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}


export function GetStudentsPendingFee(
  address: string,
  studentName: string,
  phoneNumber: string,
  batchId: string,
  instituteId: string
) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/student/getStudentsPendingFee?phoneNumber=${phoneNumber}&instituteId=${instituteId}&batchId=${batchId}&address=${address}&studentName=${studentName}`
    )
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetAllNotes(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/batch/notes/${id}`
    )
      .then((response: any) => {
        console.log("SUCCESS :", response);
        resolve(response);
      })
      .catch((error: any) => {
        console.log("ERROR :", error?.response);
        reject(error);
      });
  });
}



export function GetGallery(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/batch/gallery/${id}`
    )
      .then((response: any) => {
        console.log("GET GALLERY SUCCESS :", response);
        resolve(response);
      })
      .catch((error: any) => {
        console.log("GET GALLERY ERROR :", error?.response);
        reject(error);
      });
  });
}


export function GetExamination(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/batch/examination/${id}`
    )
      .then((response: any) => {
        console.log("GET EXAMINATION SUCCESS :", response);
        resolve(response);
      })
      .catch((error: any) => {
        console.log("GET EXAMINATION ERROR :", error?.response);
        reject(error);
      });
  });
}

export function GetTimeTable(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/batch/timeTable/${id}`
    )
      .then((response: any) => {
        console.log("GET TIMETABLE SUCCESS :", response);
        resolve(response);
      })
      .catch((error: any) => {
        console.log("GET TIMETABLE ERROR :", error?.response);
        reject(error);
      });
  });
}


export function GetDayWiseEarnings(
  instituteId: string,
  from: string,
  to: string
) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/institute/filterCollection/${instituteId}?from=${from}&to=${to}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}