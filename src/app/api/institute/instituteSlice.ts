import ApiHelper from "../ApiHelper";


export function CreateInstitute(data:{
  name:string,
  Address:string,
  email:string,
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/institute/create`,data)
      .then((response) => resolve(response))
      .catch((error:any) => reject(error));
  });
}