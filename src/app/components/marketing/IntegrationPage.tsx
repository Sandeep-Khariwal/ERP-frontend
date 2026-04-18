"use client";

import { Stack, Title, Text, Box, Tabs } from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { MetaIntegrationPanel } from "./MetaIntegrationPanel";

export default function IntegrationsPage() {
  return (
    <Stack gap="lg" w={"98%"} ml={10} >
      {/* Header */}
      <Box>
        <Title order={2} fw={800}>Integrations</Title>
        <Text size="sm" c="dimmed" mt={2}>
          Connect your ad platforms to automatically sync leads into your CRM
        </Text>
      </Box>

      {/* Tabs for each platform */}
      <Tabs defaultValue="meta" variant="outline" radius="md">
        <Tabs.List>
          <Tabs.Tab
            value="meta"
            leftSection={<IconBrandFacebook size={16} />}
          >
            Facebook & Instagram
          </Tabs.Tab>
          <Tabs.Tab
            value="google"
            leftSection={<IconBrandGoogle size={16} />}
            disabled
          >
            Google Ads (coming soon)
          </Tabs.Tab>
          <Tabs.Tab
            value="whatsapp"
            leftSection={<IconBrandWhatsapp size={16} />}
            disabled
          >
            WhatsApp (coming soon)
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="meta" pt="lg">
          <MetaIntegrationPanel />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}