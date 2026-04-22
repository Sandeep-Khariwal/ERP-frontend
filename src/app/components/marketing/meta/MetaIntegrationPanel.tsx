"use client";

import {
  Stack,
  Paper,
  Group,
  Text,
  Button,
  Badge,
  ActionIcon,
  Tooltip,
  Skeleton,
  Alert,
  Divider,
  ThemeIcon,
  Box,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconPlugConnected,
  IconPlugConnectedX,
  IconAlertCircle,
  IconCheck,
  IconExternalLink,
  IconRefresh,
} from "@tabler/icons-react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
// import { timeAgo } from "./utility/utils";
// import { useMetaPages } from "./hooks/useLeads";
import { MetaPage } from "@/types";
import { DisconnectMetaPage, GetMetaConnectUrl } from "@/axios/marketing/meta";
import { useMetaPages } from "../hooks/useLeads";
import { timeAgo } from "../utility/utils";

export function MetaIntegrationPanel() {
  const { pages, loading, error, refetch } = useMetaPages();
  const [connecting, setConnecting] = useState(false);

  // ── Open Facebook OAuth flow ────────────────────────────────────
  const handleConnect = async () => {
    setConnecting(true);
    // const res = await getMetaConnectUrl();
    GetMetaConnectUrl()
      .then((x: any) => {
        console.log("res : ", x);

        // Redirect to Facebook OAuth
        window.location.href = x.url;
      })
      .catch((e: any) => {
        notifications.show({ color: "red", message: e.message });
        setConnecting(false);
      });
  };

  // ── Disconnect a page ───────────────────────────────────────────
  const handleDisconnect = (page: MetaPage) => {
    console.log("pageSelecting : ");
    
    modals.openConfirmModal({
      title: "Disconnect Facebook Page",
      children: (
        <Text size="sm">
          Are you sure you want to disconnect <strong>{page.pageName}</strong>?
          New leads from this page will stop syncing.
        </Text>
      ),
      labels: { confirm: "Disconnect", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        DisconnectMetaPage(page.pageId)
          .then((x: any) => {
            console.log("res : ", x);
            notifications.show({
              color: "green",
              message: "Page disconnected",
            });
            refetch();
          })
          .catch((e: any) => {
            notifications.show({ color: "red", message: e.message });
            setConnecting(false);
          });
      },
    });
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Paper withBorder p="lg" radius="md">
        <Group justify="space-between" align="flex-start">
          <Group gap="md">
            <ThemeIcon size={48} radius="md" color="blue" variant="light">
              <IconBrandFacebook size={28} />
            </ThemeIcon>
            <Box>
              <Text fw={700} size="lg">
                Facebook & Instagram
              </Text>
              <Text size="sm" c="dimmed">
                Connect your Facebook Page to automatically sync lead ads
              </Text>
            </Box>
          </Group>
          <Button
            leftSection={<IconPlugConnected size={16} />}
            onClick={handleConnect}
            loading={connecting}
            variant="filled"
          >
            Connect Facebook Page
          </Button>
        </Group>
      </Paper>

      {/* How it works */}
      <Alert
        icon={<IconAlertCircle size={16} />}
        color="blue"
        variant="light"
        title="How it works"
        radius="md"
      >
        <Text size="sm">
          1. Click "Connect Facebook Page" → Login with Facebook → Approve
          permissions.
          <br />
          2. All your Facebook Pages are listed below.
          <br />
          3. When a student submits your Lead Ad form, the lead automatically
          appears in your CRM.
        </Text>
      </Alert>

      <Divider label="Connected Pages" labelPosition="left" />

      {/* Pages list */}
      {loading && (
        <Stack gap="sm">
          {[1, 2].map((i) => (
            <Skeleton key={i} height={90} radius="md" />
          ))}
        </Stack>
      )}

      {error && (
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          {error}
        </Alert>
      )}

      {!loading && pages?.length === 0 && (
        <Paper withBorder p="xl" radius="md" ta="center">
          <ThemeIcon
            size={48}
            radius="xl"
            color="gray"
            variant="light"
            mx="auto"
            mb="sm"
          >
            <IconBrandFacebook size={24} />
          </ThemeIcon>
          <Text fw={500} c="dimmed">
            No Facebook pages connected yet
          </Text>
          <Text size="sm" c="dimmed" mt={4}>
            Click "Connect Facebook Page" to get started
          </Text>
        </Paper>
      )}

      {pages?.length > 0 &&
        pages.map((page: any) => (
          <PageCard
            key={page._id}
            page={page}
            onDisconnect={(pageSelecting) => handleDisconnect(pageSelecting)}
          />
        ))}

      {pages?.length > 0 && (
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconRefresh size={14} />}
            onClick={refetch}
            size="sm"
          >
            Refresh
          </Button>
        </Group>
      )}
    </Stack>
  );
}

// ── Single connected page card ────────────────────────────────────
function PageCard({
  page,
  onDisconnect,
}: {
  page: MetaPage;
  onDisconnect: (page:MetaPage) => void;
}) {
  const isExpiringSoon =
    page.tokenExpiresAt &&
    new Date(page.tokenExpiresAt).getTime() - Date.now() <
      7 * 24 * 60 * 60 * 1000;

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="md">
          <ThemeIcon size={40} radius="md" color="blue" variant="light">
            <IconBrandFacebook size={20} />
          </ThemeIcon>
          <Box>
            <Group gap="xs">
              <Text fw={600} size="sm">
                {page.pageName}
              </Text>
              <Badge size="xs" color="green" variant="dot">
                Active
              </Badge>
            </Group>
            <Text size="xs" c="dimmed">
              {page.pageCategory || "Facebook Page"} · Connected{" "}
              {timeAgo(page.connectedAt)}
            </Text>
          </Box>
        </Group>

        <Group gap="lg" align="center">
          <Box ta="right">
            <Text size="sm" fw={600}>
              {page.totalLeadsReceived.toLocaleString()}
            </Text>
            <Text size="xs" c="dimmed">
              Leads received
            </Text>
          </Box>

          {page.lastLeadAt && (
            <Box ta="right">
              <Text size="sm" fw={500}>
                {timeAgo(page.lastLeadAt)}
              </Text>
              <Text size="xs" c="dimmed">
                Last lead
              </Text>
            </Box>
          )}

          {isExpiringSoon && (
            <Tooltip label="Token expires soon — reconnect">
              <Badge color="orange" variant="light" size="sm">
                Expiring soon
              </Badge>
            </Tooltip>
          )}

          <Tooltip label="Disconnect page">
            <ActionIcon color="red" variant="subtle" onClick={()=>onDisconnect(page)}>
              <IconPlugConnectedX size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
}
