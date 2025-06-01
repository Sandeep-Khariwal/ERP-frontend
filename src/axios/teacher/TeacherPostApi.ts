import ApiHelper from "../../ApiHelper";


export function CreateTeacher(data: {
    name:string,
    phone:string,
    email:string,
    password:string,
    institute:string,
    selectedBatches:string[]
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/v1/teacher/create/${data.institute}`,data
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function TeacherLogin(data:{
  email:string,
  password:string,
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/teacher/login`,data)
      .then((response) => resolve(response))
      .catch((error:any) => reject(error));
  });
}
export function StudentLogin(data:{
  email:string,
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/student/login`,data)
      .then((response) => resolve(response))
      .catch((error:any) => reject(error));
  });
}
export function StudentOtpVarification(data:{
  studentId:string,
  otp:string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/student/varify`,data)
      .then((response) => resolve(response))
      .catch((error:any) => reject(error));
  });
}
export function PayTeacherSallery(data:{
  teacherId: string;
  instituteId: string;
  month: string;
  salleryMode: string;
  baseSalary: number;
  pf: number;
  netSalary: number;
  amountPaid: number;
  salleryDate?: Date;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/teacher/createSallery`,{sallery:data})
      .then((response) => resolve(response))
      .catch((error:any) => reject(error));
  });
}