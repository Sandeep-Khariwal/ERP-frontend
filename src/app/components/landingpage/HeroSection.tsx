import { Box, Group, Text, Button } from "@mantine/core";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LandingPageImage = "/LandingPage.jpg";

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const elements = containerRef.current?.querySelectorAll(".animate-item");

    if (elements) {
      elements.forEach((element: Element, index: number) => {
        // Determine animation direction based on index (left for even, right for odd)
        const direction = index % 2 === 0 ? -100 : 100;

        gsap.fromTo(
          element,
          {
            opacity: 0,
            x: direction,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    gsap.utils.toArray<HTMLElement>(".main-hero-button").forEach((button) => {
      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          y: -5,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          y: 0,
          boxShadow: "none",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    // Cleanup ScrollTriggers
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Group ref={containerRef} m="5%" justify="space-around">
      <Box w="40%">
        <Group gap="xl" style={{ flexDirection: "column" }}>
          <h2
            className="animate-item hero-title"
            style={{
              fontSize: "2rem",
              fontWeight: 600,
            }}
          >
            Simplify School Operations with One Powerful Platform
          </h2>
          <Text className="animate-item hero-text">
            Simplify school operations with a powerful all-in-one management
            platform. Easily handle admissions, attendance, exams, fees, and
            reports — all from a single dashboard.
          </Text>
          {/* Separate Group for buttons without animate-item */}
          <Group gap="xl" justify="flex-start">
            <Button
              className="main-hero-button"
              bg="blue"
              radius="sm"
              size="md"
            >
              Get Started
            </Button>
            <Button
              className="main-hero-button"
              bg="white"
              c="blue"
              radius="sm"
              size="md"
              style={{
                border: "1px solid black",
                fontWeight: 700,
              }}
            >
              Book Demo
            </Button>
          </Group>
        </Group>
      </Box>
      <Box w="40%" className="animate-item hero-image">
        <Image
          src={LandingPageImage}
          alt="Landing Illustration"
          width={400}
          height={400}
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Box>
    </Group>
  );
};

export default HeroSection;
