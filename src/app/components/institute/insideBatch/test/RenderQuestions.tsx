  "use client"

import { Badge, Box, Flex, Paper, Stack, Text } from "@mantine/core";
import { Question } from "./TestDisplayModal";

  export const RenderQuestionCard = (data:{question: Question}) => {
    const correctOption = data.question.options?.find(opt => opt.answer);
    const correctAnswerLetter = correctOption ?
      String.fromCharCode(65 + data.question.options.findIndex(opt => opt.answer)) :
      "N/A";

    return (
      <Paper key={data.question._id} p="md" withBorder radius="md" bg="gray.0">
        <Box mb="sm">
          <Flex mb="xs" justify="space-between" wrap="wrap" gap="sm">
            <Flex gap="sm">
              <Badge color="indigo" size="sm" radius="sm">
                {/* Q{index + 1} */}
              </Badge>
              <Badge color="gray" size="sm" variant="outline">
                1 Mark
              </Badge>
            </Flex>
            <Badge color="teal" size="sm" variant="outline">
              Answer: {correctAnswerLetter}
            </Badge>
          </Flex>
          
          <Text fz={16} fw={500} c="dark.8" mb="sm">
            {data.question.question}
          </Text>
        </Box>

        <Stack gap="xs" ml="md">
          {data.question.options?.map((opt, i) => (
            <Flex key={opt._id} gap="sm" align="flex-start">
              <Text
                size="sm"
                fw={opt.answer ? 600 : 400}
                c={opt.answer ? "green.7" : "dark.6"}
                style={{
                  backgroundColor: opt.answer ? "#e6ffe6" : "transparent",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: opt.answer ? "1px solid #b3ffb3" : "1px solid transparent",
                  width: "100%",
                }}
              >
                {opt.answer ? "✅" : "🔸"} {String.fromCharCode(65 + i)}. {opt.name}
              </Text>
            </Flex>
          ))}
        </Stack>

        {data.question.explanation && (
          <Box mt="sm" p="xs" bg="blue.0" style={{ borderRadius: "4px" }}>
            <Text size="sm" c="blue.8">
              💡 <Text component="span" fw={500}>Explanation:</Text> {data.question.explanation}
            </Text>
          </Box>
        )}
      </Paper>
    );
  };
