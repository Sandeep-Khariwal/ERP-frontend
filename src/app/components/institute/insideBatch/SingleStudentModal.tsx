"use client";

import { GetAllSubjectsFromBatch } from "@/axios/batch/BatchGetApi";
import {
  Modal,
  Select,
  Stack,
  Text,
  Flex,
  TextInput,
  Button,
  Box,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { DateInput } from "@mantine/dates";
import { GetGrade } from "../helperFunctions";
import { CreateExamMarksheet } from "@/axios/institute/InstitutePostApi";
import { SuccessNotification } from "@/app/helperFunction/Notification";


interface Props {
  opened: boolean;
  onClose: () => void;
  refreshData: (data: any) => void;
  // subjects: { _id: string; name: string }[];
  batchId: string;
  batchStudents: {
    _id: string;
    name: string;
    rollNumber: number;
  }[]
}

const SingleStudentModal = ({ opened, onClose, batchId, batchStudents, refreshData }: Props) => {
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [marksData, setMarksData] = useState<{
    name: string;
    batch: string;
    student: string;
    marks: {
      subjectName: string;
       subjectType?: string;
      theory_marks: number;
      practical_marks: number;
       periodic_test: number;
  note_book: number;
  subject_enrichment: number;
      obtained_marks: number;
      grade: string;
    }[];
    date: Date;
  }>({
    name: "",
    batch: "",
    student: "",
    marks: [],
    date: new Date()
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<{ _id: string, name: string, type: string }[]>([]);  //state me savee krvana batch student
  const [resultDate, setResultDate] = useState<Date>(new Date());
  const [session, setSession] = useState<string>("");
  useEffect(() => {
    // This modal is always mounted inside Marksheet.tsx (only its visual
    // Modal is toggled by `opened`), so without this guard it fetched the
    // subjects list every time the Marksheet tab loaded, whether or not
    // "Add Single Student" was ever opened.
    if (!opened || !batchId) return;

    setIsLoading(true);

    GetAllSubjectsFromBatch(batchId)
      .then((x: any) => {
        const { subjects } = x.subjects;

        const formatted = subjects.map((sub: any) => {
          return {
            _id: sub._id,
            name: sub.name,
  type: sub.type,
          }
        })
        setSubjects(formatted);

        //  setTeachers(teacherByInstituteBatch);
//ye add 
        setMarksData((prev) => ({
  ...prev,
  marks: formatted.map((subject: any) => {
    const existingMark = prev.marks.find(
      (mark: any) => mark.subjectName === subject.name
    );

    return {
      subjectName: subject.name,
      subjectType: subject.type,
      theory_marks: existingMark?.theory_marks ?? 0,
      // practical_marks: existingMark?.practical_marks ?? 0,
        periodic_test: existingMark?.periodic_test ?? 0,
  note_book: existingMark?.note_book ?? 0,
  subject_enrichment: existingMark?.subject_enrichment ?? 0,

  practical_marks:
    (Number(existingMark?.periodic_test) || 0) +
    (Number(existingMark?.note_book) || 0) +
    (Number(existingMark?.subject_enrichment) || 0),

      obtained_marks: existingMark?.obtained_marks ?? 0,
      grade: existingMark?.grade ?? "",
    };
  }),
}));
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, [opened, batchId]);



const isCoScholastic = (type?: string) =>
  type?.toLowerCase().replace(/[^a-z]/g, "").startsWith("coschol") ?? false;

  
// const processMarks = (marksArray: any[]) => {
//   return marksArray.map((item) => {
//     // Co-scholastic subjects use the manually selected grade.
// if (isCoScholastic(item.subjectType)) {
//       return {
//         ...item,
//         theory_marks: 0,
//         practical_marks: 0,
//         obtained_marks: 0,
//         grade: item.grade,
//       };
//     }

//     // Scholastic subjects use numerical marks.
//     const obtained =
//       (Number(item.theory_marks) || 0) +
//       (Number(item.practical_marks) || 0);

//     return {
//       ...item,
//       obtained_marks: obtained,
//       grade: GetGrade(obtained),
//     };
//   });
// };

const processMarks = (marksArray: any[]) => {
  return marksArray.map((item) => {
    // Co-scholastic subjects: only grade, no numerical marks.
    if (isCoScholastic(item.subjectType)) {
      return {
        ...item,
        theory_marks: 0,
        practical_marks: 0,
        periodic_test: 0,
        note_book: 0,
        subject_enrichment: 0,
        obtained_marks: 0,
        grade: item.grade ?? "",
      };
    }

    const periodicTest = Number(item.periodic_test) || 0;
    const noteBook = Number(item.note_book) || 0;
    const subjectEnrichment = Number(item.subject_enrichment) || 0;
    const theory = Number(item.theory_marks) || 0;

    // Practical = Periodic Test + Notebook + Subject Enrichment
    const practical =
      periodicTest + noteBook + subjectEnrichment;

    const obtained = theory + practical;

    return {
      ...item,
      theory_marks: theory,
      periodic_test: periodicTest,
      note_book: noteBook,
      subject_enrichment: subjectEnrichment,
      practical_marks: practical,
      obtained_marks: obtained,
      grade: GetGrade(obtained),
    };
  });
};

const calculateOverall = (marks: any[]) => {
  // Overall result only uses scholastic subjects.
  const scholasticMarks = marks.filter(
    (item) => !isCoScholastic(item.subjectType)
  );

  const total = scholasticMarks.reduce(
    (sum, item) =>
      sum +
      (Number(item.theory_marks) || 0) +
      (Number(item.practical_marks) || 0),
    0
  );

  const percentage =
    scholasticMarks.length > 0
      ? total / scholasticMarks.length
      : 0;

  const overallGrade = GetGrade(percentage);

  const isFail = scholasticMarks.some(
    (item) =>
      (Number(item.theory_marks) || 0) +
        (Number(item.practical_marks) || 0) <
      33
  );

  return {
    totalMarks: total,
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

  const CreateSingleMarksheet = () => {
    const updatedMarks = processMarks(marksData.marks);

    // const overall = calculateOverall(marksData.marks);
    const overall = calculateOverall(updatedMarks);
    const payload = {
      ...marksData,
      name: selectedExam,
      batch: batchId,
      student: selectedStudent,
      date: resultDate,
      marks: updatedMarks,
      session: session,
      ...overall

    }
    CreateExamMarksheet(payload)

      .then((x: any) => {
        SuccessNotification("Marksheet Created Success!!")
        refreshData(x.marksheet);
        onClose()
      })
      .catch((e: any) => {
        console.log(e);
        onClose()
      });
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add Single Student Result"
      centered
      size="lg"
    >
      <Stack>

        {/* 🔹 TOP SELECT */}
        <Flex gap={20} align="flex-end">
          <Select
            placeholder="Select Exam"
            label="Select Exam"
            data={["Mid TERM", "Annual TERM"]}
            value={selectedExam}
            onChange={(value) => {
              setSelectedExam(value ?? "")
            }}
            w={150}
          />

          <Select
            placeholder="Select Student"
            label="Select Student"
            data={batchStudents.map((student) => ({
              label: student.name,   // 👈 jo dikhega
              value: student._id,    // 👈 jo select hoga
            }))}
            value={selectedStudent}
            onChange={(value) => {
              setSelectedStudent(value ?? "")
            }}
            w={150}
          />
          <DateInput
            placeholder="Select Result Date"
            value={resultDate}
            onChange={(value) => {
              setResultDate(value ?? new Date())
            }}
            label="Result Date"
            w={150}
          />
          <TextInput
            placeholder="2026-2027"
            label="Session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            w={150}
          />
        </Flex>
     
        
<Text fw={700} size="md" mt="md" c="blue">
  Scholastic Subjects
</Text>

{/* <Flex gap={10} mt={10}>
  <Text fw={600} w="40%">Subject Name</Text>
  <Text fw={600} w="30%">Theory</Text>
  <Text fw={600} w="30%">Practical</Text>
</Flex> */}
<Flex gap={8} mt={10} align="center">
  <Text fw={600} w="25%">Subject</Text>
  <Text fw={600} ml={50} w="20%">Theory</Text>
  <Text fw={500} w="16%">Periodic </Text>
  <Text fw={500} w="16%">Notebook </Text>
  <Text fw={500}  w="20%">Enrichment</Text>
</Flex>

{subjects
  .filter((item) => !isCoScholastic(item.type))
  .map((item) => {
    const index = subjects.findIndex(
      (subject) => subject._id === item._id
    );

    return (
      <Flex key={item._id} gap={10} align="center">
        <Text w="40%" size="sm">
          {item.name}
        </Text>

        <TextInput
          placeholder="Theory Marks"
          type="number"
          w="30%"
          value={marksData.marks[index]?.theory_marks ?? 0}
          onChange={(e) => {
            const value = e.target.value;

            setMarksData((prev) => {
              const updatedMarks = [...prev.marks];

              updatedMarks[index] = {
                ...updatedMarks[index],
                subjectName: item.name,
                subjectType: item.type,
                 theory_marks: value === "" ? 0: Number(value),
              };

              return { ...prev, marks: updatedMarks };
            });
          }}
        />

        {/* <TextInput
          placeholder="Practical Marks"
          type="number"
          w="30%"
          value={marksData.marks[index]?.practical_marks ?? 0}
          onChange={(e) => {
            const value = e.target.value;

            setMarksData((prev) => {
              const updatedMarks = [...prev.marks];

              updatedMarks[index] = {
                ...updatedMarks[index],
                subjectName: item.name,
                subjectType: item.type,
                practical_marks: value === "" ? 0 : Number(value),
              };

              return { ...prev, marks: updatedMarks };
            });
          }}
        /> */}

        {/* Periodic Test: maximum 10 */}
<TextInput
  placeholder="0-10"
  type="number"
  min={0}
  max={10}
  w="16%"
  value={marksData.marks[index]?.periodic_test ?? 0}
  onChange={(e) => {
    const rawValue = e.target.value;
    const value =
      rawValue === ""
        ? 0
        : Math.min(10, Math.max(0, Number(rawValue) || 0));

    setMarksData((prev) => {
      const updatedMarks = [...prev.marks];
      const current = updatedMarks[index];

      const periodicTest = value;
      const noteBook = Number(current?.note_book) || 0;
      const subjectEnrichment =
        Number(current?.subject_enrichment) || 0;

      updatedMarks[index] = {
        ...current,
        subjectName: item.name,
        subjectType: item.type,
        periodic_test: periodicTest,
        practical_marks:
          periodicTest + noteBook + subjectEnrichment,
      };

      return { ...prev, marks: updatedMarks };
    });
  }}
/>

{/* Notebook: maximum 5 */}
<TextInput
  placeholder="0-5"
  type="number"
  min={0}
  max={5}
  w="16%"
  value={marksData.marks[index]?.note_book ?? 0}
  onChange={(e) => {
    const rawValue = e.target.value;
    const value =
      rawValue === ""
        ? 0
        : Math.min(5, Math.max(0, Number(rawValue) || 0));

    setMarksData((prev) => {
      const updatedMarks = [...prev.marks];
      const current = updatedMarks[index];

      const periodicTest = Number(current?.periodic_test) || 0;
      const noteBook = value;
      const subjectEnrichment =
        Number(current?.subject_enrichment) || 0;

      updatedMarks[index] = {
        ...current,
        subjectName: item.name,
        subjectType: item.type,
        note_book: noteBook,
        practical_marks:
          periodicTest + noteBook + subjectEnrichment,
      };

      return { ...prev, marks: updatedMarks };
    });
  }}
/>

{/* Subject Enrichment: maximum 5 */}
<TextInput
  placeholder="0-5"
  type="number"
  min={0}
  max={5}
  w="18%"
  value={marksData.marks[index]?.subject_enrichment ?? 0}
  onChange={(e) => {
    const rawValue = e.target.value;
    const value =
      rawValue === ""
        ? 0
        : Math.min(5, Math.max(0, Number(rawValue) || 0));

    setMarksData((prev) => {
      const updatedMarks = [...prev.marks];
      const current = updatedMarks[index];

      const periodicTest = Number(current?.periodic_test) || 0;
      const noteBook = Number(current?.note_book) || 0;
      const subjectEnrichment = value;

      updatedMarks[index] = {
        ...current,
        subjectName: item.name,
        subjectType: item.type,
        subject_enrichment: subjectEnrichment,
        practical_marks:
          periodicTest + noteBook + subjectEnrichment,
      };

      return { ...prev, marks: updatedMarks };
    });
  }}
/>
      </Flex>
    );
  })}

{/* CO-SCHOLASTIC SUBJECTS */}
<Text fw={700} size="md" mt="xl" c="orange">
  Co-scholastic Subjects
</Text>

{subjects
  .filter((item) => isCoScholastic(item.type))
  .map((item) => {
    const index = subjects.findIndex(
      (subject) => subject._id === item._id
    );

    return (
      <Flex key={item._id} gap={10} align="center">
        <Text w="40%" size="sm">
          {item.name}
        </Text>

        <TextInput
          placeholder="Enter Grade (A1, A, B2...)"
          w="60%"
          value={marksData.marks[index]?.grade ?? ""}
          onChange={(e) => {
            const value = e.target.value;

            setMarksData((prev) => {
              const updatedMarks = [...prev.marks];

              updatedMarks[index] = {
                ...updatedMarks[index],
                subjectName: item.name,
                subjectType: item.type,
                theory_marks: 0,
                practical_marks: 0,
                obtained_marks: 0,
                grade: value,
              };

              return {
                ...prev,
                marks: updatedMarks,
              };
            });
          }}
        />
      </Flex>
    );
  })}

        {/* 🔹 BUTTON */}
        <Box mt={20}>
          <Button
            fullWidth
            size="md"
            style={{
              borderRadius: "10px",
              background: "linear-gradient(135deg, #4B65F6, #6A5ACD)",
            }}
            onClick={() => CreateSingleMarksheet()}
            disabled={!selectedExam || !selectedStudent || !marksData.marks.length || !session}

          >
            Create Marksheet
          </Button>
        </Box>

      </Stack>
    </Modal>
  );
};

export default SingleStudentModal;