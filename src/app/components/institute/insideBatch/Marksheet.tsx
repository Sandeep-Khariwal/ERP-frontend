"use client";

import { Box, Button, Center, Flex, Select, Stack, Table, Text, TextInput, } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { IconDownload, IconArrowLeftFromArc, } from "@tabler/icons-react";
import { Modal } from "@mantine/core";
import { Image, Group } from "@mantine/core";
import SingleStudentModal from "./SingleStudentModal";
import { useMediaQuery } from "@mantine/hooks";
import * as XLSX from "xlsx";
import { CreateExamMarksheet, CreateExamMarksheetForExcel } from "@/axios/institute/InstitutePostApi";
import { GetAllStudentsFromBatch, GetBatAllMarksheet, GetStudentDetail } from "@/axios/institute/InstituteGetApi";
import { ErrorNotification, SuccessNotification } from "@/app/helperFunction/Notification";
import { GetGrade } from "../helperFunctions";
import { useAppSelector } from "@/app/redux/redux.hooks";
import { createMarksheetPdf } from "./CreateMarksheetPdf";
const Marksheet = (props: {
  batchId: string;
  subjects: { _id: string; name: string }[];
}) => {
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails,
  );
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [batchStudents, setBatchStudents] = useState<{ _id: string, name: string, rollNumber: number }[]>([]);  //state me savee krvana batch student
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [openSingleStudentModal, setOpenSingleStudentModal] = useState(false);
  const isMobile = useMediaQuery(`(max-width: 968px)`);
  const [resultDate, setResultDate] = useState<Date | null>(null);
  const [session, setSession] = useState<string>("");
  const [filterExam, setFilterExam] = useState<string | null>("Mid TERM Exam");   //table me filter data ke liye 
  const [studentsPayload, setStudentsPayload] = useState<any[]>([]);
  const [allMarksheet, setAllMarksheet] = useState<{
    name: string;
    batch: string;
    session: string;
    student: {
      enrollmentNo: string;
      name: string;
      rollNumber: string;
      _id: string;
    };
    marks: {
      subjectName: string;
      theory_marks: number;
      practical_marks: number;
      obtained_marks: number;
      grade: string;
    }[];
    date: Date;
    totalMarks: number;
    percentage: number;
    overallGrade: string;
    status: string;
  }[]>([])


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

      })
      .catch((e: any) => {
        console.log(e);

      })
    GetResult()
  }, [])

  const GetResult = () => {
    // get all marksheet
    GetBatAllMarksheet(props.batchId)
      .then((x: any) => {
        setAllMarksheet(x.marksheets)
      })
      .catch((e: any) => {
        console.log(e);

      })
  }

  const processMarks = (marksArray: any[]) => {
    return marksArray.map((item) => {
      const obtained = item.theory_marks + item.practical_marks;

      return {
        ...item,
        obtained_marks: obtained,
        grade: GetGrade(obtained),
      };
    });
  };

  const calculateOverall = (marks: any[]) => {
    let total = 0;

    marks.forEach((m: any) => {
      let obtained_marks = m.practical_marks + m.theory_marks
      total += obtained_marks;
    });

    const percentage = total / marks.length;

    // 👉 Grade (same function use kar sakta hai)
    const overallGrade = GetGrade(percentage);

    // 👉 Status logic (customize kar sakta hai)
    const isFail = marks.some((m: any) => m.obtained_marks < 33);

    const status = isFail ? "Fail" : "Pass";

    return {
      totalMarks: total,
      percentage,
      overallGrade,
      status,
    };
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = e.target.result;

      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      let errorFound = false;

      const payload = jsonData.map((student: any, index: number) => {
        const name = student["Name"];
        const roll = student["Roll No"];

        // ❌ VALIDATION 1: Roll number missing
        if (!roll) {
          errorFound = true;
          // alert(`Row ${index + 2}: Roll Number missing`);
          ErrorNotification("Roll Number missing!");
          return null;
        }

        const subjectMap: any = {};

        Object.keys(student).forEach((key) => {
          if (key === "Name" || key === "Roll No" || key === "__rowNum__") return;

          if (key.includes("(THEORY)")) {
            const subject = key.replace(" (THEORY)", "").trim();

            if (!subjectMap[subject]) {
              subjectMap[subject] = {
                subjectName: subject,
                theory_marks: 0,
                practical_marks: 0,
              };
            }

            subjectMap[subject].theory_marks = student[key] || 0;
          }

          if (key.includes("(PRACTICAL)")) {
            const subject = key.replace("(PRACTICAL)", "").trim();

            if (!subjectMap[subject]) {
              subjectMap[subject] = {
                subjectName: subject,
                theory_marks: 0,
                practical_marks: 0,
              };
            }

            subjectMap[subject].practical_marks = student[key] || 0;
          }
        });

        const rawMarks = Object.values(subjectMap);
        const overall = calculateOverall(rawMarks);

        if (!rawMarks.length) {
          return null;
        }

        const marks = processMarks(rawMarks);

        return {
          name: selectedExam,
          batch: props.batchId,
          student: batchStudents.find(
            (std: any) =>
              std.name.toUpperCase() === name?.toUpperCase() ||
              Number(std.rollNumber) === Number(roll)
          )?._id,
          marks,
          date: resultDate ? resultDate.toISOString() : null,
          rollNumber: roll.toString(),
          session: session,
          ...overall
        };
      });

      // null values hatao
      const finalPayload = payload.filter((p: any) => p !== null);

      setStudentsPayload(finalPayload);

      if (!errorFound) {
        SuccessNotification("File processed successfully ✅");
      }
    };

    reader.readAsBinaryString(file);
  };

  const CreateMarksheet = () => {
    if (studentsPayload.length === 0) {
      // alert("No valid data found!");
      ErrorNotification("No valid data found!")
      return;
    }
    console.log("🚀 API PAYLOAD:", studentsPayload);
    CreateExamMarksheetForExcel(studentsPayload)
      .then((x: any) => {
        console.log("x :", x);
        // GetResult()
        const newMarksheet = x.map((item: any) => item.marksheet);

        // 👉 update state without API call
        setAllMarksheet((prev) => [...prev, ...newMarksheet]);

        SuccessNotification("Marksheet Created Success!!")
        setOpenUploadModal(false)
      })
      .catch((e: any) => {
        console.log(e);
        setOpenUploadModal(false)
      });
  };
  //table me filter kiya data 
  const filteredMarksheet = filterExam
    ? allMarksheet.filter((item) => item.name === filterExam)
    : [];

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
            value={filterExam}
            onChange={setFilterExam}
            // w={200}
            w={isMobile ? "100%" : 200}


          />
        </Flex>

        {/* 🔹 Table Container */}
        <Box

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
                    whiteSpace:"nowrap"
                  }}>Roll Nomber</Table.Th>
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
              {!filterExam && (
                <Table.Tr>
                  <Table.Td colSpan={5} ta="center">
                    Please select exam to view results
                  </Table.Td>
                </Table.Tr>
              )}
              {filterExam && filteredMarksheet.map((item: any, index) => (
                <Table.Tr key={index} style={

                  {
                    backgroundColor: "#FAFCFF",
                    textAlign: "center",
                    fontFamily: "Nunito",
                    padding: "1rem"
                  }
                }

                >

                  <Table.Td
                    ta="left"
                    style={{
                      // color: item.isInActive ? "#bebebe" : "#7D7D7D",
                      color: "#00000098",
                      fontWeight: 500,
                      padding: "1rem",

                    }}
                  >
                    {item.student.name}
                  </Table.Td>
                  <Table.Td
                    ta="center"
                    style={{
                      // color: item.isInActive ? "#bebebe" : "#7D7D7D",
                      color: "#00000098",
                      fontWeight: 500,
                      padding: "1rem",
                    }}>{item.student.rollNumber}</Table.Td>
                  <Table.Td
                    ta="center"
                    style={{
                      // color: item.isInActive ? "#bebebe" : "#7D7D7D",
                      color: "#00000098",
                      fontWeight: 500,
                      padding: "1rem",
                    }}>{item.status}</Table.Td>
                  <Table.Td
                    ta="center"
                    style={{
                      // color: item.isInActive ? "#bebebe" : "#7D7D7D",
                      color: "#00000098",
                      fontWeight: 500,
                      padding: "1rem",
                    }}>{item.overallGrade}</Table.Td>
                  <Table.Td
                    ta="center"
                    style={{
                      // color: item.isInActive ? "#bebebe" : "#7D7D7D",
                      color: "#00000098",
                      fontWeight: 500,
                      padding: "1rem",
                    }}>

                    <IconArrowLeftFromArc
                      size={24}
                      style={{ cursor: "pointer", color: "#00000098" }}
                      onClick={() => {


                        GetStudentDetail(item.student._id)
                          .then((res: any) => {
                            console.log("student details : ", res);
                            const student = res.student

                            const html = createMarksheetPdf({
                              instituteName: institute?.name,
                              examName: item.name,
                              batchName: item.batch.name,
                              studentName: item.student.name,
                              rollNumber: item.student.rollNumber,
                              enrolment: item.student.enrollmentNo,
                              marks: item.marks,
                              totalMarks: item.totalMarks,
                              percentage: item.percentage,
                              overallGrade: item.overallGrade,
                              status: item.status,
                              allsubjecttotal: item.marks.length * 100,
                              date: new Date(item.date).toLocaleDateString("en-GB"),
                              session: item.session,
                              fName:student.parentName,
                              address:student.address,
                              parentNumber:student.parentNumber,
                              dob: new Date(student.dateOfBirth).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric"
}),
                              photo:student.profilePic,
                              instituteLogo:student.instituteId.logo,
                              instituteAdress:student.instituteId.address,
                              institutePhone: student.instituteId.institutePhoneNumber

                            });

                            const printWindow = window.open("", "_blank");

                            if (printWindow) {
                              printWindow.document.write(html);
                              printWindow.document.close();
                              // printWindow.print();
                              printWindow.onload = () => {
                                setTimeout(() => {
                                  printWindow.print();
                                }, 800); // 👈 thoda zyada delay safe hai
                              };
                            }
                          })
                          .catch((e) => {
                            console.log(e);

                          })

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
              label="Select Exam"
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
            <TextInput
              placeholder="2026-2027"
              label="Session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              w={200}
            />
          </Flex>
          <Box

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
                    // onChange={(e: any) => {
                    //   setFile(e.target.files[0]);
                    // }}
                    onChange={(e: any) => {
                      const selectedFile = e.target.files[0];
                      setFile(selectedFile);

                      if (selectedFile) {
                        handleFileUpload(selectedFile); // 👈 YAHAN CALL
                      }
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
            disabled={!file || !selectedExam || !resultDate || !session}
            onClick={() => CreateMarksheet()}
          >
            Upload & Generate
          </Button>

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
        refreshData={(data) => {
          setAllMarksheet((prev) => [...prev, data])
        }}
      />
    </>
  );
};


export default Marksheet;