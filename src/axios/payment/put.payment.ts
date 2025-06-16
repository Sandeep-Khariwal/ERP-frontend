import ApiHelper from "@/ApiHelper";

export function UpdateSubscription(adminId:string, expireDate:Date) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/payment/updateInstituteSubscription/${adminId}`,{ expireDate:expireDate })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}