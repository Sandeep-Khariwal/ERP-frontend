import ApiHelper from "@/ApiHelper";

export function UpdateSubscription(adminId:string, subscrriptionId:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/payment/updateInstituteSubscription/${adminId}`,{ subscrriptionId:subscrriptionId })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}