

// ─── WhatsApp Integrations ────────────────────────────────────────

import ApiHelper from "@/ApiHelper";
import { Conversation, LeadsResponse, WhatsAppConnection } from "@/types";

/** Fetch all connected WhatsApp numbers */
export function fetchWaConnections(): Promise<WhatsAppConnection[]> {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/oauth/whatsapp/connections`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

/** Connect a new WhatsApp Business number */
export function connectWhatsApp(data: {
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
}): Promise<WhatsAppConnection> {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/v1/oauth/whatsapp/connect`,
      data
    )
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

/** Disconnect a WhatsApp number */
export function disconnectWhatsApp(
  phoneNumberId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `${process.env.URL}/api/v1/oauth/whatsapp/disconnect/${phoneNumberId}`
    )
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

/** Send WhatsApp message */
export function sendWaMessage(data: {
  leadId: string;
  toPhone: string;
  message: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `${process.env.URL}/api/v1/oauth/whatsapp/send`,
      data
    )
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

/** Fetch conversation */
export function fetchConversation(
  leadId: string
): Promise<Conversation> {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/oauth/whatsapp/conversation/${leadId}`
    )
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

/** Fetch WhatsApp leads */
export function fetchWaLeads(
  page = 1,
  limit = 20
): Promise<LeadsResponse> {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/oauth/whatsapp/leads?page=${page}&limit=${limit}`
    )
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}