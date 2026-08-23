import { GetInstituteOverview } from "@/axios/institute/InstituteGetApi";
import { Card, Flex, LoadingOverlay, SimpleGrid, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { GraduationCap, Building2, IndianRupee, FileWarning } from "lucide-react";
import { useEffect, useState } from "react";
import { formatNumberInK } from "../institute/helperFunctions";

export function InstituteDetailsCards(props: { instituteId: string }) {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalTeachers, setTotalTeachers] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [totalExpanses, setTotalExpanses] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (props.instituteId) {
      setIsLoading(true);
      GetInstituteOverview(props.instituteId)
        .then((x: any) => {
          const { institute } = x;
          setTotalStudents(institute.students.length);
          setTotalTeachers(institute.teachers.length);
          setTotalEarnings(institute.earnings);
          setTotalExpanses(institute.expanses);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    }
  }, [props.instituteId]);

  const stats = [
    {
      label: "Students",
      value: formatNumberInK(totalStudents),
      icon: <GraduationCap size={26} />,
      color: "#8B5CF6",
      bg: "#F1EBFF",
    },
    {
      label: "Teachers",
      value: `${totalTeachers}`,
      icon: <Building2 size={26} />,
      color: "#2F6FED",
      bg: "#EAF1FF",
    },
    {
      label: "Earnings",
      value: formatNumberInK(totalEarnings),
      icon: <IndianRupee size={26} />,
      color: "#0EA872",
      bg: "#E6F8F1",
    },
    {
      label: "Expenses",
      value: formatNumberInK(totalExpanses),
      icon: <FileWarning size={26} />,
      color: "#F43F5E",
      bg: "#FFEBEE",
    },
  ];

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <SimpleGrid
        w={isMd ? "95%" : "92%"}
        mx={"auto"}
        mt={"1.5rem"}
        cols={isMd ? 2 : 4}
        spacing={20}
        verticalSpacing={20}
      >
        {stats.map((stat) => (
          <Card
            key={stat.label}
            radius={18}
            p={22}
            shadow="0px 8px 24px rgba(15, 23, 42, 0.06)"
            style={{ border: "1px solid #F1F4F9" }}
          >
            <Flex align={"center"} gap={16}>
              <Flex
                align={"center"}
                justify={"center"}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "16px",
                  background: stat.bg,
                  color: stat.color,
                  flexShrink: 0,
                }}
              >
                {stat.icon}
              </Flex>
              <Stack gap={4}>
                <Text
                  fz={12}
                  fw={700}
                  c={"#8B96AD"}
                  style={{ letterSpacing: "0.04em", textTransform: "uppercase" }}
                >
                  {stat.label}
                </Text>
                <Text lh={1} fw={700} fz={"1.7rem"} c={"#1B2559"}>
                  {stat.value}
                </Text>
              </Stack>
            </Flex>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
}
