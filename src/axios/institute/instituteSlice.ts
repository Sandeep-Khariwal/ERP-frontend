import { FeeOptions, Installment } from "@/interfaces/batchInterface";
import ApiHelper from "../../ApiHelper";
import { dedupeInFlightRequest } from "../requestDedupe";

export function CreateInstitute(data: {
  name: string;
  address: string;
  email: string;
  phone: string;
}) {
 
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/institute/create`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

let accountByTokenInFlight: Promise<any> | null = null;

export function GetAccountByToken() {
  // If a call is already in flight (e.g. SessionRestore and this page's own
  // effect both firing on mount), share that same request instead of
  // issuing a second identical one. Each caller still gets the response
  // and runs its own .then()/.catch() exactly as before — this only
  // dedupes the network call itself.
  if (accountByTokenInFlight) return accountByTokenInFlight;

  accountByTokenInFlight = new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getAccountByToken`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error))
      .finally(() => {
        // Clear shortly after settling so a later navigation/refresh still
        // gets a fresh request rather than a stale cached one.
        setTimeout(() => {
          accountByTokenInFlight = null;
        }, 1500);
      });
  });

  return accountByTokenInFlight;
}

export function CreateBatchAndSubjects(data: {
  batchName: string;
  instituteId: string;
  subjects: string[];
  optionalSubjects: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/v1/institute/createBatchAndSubjects/${data.instituteId}`,
      data
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function EditBatchAndSubjects(id:string,data: {
  batchName: string;
  subjects: string[];
  optionalSubjects: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/v1/institute/editBatchAndSubjects/${id}`,
      data
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function CreateBatchFee(data: {
  installments: Installment[];
  batchId: string;
  feeType: FeeOptions;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/institute/createBatchFee`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetInstituteBatches(id:string) {
  // This exact same call is made independently by several components
  // (Dashboard, Students, Teachers, and a few modals) — sharing an
  // in-flight request here avoids firing it 2-3x when those mount
  // around the same time, without ever serving stale data (see
  // dedupeInFlightRequest for details).
  return dedupeInFlightRequest(`institute-batches:${id}`, () => {
    return new Promise((resolve, reject) => {
      ApiHelper.get(`${process.env.URL}/api/v1/institute/getBatches/${id}`)
        .then((response) => resolve(response))
        .catch((error: any) => reject(error));
    });
  });
}
