export type ClassManagementReason =
  | "Teacher Absent"
  | "Emergency Leave"
  | "Medical Leave"
  | "Meeting"
  | "Training"
  | "Other";

export type ClassManagementStatus = "Managed" | "Cancelled" | "Rescheduled";

export interface TeacherLite {
  _id: string;
  name: string;
  email?: string;
}

export interface BatchLite {
  _id: string;
  name: string;
}

export interface ClassManagement {
  _id: string;
  timetableId?: string;
  batchId: BatchLite | string;
  subjectId?: string;
  originalTeacherId: TeacherLite | string;
  substituteTeacherId: TeacherLite | string;
  managementDate: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  reason: ClassManagementReason;
  notes?: string;
  status: ClassManagementStatus;
  managedBy: TeacherLite | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClassManagementPayload {
  timetableId?: string;
  batchId?: string;
  subjectId?: string;
  originalTeacherId: string;
  substituteTeacherId: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  reason: ClassManagementReason;
  notes?: string;
  managedBy?: string;
}

export interface UpdateClassManagementPayload {
  substituteTeacherId?: string;
  reason?: ClassManagementReason;
  notes?: string;
  status?: ClassManagementStatus;
}

export interface ListClassManagementParams {
  batchId?: string;
  teacherId?: string;
  status?: ClassManagementStatus;
  reason?: ClassManagementReason;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface FreeTeachersQuery {
  date: string;
  startTime: string;
  endTime: string;
  batchId?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
