"use client";
import { Button, Flex, Modal, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Test } from "../InstituteInsideBatch";
import StudentResultModal from "@/app/components/student/StudentResultModal";

const ShowStudentResultsModal = (props: {
  opened: boolean;
  onClose: () => void;
  test: Test;
}) => {
  const [students, setStudents] = useState<
    { id: string; studentId: { _id: string; name: string } }[]
  >([]);
  const [resultModalOpened, setResultModalOpened] = useState<boolean>(false);
  const [selectedResultId, setSelectedResultId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  useEffect(() => {
    if (props.test.resultId.length) {
      setStudents(props.test.resultId);
    }
  }, []);

  return (
    <>
      <Modal
        title="Students Results"
        opened={props.opened}
        onClose={() => props.onClose()}
      >
        <Stack w={"100%"}>
          <Text ta={"center"}>Students Results </Text>
          <Flex
            w={"100%"}
            mih={"100%"}
            align={"center"}
            justify={"space-between"}
            wrap={"wrap"}
            
          >
            {students.map((student: any, i: number) => (
              <Flex
                key={i}
                w={"100%"}
                align={"center"}
                justify={"space-between"}
                wrap={"wrap"}
                mt={20}
              >
                <Text>{student.studentId.name}</Text>
                <Button
                  size="xs"
                  color="blue"
                  onClick={() => {
                    setSelectedResultId(student.id);
                    setSelectedStudentId(student.studentId._id)
                    setResultModalOpened(true);
                  }}
                >
                  Show Result
                </Button>
              </Flex>
            ))}
          </Flex>
        </Stack>
      </Modal>
      {/* Result Modal */}
      {resultModalOpened && (
        <StudentResultModal
          opened={resultModalOpened}
          resultId={selectedResultId}
          studentId={selectedStudentId}
          onClose={() => {
            setResultModalOpened(false);
            // props.onClose();
          }}
        />
      )}
    </>
  );
};

export default ShowStudentResultsModal;
