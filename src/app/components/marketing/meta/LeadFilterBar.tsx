"use client";

import { LeadFilters } from "@/types";
import { Group, Select, TextInput, Button, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconSearch, IconFilter, IconRefresh } from "@tabler/icons-react";

interface Props {
  filters: Partial<LeadFilters>;
  onChange: (f: Partial<LeadFilters>) => void;
  onReset: () => void;
}

export function LeadFilterBar({ filters, onChange, onReset }: Props) {
  const set = (key: keyof LeadFilters, val: any) =>
    onChange({ ...filters, [key]: val, page: 1 });

  return (
    <Stack gap="sm">
      <Group grow wrap="wrap">
        {/* Search */}
        <TextInput
          placeholder="Search name, phone, email..."
          leftSection={<IconSearch size={15} />}
          value={filters.search ?? ""}
          onChange={(e) => set("search", e.currentTarget.value)}
          miw={220}
        />

        {/* Source filter */}
        <Select
          placeholder="All sources"
          leftSection={<IconFilter size={15} />}
          clearable
          value={filters.source ?? null}
          onChange={(v) => set("source", v ?? "")}
          data={[
            { value: "google",       label: "Google Ads" },
            { value: "facebook",     label: "Facebook" },
            { value: "instagram",    label: "Instagram" },
            { value: "whatsapp",     label: "WhatsApp" },
            { value: "landing_page", label: "Landing Page" },
            { value: "telecalling",  label: "Telecalling" },
            { value: "other",        label: "Other" },
          ]}
        />

        {/* Status filter */}
        <Select
          placeholder="All statuses"
          clearable
          value={filters.status ?? null}
          onChange={(v) => set("status", v ?? "")}
          data={[
            { value: "new",       label: "New" },
            { value: "contacted", label: "Contacted" },
            { value: "qualified", label: "Qualified" },
            { value: "follow_up", label: "Follow Up" },
            { value: "converted", label: "Converted" },
            { value: "lost",      label: "Lost" },
          ]}
        />

        {/* Score filter */}
        <Select
          placeholder="All scores"
          clearable
          value={filters.leadScore ?? null}
          onChange={(v) => set("leadScore", v ?? "")}
          data={[
            { value: "hot",      label: "🔥 Hot" },
            { value: "warm",     label: "🟡 Warm" },
            { value: "cold",     label: "🔵 Cold" },
            { value: "unscored", label: "⬜ Unscored" },
          ]}
        />

        {/* Date range */}
        <DatePickerInput
          type="range"
          placeholder="Date range"
          clearable
          value={[
            filters.startDate ? new Date(filters.startDate) : null,
            filters.endDate   ? new Date(filters.endDate)   : null,
          ]}
          onChange={([start, end]) => {
            onChange({
              ...filters,
              startDate: start?.toString().split("T")[0],
              endDate:   end?.toString().split("T")[0],
              page:      1,
            });
          }}
          miw={220}
        />

        <Button
          variant="subtle"
          leftSection={<IconRefresh size={15} />}
          onClick={onReset}
        >
          Reset
        </Button>
      </Group>
    </Stack>
  );
}