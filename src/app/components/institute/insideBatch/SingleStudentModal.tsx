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
import { log } from "console";


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
      theory_marks: number;
      practical_marks: number;
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
  const [subjects, setSubjects] = useState<{ _id: string, name: string }[]>([]);  //state me savee krvana batch student
  const [resultDate, setResultDate] = useState<Date>(new Date());
  const [session, setSession] = useState<string>("");
  useEffect(() => {
    if (!batchId) return;

    setIsLoading(true);

    GetAllSubjectsFromBatch(batchId)
      .then((x: any) => {
        const { subjects } = x.subjects;

        const formatted = subjects.map((sub: any) => {
          return {
            _id: sub._id,
            name: sub.name,

          }
        })

        console.log("formatted: ", formatted);

        setSubjects(formatted);

        //  setTeachers(teacherByInstituteBatch);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, [batchId]);


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
    console.log("percentage :", percentage, total);



    return {
      totalMarks: total,
      percentage,
      overallGrade,
      status,
    };
  };

  const CreateSingleMarksheet = () => {
    const updatedMarks = processMarks(marksData.marks);

    const overall = calculateOverall(marksData.marks);
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

    console.log("payload : ", payload);


    CreateExamMarksheet(payload)

      .then((x: any) => {
        SuccessNotification("Marksheet Created Success!!")
        refreshData(x.marksheet);
        console.log("x.marksheet: ", x.marksheet);


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
            data={["Mid TERM Exam", "Annual TERM Exam"]}
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
        {/* 🔹 INPUT HEADER */}
        <Flex gap={10} mt={20}>
          <Text fw={600} w="40%">
            Subject Name
          </Text>
          <Text fw={600} w="30%">
            Theory
          </Text>
          <Text fw={600} w="30%">
            Practical
          </Text>
        </Flex>



        {subjects.map((item, index) => (
          <Flex gap={10} key={index}>

            {/* SUBJECT NAME (TEXT ONLY) */}
            <Text w="40%" mt={8}>
              {item.name}
            </Text>

            {/* THEORY INPUT */}
            <TextInput
              placeholder="Theory Marks"
              style={{ width: "30%" }}
              value={marksData.marks[index]?.theory_marks ?? ""}
              onChange={(e) => {
                const value = e.target.value;

                setMarksData((prev) => {
                  const updatedMarks = [...prev.marks];
                  //  subjectName: subjects[index]?.name,

                  updatedMarks[index] = {
                    ...updatedMarks[index],
                    theory_marks: value === "" ? 0 : Number(value),
                    subjectName: item.name

                  };

                  return {
                    ...prev,
                    marks: updatedMarks,
                  };
                });
              }}
            />

            {/* PRACTICAL INPUT */}
            <TextInput
              placeholder="Practical Marks"
              style={{ width: "30%" }}
              value={marksData.marks[index]?.practical_marks ?? ""}
              onChange={(e) => {
                const value = e.target.value;

                setMarksData((prev) => {
                  const updatedMarks = [...prev.marks];


                  updatedMarks[index] = {
                    ...updatedMarks[index],
                    practical_marks: value === "" ? 0 : Number(value)
                  };

                  return {
                    ...prev,
                    marks: updatedMarks,
                  };
                });
              }}
            />

          </Flex>
        ))}


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