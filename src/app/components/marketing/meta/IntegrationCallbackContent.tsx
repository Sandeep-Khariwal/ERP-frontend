"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Center,
  Stack,
  Paper,
  ThemeIcon,
  Text,
  Button,
  Loader,
  Group,
  Box,
  Divider,
  Badge,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconBrandFacebook,
  IconArrowLeft,
  IconRefresh,
} from "@tabler/icons-react";

// ─── Map every error code your backend sends ──────────────────────
// Source: handleMetaCallback in your backend controller
const ERROR_MAP: Record<string, { title: string; description: string; icon: "warn" | "error" }> = {
  meta_denied: {
    title:       "Permission Denied",
    description: "You cancelled the Facebook permission screen. No pages were connected.",
    icon:        "warn",
  },
  missing_params: {
    title:       "Invalid Callback",
    description: "The OAuth callback URL was missing required parameters. Please try connecting again.",
    icon:        "error",
  },
  invalid_state: {
    title:       "Session Expired",
    description: "The OAuth session state could not be verified. This can happen if you took too long. Please try again.",
    icon:        "error",
  },
  oauth_failed: {
    title:       "Connection Failed",
    description: "Facebook returned an error while connecting your pages. Please try again.",
    icon:        "error",
  },
  server_error: {
    title:       "Server Error",
    description: "An unexpected error occurred on our server. Please try again in a few minutes.",
    icon:        "error",
  },
};

const FALLBACK_ERROR = {
  title:       "Something Went Wrong",
  description: "An unknown error occurred. Please try again.",
  icon:        "error" as const,
};

export function IntegrationsCallbackContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const notifiedRef  = useRef(false); // prevent double notification in strict mode

  // ── Read params — exactly matching what your backend sends ───────
  const success = searchParams.get("success"); // "meta_connected" | null
  const error   = searchParams.get("error");   // see ERROR_MAP keys above | null
  const pages   = searchParams.get("pages");   // number string e.g. "3" | null

  const isSuccess = success === "meta_connected";
  const isError   = !!error;
  const isPending = !isSuccess && !isError;

  const errorInfo = error ? (ERROR_MAP[error] ?? FALLBACK_ERROR) : null;

  // ── Show notification + auto-redirect on success ─────────────────
  useEffect(() => {
    if (notifiedRef.current) return;
    notifiedRef.current = true;

    if (isSuccess) {
      notifications.show({
        id:      "meta-connect-success",
        color:   "green",
        title:   "Facebook pages connected!",
        message: `${pages ?? "1"} page(s) are now syncing leads to your CRM.`,
        autoClose: 5000,
      });
      // Auto-navigate to integrations page after 3s
      const timer = setTimeout(() => {
        router.replace("/");
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (isError && errorInfo) {
      notifications.show({
        id:      "meta-connect-error",
        color:   "red",
        title:   errorInfo.title,
        message: errorInfo.description,
        autoClose: 6000,
      });
    }
  }, [isSuccess, isError]);

  return (
    <Center h="80vh" px="md">
      <Paper
        withBorder
        radius="xl"
        p={0}
        w="100%"
        maw={460}
        style={{ overflow: "hidden" }}
      >
        {/* Top color bar */}
        <Box
          h={6}
          style={{
            background: isSuccess
              ? "var(--mantine-color-green-6)"
              : isError
              ? "var(--mantine-color-red-6)"
              : "var(--mantine-color-blue-6)",
          }}
        />

        <Stack align="center" gap="lg" p="xl">

          {/* ── ICON ─────────────────────────────────────────────── */}
          <ThemeIcon
            size={72}
            radius="xl"
            variant="light"
            color={isSuccess ? "green" : isError ? "red" : "blue"}
          >
            {isSuccess ? (
              <IconCheck size={38} />
            ) : isError && errorInfo?.icon === "warn" ? (
              <IconAlertTriangle size={38} />
            ) : isError ? (
              <IconX size={38} />
            ) : (
              <IconBrandFacebook size={38} />
            )}
          </ThemeIcon>

          {/* ── SUCCESS STATE ────────────────────────────────────── */}
          {isSuccess && (
            <Stack align="center" gap="sm" w="100%">
              <Text fw={800} size="xl" ta="center">
                Pages Connected!
              </Text>

              {pages && (
                <Badge size="lg" color="green" variant="light" radius="md">
                  {pages} page{Number(pages) !== 1 ? "s" : ""} connected
                </Badge>
              )}

              <Text size="sm" c="dimmed" ta="center" maw={320}>
                Your Facebook Lead Ads are now synced. Every time a student
                submits your ad form, the lead will appear here automatically.
              </Text>

              <Divider w="100%" />

              <Group gap="xs" c="dimmed">
                <Loader size="xs" color="green" />
                <Text size="sm">Redirecting to integrations...</Text>
              </Group>

              <Button
                fullWidth
                variant="light"
                color="green"
                onClick={() => router.replace("/integrations/meta")}
              >
                Go to Integrations now
              </Button>
            </Stack>
          )}

          {/* ── ERROR STATE ──────────────────────────────────────── */}
          {isError && errorInfo && (
            <Stack align="center" gap="sm" w="100%">
              <Text fw={800} size="xl" ta="center">
                {errorInfo.title}
              </Text>

              <Text size="sm" c="dimmed" ta="center" maw={340}>
                {errorInfo.description}
              </Text>

              {/* Show the raw error code for debugging */}
              <Badge
                size="sm"
                color="red"
                variant="outline"
                radius="sm"
                style={{ fontFamily: "var(--mantine-font-family-monospace)" }}
              >
                error: {error}
              </Badge>

              <Divider w="100%" />

              <Stack gap="xs" w="100%">
                {/* Show retry button for all errors except server_error */}
                {error !== "server_error" && (
                  <Button
                    fullWidth
                    leftSection={<IconRefresh size={16} />}
                    onClick={() => router.push("/")}
                  >
                    Try Again
                  </Button>
                )}

                <Button
                  fullWidth
                  variant="subtle"
                  color="gray"
                  leftSection={<IconArrowLeft size={16} />}
                  onClick={() => router.push("/")}
                >
                  Back to Integrations
                </Button>
              </Stack>
            </Stack>
          )}

          {/* ── PENDING STATE (no params yet — should not normally show) */}
          {isPending && (
            <Stack align="center" gap="sm">
              <Text fw={700} size="lg">
                Connecting your Facebook account...
              </Text>
              <Text size="sm" c="dimmed">Please wait</Text>
              <Loader size="md" />
            </Stack>
          )}

        </Stack>
      </Paper>
    </Center>
  );
}
