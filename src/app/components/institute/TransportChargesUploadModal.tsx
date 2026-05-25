"use client";

import {
  Modal,
  Button,
  Text,
  Stack,
  Group,
  Box,
  Center,
  LoadingOverlay,
  ThemeIcon,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  IconUpload,
  IconFileSpreadsheet,
  IconTrash,
  IconCheck,
} from "@tabler/icons-react";
import {
  CreateTransportAddress,
  GetTransportAddresses,
} from "@/axios/institute/InstitutePostApi";
import {
  ErrorNotification,
  SuccessNotification,
} from "@/app/helperFunction/Notification";

type Props = {
  opened: boolean;
  onClose: () => void;
  institute: any;
};

interface ParsedTransportItem {
  address: string;
  price: number;
}

export const TransportChargesUploadModal = ({
  opened,
  onClose,
  institute,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transportData, setTransportData] = useState<ParsedTransportItem[]>([]);
  const [uploadedAddresses, setUploadedAddresses] = useState<any[]>([]);

  // HANDLE FILE
  const handleFile = async (selected: File) => {
    setFile(selected);

    const data = await selected.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

    // Map and process only necessary address and price properties to save in state
    const processedData: ParsedTransportItem[] = jsonData
      .map((item) => {
        const address = item["Transport Stop"] || item["address"] || "";
        const price = item["Charges"] || item["price"] || 0;

        return {
          address: String(address).trim(),
          price: Number(price),
        };
      })
      // Filter out empty rows or header duplicate definitions if any
      .filter(
        (item) =>
          item.address && item.address.toLowerCase() !== "transport stop",
      );

    setTransportData(processedData);
    console.log("Processed Excel Data Saved to State:", processedData);
  };

  const handleUpload = async () => {
    try {
      setIsLoading(true);

      // API executes sequentially (one by one) from state data
      let addressPromise = [];
      for (const item of transportData) {
        console.log({
          _id: "",
          address: item.address,
          price: item.price,
          institute: institute._id,
        });

        const allAddress = CreateTransportAddress({
          _id: "",
          address: item.address,
          price: item.price,
          institute: institute._id,
        });
        addressPromise.push(allAddress);
      }

      const response = Promise.all(addressPromise);

      const data: any = [];

      response
        .then((res: any) => {
          data.push(res.data);
        })
        .catch((e: any) => {
          console.log(e);
        });

      // const res: any = await GetTransportAddresses(institute._id);
      setUploadedAddresses(data || []);

      SuccessNotification("Transport charges uploaded successfully ✅");

      setFile(null);
      setTransportData([]);

      setTimeout(() => {
        onClose();
      }, 1200);

      setIsLoading(false);
    } catch (err) {
      console.log("FULL BACKEND ERROR =>", (err as any)?.response?.data);

      ErrorNotification("Failed to upload transport charges ❌");
      setIsLoading(false);
    }
  };

  // DRAG DROP
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  useEffect(() => {
    if (opened) {
      GetTransportAddresses(institute._id)
        .then((res: any) => {
          setUploadedAddresses(res?.data || []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="lg"
      title={
        <Group gap="sm">
          <ThemeIcon size={36} radius="md" variant="light" color="violet">
            <IconFileSpreadsheet size={20} />
          </ThemeIcon>

          <Box>
            <Text fw={700}>Upload Transport Charges</Text>

            <Text size="xs" c="dimmed">
              Upload transport fee data using XLSX file
            </Text>
          </Box>
        </Group>
      }
    >
      <LoadingOverlay visible={isLoading} />

      <Stack>
        {/* TOP DESCRIPTION */}
        <Text size="sm" c="dimmed">
          Upload your transport charges sheet containing route names, addresses,
          pickup points, and monthly transport fees.
        </Text>

        {/* NO FILE */}
        {!file ? (
          <Box
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed #c4b5fd",
              borderRadius: "16px",
              padding: "50px",
              cursor: "pointer",
              background: "#faf5ff",
              transition: "0.3s",
            }}
          >
            <Center>
              <Stack align="center" gap="sm">
                <ThemeIcon
                  size={70}
                  radius={100}
                  variant="light"
                  color="violet"
                >
                  <IconUpload size={34} />
                </ThemeIcon>

                <Text fw={600} fz="lg">
                  Drag & drop XLSX file here
                </Text>

                <Text size="sm" c="dimmed">
                  or click to browse your files
                </Text>

                <Button
                  variant="light"
                  color="violet"
                  radius="md"
                  leftSection={<IconFileSpreadsheet size={18} />}
                >
                  Browse XLSX File
                </Button>

                <Text size="xs" c="dimmed" mt={10}>
                  Supported formats: .xlsx, .xls • Max size: 10MB
                </Text>
              </Stack>
            </Center>

            <input
              hidden
              type="file"
              accept=".xlsx,.xls"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </Box>
        ) : (
          // FILE PREVIEW
          <Box
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "18px",
              background: "#fafafa",
            }}
          >
            <Group justify="space-between" align="center">
              <Group>
                <ThemeIcon size={52} radius="md" variant="light" color="green">
                  <IconCheck size={26} />
                </ThemeIcon>

                <Box>
                  <ThemeIcon
                    variant="transparent"
                    style={{ display: "none" }}
                  />
                  <Text fw={600}>{file.name}</Text>

                  <Text size="sm" c="dimmed">
                    XLSX file selected successfully
                  </Text>
                </Box>
              </Group>

              <Button
                color="red"
                variant="subtle"
                leftSection={<IconTrash size={16} />}
                onClick={() => {
                  setFile(null);
                  setTransportData([]);
                }}
              >
                Remove
              </Button>
            </Group>
          </Box>
        )}

        <Stack mt="md">
          {uploadedAddresses.map((item, index) => (
            <Box
              key={index}
              p="sm"
              style={{
                border: "1px solid #eee",
                borderRadius: "10px",
              }}
            >
              <Text fw={600}>{item.address}</Text>

              <Text size="sm" c="dimmed">
                ₹ {item.price}
              </Text>
            </Box>
          ))}
        </Stack>

        {/* FOOTER */}
        <Group justify="space-between" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>

          <Button color="violet" disabled={!file} onClick={handleUpload}>
            Upload Transport File
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
