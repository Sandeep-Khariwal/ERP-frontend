"use client";

import { ErrorNotification, SuccessNotification } from "@/app/helperFunction/Notification";
import { SetEmail } from "@/axios/institute/InstitutePostApi";
import {
  Modal,
  Button,
  Stack,
  TextInput,
  Text,
  Box,
  PasswordInput,
} from "@mantine/core";
import { IconMail, IconKey } from "@tabler/icons-react";
import { useState } from "react";

interface AddEmailModalProps {
  opened: boolean;
  onClose: () => void;
  institute: any;
}

export function AddEmailModal({
  opened,
  onClose,
  institute,
}: AddEmailModalProps) {
  const [email_key, setEmailKey] = useState("");
  const [email_password, setEmailPassword] = useState("");
  const [loading, setLoading] = useState(false);


const handleSubmit = () => {
  if (!email_key || !email_password) {
    ErrorNotification("Please fill all fields");
    return;
  }

  const payload = {
    email_key,
    email_password,
  };

  console.log("Payload Sending =>", payload);
  console.log("Institute Id =>", institute?._id);

  setLoading(true);

  SetEmail(payload, institute?._id)
    .then((res: any) => {
      console.log("API Success =>", res);
      SuccessNotification("Set Added Successfully");

      // Backend se kya aa raha hai dekhne ke liye
      console.log("Response Data =>", res?.data);

      setLoading(false);

      onClose();
    })
    .catch((err: any) => {
      console.log("API Error =>", err);
      console.log("Error Response =>", err?.response);

      setLoading(false);
    });
};

  return (
  <Modal
  opened={opened}
  onClose={onClose}
  centered
  size="md"
 
  radius="lg"
  styles={{
    content: {
      backgroundColor: "#FAF7FF",
    },
  }}
  title={
    <Box>
      <Text fw={700} size="lg" c="#7C3AED">
        Email Configuration
      </Text>
      <Text size="xs" c="dimmed">
        Configure your email credentials
      </Text>
    </Box>
  }
>
      <Stack gap="md" mt="sm">
      <TextInput
  label="Email Key"
  placeholder="email_key"
  value={email_key}
  onChange={(e) => setEmailKey(e.currentTarget.value)}
  leftSection={<IconMail size={16} color="#7C3AED" />}
  radius="md"
  styles={{
    input: {
      borderColor: "#D8B4FE",
      backgroundColor: "#FFFFFF",
    },
    label: {
      color: "#5B21B6",
      fontWeight: 600,
    },
  }}
/>
<PasswordInput
  label="Email Password"
  placeholder="email_password"
  value={email_password}
  onChange={(e) => setEmailPassword(e.currentTarget.value)}
  leftSection={<IconKey size={16} color="#7C3AED" />}
  radius="md"
  styles={{
    input: {
      borderColor: "#D8B4FE",
      backgroundColor: "#FFFFFF",
    },
    label: {
      color: "#5B21B6",
      fontWeight: 600,
    },
  }}
/>
<Button
  fullWidth
  radius="md"
  size="md"
  mt="sm"
   loading={loading}
  onClick={handleSubmit}
  styles={{
    root: {
      background:
        "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
      border: "none",
      fontWeight: 600,
      boxShadow: "0 4px 14px rgba(124,58,237,0.25)",
    },
  }}
>
  Save Configuration
</Button>
      </Stack>
    </Modal>
  );
}