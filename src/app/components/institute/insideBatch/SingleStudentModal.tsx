"use client";

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

interface Props {
  opened: boolean;
  onClose: () => void;
  subjects: { _id: string; name: string }[];
}

const SingleStudentModal = ({ opened, onClose, subjects }: Props) => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [marksData, setMarksData] = useState<any[]>([]);
  useEffect(() => {
    console.log("Subjects inside modal 👉", subjects);
  const formattedSubjects = subjects.map((sub) => ({
    subjectName: sub.name,
    theory: "",
    practical: "",
  }));

  setMarksData(formattedSubjects);
}, [subjects]);

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
        <Select
          placeholder="Select Exam"
          data={["Mid TERM Exam", "Annual TERM Exam"]}
          value={selectedExam}
          onChange={setSelectedExam}
          w={200}
        />

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

        {/* 🔹 ROW 1
        <Flex gap={10}>
          <TextInput
            placeholder="Subject Name"
            style={{ width: "40%" }}
          />
          <TextInput
            placeholder="Theory Marks"
            style={{ width: "30%" }}
          />
          <TextInput
            placeholder="Practical Marks"
            style={{ width: "30%" }}
          />
        </Flex> */}

        {marksData.map((item, index) => (
  <Flex gap={10} key={index}>
    
    {/* SUBJECT NAME (TEXT ONLY) */}
    <Text w="40%" mt={8}>
      {item.subjectName}
    </Text>

    {/* THEORY INPUT */}
    <TextInput
      placeholder="Theory Marks"
      style={{ width: "30%" }}
      value={item.theory}
      onChange={(e) => {
        const updated = [...marksData];
        updated[index].theory = e.target.value;
        setMarksData(updated);
      }}
    />

    {/* PRACTICAL INPUT */}
    <TextInput
      placeholder="Practical Marks"
      style={{ width: "30%" }}
      value={item.practical}
      onChange={(e) => {
        const updated = [...marksData];
        updated[index].practical = e.target.value;
        setMarksData(updated);
      }}
    />

  </Flex>
))}

        {/* 🔹 ROW 2 */}
        {/* <Flex gap={10}>
          <TextInput
            placeholder="Subject Name"
            style={{ width: "40%" }}
          />
          <TextInput
            placeholder="Theory Marks"
            style={{ width: "30%" }}
          />
          <TextInput
            placeholder="Practical Marks"
            style={{ width: "30%" }}
          />
        </Flex> */}

        {/* 🔹 ROW 3 */}
        {/* <Flex gap={10}>
          <TextInput
            placeholder="Subject Name"
            style={{ width: "40%" }}
          />
          <TextInput
            placeholder="Theory Marks"
            style={{ width: "30%" }}
          />
          <TextInput
            placeholder="Practical Marks"
            style={{ width: "30%" }}
          />
        </Flex> */}

        {/* 🔹 BUTTON */}
        <Box mt={20}>
          <Button
            fullWidth
            size="md"
            style={{
              borderRadius: "10px",
              background: "linear-gradient(135deg, #4B65F6, #6A5ACD)",
            }}
          >
            Create Marksheet
          </Button>
        </Box>

      </Stack>
    </Modal>
  );
};

export default SingleStudentModal;