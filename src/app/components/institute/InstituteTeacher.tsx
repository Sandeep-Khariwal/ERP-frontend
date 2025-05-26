import { Center, Flex, Stack, Text } from "@mantine/core";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";

export const InstituteTeachers = () => {
  return (
    <Stack
      w={"100%"}
      h={"100vh"}
      bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
    >
      <Flex
        w={"90%"}
        style={{ borderRadius: "1rem" }}
        bg={"white"}
        align={"center"}
        justify={"space-between"}
        p={10}
        py={20}
        mt={10}
        mx={"auto"}
      >
        <Text fw={600} style={{ fontFamily: "sans-serif" }} fz={22}>
          Teacher
        </Text>
        <LiaChalkboardTeacherSolid size={30} />
      </Flex>

      
      <Center>Teacher</Center>
    </Stack>
  );
};
