"use client";

import React from "react";
import { Modal, Stack, Text, Button, TextInput, Flex } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";


const ReferCodeModal = (props: {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
}) => {
 const isMd =  useMediaQuery(`(max-width: 968px)`);

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.referralCode);

    notifications.show({
      title: "Copied!",
      message: "Referral code copied successfully 🎉",
      color: "green",
      position: isMd ? "top-center" : "bottom-right", 
    });

  } catch (err) {
    notifications.show({
      title: "Error",
      message: "Failed to copy",
      color: "red",
      position: isMd ? "top-center" : "bottom-right",
    });
  }
};

  return (
    <Modal
      title="Refer & Earn"
      opened={props.isOpen}
      onClose={props.onClose}
      centered
    >
      <Stack mt="md">
        <Text fw={600} size="sm">
         Share this code and invite institutes
        </Text>

        <Flex gap="sm" align="center">
          <TextInput
            value={props.referralCode}
            readOnly
            style={{ flex: 1 }}
          />

          <Button
            onClick={handleCopy}
            radius="xl"
            style={{
              background: "#4B65F6",
              color: "#fff",
            }}
          >
            Copy
          </Button>
        </Flex>

      </Stack>
    </Modal>
  );
};

export default ReferCodeModal;