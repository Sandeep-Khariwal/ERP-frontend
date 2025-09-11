"use client";

import React, { useState } from "react";
import { Button, Stack } from "@mantine/core";
import StudentTestModal from "./StudentTestModal"; // ✅ Import the modal

interface StudentTestViewProps {
  studentId: string;
}

const StudentTestView: React.FC<StudentTestViewProps> = ({ studentId }) => {
  const [opened, setOpened] = useState<boolean>(false); 
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const handleStartTest = () => {
    // You need to set a real testId here
    setSelectedTestId("TEST-b515df39-170b-4741-97db-79db4abeb41b"); // Replace with actual testId
    setOpened(true);
  };

  return (
    <Stack>
      <Button onClick={handleStartTest} color="blue" fullWidth>
        Start Test
      </Button>

      {/* ✅ Use the modal with testId */}
      <StudentTestModal 
        opened={opened} 
        onClose={() => {
          setOpened(false);
          setSelectedTestId(null);
        }} 
        testId={selectedTestId}
      />
    </Stack>
  );
};

export default StudentTestView;