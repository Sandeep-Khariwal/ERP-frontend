import ApiHelper from "../../ApiHelper";


export function GetAllSubscriptionPlans() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/shikshapay/subscription/getAll`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}