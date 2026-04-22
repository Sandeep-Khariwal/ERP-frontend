"use client";

import {
  Stack,
  Paper,
  Group,
  Text,
  Button,
  ThemeIcon,
  Badge,
  ActionIcon,
  Tooltip,
  Skeleton,
  Alert,
  Divider,
  Box,
  SimpleGrid,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useState, useEffect, useCallback } from "react";
import {
  IconBrandWhatsapp,
  IconPlugConnectedX,
  IconAlertCircle,
  IconRefresh,
  IconUsers,
  IconMessageCircle,
  IconClock,
} from "@tabler/icons-react";
import { WhatsAppConnection } from "@/types";
import {
  disconnectWhatsApp,
  fetchWaConnections,
} from "@/axios/marketing/whatsapp";
import { ConnectWhatsAppModal } from "./ConnectWhatsappModal";
import { timeAgo } from "../utility/utils";

// import { fetchWaConnections, disconnectWhatsApp } from "@/lib/whatsapp.api";
// import { WhatsAppConnection }                     from "@/types/whatsapp";
// import { ConnectWhatsAppModal }                    from "./ConnectWhatsAppModal";
// import { timeAgo, formatDate }                     from "@/lib/utils";

export function WhatsAppIntegrationPanel() {
  const [connections, setConnections] = useState<WhatsAppConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectOpened, { open: openConnect, close: closeConnect }] =
    useDisclosure(false);

  // ── Load connections ────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    fetchWaConnections()
      .then((res: any) => {
        console.log("fetchWaConnections res : ",res);
        
        setConnections(res.data);
        setLoading(false);
      })
      .catch((e: any) => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── Disconnect ──────────────────────────────────────────────────
  const handleDisconnect = (conn: WhatsAppConnection) => {
    modals.openConfirmModal({
      title: "Disconnect WhatsApp",
      children: (
        <Text size="sm">
          Disconnect <strong>{conn.verifiedName}</strong> (
          {conn.displayPhoneNumber})? Inbound messages will stop creating leads.
        </Text>
      ),
      labels: { confirm: "Disconnect", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        disconnectWhatsApp(conn.phoneNumberId)
          .then((res: any) => {
            notifications.show({
              color: "green",
              message: "WhatsApp disconnected",
            });
            load();
            setLoading(false);
          })
          .catch((e: any) => {
            setLoading(false);
            notifications.show({ color: "red", message: e.message });
          });
      },
    });
  };

  return (
    <Stack gap="lg">
      {/* Header card */}
      <Paper withBorder p="lg" radius="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="md">
            <ThemeIcon size={52} radius="md" color="green" variant="light">
              <IconBrandWhatsapp size={30} />
            </ThemeIcon>
            <Box>
              <Text fw={700} size="lg">
                WhatsApp Business
              </Text>
              <Text size="sm" c="dimmed">
                Connect your WhatsApp Business number to auto-capture inbound
                leads
              </Text>
            </Box>
          </Group>
          <Button
            color="green"
            leftSection={<IconBrandWhatsapp size={16} />}
            onClick={openConnect}
          >
            Connect Number
          </Button>
        </Group>
      </Paper>

      {/* How it works */}
      <Alert
        icon={<IconAlertCircle size={16} />}
        color="green"
        variant="light"
        title="How it works"
        radius="md"
      >
        <Text size="sm">
          When a student sends a WhatsApp message to your business number,
          Shikshapay automatically creates a lead with source = "WhatsApp" and
          saves the full conversation. You can also reply directly from the CRM.
        </Text>
      </Alert>

      <Divider label="Connected Numbers" labelPosition="left" />

      {/* Loading skeletons */}
      {loading && (
        <Stack gap="sm">
          {[1, 2].map((i) => (
            <Skeleton key={i} height={100} radius="md" />
          ))}
        </Stack>
      )}

      {/* Error */}
      {error && !loading && (
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          {error}
        </Alert>
      )}

      {/* Empty state */}
      {!loading && !error && connections.length === 0 && (
        <Paper withBorder p="xl" radius="md" ta="center">
          <ThemeIcon
            size={52}
            radius="xl"
            color="gray"
            variant="light"
            mx="auto"
            mb="md"
          >
            <IconBrandWhatsapp size={28} />
          </ThemeIcon>
          <Text fw={600} c="dimmed">
            No WhatsApp numbers connected
          </Text>
          <Text size="sm" c="dimmed" mt={4}>
            Click "Connect Number" to get started
          </Text>
          <Button
            mt="md"
            variant="light"
            color="green"
            leftSection={<IconBrandWhatsapp size={15} />}
            onClick={openConnect}
          >
            Connect Now
          </Button>
        </Paper>
      )}

      {/* Connected numbers */}
      {connections.map((conn) => (
        <ConnectionCard
          key={conn._id}
          conn={conn}
          onDisconnect={() => handleDisconnect(conn)}
        />
      ))}

      {connections.length > 0 && (
        <Group>
          <Button
            variant="subtle"
            size="sm"
            leftSection={<IconRefresh size={14} />}
            onClick={load}
          >
            Refresh
          </Button>
        </Group>
      )}

      {/* Connect modal */}
      <ConnectWhatsAppModal
        opened={connectOpened}
        onClose={closeConnect}
        onSuccess={() => {
          closeConnect();
          load();
        }}
      />
    </Stack>
  );
}

// ─── Single connected number card ────────────────────────────────
function ConnectionCard({
  conn,
  onDisconnect,
}: {
  conn: WhatsAppConnection;
  onDisconnect: () => void;
}) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" wrap="nowrap">
        {/* Left: identity */}
        <Group gap="md" wrap="nowrap">
          <ThemeIcon size={44} radius="md" color="green" variant="light">
            <IconBrandWhatsapp size={24} />
          </ThemeIcon>
          <Box>
            <Group gap="xs" align="center">
              <Text fw={700} size="sm">
                {conn.verifiedName}
              </Text>
              <Badge size="xs" color="green" variant="dot">
                Active
              </Badge>
            </Group>
            <Text size="xs" c="dimmed" ff="monospace">
              {conn.displayPhoneNumber}
            </Text>
            <Text size="xs" c="dimmed">
              Connected {timeAgo(conn.connectedAt)}
            </Text>
          </Box>
        </Group>

        {/* Right: stats + action */}
        <Group gap="xl" align="center" wrap="nowrap">
          <SimpleGrid cols={2} spacing="xl">
            <Box ta="center">
              <Group gap={4} justify="center">
                <IconUsers size={13} color="var(--mantine-color-dimmed)" />
                <Text size="sm" fw={700}>
                  {conn.totalLeadsReceived}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                Leads
              </Text>
            </Box>
            <Box ta="center">
              <Group gap={4} justify="center">
                <IconClock size={13} color="var(--mantine-color-dimmed)" />
                <Text size="sm" fw={500}>
                  {conn.lastLeadAt ? timeAgo(conn.lastLeadAt) : "—"}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                Last lead
              </Text>
            </Box>
          </SimpleGrid>

          <Tooltip label="Disconnect">
            <ActionIcon color="red" variant="subtle" onClick={onDisconnect}>
              <IconPlugConnectedX size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
}
