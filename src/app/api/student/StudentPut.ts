import { FeeRecordData } from "@/app/components/institute/student/fees/FeeRecord";
import ApiHelper from "../ApiHelper";

export function UpdateMultipleFeeRecord(
  installments: Map<string, FeeRecordData>
) {
  const promises = Array.from(installments.entries()).map(([id, data]) => {
    return UpdateFeeRecord(id, data);
  });

  return Promise.all(promises)
    .then((responses) => {
      return { success: true, responses };
    })
    .catch((error) => {
      return { success: false, error: error.message };
    });
}
export function UpdateFeeRecord(id: string, data: FeeRecordData) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/student/updateFeeRecord/${id}`,data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
