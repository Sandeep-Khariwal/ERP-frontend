import { Box, Center, Grid, Text, Title, rem, Image } from "@mantine/core";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const sandeep = "/Sandeep.jpg";
const johnson = "/Johnson.png";
const shubham = "/Shubham.png";

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    name: "Sandeep Khariwal",
    role: "Founder/CEO",
    image: `${sandeep}`,
    description:
      "As Founder and CEO, Sandeep defined Siksha Pay's vision and led the team with clarity and purpose. His leadership and entrepreneurial drive turned the idea into a successful product.",
  },
  {
    name: "Johnson",
    role: "Frontend Developer",
    image: `${johnson}`,
    description:
      "Johnson crafted the user interface with modern, responsive designs using React and Mantine. He also implemented animations and ensured pixel-perfect UI consistency.",
  },
  {
    name: "Shubham",
    role: "Backend Developer",
    image: `${shubham}`,
    description:
      "Shubham architected and implemented the backend services with secure and scalable APIs, integrating MongoDB, authentication, and admin functionalities for smooth data flow.",
  },
];

const cardStyles = {
  background: "linear-gradient(135deg, #5668F8, #0599FB)",
  border: "2px solid #7cdacc",
  boxShadow: "0 6px 15px rgba(5, 153, 251, 0.3)",
  borderRadius: rem(16),
  padding: rem(24),
  color: "#fff",
  textAlign: "center" as const,
  fontFamily: "Poppins, sans-serif",
  transition: "transform 0.3s ease",
};

const Team = () => {
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
            delay: index * 0.2,
          }
        );
      }
    });
  }, []);

  return (
    <Box py="xl" px="md" style={{ overflow: "hidden" }}>
      <Center mb="xl">
        <Title
          order={2}
          c="#0599FB"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Meet Our Team
        </Title>
      </Center>
      <Grid gutter="xl" justify="center">
        {teamMembers.map((member, idx) => (
          <Grid.Col key={member.name} span={{ base: 12, sm: 6, md: 4 }}>
            <Box
              ref={(el) => { cardsRef.current[idx] = el; }}
              style={cardStyles}
              className="team-card"
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-10px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <Center>
                <Image
                  src={member.image}
                  alt={member.name}
                  width={80}
                  height={80}
                  radius={999}
                  style={{
                    objectFit: "cover",
                    border: "3px solid #7cdacc",
                    backgroundColor: "#fff",
                    marginBottom: rem(16),
                  }}
                />
              </Center>
              <Text fw={600} size="lg" mb={4}>
                {member.name}
              </Text>
              <Text fw={400} size="sm" mb={8}>
                {member.role}
              </Text>
              <Text size="sm" style={{ lineHeight: 1.4 }}>
                {member.description}
              </Text>
            </Box>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
};

export default Team;
