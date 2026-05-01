"use client";

import { Modal, Button, Text, Stack, Group, Box, Center, LoadingOverlay } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { IconUpload, IconPhoto, IconTrash } from "@tabler/icons-react";

import { IconInfoCircle } from "@tabler/icons-react";


import { BsPencilSquare } from "react-icons/bs";
import { UploadSignature } from "@/axios/institute/InstitutePostApi";

type Props = {
  opened: boolean;
  onClose: () => void;
  institute: any;
};

export const SignatureModal = ({ opened, onClose, institute }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    formData.append("signature", file);
    setIsLoading(true);
    // 🔥 API CALL (same GPS pattern)
    UploadSignature(formData, institute._id)
      .then((res: any) => {
        console.log("✅ Upload success:", res);
        setIsLoading(false);
        if (res?.data?.url) {
          console.log("🌐 Image URL:", res.data.url);
        }
      })
      .catch((err: any) => {
        console.log("❌ Upload error:", err);
        setIsLoading(false);
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
            <BsPencilSquare size={18} color="#7c3aed" />
          </Box>
          <Text fw={600}>Add Principal Or Director Signatures</Text>
        </Group>
      }
      centered
      size="lg"
     styles={{
    body: {
      maxHeight: "unset",
      overflow: "hidden",
    },
  }}
    >
      <LoadingOverlay visible={isLoading} />
      <Stack>
        {/* TOP TEXT */}
        <Text size="sm" c="dimmed">
          Upload Principal or Director Signatures. This logo will be displayed on
          your profile and documents.
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
              padding: "20px",
              cursor: "pointer",
              background: "#faf5ff", // light purple bg
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

        <Box
  style={{
    background: "#f5f3ff", // light purple bg
    border: "1px solid #e9d5ff",
    borderRadius: "10px",
    padding: "12px",
  }}
>
 <Group align="center" gap="sm" wrap="nowrap">

    {/* ICON */}
    <IconInfoCircle size={18} color="#7c3aed" />

    {/* TEXT */}
    <Text size="sm" c="#4c1d95">
      <b>Tips:</b> Use clear signatures on a white background for best results.{" "}
      Both signatures are optional.
    </Text>
  </Group>
</Box>

        {/* FOOTER BUTTONS */}
        <Group justify="space-between" mt="md" grow>
          <Button
            variant="default"
            onClick={onClose}
            style={{
              width: "220px",
            }}
          >
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
