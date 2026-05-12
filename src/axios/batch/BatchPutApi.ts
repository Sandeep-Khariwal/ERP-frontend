import ApiHelper from "../../ApiHelper";


export function DeleteTheBatch(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/batch/deleteBatch/${id}`, {})
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function EditTheBatchName(id: string, name: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/batch/editBatchName/${id}`, { name })
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function SetPassoutBatch(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/batch/setPassout/${id}`,
      {}
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function PromoteBatch(
  currentBatchId: string,
  nextBatchId: string
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/batch/promoteTo/${currentBatchId}/${nextBatchId}`, {},
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function PutLeaveMethod(
  leaveId: string,
  isDecline: boolean
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/batch/updateLeave/${leaveId}?isDecline=${isDecline}`,
      {}
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
