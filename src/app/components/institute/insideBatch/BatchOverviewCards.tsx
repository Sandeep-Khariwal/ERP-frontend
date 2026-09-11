import { Card, Flex, SimpleGrid, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { GraduationCap, Users, FileText } from "lucide-react";

export function BatchOverviewCards(props: {
  totalTests: number;
  totalStudents: number;
  totalTeachers: number;
}) {
  const isMd = useMediaQuery(`(max-width: 968px)`);

  const stats = [
    {
      label: "Students",
      value: props.totalStudents,
      icon: <GraduationCap size={26} />,
      color: "#2F6FED",
      bg: "#EAF1FF",
    },
    {
      label: "Teachers",
      value: props.totalTeachers,
      icon: <Users size={26} />,
      color: "#0EA872",
      bg: "#E6F8F1",
    },
    {
      label: "Tests",
      value: props.totalTests,
      icon: <FileText size={26} />,
      color: "#8B5CF6",
      bg: "#F1EBFF",
    },
  ];

  return (
    <SimpleGrid
      w={isMd ? "95%" : "92%"}
      mx={"auto"}
      mt={"1.5rem"}
      cols={isMd ? 1 : 3}
      spacing={20}
    >
      {stats.map((stat) => (
        <Card
          key={stat.label}
          radius={18}
          p={22}
          shadow="0px 6px 20px rgba(15,23,42,0.05)"
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
  );
}
