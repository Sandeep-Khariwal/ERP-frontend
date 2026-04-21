"use client";

import {
  Drawer,
  Stack,
  Group,
  Text,
  Avatar,
  Badge,
  Select,
  Textarea,
  Button,
  Divider,
  Timeline,
  Paper,
  Tabs,
  Box,
  Skeleton,
  ActionIcon,
  Tooltip,
  CopyButton,
  ScrollArea,
} from "@mantine/core";
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconCopy,
  IconCheck,
  IconNotes,
  IconPhoneCall,
  IconBook,
  IconClockHour4,
} from "@tabler/icons-react";
import { useState } from "react";
import { ScoreBadge, StatusBadge, SourceBadge } from "./LeadBadges";
import { formatDateTime, getInitials, timeAgo } from "./utility/utils";
import { notifications } from "@mantine/notifications";
import { addCallLog, addNote, updateLead } from "@/axios/marketing/meta";
import { CallOutcome, Lead, LeadScore, LeadStatus } from "@/types";

interface Props {
  lead: Lead | null;
  opened: boolean;
  onClose: () => void;
  onUpdated: (lead: Lead) => void;
}

export function LeadDetailDrawer({ lead, opened, onClose, onUpdated }: Props) {
  const [saving, setSaving] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [callOutcome, setCallOutcome] = useState<CallOutcome | "">("");
  const [callNote, setCallNote] = useState("");
  const [callDuration, setCallDuration] = useState("");

  if (!lead) return null;
  const notes = lead.notes || [];
  const callLogs = lead.callLogs || [];

  // ── Update status ───────────────────────────────────────────────
  const handleStatusChange = async (val: string | null) => {
    if (!val || val === lead.status) return;
    setSaving(true);

    updateLead(lead._id, { status: val as LeadStatus })
      .then((res: any) => {
        setSaving(false);
        onUpdated(res.lead);
        notifications.show({ color: "green", message: "Status updated" });
      })
      .catch((e: any) => {
        notifications.show({ color: "red", message: e.message });
        setSaving(false);
      });

  };

  // ── Update score ────────────────────────────────────────────────
  const handleScoreChange = async (val: string | null) => {
    if (!val || val === lead.leadScore) return;
    setSaving(true);
    updateLead(lead._id, { leadScore: val as LeadScore })
      .then((res: any) => {
        setSaving(false);
        onUpdated(res.lead);
        notifications.show({ color: "green", message: "Status updated" });
      })
      .catch((e: any) => {
        notifications.show({ color: "red", message: e.message });
        setSaving(false);
      });
  };

  // ── Add note ────────────────────────────────────────────────────
  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setSaving(true);
    addNote(lead._id, noteText.trim())
      .then((res: any) => {
        setSaving(false);
        setNoteText("");
        notifications.show({ color: "green", message: "Note added" });
      })
      .catch((e: any) => {
        notifications.show({ color: "red", message: e.message });
        setSaving(false);
      });
  };

  // ── Add call log ────────────────────────────────────────────────
  const handleAddCallLog = async () => {
    if (!callOutcome) return;
    setSaving(true);

    addCallLog(lead._id, {
      outcome: callOutcome as CallOutcome,
      durationSeconds: callDuration ? parseInt(callDuration) : undefined,
      note: callNote || undefined,
    })
      .then((res: any) => {
        setCallOutcome("");
        setCallNote("");
        setCallDuration("");
        notifications.show({ color: "green", message: "Call logged" });
        onUpdated(res.lead);
        setSaving(false);
      })
      .catch((e: any) => {
        notifications.show({ color: "red", message: e.message });
        setSaving(false);
      });
  };

  console.log("lead : ", lead);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="lg"
      title={
        <Group gap="sm">
          <Avatar size={40} radius="xl" color="blue">
            {getInitials(lead.name)}
          </Avatar>
          <Box>
            <Text fw={700} lh={1.2}>
              {lead.name || "Unknown"}
            </Text>
            <Text size="xs" c="dimmed">
              {lead.courseInterest || "No course specified"}
            </Text>
          </Box>
        </Group>
      }
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="lg">
        {/* Contact info */}
        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Group gap="xs">
              <IconPhone size={14} color="var(--mantine-color-dimmed)" />
              <Text size="sm" ff="monospace">
                {lead.phone}
              </Text>
              <CopyButton value={lead.phone}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "Copied" : "Copy"}>
                    <ActionIcon size="xs" variant="subtle" onClick={copy}>
                      {copied ? (
                        <IconCheck size={12} />
                      ) : (
                        <IconCopy size={12} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
            {lead.email && (
              <Group gap="xs">
                <IconMail size={14} color="var(--mantine-color-dimmed)" />
                <Text size="sm">{lead.email}</Text>
              </Group>
            )}
            {lead.city && (
              <Group gap="xs">
                <IconMapPin size={14} color="var(--mantine-color-dimmed)" />
                <Text size="sm">{lead.city}</Text>
              </Group>
            )}
          </Stack>
        </Paper>

        {/* Badges row */}
        <Group gap="xs">
          <SourceBadge source={lead.source} />
          <ScoreBadge score={lead.leadScore} />
          <StatusBadge status={lead.status} />
          {lead.lastContactedAt && (
            <Badge variant="outline" color="gray" size="sm">
              Last contact {timeAgo(lead.lastContactedAt)}
            </Badge>
          )}
        </Group>

        {/* Quick update row */}
        <Group grow>
          <Select
            label="Status"
            value={lead.status}
            onChange={handleStatusChange}
            disabled={saving}
            size="sm"
            data={[
              { value: "new", label: "New" },
              { value: "contacted", label: "Contacted" },
              { value: "qualified", label: "Qualified" },
              { value: "follow_up", label: "Follow Up" },
              { value: "converted", label: "Converted" },
              { value: "lost", label: "Lost" },
            ]}
          />
          <Select
            label="Lead Score"
            value={lead.leadScore}
            onChange={handleScoreChange}
            disabled={saving}
            size="sm"
            data={[
              { value: "hot", label: "🔥 Hot" },
              { value: "warm", label: "🟡 Warm" },
              { value: "cold", label: "🔵 Cold" },
              { value: "unscored", label: "⬜ Unscored" },
            ]}
          />
        </Group>

        <Divider />

        {/* Tabs: Notes / Call Logs / Info */}
        <Tabs defaultValue="notes" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="notes" leftSection={<IconNotes size={14} />}>
              Notes ({lead.notes.length})
            </Tabs.Tab>
            <Tabs.Tab value="calls" leftSection={<IconPhoneCall size={14} />}>
              Calls ({lead?.callLogs?.length})
            </Tabs.Tab>
            <Tabs.Tab value="info" leftSection={<IconBook size={14} />}>
              Details
            </Tabs.Tab>
          </Tabs.List>

          {/* ── Notes tab ────────────────────────────────────────── */}
          <Tabs.Panel value="notes" pt="md">
            <Stack gap="md">
              {/* Add note */}
              <Box>
                <Textarea
                  placeholder="Write a note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.currentTarget.value)}
                  minRows={2}
                  maxRows={4}
                  autosize
                />
                <Button
                  mt="xs"
                  size="xs"
                  onClick={handleAddNote}
                  loading={saving}
                  disabled={!noteText.trim()}
                >
                  Add Note
                </Button>
              </Box>

              {/* Notes list */}
              {notes.length === 0 ? (
                <Text size="sm" c="dimmed" ta="center" py="md">
                  No notes yet
                </Text>
              ) : (
                <Timeline active={-1} bulletSize={18} lineWidth={2}>
                  {notes.reverse().map((note, i) => (
                    <Timeline.Item
                      key={i}
                      bullet={<IconNotes size={10} />}
                      title={
                        <Text size="xs" c="dimmed">
                          {formatDateTime(note.addedAt)}
                        </Text>
                      }
                    >
                      <Text size="sm" mt={2}>
                        {note.text}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              )}
            </Stack>
          </Tabs.Panel>

          {/* ── Call logs tab ─────────────────────────────────────── */}
          <Tabs.Panel value="calls" pt="md">
            <Stack gap="md">
              {/* Log a call */}
              <Paper withBorder p="sm" radius="sm">
                <Stack gap="xs">
                  <Text size="sm" fw={500}>
                    Log a call
                  </Text>
                  <Select
                    placeholder="Call outcome"
                    size="sm"
                    value={callOutcome}
                    onChange={(v) => setCallOutcome(v as CallOutcome | "")}
                    data={[
                      { value: "answered", label: "Answered" },
                      { value: "no_answer", label: "No Answer" },
                      {
                        value: "callback_requested",
                        label: "Callback Requested",
                      },
                      { value: "not_interested", label: "Not Interested" },
                    ]}
                  />
                  <Textarea
                    placeholder="Call notes (optional)"
                    size="sm"
                    value={callNote}
                    onChange={(e) => setCallNote(e.currentTarget.value)}
                    minRows={2}
                  />
                  <Textarea
                    placeholder="Call Duration"
                    size="sm"
                    value={callNote}
                    onChange={(e) => setCallDuration(e.currentTarget.value)}
                    minRows={2}
                  />
                  <Button
                    size="xs"
                    variant="light"
                    onClick={handleAddCallLog}
                    loading={saving}
                    disabled={!callOutcome}
                  >
                    Save Call Log
                  </Button>
                </Stack>
              </Paper>

              {/* Call log history */}
              {callLogs?.length === 0 ? (
                <Text size="sm" c="dimmed" ta="center" py="md">
                  No calls logged yet
                </Text>
              ) : (
                <Timeline active={-1} bulletSize={18} lineWidth={2}>
                  {callLogs.reverse().map((log:any, i:number) => (
                    <Timeline.Item
                      key={i}
                      bullet={<IconPhoneCall size={10} />}
                      color={
                        log.outcome === "answered"
                          ? "green"
                          : log.outcome === "no_answer"
                            ? "red"
                            : log.outcome === "not_interested"
                              ? "gray"
                              : "blue"
                      }
                      title={
                        <Group gap="xs">
                          <Text size="xs" fw={600}>
                            {log.outcome.replace("_", " ")}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {formatDateTime(log.calledAt)}
                          </Text>
                        </Group>
                      }
                    >
                      {log.note && (
                        <Text size="sm" mt={2}>
                          {log.note}
                        </Text>
                      )}
                      {log.durationSeconds && (
                        <Group gap={4} mt={2}>
                          <IconClockHour4 size={11} />
                          <Text size="xs" c="dimmed">
                            {log.durationSeconds}s
                          </Text>
                        </Group>
                      )}
                    </Timeline.Item>
                  ))}
                </Timeline>
              )}
            </Stack>
          </Tabs.Panel>

          {/* ── Info tab ─────────────────────────────────────────── */}
          <Tabs.Panel value="info" pt="md">
            <Stack gap="xs">
              {[
                { label: "Lead ID", value: lead._id },
                { label: "Source", value: lead.source || "—" },
                { label: "Campaign ID", value: lead.sourceCampaignId || "—" },
                { label: "Form ID", value: lead.sourceFormId || "—" },
                { label: "Facebook Page", value: lead.metaPageId || "—" },
                { label: "Created", value: formatDateTime(lead.createdAt) },
                { label: "Updated", value: formatDateTime(lead.updatedAt) },
                { label: "Message", value: lead.message || "—" },
              ].map(({ label, value }) => (
                <Group key={label} justify="space-between" wrap="nowrap">
                  <Text size="sm" c="dimmed" miw={120}>
                    {label}
                  </Text>
                  <Text size="sm" ta="right" style={{ wordBreak: "break-all" }}>
                    {value}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Drawer>
  );
}
