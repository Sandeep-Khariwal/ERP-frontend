"use client";

import {
  Stack,
  Group,
  Title,
  Text,
  Box,
  Paper,
  Table,
  Avatar,
  Badge,
  Skeleton,
  Pagination,
  Center,
  Tabs,
  ThemeIcon,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect, useCallback } from "react";
import {
  IconBrandWhatsapp,
  IconInbox,
  IconMessageCircle,
  IconSettings,
} from "@tabler/icons-react";

// import { fetchWaLeads }               from "@/lib/whatsapp.api";
// import { Lead, LeadsResponse }        from "@/types";
// import { WhatsAppIntegrationPanel }   from "@/components/integrations/whatsapp/WhatsAppIntegrationPanel";
// import { WhatsAppConversation }       from "@/components/integrations/whatsapp/WhatsAppConversation";
// import { getInitials, timeAgo }       from "@/lib/utils";
// import { ScoreBadge, StatusBadge }    from "@/components/leads/LeadBadges";
import { Drawer, Divider, ScrollArea } from "@mantine/core";
import { Lead, LeadsResponse } from "@/types";
import { fetchWaLeads } from "@/axios/marketing/whatsapp";
import { getInitials, timeAgo } from "../utility/utils";
import { ScoreBadge, StatusBadge } from "../meta/LeadBadges";
import { WhatsAppIntegrationPanel } from "./WhatsAppIntegrationPanel";
import { WhatsAppConversation } from "./WhatsAppConversation";

export default function WhatsAppPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelected] = useState<Lead | null>(null);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  // ── Load WhatsApp leads ─────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    fetchWaLeads(page, 20)
      .then(async (res: any) => {
        setData(res);
        setLoading(false);
      })
      .catch((e: any) => {
        setData(null);
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleViewLead = (lead: Lead) => {
    setSelected(lead);
    openDrawer();
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="flex-end">
        <Box>
          <Group gap="sm">
            <ThemeIcon color="green" variant="light" size={40} radius="md">
              <IconBrandWhatsapp size={22} />
            </ThemeIcon>
            <Box>
              <Title order={2} fw={800}>
                WhatsApp
              </Title>
              <Text size="sm" c="dimmed">
                {data?.pagination.total ?? 0} leads · Inbound messages +
                integration
              </Text>
            </Box>
          </Group>
        </Box>
      </Group>

      {/* Tabs: Leads | Integration Settings */}
      <Tabs defaultValue="leads" variant="outline" radius="md">
        {/* <Tabs.List>
          <Tabs.Tab value="leads" leftSection={<IconMessageCircle size={15} />}>
            WhatsApp Leads
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={15} />}>
            Connection Settings
          </Tabs.Tab>
        </Tabs.List> */}

        {/* ── Leads tab ─────────────────────────────────────────── */}
        <Tabs.Panel value="leads" pt="lg">
          <Stack gap="md">
            {loading && (
              <Stack gap="xs">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} height={52} radius="sm" />
                ))}
              </Stack>
            )}

            {!loading && (!data?.leads || data.leads.length === 0) && (
              <Center py={80}>
                <Stack align="center" gap="sm">
                  <IconInbox
                    size={48}
                    strokeWidth={1}
                    color="var(--mantine-color-dimmed)"
                  />
                  <Text fw={500} c="dimmed">
                    No WhatsApp leads yet
                  </Text>
                  <Text size="sm" c="dimmed">
                    Connect your WhatsApp Business number to start capturing
                    leads
                  </Text>
                </Stack>
              </Center>
            )}

            {!loading && data && data.leads.length > 0 && (
              <>
                <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
                  <Table
                    highlightOnHover
                    verticalSpacing="sm"
                    horizontalSpacing="md"
                  >
                    <Table.Thead
                      style={{ background: "var(--mantine-color-gray-0)" }}
                    >
                      <Table.Tr>
                        <Table.Th>Lead</Table.Th>
                        <Table.Th>Phone</Table.Th>
                        <Table.Th>Course Interest</Table.Th>
                        <Table.Th>Score</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Received</Table.Th>
                        <Table.Th>Chat</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {data.leads.map((lead) => (
                        <Table.Tr
                          key={lead._id}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleViewLead(lead)}
                        >
                          <Table.Td>
                            <Group gap="sm" wrap="nowrap">
                              <Avatar size={34} radius="xl" color="green">
                                {getInitials(lead.name)}
                              </Avatar>
                              <Box>
                                <Text size="sm" fw={600} lh={1.3}>
                                  {lead.name || "—"}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {lead.email || ""}
                                </Text>
                              </Box>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" ff="monospace">
                              {lead.phone}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{lead.courseInterest || "—"}</Text>
                          </Table.Td>
                          <Table.Td>
                            <ScoreBadge score={lead.leadScore} />
                          </Table.Td>
                          <Table.Td>
                            <StatusBadge status={lead.status} />
                          </Table.Td>
                          <Table.Td>
                            <Text size="xs" c="dimmed">
                              {timeAgo(lead.createdAt)}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <ActionIcon
                              color="green"
                              variant="light"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewLead(lead);
                              }}
                            >
                              <IconMessageCircle size={14} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Paper>

                {/* Pagination */}
                {data.pagination.totalPages > 1 && (
                  <Group justify="center">
                    <Pagination
                      total={data.pagination.totalPages}
                      value={page}
                      onChange={setPage}
                      size="sm"
                      radius="md"
                      color="green"
                    />
                  </Group>
                )}
              </>
            )}
          </Stack>
        </Tabs.Panel>

        {/* ── Settings tab ─────────────────────────────────────── */}
        <Tabs.Panel value="settings" pt="lg">
          <WhatsAppIntegrationPanel />
        </Tabs.Panel>
      </Tabs>

      {/* ── Lead + Chat drawer ──────────────────────────────────── */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        size="lg"
        title={
          selectedLead && (
            <Group gap="sm">
              <Avatar size={36} radius="xl" color="green">
                {getInitials(selectedLead.name)}
              </Avatar>
              <Box>
                <Text fw={700}>{selectedLead.name || "Unknown"}</Text>
                <Text size="xs" c="dimmed" ff="monospace">
                  {selectedLead.phone}
                </Text>
              </Box>
            </Group>
          )
        }
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {selectedLead && (
          <Stack gap="md">
            {/* Lead quick info */}
            <Group gap="xs">
              <Badge color="green" variant="dot" size="sm">
                WhatsApp
              </Badge>
              <ScoreBadge score={selectedLead.leadScore} />
              <StatusBadge status={selectedLead.status} />
            </Group>

            {selectedLead.courseInterest && (
              <Text size="sm">
                <Text span c="dimmed">
                  Course:{" "}
                </Text>
                {selectedLead.courseInterest}
              </Text>
            )}

            <Divider label="Conversation" labelPosition="left" />

            {/* Full WhatsApp chat UI */}
            <WhatsAppConversation
              leadId={selectedLead._id}
              leadName={selectedLead.name || ""}
              phone={selectedLead.phone}
            />
          </Stack>
        )}
      </Drawer>
    </Stack>
  );
}
