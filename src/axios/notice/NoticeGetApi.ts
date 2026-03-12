import ApiHelper from "../../ApiHelper";


export function GetAllNotice(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/notice/all/${id}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}