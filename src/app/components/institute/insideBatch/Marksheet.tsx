"use client";

import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { IconArrowLeftFromArc } from "@tabler/icons-react";
import { Menu, ActionIcon } from "@mantine/core";

import { IconDownload, IconTrash, IconDotsVertical, IconClipboardList } from "@tabler/icons-react";
import { Modal } from "@mantine/core";
import { Image, Group } from "@mantine/core";
import SingleStudentModal from "./SingleStudentModal";
import { useMediaQuery } from "@mantine/hooks";
// XLSX (~230 KB) is loaded on demand inside handleFileUpload instead of
// being bundled into every Marksheet tab load — it's only ever needed
// when the user actually picks a file to bulk-import.
import {

  CreateExamMarksheetForExcel,
  GetMarksheetDesign,
} from "@/axios/institute/InstitutePostApi";
import {
  GetAllStudentsFromBatch,
  GetBatAllMarksheet,
  GetMidExamMarksheet,
  GetStudentDetail,
} from "@/axios/institute/InstituteGetApi";
import {
  ErrorNotification,
  getBase64Image,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import { GetGrade } from "../helperFunctions";
import { useAppSelector } from "@/app/redux/redux.hooks";
import {
  createAcadmyMarksheetPdf,
  createCombinedMarksheetPdf,
  createMarksheetPdf,
} from "./CreateMarksheetPdf";
import { formatDate } from "../../marketing/utility/utils";
import QRCode from "qrcode";
import { DeleteMarksheet } from "@/axios/institute/InstitutePutApi";
import { getAnnualTermMarksheetHtml, getMidTermMarksheetHtml } from "./MarksheetDesignHelper";

const Marksheet = (props: {
  batchId: string;
  subjects: { _id: string; name: string }[];
}) => {
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails,
  );
  console.log("institye :", institute);

  const [savedDesignId, setSavedDesignId] = useState<string | null>(null);
const [designLoading, setDesignLoading] = useState(false);
  
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [batchStudents, setBatchStudents] = useState<
    { _id: string; name: string; rollNumber: number }[]
  >([]); //state me savee krvana batch student
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [openSingleStudentModal, setOpenSingleStudentModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const isMobile = useMediaQuery(`(max-width: 968px)`);
  const [resultDate, setResultDate] = useState<Date | null>(null);
  const [session, setSession] = useState<string>("");
  const [filterExam, setFilterExam] = useState<string | null>("Mid TERM Exam"); //table me filter data ke liye
  const [studentsPayload, setStudentsPayload] = useState<any[]>([]);
  const [selectedMarksheetId, setSelectedMarksheetId] = useState<string>("");
  const [allMarksheet, setAllMarksheet] = useState<
    {
      _id: string;
      name: string;
      batch: string;
      session: string;
      student: {
        enrollmentNo: string;
        name: string;
        rollNumber: string;
        _id: string;
         instituteId?: {
    _id: string;
    name: string;
    midTermMarksheetDesignId: string;
    annualTermMarksheetDesignId: string;
  };
      };
      marks: {
        subjectName: string;
        theory_marks: number;
        practical_marks: number;
        obtained_marks: number;
        periodic_test: number;
        note_book: number;
        subject_enrichment: number;
        grade: string;
      }[];
      activity: {
        subjectName: string;
        grade: string;
      }[];
      skills: {
        subjectName: string;
        grade: string;
      }[];
      date: Date;
      totalMarks: number;
      percentage: number;
      overallGrade: string;
      status: string;
    }[]
  >([]);

  useEffect(() => {
    //get all subjects
    GetAllStudentsFromBatch(props.batchId)
      .then((x: any) => {
        console.log("student :",x);
        
        const batchStudents = x.students.students.map((st: any) => {
          return {
            _id: st._id,
            name: st.name,
            rollNumber: Number(st.rollNumber),
          };
        });
        setBatchStudents(batchStudents);
      })
      .catch((e: any) => {
        console.log(e);
      });


    GetResult();
  }, []);
useEffect(() => {
  const fetchSavedDesign = async () => {
    if (!institute?._id) return;

    try {
      setDesignLoading(true);

      const response: any = await GetMarksheetDesign(institute._id);

      const data = response?.data ?? response;

      setSavedDesignId(data?.selection?.designId ?? null);

      console.log("Saved marksheet design:", data);
      console.log("Design ID:", data?.selection?.designId);
    } catch (error) {
      console.error("Fetch marksheet design error:", error);
      setSavedDesignId(null);
    } finally {
      setDesignLoading(false);
    }
  };

  fetchSavedDesign();
}, [institute?._id]);

  // const GetResult = () => {
  //   // get all marksheet
  //   GetBatAllMarksheet(props.batchId)
  //     .then((x: any) => {
  //       setAllMarksheet(x.marksheets);
  //       setFilterExam("Mid TERM");
  //     })
  //     .catch((e: any) => {
  //       console.log(e);
  //     });
  // };
  const GetResult = () => {
  GetBatAllMarksheet(props.batchId)
    .then((x: any) => {
      console.log("All marksheets:", x.marksheets);

      const marksheets = x.marksheets ?? [];

      setAllMarksheet(marksheets);
      setFilterExam("Mid TERM");
    })
    .catch((e: any) => {
      console.error("Get marksheets error:", e);
    });
};

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
      let obtained_marks = m.practical_marks + m.theory_marks;
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

    reader.onload = async (e: any) => {
      const data = e.target.result;

      const XLSX = await import("xlsx");
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
        const activitySubjectMap: any = {};
        const skillsSubjectMap: any = {};

        Object.keys(student).forEach((key) => {
          if (key === "Name" || key === "Roll No" || key === "__rowNum__")
            return;

          if (key.includes("(THEORY)")) {
            const subject = key.replace(" (THEORY)", "").trim();

            if (!subjectMap[subject]) {
              subjectMap[subject] = {
                subjectName: subject,
                theory_marks: 0,
                practical_marks: 0,
                periodic_test: 0,
                note_book: 0,
                subject_enrichment: 0,
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
                periodic_test: 0,
                note_book: 0,
                subject_enrichment: 0,
              };
            }

            subjectMap[subject].practical_marks = student[key] || 0;
          }
          if (key.includes("(PERIODIC TEST)")) {
            const subject = key.replace("(PERIODIC TEST)", "").trim();

            if (!subjectMap[subject]) {
              subjectMap[subject] = {
                subjectName: subject,
                theory_marks: 0,
                practical_marks: 0,
                periodic_test: 0,
                note_book: 0,
                subject_enrichment: 0,
              };
            }

            subjectMap[subject].periodic_test = student[key] || 0;
          }
          if (key.includes("(NOTEBOOK)")) {
            const subject = key.replace("(NOTEBOOK)", "").trim();

            if (!subjectMap[subject]) {
              subjectMap[subject] = {
                subjectName: subject,
                theory_marks: 0,
                practical_marks: 0,
                periodic_test: 0,
                note_book: 0,
                subject_enrichment: 0,
              };
            }

            subjectMap[subject].note_book = student[key] || 0;
          }
          if (key.includes("(SUBJECT ENRICHMENT)")) {
            const subject = key.replace("(SUBJECT ENRICHMENT)", "").trim();

            if (!subjectMap[subject]) {
              subjectMap[subject] = {
                subjectName: subject,
                theory_marks: 0,
                practical_marks: 0,
                periodic_test: 0,
                note_book: 0,
                subject_enrichment: 0,
              };
            }

            subjectMap[subject].subject_enrichment = student[key] || 0;
          }

          if (key.includes("ACTIVITY")) {
            const subject = key.replace("(GRADE ACTIVITY)", "").trim();

            if (!activitySubjectMap[subject]) {
              activitySubjectMap[subject] = {
                subjectName: subject,
                grade: "",
              };
            }

            activitySubjectMap[subject].grade = student[key] || "";
          }

          if (key.includes("SKILLS")) {
            const subject = key.replace("(GRADE SKILLS)", "").trim();

            if (!skillsSubjectMap[subject]) {
              skillsSubjectMap[subject] = {
                subjectName: subject,
                grade: "",
              };
            }

            skillsSubjectMap[subject].grade = student[key] || "";
          }
        });

        const rawMarks = Object.values(subjectMap);
        const rawActivity = Object.values(activitySubjectMap);
        const rawSkills = Object.values(skillsSubjectMap);
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
              Number(std.rollNumber) === Number(roll),
          )?._id,
          marks,
          date: resultDate ? resultDate.toISOString() : null,
          rollNumber: roll.toString(),
          session: session,
          activity: rawActivity,
          skills: rawSkills,
          ...overall,
        };
      });

      // null values hatao
      const finalPayload = payload.filter((p: any) => p !== null);

      console.log("finalPayload : ", finalPayload);

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
      ErrorNotification("No valid data found!");
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

        SuccessNotification("Marksheet Created Success!!");
        setOpenUploadModal(false);
      })
      .catch((e: any) => {
        console.log(e);
        setOpenUploadModal(false);
      });
  };

  const HandleDeleteMarksheet = () => {
    if (!selectedMarksheetId) {
      ErrorNotification("Marksheet id missing!");
      return;
    }

    DeleteMarksheet(selectedMarksheetId)
      .then((x: any) => {
        console.log("delete response :", x);

        // state se remove
        setAllMarksheet((prev: any) =>
          prev.filter((item: any) => item._id !== selectedMarksheetId),
        );

        SuccessNotification("Marksheet Deleted Successfully!");

        setDeleteModalOpen(false);
        setSelectedMarksheetId("");
      })
      .catch((e: any) => {
        console.log(e);

        ErrorNotification("Failed to delete marksheet!");
        setDeleteModalOpen(false);
      });
  };
  //table me filter kiya data
  const filteredMarksheet = filterExam
    ? allMarksheet.filter((item) => item.name === filterExam || item.name === filterExam + " Exam")
    : [];

  return (
    <>
      <Stack w={"100%"} mt={20}>
        <Box
          p={20}
          style={{
            borderRadius: "16px",
            background: "#EEF3FF",
            border: "1px solid #DCE7FF",
          }}
        >
          <Flex
            justify="space-between"
            align={isMobile ? "flex-start" : "center"}
            direction={isMobile ? "column" : "row"}
            gap={16}
          >
            <Flex align="center" gap={14}>
              <Flex
                align="center"
                justify="center"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background: "#FFFFFF",
                }}
              >
                <IconClipboardList size={22} color="#2F6FED" />
              </Flex>
              <Stack gap={2}>
                <Text fw={700} fz={22} c="#1B2559">
                  Marksheet
                </Text>
                <Text fz={13} c="#5B6B8C">
                  Review results, publish marks, and manage student records.
                </Text>
              </Stack>
            </Flex>

            <Flex
              gap={10}
              direction={isMobile ? "column" : "row"}
              w={isMobile ? "100%" : "auto"}
            >
              <Button
                variant="default"
                radius={10}
                fullWidth={isMobile}
                styles={{
                  root: {
                    border: "1px solid #E2E8F0",
                    fontWeight: 600,
                    color: "#33415C",
                  },
                }}
                onClick={() => setOpenUploadModal(true)}
              >
                Upload File
              </Button>
              <Button
                radius={10}
                fullWidth={isMobile}
                styles={{
                  root: {
                    background: "linear-gradient(135deg, #4F7CFB 0%, #2F6FED 100%)",
                    border: 0,
                    fontWeight: 600,
                  },
                }}
                onClick={() => setOpenSingleStudentModal(true)}
              >
                + Single Student
              </Button>
            </Flex>
          </Flex>
        </Box>

        {/* 🔹 Top Buttons */}
        <Flex
          justify="flex-end"
          align="center"
          mt={4}
          direction={isMobile ? "column" : "row"}
          gap={isMobile ? 10 : 0}
        >
          {/* Right dropdown */}
          <Select
            placeholder="Select Exam"
            data={["Mid TERM", "Annual TERM"]}
            value={filterExam}
            onChange={setFilterExam}
            radius={10}
            // w={200}
            w={isMobile ? "100%" : 200}
          />
        </Flex>

        {/* 🔹 Table Container */}
        <Box
          style={{
            overflowX: "auto",
            borderRadius: "16px",
            border: "1px solid #F1F4F9",
          }}
        >
          <Table
            w={"100%"}
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
              bg={"#F7F9FC"}
              style={{
                borderBottom: "1px solid #EEF1F6",
              }}
            >
              <Table.Tr>
                <Table.Th
                  ta="left"
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 600,
                    color: "#64748B",
                    fontSize: 13,
                  }}
                >
                  Name
                </Table.Th>
                <Table.Th
                  ta="center"
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 600,
                    color: "#64748B",
                    fontSize: 13,
                    whiteSpace: "nowrap",
                  }}
                >
                  Roll Nomber
                </Table.Th>
                <Table.Th
                  ta="center"
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 600,
                    color: "#64748B",
                    fontSize: 13,
                  }}
                >
                  Status
                </Table.Th>
                <Table.Th
                  ta="center"
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 600,
                    color: "#64748B",
                    fontSize: 13,
                  }}
                >
                  Grade
                </Table.Th>
                <Table.Th
                  ta="center"
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 600,
                    color: "#64748B",
                    fontSize: 13,
                  }}
                >
                  Action
                </Table.Th>
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
              {filterExam &&
                filteredMarksheet.map((item: any, index) => (
                  <Table.Tr
                    key={index}
                    style={{
                      textAlign: "center",
                      fontFamily: "Nunito",
                      borderBottom: "1px solid #F1F5F9",
                    }}
                  >
                    <Table.Td
                      ta="left"
                      style={{
                        color: "#1B2559",
                        fontWeight: 600,
                        padding: "1rem",
                      }}
                    >
                      {item.student?.name}
                    </Table.Td>
                    <Table.Td
                      ta="center"
                      style={{
                        color: "#64748B",
                        fontWeight: 500,
                        padding: "1rem",
                      }}
                    >
                      {item.student?.rollNumber}
                    </Table.Td>
                    <Table.Td
                      ta="center"
                      style={{
                        padding: "1rem",
                      }}
                    >
                      <Badge
                        variant="light"
                        radius="xl"
                        size="lg"
                        styles={{
                          root: {
                            textTransform: "none",
                            backgroundColor:
                              item.status === "Pass" ? "#EAF7EE" : "#FDEDED",
                            color:
                              item.status === "Pass" ? "#1E8E3E" : "#D93025",
                          },
                        }}
                      >
                        {item.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td
                      ta="center"
                      style={{
                        padding: "1rem",
                      }}
                    >
                      <Badge
                        variant="light"
                        radius="xl"
                        size="lg"
                        color="grape"
                        styles={{
                          root: {
                            textTransform: "none",
                          },
                        }}
                      >
                        {item.overallGrade}
                      </Badge>
                    </Table.Td>
                  
                    <Table.Td
                      ta="center"
                      style={{
                        color: "#00000098",
                        fontWeight: 500,
                        padding: "1rem",
                      }}
                    >
                      <Menu shadow="md" width={180} position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical size={22} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                       
                          <Menu.Item
//   leftSection={<IconDownload size={18} />}
//   onClick={async () => {
//     try {
//       const url = `https://shikshapay.cloud/marksheet/${item._id}`;
//       const qr = await QRCode.toDataURL(url);
//       const isAcadmy = institute?.isAcadmy;

//       const res: any = await GetStudentDetail(item.student._id);
//       const student = res.student;

//       if (!student) {
//         ErrorNotification("Student details not found!");
//         return;
//       }
//    const midTermDesignId =
//   student.instituteId?.midTermMarksheetDesignId;

// const annualTermDesignId =
//   student.instituteId?.annualTermMarksheetDesignId;

// console.log("Mid Term Design ID:", midTermDesignId);
// console.log("Annual Term Design ID:", annualTermDesignId);

//       const base64Photo = await getBase64Image(student.profilePic);
//       const base64Logo = await getBase64Image(student.instituteId.logo);
//       const base64Signature = await getBase64Image(
//         student.instituteId.signature,
//       );

    
//       const commonData = {
//         instituteName: institute?.name,
//         batchName: item.batch?.name,
//         studentName: item.student?.name,
//         rollNumber: item.student?.rollNumber,
//         enrolment: item.student?.enrollmentNo,
//         fName: student.parentName,
//         address: student.address,
//         parentNumber: student.parentNumber,
//         dob: formatDate(student.dateOfBirth),
//         photo: base64Photo,
//         instituteLogo: base64Logo,
//         principalSignature: base64Signature,
//         instituteAdress: student.instituteId.address,
//         institutePhone: student.instituteId.institutePhoneNumber,
//         qr,
//       };

    
//       const currentMarksheet = {
//         ...commonData,
//         examName: item.name,
//         marks: item.marks ?? [],
//         activity: item.activity ?? [],
//         skills: item.skills ?? [],
//         totalMarks: item.totalMarks,
//         percentage: item.percentage,
//         overallGrade: item.overallGrade,
//         status: item.status,
//         allsubjecttotal: (item.marks ?? []).length * 100,
//         date: new Date(item.date).toLocaleDateString("en-GB"),
//         session: item.session,
//       };

//       let term1: any = currentMarksheet;
//       let term2: any = currentMarksheet;
//       let html = "";
// if(res.student.instituteId.midTermMarksheetDesignId==='temp_1mid' && filterExam?.includes("Mid")){
//       html = createMarksheetPdf(currentMarksheet);
// }else if(res.student.instituteId.annualTermMarksheetdesignId==='temp_1annual' && filterExam?.includes("Annual")){
//  html = createCombinedMarksheetPdf(term1, term2);
// }

// // else if(res.student.instituteId.midtermId==='temp_2mid'){

// // }else if(res.student.instituteId.midtermId==='temp_2annual'){

// // }
//       // if (isAcadmy) 
//       //   html = createAcadmyMarksheetPdf(currentMarksheet);
//       // } else if (filterExam?.includes("Annual")) {
      
//       //   let midMarksheet: any = null;

//       //   try {
//       //     const midResponse: any = await GetMidExamMarksheet(
//       //       item.batch?._id ?? props.batchId,
//       //       item.student?._id,
//       //     );

//       //     console.log("Mid Term API response:", midResponse);
//       //     console.log("Annual marksheet:", item);

//       //     midMarksheet = midResponse?.marksheet ?? null;
//       //   } catch (error) {
       
//       //     console.warn("Mid Term marksheet unavailable:", error);
//       //   }

//       //   term2 = currentMarksheet;

//       //   if (midMarksheet?.marks?.length) {
//       //     term1 = {
//       //       ...commonData,
//       //       examName: midMarksheet.name,
//       //       marks: midMarksheet.marks,
//       //       activity: midMarksheet.activity ?? [],
//       //       skills: midMarksheet.skills ?? [],
//       //       totalMarks: midMarksheet.totalMarks,
//       //       percentage: midMarksheet.percentage,
//       //       overallGrade: midMarksheet.overallGrade,
//       //       status: midMarksheet.status,
//       //       allsubjecttotal: midMarksheet.marks.length * 100,
//       //       date: new Date(midMarksheet.date).toLocaleDateString("en-GB"),
//       //       session: midMarksheet.session,
//       //     };

//       //     // Both terms exist: generate combined PDF
//       //     html = createCombinedMarksheetPdf(term1, term2);
//       //   } else {
//       //     // Mid TERM missing: generate Annual TERM PDF only
//       //     html = createMarksheetPdf(currentMarksheet);
//       //   }
//       // } else {
//       //   // Mid TERM selected: generate its single PDF
//       //   html = createMarksheetPdf(currentMarksheet);
//       // }

//       if (!html) {
//         ErrorNotification("Unable to generate marksheet PDF!");
//         return;
//       }

//       // Open print window
//       const printWindow = window.open("", "_blank");

//       if (!printWindow) {
//         ErrorNotification(
//           "Please allow pop-ups in your browser to download the marksheet.",
//         );
//         return;
//       }

//       printWindow.document.open();
//       printWindow.document.write(html);
//       printWindow.document.close();

      
//       printWindow.onload = () => {
//         printWindow.focus();
//         printWindow.print();
//       };

    
//       setTimeout(() => {
//         if (!printWindow.closed) {
//           printWindow.focus();
//           printWindow.print();
//         }
//       }, 1000);
//     } catch (error) {
//       console.error("Download marksheet error:", error);
//       ErrorNotification("Failed to generate marksheet!");
//     }
//   }}




  // leftSection={<IconDownload size={18} />}
  // onClick={async () => {
  //   try {
  //     const url = `https://shikshapay.cloud/marksheet/${item._id}`;
  //     const qr = await QRCode.toDataURL(url);

  //     // 1. Get complete student details
  //     const res: any = await GetStudentDetail(item.student._id);
  //     const student = res?.student;

  //     if (!student) {
  //       ErrorNotification("Student details not found!");
  //       return;
  //     }

  //     // 2. Get design IDs directly from institute
  //     const instituteData = student.instituteId;

  //     const midTermDesignId =
  //       instituteData?.midTermMarksheetDesignId;

  //     const annualTermDesignId =
  //       instituteData?.annualTermMarksheetDesignId;

  //     console.log("Mid Term Design ID:", midTermDesignId);
  //     console.log("Annual Term Design ID:", annualTermDesignId);
  //     console.log("Selected Exam:", item.name);

  //     // 3. Convert images to base64
  //     const base64Photo = await getBase64Image(student.profilePic);
  //     const base64Logo = await getBase64Image(instituteData?.logo);
  //     const base64Signature = await getBase64Image(
  //       instituteData?.signature
  //     );

  //     // 4. Common data for both marksheets
  //     const commonData = {
  //       instituteName: instituteData?.name || institute?.name,
  //       batchName: item.batch?.name,
  //       studentName: student.name || item.student?.name,
  //       rollNumber: item.student?.rollNumber,
  //       enrolment: item.student?.enrollmentNo,
  //       fName: student.parentName,
  //       address: student.address,
  //       parentNumber: student.parentNumber,
  //       dob: formatDate(student.dateOfBirth),
  //       photo: base64Photo,
  //       instituteLogo: base64Logo,
  //       principalSignature: base64Signature,
  //       instituteAdress: instituteData?.address,
  //       institutePhone: instituteData?.institutePhoneNumber,
  //       qr,
  //     };

  //     // 5. Current selected marksheet data
  //     const currentMarksheet = {
  //       ...commonData,
  //       examName: item.name,
  //       marks: item.marks ?? [],
  //       activity: item.activity ?? [],
  //       skills: item.skills ?? [],
  //       totalMarks: item.totalMarks,
  //       percentage: item.percentage,
  //       overallGrade: item.overallGrade,
  //       status: item.status,
  //       allsubjecttotal: (item.marks ?? []).length * 100,
  //       date: item.date
  //         ? new Date(item.date).toLocaleDateString("en-GB")
  //         : "",
  //       session: item.session,
  //     };

  //     let html = "";

  //     // 6. MID TERM: temp_1mid -> single marksheet PDF
  //     if (
  //       midTermDesignId === "temp_1mid" &&
  //       item.name?.toLowerCase().includes("mid")
  //     ) {
  //       html = createMarksheetPdf(currentMarksheet);
  //     }

  //     // 7. ANNUAL TERM: temp_1annual -> combined PDF
  //     else if (
  //       annualTermDesignId === "temp_1annual" &&
  //       item.name?.toLowerCase().includes("annual")
  //     ) {
  //       let midMarksheet: any = null;

  //       // Fetch the student's Mid Term marksheet
  //       try {
  //         const midResponse: any = await GetMidExamMarksheet(
  //           item.batch?._id ?? props.batchId,
  //           item.student?._id
  //         );

  //         console.log("Mid Term API response:", midResponse);

  //         midMarksheet =
  //           midResponse?.marksheet ??
  //           midResponse?.data?.marksheet ??
  //           null;
  //       } catch (error) {
  //         console.error("Mid Term marksheet fetch error:", error);
  //       }

  //       // Build Mid Term data for the combined PDF
  //       if (midMarksheet?.marks?.length) {
  //         const term1 = {
  //           ...commonData,
  //           examName: midMarksheet.name,
  //           marks: midMarksheet.marks ?? [],
  //           activity: midMarksheet.activity ?? [],
  //           skills: midMarksheet.skills ?? [],
  //           totalMarks: midMarksheet.totalMarks,
  //           percentage: midMarksheet.percentage,
  //           overallGrade: midMarksheet.overallGrade,
  //           status: midMarksheet.status,
  //           allsubjecttotal:
  //             (midMarksheet.marks ?? []).length * 100,
  //           date: midMarksheet.date
  //             ? new Date(midMarksheet.date).toLocaleDateString("en-GB")
  //             : "",
  //           session: midMarksheet.session,
  //         };

  //         // Current selected Annual Term marksheet
  //         const term2 = currentMarksheet;

  //         // Generate combined Mid Term + Annual Term PDF
  //         html = createCombinedMarksheetPdf(term1, term2);
  //       } else {
  //         // Do not silently generate an incomplete combined marksheet
  //         ErrorNotification(
  //           "Mid Term marksheet not found. Please create the Mid Term marksheet first."
  //         );
  //         return;
  //       }
  //     } else {
  //       ErrorNotification(
  //         `No matching marksheet design found for ${item.name}.`
  //       );
  //       return;
  //     }

  //     // 8. Open print window
  //     if (!html) {
  //       ErrorNotification("Unable to generate marksheet PDF!");
  //       return;
  //     }

  //     const printWindow = window.open("", "_blank");

  //     if (!printWindow) {
  //       ErrorNotification(
  //         "Please allow pop-ups in your browser to download the marksheet."
  //       );
  //       return;
  //     }

  //     printWindow.document.open();
  //     printWindow.document.write(html);
  //     printWindow.document.close();

  //     printWindow.onload = () => {
  //       printWindow.focus();
  //       printWindow.print();
  //     };

  //     // Fallback for browsers where onload fires too early
  //     setTimeout(() => {
  //       if (!printWindow.closed) {
  //         printWindow.focus();
  //         printWindow.print();
  //       }
  //     }, 1000);
  //   } catch (error) {
  //     console.error("Download marksheet error:", error);
  //     ErrorNotification("Failed to generate marksheet!");
  //   }
  // }}

    onClick={async () => {
    try {
      // 1. QR Code URL
       const url = `https://shikshapay.cloud/marksheet/${item._id}`;
      const qr = await QRCode.toDataURL(url);


      // 2. Get Student Details
      const res: any = await GetStudentDetail(item.student._id);
      const student = res?.student;

      if (!student) {
        ErrorNotification("Student details not found.");
        return;
      }

      // 3. Get Institute Details
      const instituteData = student.instituteId;

      // 4. Get Selected Marksheet Design IDs
      const midTermDesignId =
        instituteData?.midTermMarksheetDesignId;

      const annualTermDesignId =
        instituteData?.annualTermMarksheetDesignId;

     
    //     // 3. Convert images to base64
      const base64Photo = await getBase64Image(student.profilePic);
      // const base64Logo = await getBase64Image(instituteData?.logo);
        const base64Logo = await getBase64Image(student.instituteId.logo);
      const base64Signature = await getBase64Image(
        instituteData?.signature
      );

      // 6. Common Data
       const commonData = {
        instituteName: instituteData?.name || institute?.name,
        batchName: item.batch?.name,
        studentName: student.name || item.student?.name,
        rollNumber: item.student?.rollNumber,
        enrolment: item.student?.enrollmentNo,
        fName: student.parentName,
        address: student.address,
        parentNumber: student.parentNumber,
        dob: formatDate(student.dateOfBirth),
        photo: base64Photo,
        instituteLogo: base64Logo,
        principalSignature: base64Signature,
        instituteAdress: instituteData?.address,
        institutePhone: instituteData?.institutePhoneNumber,
        qr,
      };

      // 7. Current Marksheet Data
      const currentMarksheet = {
        ...commonData,

        examName: item?.name ?? "",
        marks: item?.marks ?? [],
        activity: item?.activity ?? [],
        skills: item?.skills ?? [],

        totalMarks: item?.totalMarks,
        percentage: item?.percentage,
        overallGrade: item?.overallGrade,
        status: item?.status,

        allsubjecttotal: (item?.marks ?? []).length * 100,

        date: item?.date
          ? new Date(item.date).toLocaleDateString("en-GB")
          : "",

        session: item?.session,
      };

      // 8. Select Marksheet Design
      let html = "";

      const examName = item?.name?.toLowerCase() ?? "";

      const isMidTerm = examName.includes("mid");
      const isAnnualTerm = examName.includes("annual");

      // ==========================================
      // MID TERM MARKSHEET
      // ==========================================
      if (isMidTerm) {
        html = getMidTermMarksheetHtml(
          currentMarksheet,
          midTermDesignId
        );

        if (!html) {
          ErrorNotification(
            `No matching Mid Term design found: ${
              midTermDesignId || "not selected"
            }`
          );
          return;
        }
      }

      // ==========================================
      // ANNUAL TERM MARKSHEET
      // ==========================================
      else if (isAnnualTerm) {
        let midMarksheet: any = null;

        // Fetch Mid Term Marksheet
        try {
          const midResponse: any = await GetMidExamMarksheet(
            item?.batch?._id ?? props.batchId,
            item?.student?._id
          );

          midMarksheet =
            midResponse?.marksheet ??
            midResponse?.data?.marksheet ??
            null;
        } catch (error) {
          console.error(
            "Mid Term marksheet fetch error:",
            error
          );

          ErrorNotification(
            "Unable to fetch Mid Term marksheet."
          );
          return;
        }

        if (!midMarksheet?.marks?.length) {
          ErrorNotification(
            "Mid Term marksheet not found. Please create the Mid Term marksheet first."
          );
          return;
        }

        // Prepare Term 1 Data
        const term1 = {
          ...commonData,

          examName: midMarksheet?.name ?? "Mid Term",
          marks: midMarksheet?.marks ?? [],
          activity: midMarksheet?.activity ?? [],
          skills: midMarksheet?.skills ?? [],

          totalMarks: midMarksheet?.totalMarks,
          percentage: midMarksheet?.percentage,
          overallGrade: midMarksheet?.overallGrade,
          status: midMarksheet?.status,

          allsubjecttotal:
            (midMarksheet?.marks ?? []).length * 100,

          date: midMarksheet?.date
            ? new Date(
                midMarksheet.date
              ).toLocaleDateString("en-GB")
            : "",

          session: midMarksheet?.session,
        };

        // Prepare Term 2 Data
        const term2 = currentMarksheet;

        // Generate Annual Marksheet According to Design
        html = getAnnualTermMarksheetHtml(
          term1,
          term2,
          annualTermDesignId
        );

        if (!html) {
          ErrorNotification(
            `No matching Annual Term design found: ${
              annualTermDesignId || "not selected"
            }`
          );
          return;
        }
      } else {
        ErrorNotification(
          `Unsupported exam: ${item?.name ?? "Unknown"}`
        );
        return;
      }

      // ==========================================
      // 9. Validate Generated HTML
      // ==========================================
      if (!html) {
        ErrorNotification(
          "Failed to generate marksheet."
        );
        return;
      }

      // ==========================================
      // 10. Open Print Window
      // ==========================================
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        ErrorNotification(
          "Please allow pop-ups to print the marksheet."
        );
        return;
      }

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      // ==========================================
      // 11. Print Marksheet
      // ==========================================
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };

      // Fallback for HTML that loads before onload is assigned
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.focus();
        }
      }, 500);
    } catch (error) {
      console.error("Marksheet generation error:", error);

      ErrorNotification(
        "Something went wrong while generating the marksheet."
      );
    }
  }}

