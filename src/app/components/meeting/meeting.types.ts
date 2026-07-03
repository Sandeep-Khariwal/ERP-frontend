export type MeetingStatus = "scheduled" | "live" | "ended" | "cancelled";
export type UserRole = "teacher" | "student" | "admin";
export type MessageType = "text" | "question" | "answer";

export interface Participant {
  userId: string;
  name: string;
  role: UserRole;
  joinedAt?: string;
  leftAt?: string;
}

export interface ChatMessage {
  _id?: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  type: MessageType;
  replyTo?: string;
  timestamp: string;
}

export interface PollOption {
  label: string;
  index: number;
}

export interface Poll {
  _id: string;
  question: string;
  options: string[];
  votes: Record<string, number>;
  voters: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Meeting {
  _id: string;
  title: string;
  description?: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  scheduledAt: string;
  duration: number;
  meetingCode: string;
  status: MeetingStatus;
  participants: Participant[];
  chat: ChatMessage[];
  polls: Poll[];
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleMeetingForm {
  title: string;
  description: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  scheduledAt: Date | null;
  duration: number;
}

export interface CreatePollForm {
  question: string;
  options: string[];
}
