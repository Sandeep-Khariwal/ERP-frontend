import ApiHelper from "../../ApiHelper";
import { dedupeInFlightRequest } from "../requestDedupe";


export function GetAllNotice(id:string) {
  return dedupeInFlightRequest(`institute-notices:${id}`, () => {
    return new Promise((resolve, reject) => {
      ApiHelper.get(
        `${process.env.URL}/api/v1/notice/all/${id}`
      )
        .then((response) => resolve(response))
        .catch((error: any) => reject(error));
    });
  }, 0);
}