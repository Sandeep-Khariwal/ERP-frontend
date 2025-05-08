"use client";


import { SuccessNotification } from "@/app/helperFunction/Notification";
import { GetAllSubjectsFromBatch } from "@/axios/batch/BatchGetApi";
import { CreateTest } from "@/axios/batch/BatchPostApi";
import { StudentsDataWithBatch } from "@/interface/student.interface";
import {
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { SetStateAction, useEffect, useState } from "react";

const AddMarksModal = (props: {
  opened: boolean;
  batchId: string;
  students: StudentsDataWithBatch[];
  setOpenAddMarksModal: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [allSubjects, setAllSubjects] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [marks, setMarks] = useState<
    { studentId: string; name: string; marks: number }[]
  >([]);
  const [testName, setTestName] = useState<string>("");
  const [maxMarks, setMaxMarks] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    GetAllSubjectsFromBatch(props.batchId)
      .then((x: any) => {
        const { subjects } = x.subjects;
        const formatedSubjects = subjects.map(
          (s: { _id: string; name: string }) => {
            return {
              value: s._id,
              label: s.name,
            };
          }
        );

        setAllSubjects(formatedSubjects);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, [props.batchId]);

  const handleMarkChange = (
    studentId: string,
    name: string,
    newMarks: number
  ) => {
    setMarks((prevMarks) => {
      const existingMark = prevMarks.find(
        (mark) => mark.studentId === studentId
      );
      if (existingMark) {
        return prevMarks.map((mark) =>
          mark.studentId === studentId ? { ...mark, marks: newMarks } : mark
        );
      } else {
        return [...prevMarks, { studentId, name: name, marks: newMarks }];
      }
    });
  };

  const createTest = () => {
    setIsLoading(true);
    CreateTest({
      batchId: props.batchId,
      maxNumber: maxMarks,
      testName: testName,
      subjectId: selectedSubject,
      marks: marks,
    })
      .then((x: any) => {
        props.setOpenAddMarksModal(false);
        setIsLoading(false);
        SuccessNotification("Test Marks Created Success!!");
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
        props.setOpenAddMarksModal(false);
      });
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Modal
        opened={props.opened}
        onClose={() => props.setOpenAddMarksModal(false)}
        title={"Add Test marks"}
        size={"lg"}
      >
        <Text
          ta={"center"}
          mx={isMd ? 14 : 30}
          mt={20}
          c={"#2F4F4F"}
          fw={600}
          style={{ cursor: "pointer", whiteSpace: "nowrap" }}
          fz={24}
          ff={"Roboto"}
          w={"auto"}
        >
          Add Test Marks
        </Text>
        <Flex mt={20} align={"center"} justify={"space-between"}>
          <Select
            data={allSubjects}
            required
            value={selectedSubject}
            onChange={(value) => setSelectedSubject(value || "")}
            placeholder="Select Subject"
            label="Select subject"
            w={"10rem"}
          />

          <TextInput
            placeholder="Enter test name"
            label="Enter Test Name"
            required
            w={"10rem"}
            onChange={(e) => setTestName(e.target.value)}
          />
          <NumberInput
            placeholder="Max Marks"
            label="Enter Max Marks"
            required
            w={"10rem"}
            min={0}
            onChange={(value) => setMaxMarks(Number(value) ?? 0)}
          />
        </Flex>
        <Table mt={30}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Roll No.</Table.Th>
              <Table.Th>Student Name</Table.Th>
              <Table.Th>Marks</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {props.students.map((s: StudentsDataWithBatch) => (
              <Table.Tr key={s._id}>
                <Table.Td>{s.uniqueRoll}</Table.Td>
                <Table.Td>{s.name}</Table.Td>
                <Table.Td>
                  <NumberInput
                    hideControls
                    value={
                      marks.find((mark) => mark.studentId === s._id)?.marks || 0
                    }
                    onChange={(value) =>
                      handleMarkChange(s._id || "", s.name, Number(value) ?? 0)
                    }
                    min={0}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Button mt={20} variant="outline" onClick={createTest}>
          submit
        </Button>
      </Modal>
    </>
  );
};
export default AddMarksModal;
