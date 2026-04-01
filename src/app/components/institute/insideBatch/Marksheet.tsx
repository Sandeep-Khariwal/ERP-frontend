
"use client";

import { Box, Button, Center, Flex, Select, Stack, Table, Text, } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { FaFileDownload } from "react-icons/fa";
import { Modal } from "@mantine/core";
import { Image, Group } from "@mantine/core";
import SingleStudentModal from "./SingleStudentModal";
import { useMediaQuery } from "@mantine/hooks";
import * as XLSX from "xlsx";
import { CreateExamMarksheet } from "@/axios/institute/InstitutePostApi";
import { StudentsDataWithBatch } from "@/interface/student.interface";
import { GetAllStudentsFromBatch, GetBatAllMarksheet } from "@/axios/institute/InstituteGetApi";
import { SuccessNotification } from "@/app/helperFunction/Notification";
const Marksheet = (props: {
  batchId: string;
  subjects: { _id: string; name: string }[];
}) => {
  console.log("Subjects from Marksheet 👉", props.subjects);

  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [batchStudents, setBatchStudents] = useState<{ _id: string, name: string, rollNumber: number }[]>([]);  //state me savee krvana batch student
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [openSingleStudentModal, setOpenSingleStudentModal] = useState(false);
  const isMobile = useMediaQuery(`(max-width: 968px)`);
  const [resultDate, setResultDate] = useState<Date | null>(null);
  const [allMarksheet, setAllMarksheet] = useState<{
    name: string;
    batch: string;
    student: string;
    marks: {
      subjectName: string;
      theory_marks: number;
      practical_marks: number;
      obtained_marks: number;
      grade: string;
    }[];
    date: Date;
  }[]>([])
  // 🔹 Dummy data (backend se replace karna hai)
  const students = [
    {
      name: "GURVEER",
      roll: "101",
      status: "Pass",
      grade: "A",
    },
  ];

  useEffect(() => {
    //get all subjects
    GetAllStudentsFromBatch(props.batchId)
      .then((x: any) => {
        const batchStudents = x.students.students.map((st: any) => {
          return {
            _id: st._id,
            name: st.name,
            rollNumber: Number(st.rollNumber)
          }
        })
        setBatchStudents(batchStudents);
        console.log("batch students : ", batchStudents);

      })
      .catch((e: any) => {
        console.log(e);

      })

    // get all marksheet
    GetBatAllMarksheet(props.batchId)
      .then((x: any) => {
        console.log("marksheet data  : ", x);


      })
      .catch((e: any) => {
        console.log(e);

      })
  }, [])


  const CreateMarksheet = () => {
    if (!file) {
      alert("Please upload file first");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = e.target.result;

      // 🔹 Excel read
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet);

      console.log("Excel Data 👉", jsonData);

      // 🔥 YAHI SE MAIN LOGIC START
      const studentsPayload = jsonData.map((student: any) => {

        const name = student["Name"];
        const roll = student["Roll No"];

        const subjectMap: any = {};

        Object.keys(student).forEach((key) => {

          if (key === "Name" || key === "Roll No" || key === "__rowNum__") return;

          // THEORY
          if (key.includes("(THEORY)")) {
            const subject = key.replace(" (THEORY)", "").trim();

            if (!subjectMap[subject]) {
              subjectMap[subject] = {
                subjectName: subject,
                theory_marks: 0,
                practical_marks: 0,
                obtained_marks: 0,
                grade: "A",
              };
            }

            subjectMap[subject].theory_marks = student[key];
          }

          // PRACTICAL
          if (key.includes("(PRACTICAL)")) {
            const subject = key.replace("(PRACTICAL)", "").trim();

            if (!subjectMap[subject]) {
              subjectMap[subject] = {
                subjectName: subject,
                theory_marks: 0,
                practical_marks: 0,
                obtained_marks: 0,
                grade: "A",
              };
            }

            subjectMap[subject].practical_marks = student[key];
          }

        });

        // 🔹 Convert to array
        const marks = Object.values(subjectMap).map((sub: any) => ({
          ...sub,
          obtained_marks: sub.theory_marks + sub.practical_marks,
        }));

        // 🔹 FINAL PAYLOAD
        return {
          name: selectedExam,
          batch: props.batchId, // 👈 apna batch id daal
          student: batchStudents.find((std: any) => std.name.toUpperCase() === name.toUpperCase() || Number(std.rollNumber) === Number(roll))?._id,
          marks: marks,
          // date: new Date(),
          date: resultDate,
          rollNumber: roll.toString(),
        };

      });

      console.log("studentsPayload : ", studentsPayload);



      // 🔹 API CALL for each student
      studentsPayload.forEach((payload: any) => {
        CreateExamMarksheet(payload)
          .then((x: any) => {
            console.log("Success ✅", x);
            SuccessNotification("Marksheet Created Success!!")
            setOpenUploadModal(false)
          })
          .catch((e: any) => {
            console.log(e);
            setOpenUploadModal(false)
          });
      });



    };

    reader.readAsBinaryString(file);
  };
  return (
    <>
      <Stack w={"100%"} mt={20}>

        <Text fw={700} fz={22}>
          Marksheet
        </Text>

        {/* 🔹 Top Buttons */}
        <Flex justify="space-between" align="center" mt={10} direction={isMobile ? "column" : "row"}
          gap={isMobile ? 10 : 0}>
          {/* Left buttons */}
          <Flex gap={10} direction={isMobile ? "column" : "row"}
            w={isMobile ? "100%" : "auto"}>
            <Button variant="outline"
              fullWidth={isMobile}
              c={"#111"}
              style={{ borderColor: "#111" }}
              onClick={() => setOpenSingleStudentModal(true)}>
              + Single Student
            </Button>

            <Button variant="outline"
              fullWidth={isMobile}
              c={"#111"}
              style={{ borderColor: "#111" }}
              onClick={() => setOpenUploadModal(true)}>

              Upload File
            </Button>
          </Flex>

          {/* Right dropdown */}
          <Select
            placeholder="Select Exam"
            data={["Mid TERM Exam", "Annual TERM Exam"]}
            value={selectedExam}
            onChange={setSelectedExam}
            // w={200}
            w={isMobile ? "100%" : 200}


          />
        </Flex>

        {/* 🔹 Table Container */}
        <Box
          // mt={20}
          // p={10}
          // w="100%"
          // style={{
          //   border: "1px solid #ccc",
          //   borderRadius: "8px",
          // }}
          style={{ overflowX: "auto" }}
        >
          <Table w={"100%"}
            mt={8}
            bg={"white"}
            // verticalSpacing="md"
            // horizontalSpacing="xl"

            // fz={18}
            verticalSpacing={isMobile ? "sm" : "md"}
            horizontalSpacing={isMobile ? "sm" : "xl"}
            fz={isMobile ? 14 : 18}

          >
            {/* 🔹 Table Header */}
            <Table.Thead
              bg={"linear-gradient(135deg, #D28BD9, #7585D8)"}
              style={{
                border: "2px solid transparent",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
              }}
            >
              <Table.Tr>
                <Table.Th
                  ta="left"
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 700,
                    color: "#2F4F4F",
                    fontSize: 18,
                  }}
                >
                  Name
                </Table.Th>
                <Table.Th
                  ta="center"
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 700,
                    color: "#2F4F4F",
                    fontSize: 18,
                  }}>Roll Number</Table.Th>
                <Table.Th
                  ta="center"
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 700,
                    color: "#2F4F4F",
                    fontSize: 18,
                  }}>Status</Table.Th>
                <Table.Th
                  ta="center"
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 700,
                    color: "#2F4F4F",
                    fontSize: 18,
                  }}>Grade</Table.Th>
                <Table.Th
                  ta="center"
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 700,
                    color: "#2F4F4F",
                    fontSize: 18,
                  }}>Download</Table.Th>
              </Table.Tr>
            </Table.Thead>

            {/* 🔹 Table Body */}
            <Table.Tbody style={{ width: "100%" }}>
              {students.map((item: any, index) => (
                <Table.Tr key={index} style={
                  item.isInActive
                    ? {
                      backgroundColor: "#FAFCFF",
                      textAlign: "center",
                      fontFamily: "Nunito",
                      padding: "1rem",
                    }
                    : {
                      // textAlign: "center",
                      fontFamily: "Nunito",
                      padding: "1rem",
                    }
                }>
                  <Table.Td
                    ta="left"
                    style={{
                      color: item.isInActive ? "#bebebe" : "#7D7D7D",
                      fontWeight: 500,
                      padding: "1rem",

                    }}
                  >
                    {item.name}
                  </Table.Td>
                  <Table.Td
                    ta="center"
                    style={{
                      color: item.isInActive ? "#bebebe" : "#7D7D7D",
                      fontWeight: 500,
                      padding: "1rem",
                    }}>{item.roll}</Table.Td>
                  <Table.Td
                    ta="center"
                    style={{
                      color: item.isInActive ? "#bebebe" : "#7D7D7D",
                      fontWeight: 500,
                      padding: "1rem",
                    }}>{item.status}</Table.Td>
                  <Table.Td
                    ta="center"
                    style={{
                      color: item.isInActive ? "#bebebe" : "#7D7D7D",
                      fontWeight: 500,
                      padding: "1rem",
                    }}>{item.grade}</Table.Td>
                  <Table.Td
                    ta="center"
                    style={{
                      color: item.isInActive ? "#bebebe" : "#7D7D7D",
                      fontWeight: 500,
                      padding: "1rem",
                    }}>
                    <FaFileDownload

                      size={24}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        console.log("Download clicked");
                      }}
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      </Stack>

      <Modal
        opened={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        title="Upload Marksheet"
        centered
        size="lg"
      >
        <Stack>
          <Flex gap={20} align="flex-end">
            {/* 🔹 Select Exam */}
            <Select
              placeholder="Select Exam"
              data={["Mid TERM Exam", "Annual TERM Exam"]}
              value={selectedExam}
              onChange={setSelectedExam}
              w={200}
            />
            <DateInput
              placeholder="Select Result Date"
              value={resultDate}
              onChange={setResultDate}
              label="Result Date"
              w={200}
            />
          </Flex>
          <Box
          // mt={10}
          // p={20}
          // style={{
          //   border: "1px solid #eee",
          //   borderRadius: "12px",
          //   backgroundColor: "#fafafa",
          // }}
          >
            <Flex align="center" justify="space-between" gap={20}>

              {/* 🔹 LEFT IMAGE */}
              <Image
                src="/modallogo.jpeg"
                alt="upload"
                style={{ width: "60%", maxHeight: 180, objectFit: "contain" }}
              />

              {/* 🔹 RIGHT CONTENT */}
              <Stack w="60%">

                <Text fw={700} fz={20}>
                  Upload Excel File
                </Text>

                <Text c="dimmed" fz={14}>
                  Generate marksheets for multiple students at once.
                </Text>
                {/* 🔹 Drag & Drop Box */}
                <Box
                  style={{
                    border: "1px dashed #ccc",
                    borderRadius: "10px",
                    padding: "20px",
                    textAlign: "center",
                    backgroundColor: "#fff",
                  }}
                >
                  <Text mb={8}>⬆️</Text>

                  <Group justify="center" gap={6}>
                    <Text fz={14}>
                      Drag & drop your file here or
                    </Text>

                    <Button
                      size="xs"
                      variant="light"
                      disabled={!selectedExam} // 👈 condition
                      onClick={() => document.getElementById("fileInput")?.click()}
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
                      setFile(e.target.files[0]);
                    }}
                    disabled={!selectedExam} // 👈 condition
                  />
                </Box>
              </Stack>
            </Flex>
          </Box>

          <Button
            fullWidth
            mt={15}
            size="md"
            style={{
              background: "linear-gradient(135deg, #4B65F6, #6A5ACD)",
            }}
            disabled={!file || !selectedExam || !resultDate}
            onClick={() => CreateMarksheet()}
          >
            Upload & Generate
          </Button>
          {/* <Text ta="center"
            mt={5}
            style={{
              fontSize: "14px",
              color: "#6A5ACD",
              fontWeight: 500,
              cursor: "pointer",
              textDecoration: "underline",
            }}>Download the sample excel file</Text> */}
          <a
            href="https://docs.google.com/uc?export=download&id=1NhUESVU2B8mEVI67KR2QrFr2jdmSD9lf"
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
        </Stack>
      </Modal>

      <SingleStudentModal
        opened={openSingleStudentModal}
        onClose={() => setOpenSingleStudentModal(false)}
        // subjects={props.subjects ?? []}
        batchId={props.batchId}
        batchStudents={batchStudents}
      />
    </>
  );
};


export default Marksheet;