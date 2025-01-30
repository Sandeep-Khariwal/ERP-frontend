import { Flex, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";

export function BatchOverviewCards(props: {
  totalTests: number;
  totalStudents: number;
  totalTeachers: number;
}) {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  return (
    <>
      <Flex
        w={isMd ? "95%" : "80%"}
        mt={"2rem"}
        align={"start"}
        gap={20}
        justify={isMd?"center":"start"}
        wrap={"wrap"}
      >
        <Flex
          p={10}
          style={{ borderRadius: "0.3rem", fontFamily: "sans-serif" }}
          w={!isMd?"15rem":"20rem"}
          gap={15}
          bg={"white"}
          align={"center"}
          justify={isMd?"space-between":"center"}
        >
          <Stack align={"start"} justify={"start"} gap={1.4}>
            <Text lh={1.4} fz={"1.2rem"} fw={500} c={"#BFBFBF "}>
              Students
            </Text>
            <Text lh={1} fw={700} fz={"1.7rem"} c={"#4F4F4F"}>
              {props.totalStudents}
            </Text>
          </Stack>
          <Image src={"/student.png"} alt="Not found" width={70} height={70} />
        </Flex>
        <Flex
          p={10}
          style={{ borderRadius: "0.3rem", fontFamily: "sans-serif" }}
          w={!isMd?"15rem":"20rem"}
          gap={15}
          bg={"white"}
          align={"center"}
          justify={isMd?"space-between":"center"}
        >
          <Stack align={"start"} justify={"start"} gap={1}>
            <Text lh={1.4} fz={"1.2rem"} c={"#BFBFBF "} fw={500}>
              Teachers
            </Text>
            <Text lh={1} fw={700} fz={"1.7rem"} c={"#4F4F4F"}>
              {props.totalTeachers}
            </Text>
          </Stack>
          <Image src={"/teacher.png"} alt="Not found" width={70} height={70} />
        </Flex>
        <Flex
          p={10}
          style={{ borderRadius: "0.3rem", fontFamily: "sans-serif" }}
          w={!isMd?"15rem":"20rem"}
          gap={15}
          bg={"white"}
          align={"center"}
          justify={isMd?"space-between":"center"}
        >
          <Stack align={"start"} justify={"start"} gap={1}>
            <Text lh={1.4} fz={"1.2rem"} c={"#BFBFBF "} fw={500}>
              Tests
            </Text>
            <Text lh={1} fw={700} fz={"1.7rem"} c={"#4F4F4F "}>
              {props.totalTests}
            </Text>
          </Stack>
          <Image
            src={"/assignment.png"}
            alt="Not found"
            width={70}
            height={70}
          />
        </Flex>
      </Flex>
    </>
  );
}
