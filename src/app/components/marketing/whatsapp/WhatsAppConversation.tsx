"use client";

import {
  Stack,
  Paper,
  Group,
  Text,
  TextInput,
  ActionIcon,
  Box,
  ScrollArea,
  Loader,
  Center,
  Badge,
  Avatar,
} from "@mantine/core";
import { IconSend, IconBrandWhatsapp } from "@tabler/icons-react";
import { useState, useEffect, useRef, useCallback } from "react";
// import { fetchConversation, sendWaMessage } from "@/lib/whatsapp.api";
// import { Conversation, WaMessage }          from "@/types/whatsapp";
import { notifications } from "@mantine/notifications";
import { fetchConversation, sendWaMessage } from "@/axios/marketing/whatsapp";
import { Conversation, WaMessage } from "@/types";

interface Props {
  leadId: string;
  leadName: string;
  phone: string;
}

export function WhatsAppConversation({ leadId, leadName, phone }: Props) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Load conversation ───────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    fetchConversation(leadId)
      .then((res: any) => {
        setConversation(res.data);
        setLoading(false);
      })
      .catch((e: any) => {
        setLoading(false);
        setConversation(null);
      });
  }, [leadId]);

  useEffect(() => {
    load();
  }, [load]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  // ── Send message ────────────────────────────────────────────────
  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    sendWaMessage({ leadId, toPhone: phone, message: message.trim() })
      .then(async(res: any) => {
        setMessage("");
       await load(); // refresh conversation
        setLoading(false);
      })
      .catch((e: any) => {
        setLoading(false);
        notifications.show({ color: "red", message: e.message });
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const messages = conversation?.messages ?? [];

  return (
    <Stack gap={0} style={{ height: 420 }}>
      {/* Header */}
      <Paper
        withBorder
        px="md"
        py="xs"
        radius={0}
        style={{
          borderBottom: "none",
          borderRadius: "var(--mantine-radius-md) var(--mantine-radius-md) 0 0",
        }}
      >
        <Group gap="xs">
          <IconBrandWhatsapp size={16} color="#25D366" />
          <Text size="sm" fw={600}>
            {leadName || phone}
          </Text>
          <Badge size="xs" color="green" variant="dot">
            {phone}
          </Badge>
        </Group>
      </Paper>

      {/* Messages area */}
      <ScrollArea
        style={{
          flex: 1,
          background: "#ECE5DD",
          borderLeft: "1px solid var(--mantine-color-default-border)",
          borderRight: "1px solid var(--mantine-color-default-border)",
        }}
        p="sm"
      >
        {loading && (
          <Center py="xl">
            <Loader size="sm" color="green" />
          </Center>
        )}

        {!loading && messages.length === 0 && (
          <Center py="xl">
            <Stack align="center" gap="xs">
              <IconBrandWhatsapp size={32} color="#25D366" strokeWidth={1} />
              <Text size="sm" c="dimmed">
                No messages yet
              </Text>
            </Stack>
          </Center>
        )}

        {!loading &&
          messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} leadName={leadName} />
          ))}

        <div ref={bottomRef} />
      </ScrollArea>

      {/* Input bar */}
      <Paper
        withBorder
        p="xs"
        radius={0}
        style={{
          borderTop: "none",
          borderRadius: "0 0 var(--mantine-radius-md) var(--mantine-radius-md)",
        }}
      >
        <Group gap="xs" wrap="nowrap">
          <TextInput
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1 }}
            size="sm"
            radius="xl"
          />
          <ActionIcon
            size={36}
            radius="xl"
            color="green"
            variant="filled"
            loading={sending}
            disabled={!message.trim()}
            onClick={handleSend}
          >
            <IconSend size={16} />
          </ActionIcon>
        </Group>
      </Paper>
    </Stack>
  );
}

// ─── Single message bubble ────────────────────────────────────────
function MessageBubble({
  msg,
  leadName,
}: {
  msg: WaMessage;
  leadName: string;
}) {
  const isOutbound = msg.sender === "admin" || msg.sender === "bot";
  const time = new Date(msg.timestamp).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Group
      justify={isOutbound ? "flex-end" : "flex-start"}
      mb="xs"
      align="flex-end"
      wrap="nowrap"
    >
      {/* Avatar for inbound */}
      {!isOutbound && (
        <Avatar size={28} radius="xl" color="green">
          {leadName?.[0]?.toUpperCase() ?? "?"}
        </Avatar>
      )}

      {/* Bubble */}
      <Box
        maw="75%"
        px="sm"
        py={6}
        style={{
          background: isOutbound ? "#DCF8C6" : "#FFFFFF",
          borderRadius: isOutbound
            ? "12px 12px 4px 12px"
            : "12px 12px 12px 4px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        {!isOutbound && (
          <Text size="xs" fw={600} c="green" mb={2}>
            {leadName || "Lead"}
          </Text>
        )}
        <Text
          size="sm"
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {msg.text}
        </Text>
        <Group justify="flex-end" mt={2}>
          <Text size="xs" c="dimmed">
            {time}
          </Text>
        </Group>
      </Box>

      {/* Avatar for outbound */}
      {isOutbound && (
        <Avatar size={28} radius="xl" color="blue">
          A
        </Avatar>
      )}
    </Group>
  );
}
