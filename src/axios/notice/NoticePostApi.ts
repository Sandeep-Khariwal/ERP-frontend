import ApiHelper from "../../ApiHelper";

export function CreateNotice(data: {
  title: string;
  noticeType: string;
  description: string;
  fromDate: Date;
  toDate: Date | null;
  institute: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/notice/create`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
