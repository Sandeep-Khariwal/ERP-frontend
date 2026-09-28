"use client";

import { Box, Flex, LoadingOverlay, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { BatchOverviewCards } from "./BatchOverviewCards";
import { useMediaQuery } from "@mantine/hooks";
import { GetBatchOverview } from "@/axios/batch/BatchGetApi";
import TopClassPerformanceStudents from "./TopClassPerformanceStudents";
import { IconLayoutDashboard } from "@tabler/icons-react";

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
    <Stack w={"100%"} mt={20} p={15}>
      <LoadingOverlay visible={isLoading} />
      {/* Header styled to match the Test section's master container:
          light-blue tinted box, white icon badge, title + subtitle. */}
      <Box
        p={20}
        style={{
          borderRadius: "16px",
          background: "#EEF3FF",
          border: "1px solid #DCE7FF",
        }}
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
              flexShrink: 0,
            }}
          >
            <IconLayoutDashboard size={22} color="#2F6FED" />
          </Flex>
          <Stack gap={2} style={{ minWidth: 0 }}>
            <Text fz={isMd ? 18 : 22} fw={700} c="#1B2559">
              View your batch details here!
            </Text>
            <Flex c={"#5B6B8C"} wrap="wrap" gap={4} style={{ rowGap: 2 }}>
              {subjectNames.map((s, i: number) => (
                <Text key={i} fz={13}>
                  {s}
                  {i < subjectNames.length - 1 ? "," : ""}
                </Text>
              ))}
            </Flex>
          </Stack>
        </Flex>
      </Box>
      <BatchOverviewCards
        totalStudents={totalStudents}
        totalTeachers={totalTeachers}
        totalTests={totalTests}
      />
      <TopClassPerformanceStudents batchId={props.batchId}/>
    </Stack>
  );
};

export default OverView;
