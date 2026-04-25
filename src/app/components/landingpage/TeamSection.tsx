import { Box, Center, Grid, Text, Title, rem, Image } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const sandeep = "/Sandeep.jpg";
const johnson = "/Johnson.png";
const shubham = "/Shubham.png";
const jagdeep = "/jagdeep.jpeg";
const guri = "/guri.jpeg"

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
  {
    name: "jagdeep",
    role: "FullStack Developer",
    image: `${jagdeep}`,
   description:
  "Jagdeep is a passionate Full Stack Developer with expertise in building robust and scalable web applications. He excels in crafting responsive user interfaces and developing secure, high-performance backend systems. With hands-on experience in modern frameworks, API development, and database management, Jagdeep consistently delivers efficient and user-focused digital solutions."
  },
  {
    name: "Guri",
    role: "FullStack Developer",
    image: `${guri}`,
 description:
  "Guri is a dedicated Full Stack Developer known for building clean, efficient, and scalable web applications. He has strong command over both frontend and backend technologies, creating smooth user experiences and reliable system architecture. With a problem-solving mindset and attention to detail, Guri focuses on delivering high-quality, performance-driven solutions."
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
  height: "100%",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between",
};

const Team = () => {
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    // Only run animations on larger screens
    if (!isMobile) {
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
    } else {
      // On mobile, ensure cards are visible immediately
      cardsRef.current.forEach((card) => {
        if (card) {
          gsap.set(card, { opacity: 1, y: 0 });
        }
      });
    }
  }, [isMobile]);

  return (
    <Box py="xl" px="md" style={{ overflow: "hidden", minHeight: "70vh" }} >
      <Center mb="xl">
        <Title
          order={2}
          c="#0599FB"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          }}
        >
          Meet Our Team
        </Title>
      </Center>
      <Grid gutter="xl" justify="center" align="stretch">
        {teamMembers.map((member, idx) => (
          <Grid.Col
            key={member.name}
            span={{ base: 12, xs: 12, sm: 6, md: 4, lg: 4 }}
          >
            <Box
              style={cardStyles}
              className="team-card"
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-10px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <Box>
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
                <Text fw={400} size="sm" mb={8} style={{ color: "#7cdacc" }}>
                  {member.role}
                </Text>
              </Box>
              <Text size="sm" style={{ lineHeight: 1.4, marginTop: "auto" }}>
                {member.description}
              </Text>
            </Box>
          </Grid.Col>
        ))}
      </Grid>

      {/* Additional CSS for better mobile experience */}
      <style jsx global>{`
        @media (max-width: 576px) {
          .team-card {
            margin-bottom: 1.5rem !important;
          }
        }

        @media (max-width: 768px) {
          .team-card {
            min-height: 320px;
          }
        }

        @media (min-width: 769px) and (max-width: 992px) {
          .team-card {
            min-height: 360px;
          }
        }
      `}</style>
    </Box>
  );
};

export default Team;
