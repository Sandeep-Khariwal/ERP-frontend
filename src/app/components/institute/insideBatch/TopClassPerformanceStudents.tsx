"use client";

import { GetTopClassPerformedStudents } from "@/axios/batch/BatchGetApi";
import {
  Container,
  Title,
  Text,
  Group,
  Avatar,
  Stack,
  Grid,
  Paper,
  Box,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCheck,
  IconBook,
  IconFileDescription,
  IconTrophy,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function TopStudentsPremium(props: { batchId: string }) {
  const [students, setStudents] = useState<any[]>([]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#f59f00"; // gold
    if (rank === 2) return "#868e96"; // silver
    if (rank === 3) return "#d9480f"; // bronze
    return "#228be6"; // blue
  };

  useEffect(() => {
    GetTopClassPerformedStudents(props.batchId)
      .then((res: any) => {
        const data = res.data?.data || res.data;
        const sorted = [...data].sort((a: any, b: any) => a.rank - b.rank);

        if (sorted.length >= 3) {
          const podiumOrder = [sorted[1], sorted[0], sorted[2], ...sorted.slice(3)];
          setStudents(podiumOrder);
        } else {
          setStudents(sorted);
        }
      })
      .catch((e: any) => console.error(e));
  }, [props.batchId]);

  return (
    <Box py={60} style={{ background: "#f8f9fa" }}>
      <Container size="lg">
        {/* Header */}
        <Stack align="center" mb={50}>
          <ThemeIcon size={70} radius="xl" color="yellow" variant="light">
            <IconTrophy size={30} />
          </ThemeIcon>

          <Title fw={900} size="2rem">
            Top Performers
          </Title>

         
        </Stack>

        {/* Cards */}
        <Grid justify="center" align="stretch" gutter="xl">
          {students.map((student) => {
            const color = getRankColor(student.rank);
            const isFirst = student.rank === 1;

            return (
              <Grid.Col key={student._id} span={{ base: 12, sm: 4 }}>
                <Paper
                  radius="xl"
                  p="xl"
                  style={{
                    height: isFirst ? 340 : 300,
                    textAlign: "center",
                    background: "#ffffff",
                    border: "1px solid #e9ecef",
                    transition: "all 0.25s ease",
                    boxShadow: isFirst
                      ? "0 10px 25px rgba(0,0,0,0.08)"
                      : "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 30px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.05)";
                  }}
                >
                  {/* Rank */}
                  <Text
                    size="xs"
                    fw={700}
                    style={{
                      color: color,
                      letterSpacing: 1,
                      marginBottom: 8,
                    }}
                  >
                    RANK #{student.rank}
                  </Text>

                  {/* Avatar */}
                  <Avatar
                    size={isFirst ? 100 : 80}
                    radius="xl"
                    mx="auto"
                    mb="sm"
                    src={student.avatar || ""}
                    style={{
                      border: `3px solid ${color}`,
                    }}
                  />

                  {/* Name */}
                  <Text fw={700} size="lg">
                    {student.name}
                  </Text>

                  {/* Score */}
                  <Text
                    fw={800}
                    size="xl"
                    style={{ color: color, marginTop: 4 }}
                  >
                    {(student.finalScore * 100).toFixed(0)}%
                  </Text>

                  {/* Divider */}
                  <Box
                    my="md"
                    style={{
                      height: 1,
                      background: "#e9ecef",
                    }}
                  />

                  {/* Stats */}
                  <Group justify="center" gap="xl">
                    <Stack gap={2} align="center">
                      <IconCheck size={18} />
                      <Text size="xs" c="dimmed">
                        {student.attendance || 0}
                      </Text>
                    </Stack>

                    <Stack gap={2} align="center">
                      <IconBook size={18} />
                      <Text size="xs" c="dimmed">
                        {student.test || 0}
                      </Text>
                    </Stack>

                    <Stack gap={2} align="center">
                      <IconFileDescription size={18} />
                      <Text size="xs" c="dimmed">
                        {student.online || 0}
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              </Grid.Col>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}