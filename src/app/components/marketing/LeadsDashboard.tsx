"use client";

import {
  Stack,
  Group,
  Title,
  Text,
  Button,
  SegmentedControl,
  Box,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useCallback } from "react";
import { IconPlus, IconTable, IconLayoutKanban } from "@tabler/icons-react";
import { useLeads, useLeadStats } from "./hooks/useLeads";
import { Lead, LeadFilters } from "@/types";
import { StatsCards } from "./StatsCards";
import { LeadFilterBar } from "./LeadFilterBar";
import { LeadTable } from "./LeadTable";
import { LeadDetailDrawer } from "./LeadDetailDrawer";
import { CreateLeadModal } from "./CreateLeadModal";

// import { StatsCards }      from "@/components/leads/StatsCards";
// import { LeadFilterBar }   from "@/components/leads/LeadFilterBar";
// import { LeadTable }       from "@/components/leads/LeadTable";
// import { LeadDetailDrawer } from "@/components/leads/LeadDetailDrawer";
// import { CreateLeadModal } from "@/components/leads/CreateLeadModal";

// import { useLeads, useLeadStats } from "@/hooks/useLeads";
// import { Lead, LeadFilters }      from "@/types";

const DEFAULT_FILTERS: Partial<LeadFilters> = {
  page:  1,
  limit: 20,
};

export default function LeadsPage() {
  // ── State ────────────────────────────────────────────────────────
  const [filters, setFilters]       = useState<Partial<LeadFilters>>(DEFAULT_FILTERS);
  const [selectedLead, setSelected] = useState<Lead | null>(null);

  const [drawerOpened,  { open: openDrawer,  close: closeDrawer  }] = useDisclosure(false);
  const [modalOpened,   { open: openModal,   close: closeModal   }] = useDisclosure(false);

  // ── Data ─────────────────────────────────────────────────────────
  const { stats, loading: statsLoading, refetch: refetchStats } = useLeadStats();
  const { data,  loading: leadsLoading, refetch: refetchLeads } = useLeads(filters);

  // ── Handlers ─────────────────────────────────────────────────────
  const handleView = useCallback((lead: Lead) => {
    setSelected(lead);
    openDrawer();
  }, [openDrawer]);

  const handleLeadUpdated = useCallback((updated: Lead) => {
    setSelected(updated);
    refetchLeads();
    refetchStats();
  }, [refetchLeads, refetchStats]);

  const handleLeadCreated = useCallback((lead: Lead) => {
    refetchLeads();
    refetchStats();
  }, [refetchLeads, refetchStats]);

  const handleFilterChange = useCallback((f: Partial<LeadFilters>) => {
    setFilters(f);
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  console.log("data?.pagination : ",stats,data);
  

  // ── Render ───────────────────────────────────────────────────────
  return (
    <Stack gap="lg"  w={"98%"} ml={10}>
      {/* Page header */}
      <Group justify="space-between" align="flex-end">
        <Box>
          <Title order={2} fw={800}>Lead Management</Title>
          <Text size="sm" c="dimmed" mt={2}>
            {data?.pagination.total ?? 0} leads total · All institutes isolated
          </Text>
        </Box>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openModal}
          radius="md"
        >
          Add Lead
        </Button>
      </Group>

      {/* Stats cards */}
      <StatsCards stats={stats} loading={statsLoading} />

      <Divider />

      {/* Filters */}
      <LeadFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Leads table */}
      <LeadTable
        leads={data?.leads ?? []}
        pagination={data?.pagination!!}
        loading={leadsLoading}
        page={filters.page ?? 1}
        limit={filters.limit ?? 20}
        onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
        onLimitChange={(l) => setFilters((f) => ({ ...f, limit: l, page: 1 }))}
        onView={handleView}
      />

      {/* Lead detail drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        opened={drawerOpened}
        onClose={closeDrawer}
        onUpdated={handleLeadUpdated}
      />

      {/* Create lead modal */}
      <CreateLeadModal
        opened={modalOpened}
        onClose={closeModal}
        onCreated={handleLeadCreated}
      />
    </Stack>
  );
}