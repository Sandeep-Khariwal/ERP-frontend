import { GetInstituteOverview } from "@/axios/institute/InstituteGetApi";
import { Flex, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatNumberInK } from "../institute/helperFunctions";

export function InstituteDetailsCards(props: { instituteId: string }) {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalTeachers, setTotalTeachers] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [totalExpanses, setTotalExpanses] = useState<number>(0);
  const [isLoading,setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (props.instituteId) {
      setIsLoading(true)
      GetInstituteOverview(props.instituteId)
        .then((x: any) => {
          const { institute } = x;
          setTotalStudents(institute.students.length);
          setTotalTeachers(institute.teachers.length);
          setTotalEarnings(institute.earnings);
          setTotalExpanses(institute.expanses);
          setIsLoading(false)
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false)
        });
    }
  }, [props.instituteId]);
  return (
    <>
    <LoadingOverlay visible={isLoading} />
      <Flex
        w={isMd ? "95%" : "80%"}
        mx={"auto"}
        mt={"2rem"}
        align={"center"}
        gap={15}
        justify={"space-between"}
        wrap={"wrap"}
      >
        <Flex
          p={10}
          style={{ borderRadius: "0.3rem", fontFamily: "sans-serif" }}
          w={"10rem"}
          gap={15}
          bg={"white"}
          align={"center"}
          justify={"center"}
        >
          <Image src={"/student.png"} alt="Not found" width={40} height={40} />
          <Stack align={"center"} justify={"start"} gap={1.4}>
            <Text lh={1.4} fz={"0.8rem"} fw={600} c={"#BFBFBF "}>
              Students
            </Text>
            <Text lh={1} fw={700} fz={"1.3rem"} c={"#4F4F4F"}>
              {formatNumberInK(totalStudents)}
            </Text>
          </Stack>
        </Flex>
        <Flex
          p={10}
          style={{ borderRadius: "0.3rem", fontFamily: "sans-serif" }}
          w={"10rem"}
          gap={15}
          bg={"white"}
          align={"center"}
          justify={"center"}
        >
          <Image src={"/teacher.png"} alt="Not found" width={40} height={40} />
          <Stack align={"center"} justify={"start"} gap={1}>
            <Text lh={1.4} fz={"0.8rem"} c={"#BFBFBF "} fw={600}>
              Teachers
            </Text>
            <Text lh={1} fw={700} fz={"1.3rem"} c={"#4F4F4F"}>
              {totalTeachers}
            </Text>
          </Stack>
        </Flex>
        <Flex
          p={10}
          style={{ borderRadius: "0.3rem", fontFamily: "sans-serif" }}
          w={"10rem"}
          gap={15}
          bg={"white"}
          align={"center"}
          justify={"center"}
        >
          <Image src={"/earnings.png"} alt="Not found" width={40} height={40} />
          <Stack align={"center"} justify={"start"} gap={1}>
            <Text lh={1.4} fz={"0.8rem"} c={"#BFBFBF "} fw={600}>
              Earnings
            </Text>
            <Text lh={1} fw={700} fz={"1.3rem"} c={"#4F4F4F "}>
              {formatNumberInK(totalEarnings)}
            </Text>
          </Stack>
        </Flex>
        <Flex
          p={10}
          style={{ borderRadius: "0.3rem", fontFamily: "sans-serif" }}
          w={"10rem"}
          gap={15}
          bg={"white"}
          align={"center"}
          justify={"center"}
        >
          <Image src={"/expenses.jpg"} alt="Not found" width={40} height={40} />
          <Stack align={"center"} justify={"start"} gap={1}>
            <Text lh={1.4} fz={"0.8rem"} c={"#BFBFBF "} fw={600}>
              Expanses
            </Text>
            <Text lh={1} fw={700} fz={"1.3rem"} c={"#4F4F4F "}>
              {formatNumberInK(totalExpanses)}
            </Text>
          </Stack>
        </Flex>
      </Flex>
    </>
  );
}
