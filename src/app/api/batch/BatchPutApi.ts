
import ApiHelper from "../ApiHelper";

export function DeleteTheBatch(id:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/batch/deleteBatch/${id}`,{})
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function EditTheBatchName(id:string,name:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/batch/editBatchName/${id}`,{name})
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}