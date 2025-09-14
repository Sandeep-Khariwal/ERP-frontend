import ApiHelper from "@/ApiHelper";

export function CreateVan(data: {
  institute: string;
  plateNumber: string;
  vanNumber: number;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/van/create`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function CreateDriver(data: {
  institute: string;
  name: string;
  address: string;
  phone: string;
  van: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/driver/create`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetAllVans(instituteId:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/van/all/${instituteId}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetAllDrivers(instituteId:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/driver/all/${instituteId}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
