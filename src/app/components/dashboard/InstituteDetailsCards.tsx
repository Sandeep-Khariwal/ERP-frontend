"use client";

import { GetInstituteOverview } from "@/axios/institute/InstituteGetApi";
import {
  Flex,
  LoadingOverlay,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatNumberInK } from "../institute/helperFunctions";

interface InstituteOverview {
  totalStudents: number;
  totalTeachers: number;
  earnings: number;
  expanses: number;
}

interface InstituteOverviewResponse {
  institute: InstituteOverview;
}

interface InstituteDetailsCardsProps {
  instituteId: string;
}

export function InstituteDetailsCards({
  instituteId,
}: InstituteDetailsCardsProps) {
  const isMd = useMediaQuery("(max-width: 968px)");

  const [overview, setOverview] = useState<InstituteOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!instituteId) {
      setOverview(null);
      setIsLoading(false);
      return;
    }

    let isCurrentRequest = true;

    const fetchOverview = async () => {
      setIsLoading(true);

      try {
        const response =
          (await GetInstituteOverview(
            instituteId,
          )) as InstituteOverviewResponse;

        if (!isCurrentRequest) return;

        setOverview(response.institute);
      } catch (error) {
        if (!isCurrentRequest) return;

        console.error("Failed to fetch institute overview:", error);
        setOverview(null);
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    fetchOverview();

    return () => {
      isCurrentRequest = false;
    };
  }, [instituteId]);

 const renderValue = (
  value: number | undefined,
  formatter = false,
) => {
  const displayValue = formatter
    ? formatNumberInK(value ?? 0)
    : value ?? 0;

  return (
    <div
      style={{
        width: "80px",
        minWidth: "80px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <Skeleton height={20} width={60} radius="sm" />
      ) : (
        <Text
          lh={1}
          fw={700}
          fz="1.3rem"
          c="#4F4F4F"
          ta="center"
          style={{ whiteSpace: "nowrap" }}
        >
          {displayValue}
        </Text>
      )}
    </div>
  );
};

  return (
    <>
      <LoadingOverlay visible={isLoading} />

      <Flex
        w={isMd ? "95%" : "80%"}
        mx="auto"
        mt="2rem"
        align="center"
        gap={15}
        justify="space-between"
        wrap="wrap"
      >
        <Flex
          p={10}
          w="10rem"
          gap={15}
          bg="white"
          align="center"
          justify="center"
          style={{
            borderRadius: "0.3rem",
            fontFamily: "sans-serif",
          }}
        >
          <Image
            src="/student.png"
            alt="Students"
            width={40}
            height={40}
          />

          <Stack align="center" justify="start" gap={1.4}>
            <Text lh={1.4} fz="0.8rem" fw={600} c="#BFBFBF">
              Students
            </Text>

            {renderValue(overview?.totalStudents, true)}
          </Stack>
        </Flex>

        <Flex
          p={10}
          w="10rem"
          gap={15}
          bg="white"
          align="center"
          justify="center"
          style={{
            borderRadius: "0.3rem",
            fontFamily: "sans-serif",
          }}
        >
          <Image
            src="/teacher.png"
            alt="Teachers"
            width={40}
            height={40}
          />

          <Stack align="center" justify="start" gap={1}>
            <Text lh={1.4} fz="0.8rem" c="#BFBFBF" fw={600}>
              Teachers
            </Text>

            {renderValue(overview?.totalTeachers)}
          </Stack>
        </Flex>

        <Flex
          p={10}
          w="10rem"
          gap={15}
          bg="white"
          align="center"
          justify="center"
          style={{
            borderRadius: "0.3rem",
            fontFamily: "sans-serif",
          }}
        >
          <Image
            src="/earnings.jpg"
            alt="Earnings"
            width={40}
            height={40}
          />

          <Stack align="center" justify="start" gap={1}>
            <Text lh={1.4} fz="0.8rem" fw={600} c="#BFBFBF">
              Earnings
            </Text>

            {renderValue(overview?.earnings, true)}
          </Stack>
        </Flex>

        <Flex
          p={10}
          w="10rem"
          gap={15}
          bg="white"
          align="center"
          justify="center"
          style={{
            borderRadius: "0.3rem",
            fontFamily: "sans-serif",
          }}
        >
          <Image
            src="/expenses.jpg"
            alt="Expenses"
            width={40}
            height={40}
          />

          <Stack align="center" justify="start" gap={1}>
            <Text lh={1.4} fz="0.8rem" fw={600} c="#BFBFBF">
              Expenses
            </Text>

            {renderValue(overview?.expanses, true)}
          </Stack>
        </Flex>
      </Flex>
    </>
  );
}