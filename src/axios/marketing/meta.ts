import {
  Lead,
  LeadFilters,
  LeadStats,
  MetaPage,
  LeadStatus,
  LeadScore,
  CallOutcome,
} from "@/types";
import { GetUserToken } from "../LocalStorageUtility";
import ApiHelper from "@/ApiHelper";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// ─── HTTP helper ──────────────────────────────────────────────────

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = GetUserToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "API error");
  return json.data as T;
}

// ─── Leads ────────────────────────────────────────────────────────

export async function fetchLeads(filters: Partial<LeadFilters>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.set(k, String(v));
  });
  console.log("leads params : ",params);
  
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/leads?${params}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export async function fetchLeadStats() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/leads/stats`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export async function fetchLeadById(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/leads/${id}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export async function createLead(data: {
  name?: string;
  phone: string;
  email?: string;
  city?: string;
  courseInterest?: string;
  message?: string;
  source: string;
  leadScore?: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/leads`, data)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export async function updateLead(
  id: string,
  data: {
    status?: LeadStatus;
    leadScore?: LeadScore;
    assignedTo?: string;
  },
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/leads/update/${id}`, data)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export async function addNote(leadId: string, text: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/leads/${leadId}/notes`, { text })
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export async function addCallLog(
  leadId: string,
  data: { outcome: CallOutcome; durationSeconds?: number; note?: string },
) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/leads/call-logs/${leadId}`, data)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// ─── Meta Integration ─────────────────────────────────────────────

export function FetchConnectedPages() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/oauth/meta/pages`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function GetMetaConnectUrl() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/oauth/meta/connect`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
export function DisconnectMetaPage(pageId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(`${process.env.URL}/api/v1/oauth/meta/pages/${pageId}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

