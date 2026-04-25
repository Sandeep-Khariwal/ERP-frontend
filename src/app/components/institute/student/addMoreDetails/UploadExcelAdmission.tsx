import React, { SetStateAction, useState } from "react";
import {
  Modal,
  Stack,
  Flex,
  Text,
  Button,
  Box,
  Group,
  Image,
  LoadingOverlay,
} from "@mantine/core";
import * as XLSX from "xlsx";
import {
  ErrorNotification,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import { CreateStudent } from "@/axios/institute/InstitutePostApi";
import { parseExcelDate } from "../../helperFunctions";
import { StudentsDataWithBatch } from "@/interface/student.interface";

interface Props {
  opened: boolean;
  batchId: string;
  setOpenAddMarksModal: React.Dispatch<SetStateAction<boolean>>;
  instituteId: string;
  setStudents: React.Dispatch<
    React.SetStateAction<
      {
        _id: string;
        name: string;
        phoneNumber: string;
        parentName: string;
        feeStatus: string;
      }[]
    >
  >;
}

function UploadExcelAdmission({
  opened,
  setOpenAddMarksModal,
  instituteId,
  batchId,
  setStudents,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [studentsPayload, setStudentsPayload] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ HANDLE FILE UPLOAD
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = e.target.result;

      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      let errorFound = false;

      const payload = jsonData.map((student: any, index: number) => {
        const name = student["name"];
        const phone = student["phoneNumber"];

        // ❌ validation
        if (!name || !phone) {
          errorFound = true;
          ErrorNotification(`Row ${index + 2}: Name or Phone missing`);
          return null;
        }
        console.log("student : ", student);

        return {
          name: student["name"],
          parentName: student["fatherName"],
          email: student["email"],
          parentNumber: student["parentNumber"],
          phoneNumber: [String(student["phoneNumber"])],
          address: student["address"],
          gender: student["gender"],
          instituteId,
          batchId,
          dateOfBirth: parseExcelDate(student["dateOfBirth"]),
          dateOfJoining: parseExcelDate(student["dateOfJoining"]),
        };
      });

      const finalPayload = payload.filter((p: any) => p !== null);
      console.log(" finalPayload : ", finalPayload);

      setStudentsPayload(finalPayload);

      if (!errorFound) {
        SuccessNotification("File processed successfully ✅");
      }
    };

    reader.readAsBinaryString(file);
  };

  // ✅ CREATE STUDENTS
  const handleCreateStudents = async () => {
    if (studentsPayload.length === 0) {
      ErrorNotification("No valid data found!");
      return;
    }

    console.log("studentsPayload : ", studentsPayload);

    try {
      setLoading(true);

      const success: any[] = [];
      const failed: any[] = [];

      for (const student of studentsPayload) {
        try {
          await CreateStudent(student);
          success.push(student);
        } catch (err) {
          failed.push({ student, error: err });
        }
      }

      console.log("success admisionss : ", success);
      const allStudents = success.flatMap((item: any) => {
        // handle both cases safely
        if (item?.students) return item.students;
        if (item?.student) return [item.student];
        return [];
      });

      // 🔥 YOUR REQUIRED TRANSFORMATION
      const studentData = allStudents.map((s: any) => {
        const totals = (s.feeRecords || []).reduce(
          (acc: any, record: any) => {
            acc.totalAmount += record.totalAmount || 0;
            acc.amountPaid += record.amountPaid || 0;
            return acc;
          },
          { totalAmount: 0, amountPaid: 0 },
        );

        return {
          _id: s._id,
          name: s.name,
          phoneNumber: s.phoneNumber,
          parentName: s.parentName,
          feeStatus:
            totals.totalAmount === totals.amountPaid && totals.amountPaid > 0
              ? "Paid"
              : totals.amountPaid === 0
                ? "Not Paid"
                : "Partial Paid",
        };
      });

      console.log("studentData : ", studentData);

      setStudents(studentData);

      SuccessNotification(`${success.length} Students Added`);

      if (failed.length > 0) {
        ErrorNotification(`${failed.length} students failed`);
        console.log("Failed:", failed);
      }

      if (failed.length === 0) {
        setFile(null);
        setStudentsPayload([]);
        setOpenAddMarksModal(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpenAddMarksModal(false)}
      title="Upload Admission"
      centered
      size="lg"
    >
      <LoadingOverlay visible={loading} />
      <Stack>
        <Box>
          <Flex align="center" justify="space-between" gap={20}>
            {/* LEFT IMAGE */}
            <Image
              src="/modallogo.jpeg"
              alt="upload"
              style={{ width: "60%", maxHeight: 180, objectFit: "contain" }}
            />

            {/* RIGHT */}
            <Stack w="60%">
              <Text fw={700} fz={20}>
                Upload Excel File
              </Text>

              <Text c="dimmed" fz={14}>
                Add multiple students at once.
              </Text>

              {/* UPLOAD BOX */}
              <Box
                style={{
                  border: "1px dashed #ccc",
                  borderRadius: "10px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <Text mb={8}>⬆️</Text>

                <Group justify="center" gap={6}>
                  <Text fz={14}>Drag & drop or</Text>

                  <Button
                    size="xs"
                    variant="light"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                  >
                    Browse
                  </Button>
                </Group>

                <input
                  id="fileInput"
                  type="file"
                  accept=".xlsx,.xls"
                  style={{ display: "none" }}
                  onChange={(e: any) => {
                    const selectedFile = e.target.files[0];
                    setFile(selectedFile);
                    if (selectedFile) handleFileUpload(selectedFile);
                  }}
                />
              </Box>
            </Stack>
          </Flex>
        </Box>

        <Button
          fullWidth
          mt={15}
          loading={loading}
          disabled={!file || studentsPayload.length === 0}
          onClick={handleCreateStudents}
          style={{
            background: "linear-gradient(135deg, #4B65F6, #6A5ACD)",
          }}
        >
          Upload & Add Students
        </Button>

        {/* SAMPLE FILE */}
        <a
          href="https://docs.google.com/spreadsheets/d/127Ihz4EyAOxJTBfKxCqDE-D_F3RojBa_/export?format=xlsx"
          style={{ textDecoration: "none" }}
        >
          <Text
            ta="center"
            mt={5}
            style={{
              fontSize: "14px",
              color: "#6A5ACD",
              fontWeight: 500,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Download the sample excel file
          </Text>
        </a>
        {/* <Text
          ta="center"
          mt={5}
          style={{
            fontSize: "14px",
            color: "#6A5ACD",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Download sample excel file
        </Text> */}
      </Stack>
    </Modal>
  );
}

export default UploadExcelAdmission;