>
  Download
</Menu.Item>

                          {/* DELETE */}
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={18} />}
                            onClick={() => {
                              console.log("Delete clicked", item._id);
                              setSelectedMarksheetId(item._id);

                              // yaha delete API lagegi
                              setDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
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
              data={["Mid TERM", "Annual TERM"]}
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
          <Box>
            <Flex
              align="center"
              justify="space-between"
              gap={20}
              direction={isMobile ? "column" : "row"}
            >
              {/* 🔹 LEFT IMAGE */}
              {!isMobile && (
                <Image
                  src="/modallogo.jpeg"
                  alt="upload"
                  style={{ width: "60%", maxHeight: 180, objectFit: "contain" }}
                />
              )}

              {/* 🔹 RIGHT CONTENT */}
              <Stack w={isMobile ? "100%" : "60%"}>
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
                    <Text fz={14}>Drag & drop your file here or</Text>

                    <Button
                      size="xs"
                      variant="light"
                      disabled={!selectedExam} // 👈 condition
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

          {institute.isAcadmy ? (
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
          ) : (
            <a
              href="https://docs.google.com/spreadsheets/d/19AWkBwps-5Rxr_lL_FH-zF2vKcbPWNTu/export?format=xlsx"
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
          )}
        </Stack>
      </Modal>

      <SingleStudentModal
        opened={openSingleStudentModal}
        onClose={() => setOpenSingleStudentModal(false)}
        // subjects={props.subjects ?? []}
        batchId={props.batchId}
        batchStudents={batchStudents}
        refreshData={(data) => {
          setAllMarksheet((prev) => [...prev, data]);
        }}
      />
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={
          <Text fw={700} style={{ color: "#c0392b" }}>
            Delete Marksheet
          </Text>
        }
        centered
        radius="lg"
        size="sm"
      >
        <Stack>
          <Text size="sm" c="dimmed">
            Are you sure you want to delete this marksheet? This action cannot
            be undone.
          </Text>

          <Group justify="flex-end" gap="sm">
            {/* Cancel Button */}
            <Button
              variant="default"
              radius="md"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>

            {/* Delete Button */}
            <Button
              color="red"
              radius="md"
              leftSection={<IconTrash size={14} />}
              onClick={() => {
                setDeleteModalOpen(false);
                HandleDeleteMarksheet();

                // future me delete API yaha lagegi
              }}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default Marksheet;
