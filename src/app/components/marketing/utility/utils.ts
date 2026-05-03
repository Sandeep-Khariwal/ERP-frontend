// import { LeadScore, LeadStatus, LeadSource } from "@/types";

import { LeadScore, LeadSource, LeadStatus } from "@/types";

// ─── Lead Score ───────────────────────────────────────────────────

export const scoreColor: Record<LeadScore, string> = {
  hot:      "red",
  warm:     "orange",
  cold:     "blue",
  unscored: "gray",
};

export const scoreLabel: Record<LeadScore, string> = {
  hot:      "Hot",
  warm:     "Warm",
  cold:     "Cold",
  unscored: "Unscored",
};

// ─── Lead Status ──────────────────────────────────────────────────

export const statusColor: Record<LeadStatus, string> = {
  new:       "blue",
  contacted: "violet",
  qualified: "teal",
  follow_up: "yellow",
  converted: "green",
  lost:      "red",
};

export const statusLabel: Record<LeadStatus, string> = {
  new:       "New",
  contacted: "Contacted",
  qualified: "Qualified",
  follow_up: "Follow Up",
  converted: "Converted",
  lost:      "Lost",
};

// ─── Lead Source ──────────────────────────────────────────────────

export const sourceLabel: Record<LeadSource, string> = {
  google:       "Google Ads",
  facebook:     "Facebook",
  instagram:    "Instagram",
  whatsapp:     "WhatsApp",
  landing_page: "Landing Page",
  telecalling:  "Telecalling",
  other:        "Other",
};

export const sourceColor: Record<LeadSource, string> = {
  google:       "yellow",
  facebook:     "blue",
  instagram:    "pink",
  whatsapp:     "green",
  landing_page: "violet",
  telecalling:  "orange",
  other:        "gray",
};

// ─── Date formatting ──────────────────────────────────────────────

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
    timeZone: "UTC",
  });
};

export const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day:    "2-digit",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  });
};

export const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days > 0)  return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0)  return `${mins}m ago`;
  return "Just now";
};

// ─── Initials avatar ──────────────────────────────────────────────

export const getInitials = (name?: string): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
};