"use client";

import {  Divider, Flex, Stack, Text } from "@mantine/core";
import { IconUserSquareRounded } from "@tabler/icons-react";
import React, { useState } from "react";
import { StudentList } from "../../InstituteStudents";

const StudentListCard = (props: {
  onClickStudent: (id: string) => void;
  id: string;
  selectedStudentId: string;
  student:StudentList
}) => {
  return (
    <Stack
      w={"100%"}
      bg={props.id === props.selectedStudentId ? "#FAF5FA" : "white"}
      px={5}
      style={{borderRadius:"0.5rem"}}
      opacity={50}
      py={10}
      onClick={() => {
        props.onClickStudent(props.student._id);
      }}
    >
      <Flex w={"100%"} style={{ cursor: "pointer" }}>
        <Flex w={"10%"} align={"start"} justify={"start"}>
          <IconUserSquareRounded />
        </Flex>
        <Stack w={"50%"}>
          <Text
            lh={0}
            fz={14}
            style={{ fontFamily: "sans-serif" }}
            c={"#4F4F4F"}
          >
            {props.student.name}
          </Text>
          <Text
            lh={0}
            fz={12}
            style={{ fontFamily: "sans-serif" }}
            fw={500}
            c={"#BFBFBF "}
          >
            {props.student.batchId.name}
          </Text>
        </Stack>
        <Flex
          w={"20%"}
          align={"center"}
          justify={"center"}
          fw={600}
          c={"#4F4F4F"}
        >
          <Text>{props.student.uniqueRoll}</Text>
        </Flex>
        <Flex
          w={"20%"}
          align={"center"}
          justify={"center"}
          fw={600}
          c={"#4F4F4F"}
        >
          <Text>{props.student.dateOfJoining}</Text>
        </Flex>
      </Flex>
      <Divider c={"gray"} w={"100%"} />
    </Stack>
  );
};

export default StudentListCard;
