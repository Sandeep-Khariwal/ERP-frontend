"use client";

import {
ErrorNotification,
SuccessNotification,
} from "@/app/helperFunction/Notification";
import { UpdatePaymentKeys } from "@/axios/institute/InstitutePostApi";

import {
Modal,
Button,
Stack,
TextInput,
Text,
Box,
PasswordInput,
} from "@mantine/core";

import { IconKey, IconLock } from "@tabler/icons-react";
import { useState } from "react";

interface AddPaymentKeysModalProps {
opened: boolean;
onClose: () => void;
institute: any;
}

export function AddPaymentKeysModal({
opened,
onClose,
institute,
}: AddPaymentKeysModalProps) {
const [api_key, setApiKey] = useState("");
const [api_secret, setApiSecret] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = () => {
if (!api_key || !api_secret) {
ErrorNotification("Please fill all fields");
return;
}

const payload = {
  api_key,
  api_secret,
};

console.log("Payload Sending =>", payload);

setLoading(true);

UpdatePaymentKeys(payload)
  .then((res: any) => {
    console.log("API Success =>", res);

    SuccessNotification(
      res?.data?.message || "Payment Keys Updated Successfully"
    );

    setLoading(false);
    onClose();
  })
  .catch((err: any) => {
    console.log("API Error =>", err);
    console.log("Error Response =>", err?.response);

    ErrorNotification(
      err?.response?.data?.message || "Something went wrong"
    );

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
title={ <Box> <Text fw={700} size="lg" c="#7C3AED">
Payment Keys Configuration </Text> <Text size="xs" c="dimmed">
Configure your payment gateway credentials </Text> </Box>
}
> <Stack gap="md" mt="sm">
<TextInput
label="API Key"
placeholder="Enter API Key"
value={api_key}
onChange={(e) => setApiKey(e.currentTarget.value)}
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


    <PasswordInput
      label="API Secret"
      placeholder="Enter API Secret"
      value={api_secret}
      onChange={(e) => setApiSecret(e.currentTarget.value)}
      leftSection={<IconLock size={16} color="#7C3AED" />}
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
      Save Payment Keys
    </Button>
  </Stack>
</Modal>

);
}
