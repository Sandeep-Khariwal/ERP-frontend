"use client";

import { LeadStats } from "@/types";
import { SimpleGrid, Paper, Text, Group, ThemeIcon, Skeleton, Stack } from "@mantine/core";
import {
  IconUsers,
  IconFlame,
  IconTrendingUp,
  IconCalendarStats,
} from "@tabler/icons-react";

interface Props {
  stats: LeadStats | null;
  loading: boolean;
}

export function StatsCards({ stats, loading }: Props) {
  console.log("stats card : ",stats);
  
  const cards = [
    {
      label: "Total Leads",
      value: stats?.recentCount ?? 0,
      icon:  IconUsers,
      color: "blue",
      sub:   "All time",
    },
    {
      label: "Hot Leads",
      value: stats?.byScore?.find((bs:any)=>bs._id === 'hot')?.count ?? 0,
      icon:  IconFlame,
      color: "red",
      sub:   "Ready to enroll",
    },
    {
      label: "This Week",
      value: stats?.recentCount ?? 0,
      icon:  IconCalendarStats,
      color: "violet",
      sub:   "Last 7 days",
    },
    {
      label: "Converted",
      value: stats?.byStatus?.find((bs:any)=>bs._id === 'converted')?.count,
      icon:  IconTrendingUp,
      color: "teal",
      sub:   `of ${stats?.total ?? 0} total`,
    },
  ];

  if (loading) {
    return (
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} height={110} radius="md" />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
      {cards.map((c) => (
        <Paper key={c.label} withBorder p="lg" radius="md">
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Text size="xs" c="dimmed" fw={500} tt="uppercase" lts={0.5}>
                {c.label}
              </Text>
              <Text size="xl" fw={800} lh={1}>
                {c?.value?.toLocaleString()}
              </Text>
              <Text size="xs" c="dimmed">
                {c.sub}
              </Text>
            </Stack>
            <ThemeIcon
              color={c.color}
              variant="light"
              size={44}
              radius="md"
            >
              <c.icon size={22} />
            </ThemeIcon>
          </Group>
        </Paper>
      ))}
    </SimpleGrid>
  );
}