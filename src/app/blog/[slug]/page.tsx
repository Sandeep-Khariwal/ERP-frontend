import { blogs } from "../../data/blogs";
import { notFound } from "next/navigation";

import {
  Container,
  Title,
  Text,
  Paper,
  Badge,
  Divider,
  Button,
  Group,
} from "@mantine/core";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const blog = blogs.find((item) => item.slug === slug);

  return {
    title: blog?.title,
    description: blog?.description,
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <Container size="md" py={60}>
      <Badge
        color="blue"
        variant="light"
        size="lg"
        mb="md"
      >
        ShikshaPay Blog
      </Badge>

      <Title
        mb="md"
        style={{
          color: "#1e3a8a",
          fontSize: "clamp(2rem,5vw,3rem)",
        }}
      >
        {blog.title}
      </Title>

      <Text c="dimmed" mb="xl">
        Published on {blog.date}
      </Text>

      <Divider mb="xl" />

      <Paper
        p={{ base: "lg", md: "xl" }}
        radius="lg"
        style={{
          border: "1px solid rgba(0,0,0,0.06)",
          background: "#fff",
        }}
      >
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        />
      </Paper>

      <Paper
        mt={40}
        p="xl"
        radius="lg"
        style={{
          background:
            "linear-gradient(135deg,#f8fafc,#eef2f6)",
        }}
      >
        <Title
          order={3}
          mb="sm"
          style={{
            color: "#1e3a8a",
          }}
        >
          Ready to Transform Your Institution?
        </Title>

        <Text c="dimmed" mb="lg">
          ShikshaPay helps schools, colleges,
          coaching institutes, and training centers
          manage admissions, fees, attendance,
          examinations, and communication from a
          single platform.
        </Text>

        <Group>
          <Button
            component="a"
            href="tel:+919416059799"
            variant="light"
            color="blue"
          >
            Call Now
          </Button>

          <Button
            component="a"
            href={`https://wa.me/919416059799?text=${encodeURIComponent(
              `Hello ShikshaPay Team,

I am interested in learning more about ShikshaPay School ERP & Education CRM Software.

Please share details regarding:
• Features and modules
• Pricing plans
• Demo availability
• Implementation process

Kindly schedule a demo at your convenience.

Thank you.`
            )}`}
            target="_blank"
            variant="gradient"
            gradient={{
              from: "#46affa",
              to: "#284ffc",
              deg: 60,
            }}
          >
            Book Demo
          </Button>
        </Group>
      </Paper>

      <style>
        {`
          .blog-content h2{
            color:#1e3a8a;
            margin-top:2rem;
            margin-bottom:1rem;
            font-size:1.8rem;
            font-weight:700;
          }

          .blog-content h3{
            color:#284ffc;
            margin-top:1.5rem;
            margin-bottom:.75rem;
            font-size:1.3rem;
            font-weight:600;
          }

          .blog-content p{
            color:#444;
            line-height:1.9;
            margin-bottom:1rem;
            font-size:1rem;
          }

          .blog-content ul{
            padding-left:1.5rem;
            margin-bottom:1rem;
          }

          .blog-content li{
            margin-bottom:.75rem;
            line-height:1.8;
            color:#444;
          }

          .blog-content strong{
            color:#1e3a8a;
          }
        `}
      </style>
    </Container>
  );
}