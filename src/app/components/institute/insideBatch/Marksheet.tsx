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
import { GetAllSubjectsFromBatch } from "@/axios/batch/BatchGetApi";

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
  const [batchSubjects, setBatchSubjects] = useState<
  { _id: string; name: string; type: string }[]
>([]);
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

      GetAllSubjectsFromBatch(props.batchId)
  .then((res: any) => {
    const subjects = res?.subjects?.subjects ?? [];
    setBatchSubjects(
      subjects.map((subject: any) => ({
        _id: subject._id,
        name: subject.name,
        type: subject.type ?? "",
      }))
    );
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

  const isCoScholastic = (type?: string) =>
  type?.toLowerCase().replace(/[^a-z]/g, "").startsWith("coschol") ??
  false;

const getSubjectType = (subjectName: string, savedType?: string) => {
  if (savedType) return savedType;

  return (
    batchSubjects.find(
      (subject) =>
        subject.name.trim().toLowerCase() ===
        subjectName.trim().toLowerCase()
    )?.type ?? ""
  );
};

const getNormalizedMarks = (marksArray: any[]) => {
  return marksArray.map((item) => {
    const subjectType = getSubjectType(
      item.subjectName ?? "",
      item.subjectType
    );

    if (isCoScholastic(subjectType)) {
      return {
        ...item,
        subjectType,
        theory_marks: 0,
        practical_marks: 0,
        obtained_marks: 0,
        // Manual grade ko change nahi karna.
        grade: item.grade ?? "",
      };
    }

    const theory = Number(item.theory_marks) || 0;
    // const practical = Number(item.practical_marks) || 0;
    const periodicTest = Number(item.periodic_test) || 0;
const noteBook = Number(item.note_book) || 0;
const subjectEnrichment = Number(item.subject_enrichment) || 0;

// Practical marks = components ka total
const practical =
  periodicTest + noteBook + subjectEnrichment;

    const obtained = theory + practical;

    return {
      ...item,
      subjectType,
      theory_marks: theory,
      practical_marks: practical,
      obtained_marks: obtained,
      grade: item.grade || GetGrade(obtained),
    };
  });
};

const calculateOverall = (marksArray: any[]) => {
  const normalizedMarks = getNormalizedMarks(marksArray);

  const scholasticMarks = normalizedMarks.filter(
    (item) => !isCoScholastic(item.subjectType)
  );

  const totalMarks = scholasticMarks.reduce(
    (sum, item) => sum + (Number(item.obtained_marks) || 0),
    0
  );

  const percentage =
    scholasticMarks.length > 0
      ? totalMarks / scholasticMarks.length
      : 0;

  const overallGrade = GetGrade(percentage);

  const isFail = scholasticMarks.some(
    (item) => (Number(item.obtained_marks) || 0) < 33
  );

  return {
    totalMarks,
    percentage,
    overallGrade,
    status:
      scholasticMarks.length === 0
        ? "Pass"
        : isFail
          ? "Fail"
          : "Pass",
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
        const typedRawMarks = rawMarks.map((item: any) => ({
  ...item,
  subjectType: getSubjectType(item.subjectName ?? ""),
}));
        const rawActivity = Object.values(activitySubjectMap);
        const rawSkills = Object.values(skillsSubjectMap);
        const overall = calculateOverall(rawMarks);

        if (!rawMarks.length) {
          return null;
        }

        // const marks = processMarks(rawMarks);
        const marks = getNormalizedMarks(typedRawMarks);

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
        mName: student.motherName,
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

      const currentMarks = getNormalizedMarks(item?.marks ?? []);
const currentSummary = calculateOverall(currentMarks);

      // 7. Current Marksheet Data
      const currentMarksheet = {
        ...commonData,

        examName: item?.name ?? "",
        activity: item?.activity ?? [],
        skills: item?.skills ?? [],
        
        
marks: currentMarks,
totalMarks: currentSummary.totalMarks,
percentage: currentSummary.percentage,
overallGrade: currentSummary.overallGrade,
status: currentSummary.status,
allsubjecttotal: currentMarks.filter(
  (mark: any) => !isCoScholastic(mark.subjectType)
).length * 100,

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
const term1Marks = getNormalizedMarks(midMarksheet?.marks ?? []);
const term1Summary = calculateOverall(term1Marks);
        // Prepare Term 1 Data
        const term1 = {
          ...commonData,

          examName: midMarksheet?.name ?? "Mid Term",
          activity: midMarksheet?.activity ?? [],
          skills: midMarksheet?.skills ?? [],
          
        
          marks: term1Marks,
totalMarks: term1Summary.totalMarks,
percentage: term1Summary.percentage,
overallGrade: term1Summary.overallGrade,
status: term1Summary.status,
allsubjecttotal: term1Marks.filter(
  (mark: any) => !isCoScholastic(mark.subjectType)
).length * 100,

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
