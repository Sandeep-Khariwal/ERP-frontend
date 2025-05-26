// CreateUser

import ApiHelper from "../../ApiHelper";

export function CreateUser(data: {
  name: string;
  phone: string;
  email: string;
  password: string;
  institute: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/v1/user/create/${data.institute}`,
      data
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function LoginUser(data: { email: string; password: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/user/login`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
