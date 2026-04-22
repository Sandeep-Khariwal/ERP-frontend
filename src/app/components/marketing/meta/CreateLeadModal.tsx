"use client";

import { createLead } from "@/axios/marketing/meta";
import { Lead } from "@/types";
import {
  Modal,
  Stack,
  TextInput,
  Select,
  Textarea,
  Button,
  Group,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

interface Props {
  opened: boolean;
  onClose: () => void;
  onCreated: (lead: Lead) => void;
}

export function CreateLeadModal({ opened, onClose, onCreated }: Props) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      city: "",
      courseInterest: "",
      message: "",
      source: "telecalling",
      leadScore: "unscored",
    },
    validate: {
      phone: (v) =>
        v.trim().length < 10 ? "Enter a valid phone number" : null,
      source: (v) => (!v ? "Source is required" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {

    console.log("values : ",values);
    
    setLoading(true);

    createLead(values)
      .then((res: any) => {
        notifications.show({
          color: "green",
          message: "Lead created successfully",
        });
        onCreated(res.lead);
        form.reset();
        onClose();
        setLoading(false);
      })
      .catch((e: any) => {
        notifications.show({ color: "red", message: e.message });
        setLoading(false);
      });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg">
          Add New Lead
        </Text>
      }
      size="md"
      radius="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <Group grow>
            <TextInput
              label="Full Name"
              placeholder="Priya Sharma"
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Phone *"
              placeholder="9876543210"
              {...form.getInputProps("phone")}
            />
          </Group>

          <Group grow>
            <TextInput
              label="Email"
              placeholder="priya@email.com"
              {...form.getInputProps("email")}
            />
            <TextInput
              label="City"
              placeholder="Delhi"
              {...form.getInputProps("city")}
            />
          </Group>

          <TextInput
            label="Course Interest"
            placeholder="BSc Nursing, GNM..."
            {...form.getInputProps("courseInterest")}
          />

          <Group grow>
            <Select
              label="Source *"
              {...form.getInputProps("source")}
              data={[
                { value: "telecalling", label: "Telecalling" },
                { value: "whatsapp", label: "WhatsApp" },
                { value: "landing_page", label: "Landing Page" },
                { value: "google", label: "Google Ads" },
                { value: "facebook", label: "Facebook" },
                { value: "instagram", label: "Instagram" },
                { value: "other", label: "Other" },
              ]}
            />
            <Select
              label="Lead Score"
              {...form.getInputProps("leadScore")}
              data={[
                { value: "hot", label: "🔥 Hot" },
                { value: "warm", label: "🟡 Warm" },
                { value: "cold", label: "🔵 Cold" },
                { value: "unscored", label: "⬜ Unscored" },
              ]}
            />
          </Group>

          <Textarea
            label="Message / Note"
            placeholder="Any additional info..."
            minRows={2}
            {...form.getInputProps("message")}
          />

          <Group justify="flex-end" mt="sm">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Add Lead
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
