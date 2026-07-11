import Link from "next/link";
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Paper,
  Badge,
  Button,
  Stack,
  Group,
} from "@mantine/core";

import { blogs } from "../data/blogs";

export default function BlogsPage() {
  return (
    <Container size="lg" py={80}>
      <Stack align="center" mb={60}>
        <Badge
          size="lg"
          variant="light"
          color="blue"
          radius="xl"
        >
          ShikshaPay Blogs
        </Badge>

        <Title
          ta="center"
          style={{
            color: "#1e3a8a",
            fontSize: "clamp(2rem,5vw,3rem)",
          }}
        >
          Latest Insights & Educational Resources
        </Title>

        <Text
          ta="center"
          maw={700}
          c="dimmed"
          size="lg"
        >
          Explore articles about School ERP Software,
          Education CRM, Fee Management, Attendance,
          Admissions, and Digital Transformation in Education.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
        {blogs.map((blog) => (
          <Paper
            key={blog.slug}
            p="xl"
            radius="lg"
            style={{
              border: "1px solid rgba(0,0,0,0.06)",
              transition: "all .3s ease",
              cursor: "pointer",
              height: "100%",
            }}
          >
            <Stack justify="space-between" h="100%">
              <div>
                <Badge
                  color="blue"
                  variant="light"
                  mb="md"
                >
                  Blog
                </Badge>

                <Title
                  order={3}
                  mb="sm"
                  style={{
                    color: "#1e3a8a",
                  }}
                >
                  {blog.title}
                </Title>

                <Text c="dimmed" size="sm">
                  {blog.description}
                </Text>
              </div>

              <Group justify="space-between" mt="xl">
                <Text size="xs" c="dimmed">
                  {blog.date}
                </Text>

                <Link
                  href={`/blog/${blog.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="gradient"
                    gradient={{
                      from: "#46affa",
                      to: "#284ffc",
                      deg: 60,
                    }}
                  >
                    Read More
                  </Button>
                </Link>
              </Group>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Container>
  );
}