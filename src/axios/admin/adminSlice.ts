import ApiHelper from "../../ApiHelper";



export function CreateAdmin(data:{
  name:string,
  phone:string,
  email:string,
  password:string,
  institute:string
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/admin/create`,data)
      .then((response) => resolve(response))
      .catch((error:any) => reject(error));
  });
}
export function LoginAdmin(data:{
  email:string,
  password:string,
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/admin/login`,data)
      .then((response) => resolve(response))
      .catch((error:any) => reject(error));
  });
}


