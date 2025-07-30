"use client";

import React, { useEffect, useRef } from "react";
import { Flex, Box, Text, Group, Image } from "@mantine/core";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Johnson = "/Johnson.webp";

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll(".animate-item");

    if (elements) {
      elements.forEach((element: Element, index: number) => {
        const direction = index % 2 === 0 ? -100 : 100;
        gsap.fromTo(
          element,
          { opacity: 0, x: direction },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 95%",
              end: "bottom 5%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const TestimonialCard = () => (
    <Flex
      className="animate-item"
      gap="md"
      style={{
        border: "1px solid #e0e0e0",
        padding: "1rem",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #fcfdffff, #e5e9ff)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        backdropFilter: "blur(12px)",
        width: "100%",
        maxWidth: "400px",
        minWidth: "280px",
        flex: "1 1 300px", // Flexible width with min-width
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.1)";
      }}
    >
      <Image
        mt="5px"
        src={Johnson}
        alt="Johnson"
        w="50px"
        h="50px"
        style={{
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #fff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          flexShrink: 0, // Prevent image from shrinking
        }}
      />
      <Box style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: 900,
            fontSize: "clamp(1rem, 4vw, 1.15rem)", // Responsive font size
            color: "#1e1e1e",
            marginBottom: "0.5rem",
          }}
        >
          Johnson
        </Text>
        <Text
          style={{
            fontSize: "clamp(0.8rem, 3vw, 0.9rem)", // Responsive font size
            color: "#333",
            lineHeight: "1.4",
          }}
        >
          This software has made managing school tasks so much easier and
          faster. It's user-friendly, efficient, and has improved overall
          communication and organization.
        </Text>
      </Box>
    </Flex>
  );

  return (
    <Flex
      direction="column"
      p={{ base: "5% 5% 10%", sm: "4% 8% 10%", md: "2.5% 10% 10%" }}
      ref={containerRef}
      style={{
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <Group
        justify="space-around"
        align="center"
        mb={{ base: "2rem", md: "xl" }}
      >
        <Flex
          direction="column"
          w={{ base: "100%", md: "50%" }}
          style={{ gap: "1.25rem" }}
          ta={{ base: "center", md: "left" }}
        >
          <Box
            className="animate-item"
            m={{ base: "0 auto", md: "0" }}
            style={{
              width: "fit-content",
              backgroundColor: "#F2E6E6",
              padding: "5px 1rem",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "clamp(0.8rem, 3vw, 0.9rem)",
            }}
          >
            TESTIMONIALS
          </Box>
          <Text
            className="animate-item"
            style={{
              fontSize: "clamp(1.8rem, 6vw, 2.75rem)",
              fontWeight: 700,
              lineHeight: "1.2",
            }}
          >
            How Our Software Has Transformed Schools
          </Text>
        </Flex>

        <Box
          className="animate-item"
          w={{ base: "100%", md: "35%" }}
          mt={{ base: "0", md: "1.25rem" }}
          ta={{ base: "center", md: "left" }}
          style={{
            fontSize: "clamp(0.9rem, 3.5vw, 1rem)",
            lineHeight: "1.5",
          }}
        >
          Our software simplifies school management, boosts efficiency, and
          improves communication between teachers, students, and parents.
        </Box>
      </Group>

      {/* Testimonials Grid */}
      <Flex
        wrap="wrap"
        justify={{ base: "center", sm: "space-around" }}
        gap={{ base: "1rem", sm: "1.5rem", md: "2rem" }}
        mt={{ base: "2rem", md: "xl" }}
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <TestimonialCard key={i} />
          ))}
      </Flex>
    </Flex>
  );
};

export default Testimonials;
