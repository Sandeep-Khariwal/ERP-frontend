import ApiHelper from "../../ApiHelper";

export function CreateDriver(data: any) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/driver/create`, { data })
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetAllDrivers(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/driver/all/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetAllInstituteVans(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/van/all/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function CreateVan(data: {
  vanNumber: number;
  plateNumber: string;
  institute: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/van/create`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
