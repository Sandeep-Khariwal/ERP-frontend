import ApiHelper from "../ApiHelper";

export function GetBatchOverview(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/batch/getBatchOverview/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}