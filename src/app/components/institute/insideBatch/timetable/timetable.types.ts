export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

export type ManagementReason =
  | "Teacher Absent"
  | "Emergency Leave"
  | "Medical Leave"
  | "Meeting"
  | "Training"
  | "Other";

export const MANAGEMENT_REASONS: ManagementReason[] = [
  "Teacher Absent",
  "Emergency Leave",
  "Medical Leave",
  "Meeting",
  "Training",
  "Other",
];

export interface Timetable {
  _id: string;
  batchId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room?: string;
  isActive: boolean;
  // populated fields (optional, depends on backend populate)
  batchName?: string;
  subjectName?: string;
  teacherName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassManagement {
  _id: string;
  timetableId: string;
  batchId: string;
  subjectId: string;
  originalTeacherId: string;
  substituteTeacherId: string;
  managementDate: string;
  reason: ManagementReason;
  notes?: string;
  managedBy: string;
  status: "Managed Successfully" | "Pending" | "Cancelled";
  // populated
  originalTeacherName?: string;
  substituteTeacherName?: string;
  subjectName?: string;
  batchName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Teacher {
  _id: string;
  name: string;
  email?: string;
  isActive: boolean;
}

export interface Subject {
  _id: string;
  name: string;
}

export interface Batch {
  _id: string;
  name: string;
}
