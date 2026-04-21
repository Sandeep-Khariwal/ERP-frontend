// ─── Enums matching backend exactly ───────────────────────────────

export type LeadSource =
  | "google"
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "landing_page"
  | "telecalling"
  | "other";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "follow_up"
  | "converted"
  | "lost";

export type LeadScore = "hot" | "warm" | "cold" | "unscored";

export type CallOutcome =
  | "answered"
  | "no_answer"
  | "callback_requested"
  | "not_interested";

// ─── Sub-documents ────────────────────────────────────────────────

export interface Note {
  text: string;
  addedBy?: string;
  addedAt: string;
}

export interface CallLog {
  calledBy?: string;
  calledAt: string;
  outcome: CallOutcome;
  durationSeconds?: number;
  note?: string;
}

// ─── Main Lead type ───────────────────────────────────────────────

export interface Lead {
  _id: string;
  instituteId: string;

  name?: string;
  phone: string;
  email?: string;
  city?: string;

  source?: LeadSource;
  metaPageId?: string;
  sourceCampaignId?: string;
  sourceFormId?: string;
  sourceAdId?: string;

  courseInterest?: string;
  message?: string;

  status: LeadStatus;
  leadScore: LeadScore;

  assignedTo?: string;
  lastContactedAt?: string;

  chatbotState?: "not_started" | "in_progress" | "completed" | "opted_out";

  notes: Note[];
  callLogs: CallLog[];

  createdAt: string;
  updatedAt: string;
}

// ─── API Response shapes ──────────────────────────────────────────

export interface PaginationType {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: PaginationType;
}

export interface LeadStats {
  total: number;
  recentCount: number;
  byStatus: {_id:string,count:number}[];
  byScore: {_id:string,count:number}[];
  bySource: {_id:string,count:number}[];
}

// ─── Meta Integration ─────────────────────────────────────────────

export interface MetaPage {
  _id: string;
  pageId: string;
  pageName: string;
  pageCategory?: string;
  connectedAt: string;
  totalLeadsReceived: number;
  lastLeadAt?: string;
  tokenExpiresAt?: string;
}

// ─── Filters ─────────────────────────────────────────────────────

export interface LeadFilters {
  source?: LeadSource | "";
  status?: LeadStatus | "";
  leadScore?: LeadScore | "";
  assignedTo?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}