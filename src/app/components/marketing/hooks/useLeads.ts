"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchLeads,
  fetchLeadStats,
  fetchLeadById,
  FetchConnectedPages,
} from "@/axios/marketing/meta";

import { Lead, LeadFilters, LeadsResponse, LeadStats, MetaPage } from "@/types";
// import { fetchLeads } from "@/axios/marketing/meta";

// ─── useLeads ─────────────────────────────────────────────────────

export function useLeads(filters: Partial<LeadFilters>) {
  const [data, setData] = useState<LeadsResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    fetchLeads(filters)
      .then((res: any) => {
        console.log("leads resp : ", res);

        setData({ leads: res.leads, pagination: res.pagination });
        setLoading(false);
      })
      .catch((e: any) => {
        setError(e.message);
        setLoading(false);
      });
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

// ─── useLeadStats ─────────────────────────────────────────────────

export function useLeadStats() {
  const [stats, setStats] = useState<LeadStats | null>(null);
 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);

    fetchLeadStats()
      .then((res: any) => {
         console.log("stats res : ", res);
        setStats(res.stats);
        setLoading(false);
      })
      .catch((e: any) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, loading, error, refetch: load };
}

// ─── useLeadDetail ────────────────────────────────────────────────

export function useLeadDetail(id: string | null) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetchLeadById(id)
      .then((res: any) => {
        setLead(res.lead);
        setLoading(false);
      })
      .catch((e: any) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { lead, loading, error, refetch: load };
}

// ─── useMetaPages ─────────────────────────────────────────────────

export function useMetaPages() {
  const [pages, setPages] = useState<MetaPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    FetchConnectedPages()
      .then((res: any) => {
        setPages(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(e.message);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { pages, loading, error, refetch: load };
}
