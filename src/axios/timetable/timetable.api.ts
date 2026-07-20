
import { DayOfWeek } from "@/app/components/institute/insideBatch/timetable/timetable.types";
import ApiHelper from "../../ApiHelper";
export interface CreateTimetablePayload {
  batchId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room?: string;
}

// Create Timetable
export function CreateTimetable(
  data: CreateTimetablePayload
) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/v1/timetable/create`,
      data
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// Get All Timetables
export function GetAllTimetables(filters?: {
  batchId?: string;
  teacherId?: string;
  dayOfWeek?: string;
}) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();

    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    ApiHelper.get(
      `${process.env.URL}/api/v1/timetable?${params.toString()}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// Get Timetable By Id
export function GetTimetableById(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/timetable/${id}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// Get Batch Grid
export function GetBatchGrid(batchId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/timetable/batch/${batchId}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}


// Update Timetable
// export function UpdateTimetable(
//   id: string,
//   data: Partial<CreateTimetablePayload>
// ) {
//   return new Promise((resolve, reject) => {
//     ApiHelper.patch(
//       `${process.env.URL}/api/timetable/${id}`,
//       data
//     )
//       .then((response) => resolve(response))
//       .catch((error: any) => reject(error));
//   });
// }

export function UpdateTimetable(
  id: string,
  data: Partial<CreateTimetablePayload>
) {
  return new Promise((resolve, reject) => {
    ApiHelper.patch(
      `${process.env.URL}/api/v1/timetable/update/${id}`,  
      data
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// Delete Timetable
export function DeleteTimetable(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `${process.env.URL}/api/v1/timetable/delete/${id}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}