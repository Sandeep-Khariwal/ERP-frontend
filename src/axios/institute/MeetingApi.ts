import ApiHelper from "../../ApiHelper";
import { Meeting, ScheduleMeetingForm } from "@/app/components/meeting/meeting.types";

// ─── MEETINGS ─────────────────────────────────────────

export function CreateMeeting(data: ScheduleMeetingForm) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/meeting/create`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetMeeting(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/meeting/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetMeetingByCode(code: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/meeting/code/${code}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetTeacherMeetings(teacherId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/meeting/teacher/${teacherId}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetClassMeetings(classId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/meeting/class/${classId}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetUpcomingMeetings(classId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/meeting/class/${classId}/upcoming`
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function UpdateMeeting(
  id: string,
  data: Partial<ScheduleMeetingForm>
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/meeting/${id}`, data)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function CancelMeeting(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(`${process.env.URL}/api/v1/meeting/${id}`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// ─── SESSION ──────────────────────────────────────────

export function StartMeeting(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.patch(`${process.env.URL}/api/v1/meeting/${id}/start`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function EndMeeting(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.patch(`${process.env.URL}/api/v1/meeting/${id}/end`)
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// ─── PARTICIPANTS ─────────────────────────────────────

export function JoinMeeting(data: {
  id: string;
  userId: string;
  name: string;
  role: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/v1/meeting/${data.id}/join`,
      {
        userId: data.userId,
        name: data.name,
        role: data.role,
      }
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function LeaveMeeting(data: {
  id: string;
  userId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/v1/meeting/${data.id}/leave`,
      {
        userId: data.userId,
      }
    )
      .then((response) => resolve(response))
      .catch((error: any) => reject(error));
  });
}