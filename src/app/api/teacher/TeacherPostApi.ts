import ApiHelper from "../ApiHelper";

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