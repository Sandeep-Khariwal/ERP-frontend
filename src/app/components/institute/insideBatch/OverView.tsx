"use client";

import { Flex, LoadingOverlay, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { BatchOverviewCards } from "./BatchOverviewCards";
import { useMediaQuery } from "@mantine/hooks";
import { GetBatchOverview } from "@/app/api/batch/BatchGetApi";

const OverView = (props: { batchId: string }) => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [subjectNames, setSubjectNames] = useState<string[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalTeachers, setTotalTeachers] = useState<number>(0);
  const [totalTests, setTotalTests] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (props.batchId && !totalStudents) {
      setIsLoading(true);
      GetBatchOverview(props.batchId)
        .then((x: any) => {
          setTotalStudents(x.batch.students.length);
          setTotalTeachers(x.batch.teachers.length);
          setTotalTests(x.batch.tests.length);

          const subjects = [
            ...x.batch.subjects,
            ...x.batch.optionalSubjects,
          ].map((s) => s.name);
          setSubjectNames(subjects);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    }
  }, [props.batchId]);
  return (
    <Stack w={"100%"} mt={20}>
      <LoadingOverlay visible={isLoading} />
      <Stack w={"100%"} bg={"white"} p={20} style={{ borderRadius: "1rem" }}>
        <Text fw={900} fz={isMd ? 18 : 24}>
          View your batch details here!
        </Text>
        <Flex c={"#BFBFBF "}>
          {subjectNames.map((s) => (
            <Text>{s + ", "} </Text>
          ))}
        </Flex>
      </Stack>
      <BatchOverviewCards
        totalStudents={totalStudents}
        totalTeachers={totalTeachers}
        totalTests={totalTests}
      />
    </Stack>
  );
};

export default OverView;
