import { Box, Center, Grid, Text, Title, rem, Image, Container } from "@mantine/core";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  { name: "Sandeep Khariwal", role: "Founder/CEO", image: "/Sandeep.jpg" },
  { name: "Johnson", role: "Frontend Developer", image: "/Johnson.png" },
  { name: "Shubham", role: "Fullstack Developer", image: "/Shubham.png" },
  { name: "Jagdeep", role: "Frontend Developer", image: "/jagdeep.jpeg" },
  { name: "Guri", role: "Frontend Developer", image: "/guri.jpeg" },
  { name: "Rahul", role: "Fullstack Developer", image: "/rahul.jpeg" },
];

const Team = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reset any hidden states immediately to ensure visibility
      gsap.set(".team-card", { opacity: 1, y: 0 });

      // 2. Entrance Animation: Staggered Fade-in
      gsap.from(".team-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".team-grid",
          start: "top 85%", 
          toggleActions: "play none none none"
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box 
      ref={containerRef} 
      py={80} 
      style={{ 
        background: "linear-gradient(180deg, #0a192f 0%, #020c1b 100%)",
        minHeight: "100vh",
        overflow: "visible" // Ensure cards aren't clipped
      }}
    >
      <Container size="xl">
        <Center mb={60} style={{ flexDirection: "column" }}>
          <Title
            order={2}
            c="white"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              textAlign: "center"
            }}
          >
            Meet Our <span style={{ color: "#0599FB" }}>Experts</span>
          </Title>
          <Box h={4} w={80} bg="#0599FB" mt={10} style={{ borderRadius: 10 }} />
        </Center>

        {/* 
            Grid Explanation:
            Base 12: 1 card per row
            SM 6: 2 cards per row
            MD 4: 3 cards per row
        */}
        <Grid gutter={30} className="team-grid" justify="center" align="stretch">
          {teamMembers.map((member) => (
            <Grid.Col key={member.name} span={{ base: 12, sm: 6, md: 4, lg: 4 }}  >
              <Box
                className="team-card"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: rem(20),
                  padding: rem(30),
                  // height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transition: "transform 0.3s ease, border-color 0.3s ease",
                  cursor: "default"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.borderColor = "#0599FB";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  w={110}
                  h={110}
                  radius={100}
                  mb={20}
                  style={{
                    border: "3px solid #0599FB",
                    padding: "4px",
                    background: "rgba(5, 153, 251, 0.1)"
                  }}
                />
                
                <Text fw={700} size="xl" c="white" mb={5}>
                  {member.name}
                </Text>
                
                <Text fw={500} size="sm" c="#0599FB" tt="uppercase" >
                  {member.role}
                </Text>

              </Box>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Team;