import { CreateClassManagementPayload } from "@/interfaces/class-management";
import ApiHelper from "../../ApiHelper";
import { ManagementReason } from "@/app/components/institute/insideBatch/timetable/timetable.types";


export interface CreateManagementPayload {
  timetableId: string;
  substituteTeacherId: string;
  managementDate: string; // ISO date string
  reason: ManagementReason;
  notes?: string;
  managedBy: string;
}

export interface BulkManagementPayload {
  timetableId: string;
  substituteTeacherId: string;
  startDate: string;
  endDate: string;
  reason: ManagementReason;
  notes?: string;
  managedBy: string;
}


// Create Class Management
export function CreateClassManagement(
  data: CreateManagementPayload
) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/class-management`,
      data
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// Bulk Create Class Management
export function BulkCreateClassManagement(
  data: BulkManagementPayload
) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/class-management/bulk`,
      data
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// Get Free Teachers
export function GetFreeTeachers(query: {
  timetableId: string;
  date: string;
  allTeacherIds?: string[];
}) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();

    if (query.timetableId)
      params.append("timetableId", query.timetableId);

    if (query.date)
      params.append("date", query.date);

    if (query.allTeacherIds?.length) {
      query.allTeacherIds.forEach((id) =>
        params.append("allTeacherIds", id)
      );
    }

    ApiHelper.get(
      `${process.env.URL}/api/class-management/free-teachers?${params.toString()}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// Get All Class Management
export function GetAllClassManagement(filters?: {
  batchId?: string;
  timetableId?: string;
  originalTeacherId?: string;
  substituteTeacherId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();

    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    ApiHelper.get(
      `${process.env.URL}/api/class-management?${params.toString()}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// Get By Id
export function GetClassManagementById(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/class-management/${id}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// Update Class Management
export function UpdateClassManagement(
  id: string,
  data: Partial<CreateClassManagementPayload>
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `${process.env.URL}/api/class-management/${id}`,
      data
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// Cancel Class Management
export function CancelClassManagement(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `${process.env.URL}/api/class-management/${id}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}