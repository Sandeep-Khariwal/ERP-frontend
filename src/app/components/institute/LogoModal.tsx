"use client";

import {
  Modal,
  Button,
  Text,
  Stack,
  Group,
  Box,
  Center,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { IconUpload, IconPhoto, IconTrash } from "@tabler/icons-react";
import { Uploadlogo } from "@/axios/institute/InstitutePostApi";

type Props = {
  opened: boolean;
  onClose: () => void;
   institute: any;
};

export const LogoModal = ({ opened, onClose, institute }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // HANDLE FILE
  const handleFile = (selected: File) => {
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // DRAG DROP
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };


  useEffect(() => {
  // ❌ agar file ya institute id nahi hai toh stop
  if (!file || !institute?._id) return;

  const formData = new FormData();
  formData.append("logo", file);

  // 🔥 API CALL (same GPS pattern)
  Uploadlogo(formData, institute._id)
    .then((res: any) => {
      console.log("✅ Upload success:", res);

      if (res?.data?.url) {
        console.log("🌐 Image URL:", res.data.url);
      }
    })
    .catch((err: any) => {
      console.log("❌ Upload error:", err);
    });

}, [file]); // 🔥 file change = API call

  return (
    <Modal
      opened={opened}
      onClose={onClose}
     title={
  <Group gap="sm">
    <Box
      style={{
        background: "#ede9fe",
        padding: "6px",
        borderRadius: "8px",
      }}
    >
      <IconUpload size={18} color="#7c3aed" />
    </Box>
    <Text fw={600}>Upload Institute Logo</Text>
  </Group>
}
      centered
      size="lg"
    >
      <Stack>

        {/* TOP TEXT */}
        <Text size="sm" c="dimmed">
          Upload your school or institute logo. This logo will be displayed on your profile and documents.
        </Text>

        {/* IF NO IMAGE */}
        {!preview ? (
          <Box
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
            border: "2px dashed #c4b5fd",
  borderRadius: "14px",
  padding: "45px",
  cursor: "pointer",
  background: "#faf5ff",   // light purple bg
            }}
          >
            <Center>
              <Stack align="center" gap="xs">
                <IconUpload size={40} color="#7c3aed" />

                <Text fw={500}>Drag & drop your logo here</Text>
                <Text size="sm" c="dimmed">
                  or
                </Text>

               <Button
  variant="light"
  radius="md"
  styles={{
    root: {
      backgroundColor: "#ede9fe",
      color: "#6d28d9",
      border: "1px solid #c4b5fd",
      fontWeight: 500,
    },
  }}
  leftSection={<IconPhoto size={16} />}
>
  Browse Files
</Button>

                <Text size="xs" c="dimmed" mt={10}>
                  Recommended: PNG, JPG, SVG • Max size: 2MB • Aspect ratio: 1:1
                </Text>
              </Stack>
            </Center>

            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </Box>
        ) : (
          // ✅ PREVIEW UI
          <Stack align="center">
            <Box
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "10px",
              }}
            >
              <img
                src={preview}
                alt="logo"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </Box>

            <Group>
              <Button
                variant="light"
                leftSection={<IconPhoto size={16} />}
                onClick={() => fileInputRef.current?.click()}
              >
                Change Logo
              </Button>

              <Button
                color="red"
                variant="subtle"
                leftSection={<IconTrash size={16} />}
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
              >
                Remove Logo
              </Button>
            </Group>

            <Text size="xs" c="dimmed">
              Recommended: PNG, JPG, SVG • Max size: 2MB • Aspect ratio: 1:1
            </Text>

            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </Stack>
        )}

        {/* FOOTER BUTTONS */}
        <Group justify="space-between" mt="md"grow>
         <Button
  variant="default"
  onClick={onClose}
  style={{
    width: "220px",
  }}
>
  Cancel
</Button>

        <Button
  disabled={!file}
  style={{
    width: "220px",   // 🔥 width bada kiya
    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    fontWeight: 600,
  }}
>
  Save Logo
</Button>
        </Group>
      </Stack>
    </Modal>
  );
};