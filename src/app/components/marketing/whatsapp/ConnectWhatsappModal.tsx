"use client";

import {
  Modal,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Alert,
  Anchor,
  Code,
  Divider,
  List,
  ThemeIcon,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import {
  IconBrandWhatsapp,
  IconAlertCircle,
  IconExternalLink,
  IconCircleCheck,
} from "@tabler/icons-react";

import { notifications } from "@mantine/notifications";
import { WhatsAppConnection } from "@/types";
import { connectWhatsApp } from "@/axios/marketing/whatsapp";

interface Props {
  opened: boolean;
  onClose: () => void;
  onSuccess: (conn: WhatsAppConnection) => void;
}

export function ConnectWhatsAppModal({ opened, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      phoneNumberId: "",
      businessAccountId: "",
      accessToken: "",
    },
    validate: {
      phoneNumberId: (v) => (!v.trim() ? "Phone Number ID is required" : null),
      businessAccountId: (v) =>
        !v.trim() ? "Business Account ID is required" : null,
      accessToken: (v) => (!v.trim() ? "Access Token is required" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    connectWhatsApp(values)
      .then((res: any) => {
        notifications.show({
          color: "green",
          title: "WhatsApp Connected!",
          message: `${res.verifiedName} (${res.displayPhoneNumber}) is now active.`,
        });
        onSuccess(res);
        form.reset();
        onClose();
        setLoading(false);
      })
      .catch((e: any) => {
        setLoading(false);
        notifications.show({
          color: "red",
          title: "Connection Failed",
          message: e.message,
        });
      });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon color="green" variant="light" size={32} radius="md">
            <IconBrandWhatsapp size={18} />
          </ThemeIcon>
          <Text fw={700} size="lg">
            Connect WhatsApp Business
          </Text>
        </Group>
      }
      size="lg"
      radius="lg"
    >
      <Stack gap="md">
        {/* Where to find credentials */}
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="blue"
          variant="light"
          title="Where to find these credentials"
          radius="md"
        >
          <List size="xs" spacing={4} mt={4}>
            <List.Item>
              Go to{" "}
              <Anchor
                href="https://developers.facebook.com"
                target="_blank"
                size="xs"
              >
                Meta for Developers{" "}
                <IconExternalLink
                  size={10}
                  style={{ verticalAlign: "middle" }}
                />
              </Anchor>
            </List.Item>
            <List.Item>Open your App → WhatsApp → API Setup</List.Item>
            <List.Item>
              Copy <Code>Phone Number ID</Code> and{" "}
              <Code>WhatsApp Business Account ID</Code>
            </List.Item>
            <List.Item>
              Generate a <Code>Temporary access token</Code> (or use a permanent
              System User token)
            </List.Item>
          </List>
        </Alert>

        <Divider />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Phone Number ID"
              description="Found in Meta Developer App → WhatsApp → API Setup"
              placeholder="e.g. 123456789012345"
              {...form.getInputProps("phoneNumberId")}
            />

            <TextInput
              label="WhatsApp Business Account ID (WABA ID)"
              description="Found in Meta Business Manager → WhatsApp Accounts"
              placeholder="e.g. 987654321098765"
              {...form.getInputProps("businessAccountId")}
            />

            <PasswordInput
              label="Access Token"
              description="Temporary token from API Setup page, or permanent System User token"
              placeholder="EAAxxxxxxxxxxxxxxxx..."
              {...form.getInputProps("accessToken")}
            />

            <Alert
              color="yellow"
              variant="light"
              icon={<IconAlertCircle size={14} />}
            >
              <Text size="xs">
                We verify your credentials with Meta before saving. If the token
                is invalid or the phone number is not linked to your account,
                the connection will fail.
              </Text>
            </Alert>

            <Group justify="flex-end" mt="sm">
              <Button variant="subtle" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                color="green"
                leftSection={<IconBrandWhatsapp size={16} />}
              >
                Connect WhatsApp
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}
