"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Modal,
  Stack,
  Text,
  Button,
  Box,
  Flex,
  Image,
  Group,
} from "@mantine/core";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";
import { ErrorNotification, SuccessNotification } from "@/app/helperFunction/Notification";
import { CreateExcelAllQues } from "@/axios/tests/Tests.post";

interface Props {
  opened: boolean;
  onClose: () => void;
  batchId: string;
  testId: string;
  subjectId: string;
  onSuccess: () => void;
}

export default function UploadExcelQues({
  opened,
  onClose,
    batchId,
  testId,
  subjectId,
  onSuccess,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUploadQuestions = () => {
  if (!file) {
    ErrorNotification("Please select excel file");
    return;
  }

  const reader = new FileReader();

  reader.onload = (e: any) => {
    const data = e.target.result;

    const workbook = XLSX.read(data, {
      type: "binary",
    });

    const sheet =
      workbook.Sheets[workbook.SheetNames[0]];

    const jsonData: any[] =
      XLSX.utils.sheet_to_json(sheet);

    console.log("EXCEL DATA :", jsonData);

    // FINAL ARRAY
  const finalPayload = jsonData.map((item: any) => {
  const options = [
    {
      name: item["Option 1"],
      answer:
        String(item["Option 1 Is Correct"])
          .toLowerCase()
          .trim() === "true",
    },

    {
      name: item["Option 2"],
      answer:
        String(item["Option 2 Is Correct"])
          .toLowerCase()
          .trim() === "true",
    },

    {
      name: item["Option 3"],
      answer:
        String(item["Option 3 Is Correct"])
          .toLowerCase()
          .trim() === "true",
    },

    {
      name: item["Option 4"],
      answer:
        String(item["Option 4 Is Correct"])
          .toLowerCase()
          .trim() === "true",
    },
  ];

  // correct option nikalna
  const correctOption = options.find(
    (opt) => opt.answer === true,
  );

  return {
    question: {
      testId: testId,

      question: item["Question"],

      options: options,

      correctAns: correctOption?.name || "",

      explanation:
        item["Explanation"] || "",
    },

    batchId: batchId,

    subjectId: subjectId,
  };
});
    console.log(
      "FINAL QUESTIONS PAYLOAD :",
      finalPayload,
    );

    setLoading(true);

    CreateExcelAllQues(finalPayload)
      .then((res: any) => {
        console.log("SUCCESS :", res);

        SuccessNotification(
          "Questions uploaded successfully",
        );

        setFile(null);

        onSuccess();

        onClose();
        

        setLoading(false);
      })
      .catch((err: any) => {
        console.log("ERROR :", err);

        ErrorNotification(
          "Failed to upload questions",
        );

        setLoading(false);
      });
  };

  reader.readAsBinaryString(file);
};

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="lg"
      title="Upload All Questions"
      radius="md"
      styles={{
        title: {
          fontSize: "18px",
          fontWeight: 700,
        },

        body: {
          paddingTop: "10px",
        },
      }}
    >
      <Stack gap="md">
  <Flex
  align="center"
  justify="space-between"
  gap={20} // 👈 pehle 30 tha
  direction={isMobile ? "column" : "row"}
>
  {/* LEFT IMAGE */}
  {!isMobile && (
    <Image
      src="/modallogo.jpeg"
      alt="upload"
      w="38%" // 👈 pehle 45% tha
      fit="contain"
    />
  )}

  {/* RIGHT SIDE */}
  <Stack
    w={isMobile ? "100%" : "58%"} // 👈 thoda adjust kiya
    gap="md"
  >
    <Text fw={700} fz={18}>
      Upload Excel File
    </Text>

    <Text c="dimmed" fz={14}>
      Upload multiple questions at once.
    </Text>

    {/* UPLOAD BOX */}
    <Box
      style={{
        border: "1px dashed #d0d0d0",
        borderRadius: "12px",
        padding: "28px 18px", // 👈 thoda small
        textAlign: "center",
        backgroundColor: "#fff",
        width: "100%",
      }}
    >
      <Stack align="center" gap="xs">
        <Text fz={18}>⬆️</Text>

        <Stack align="center" gap={8}>
          <Text fz={14} ta="center">
            Drag & drop your file here or
          </Text>

          <Button
            size="xs"
            variant="light"
            onClick={() =>
              document.getElementById("excelInput")?.click()
            }
          >
            Browse
          </Button>
        </Stack>

        {/* FILE NAME + ACTIONS */}
        {file && (
          <Box
            w="100%"
            mt={10}
            px={10}
            py={10}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "8px",
              background: "#f8f9fa",
            }}
          >
            {/* FILE NAME */}
            <Text
              size="sm"
              fw={600}
              c="green"
              ta="center"
              mb={10}
              style={{
                wordBreak: "break-word",
              }}
            >
              {file.name}
            </Text>

            {/* ACTIONS */}
            <Flex justify="center" gap={10}>
              <Button
                size="xs"
                variant="light"
                color="blue"
                leftSection={<IconEdit size={14} />}
                onClick={() =>
                  document.getElementById("excelInput")?.click()
                }
              >
                Edit
              </Button>

              <Button
                size="xs"
                variant="light"
                color="red"
                leftSection={<IconTrash size={14} />}
                onClick={() => {
                  setFile(null);

                  const input: any =
                    document.getElementById("excelInput");

                  if (input) {
                    input.value = "";
                  }
                }}
              >
                Delete
              </Button>
            </Flex>
          </Box>
        )}

        {/* INPUT */}
        <input
          id="excelInput"
          type="file"
          accept=".xlsx,.xls"
          style={{ display: "none" }}
          onChange={(e: any) => {
            const selectedFile = e.target.files[0];

            if (selectedFile) {
              setFile(selectedFile);

              console.log("SELECTED FILE :", selectedFile);
            }
          }}
        />
      </Stack>
    </Box>
  </Stack>
</Flex>

        {/* BUTTON */}
        <Button
  fullWidth
  mt={10}
  size="md"
  disabled={!file}
  loading={loading}
  onClick={handleUploadQuestions}
  style={{
    background:
      "linear-gradient(135deg, #4B65F6, #6A5ACD)",
    height: "48px",
    fontSize: "16px",
    fontWeight: 600,
  }}
>
  Upload & Generate
</Button>

        {/* SAMPLE FILE */}
        <Text
          ta="center"
          size="sm"
          mt={4}
          style={{
            color: "#6A5ACD",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Download the sample excel file
        </Text>
      </Stack>
    </Modal>
  );
}