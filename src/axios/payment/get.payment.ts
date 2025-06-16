import ApiHelper from "@/ApiHelper";

export function GetKey() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/payment/getKey`)
      .then((response) => resolve(response))
      .catch((error:any) => reject(error));
  });
}