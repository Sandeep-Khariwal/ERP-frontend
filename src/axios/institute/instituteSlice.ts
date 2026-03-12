import { FeeOptions, Installment } from "@/interfaces/batchInterface";
import ApiHelper from "../../ApiHelper";

export function CreateInstitute(data: {
  name: string;
  address: string;
  email: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`http://localhost:8080/api/v1/institute/create`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetAccountByToken() {
  
    console.log("process.env.URL in api : ",process.env.URL);
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getAccountByToken`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
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
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/institute/getBatches/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
