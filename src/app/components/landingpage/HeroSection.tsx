"use client";

import { Box, Group, Text, Button } from "@mantine/core";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";

const LandingPageImage = "/LandingPage.jpg";

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const hasAnimated = sessionStorage.getItem("heroAnimated");

    // Only run animation if not played before in this session (i.e. first load / refresh)
    if (!hasAnimated) {
      const elements = containerRef.current?.querySelectorAll(".animate-item");
      if (elements) {
        gsap.from(elements, {
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 1,
          ease: "power2.out",
        });
      }
      sessionStorage.setItem("heroAnimated", "true");
    }

    // Hover animation setup
    const buttons = gsap.utils.toArray<HTMLElement>(".main-hero-button");
    const enterListeners: (() => void)[] = [];
    const leaveListeners: (() => void)[] = [];

    buttons.forEach((button, index) => {
      const onEnter = () =>
        gsap.to(button, {
          y: -5,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          duration: 0.3,
          ease: "power2.out",
        });
      const onLeave = () =>
        gsap.to(button, {
          y: 0,
          boxShadow: "none",
          duration: 0.3,
          ease: "power2.out",
        });

      button.addEventListener("mouseenter", onEnter);
      button.addEventListener("mouseleave", onLeave);

      enterListeners[index] = onEnter;
      leaveListeners[index] = onLeave;
    });

    return () => {
      buttons.forEach((button, index) => {
        button.removeEventListener("mouseenter", enterListeners[index]);
        button.removeEventListener("mouseleave", leaveListeners[index]);
      });
    };
  }, []);

  // Smooth scroll to contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById("Contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      ref={containerRef}
      m="5%"
      id="About"
      style={{
        overflow: "hidden",
      }}
    >
      {/* Desktop Layout */}
      <Group justify="space-around" visibleFrom="md">
        {/* Left Section */}
        <Box w="45%">
          <Group gap="xl" style={{ flexDirection: "column" }}>
            <h2
              className="animate-item"
              style={{ fontSize: "2.5rem", fontWeight: 700, color: "#1e3a8a" }}
            >
              Simplify School Operations with One Powerful Platform
            </h2>
            <Text
              className="animate-item"
              style={{ fontSize: "1.125rem", color: "#444" }}
            >
              Simplify school operations with a powerful all-in-one management
              platform. Easily handle admissions, attendance, exams, fees, and
              reports — all from a single dashboard.
            </Text>

            <Group gap="lg" justify="flex-start">
              <a href="tel:+919416059799" style={{ textDecoration: "none" }}>
                <Button
                  className="main-hero-button"
                  radius="sm"
                  size="md"
                  variant="gradient"
                  gradient={{ from: "#46affaff", to: "#284ffcff", deg: 60 }}
                  style={{ cursor: "pointer" }}
                >
                  Call Now
                </Button>
              </a>

              <Button
                onClick={scrollToContact}
                className="main-hero-button"
                bg="white"
                c="blue"
                radius="sm"
                size="md"
                style={{ border: "1px solid #284ffc", fontWeight: 600 }}
              >
                Book Demo
              </Button>
            </Group>
          </Group>
        </Box>

        {/* Right Section */}
        <Box w="45%" className="animate-item">
          <Image
            src={LandingPageImage}
            alt="Landing Illustration"
            width={500}
            height={400}
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Box>
      </Group>

      {/* Mobile View */}
      <Box hiddenFrom="md">
        <Group
          gap="xl"
          style={{
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box
            className="animate-item"
            style={{ width: "100%", maxWidth: "350px" }}
          >
            <Image
              src={LandingPageImage}
              alt="Landing Illustration"
              width={350}
              height={350}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Box>

          <h2
            className="animate-item"
            style={{
              fontSize: "1.75rem",
              fontWeight: 600,
              color: "#1e3a8a",
              margin: 0,
              lineHeight: 1.3,
              padding: "0 1rem",
            }}
          >
            Simplify School Operations with One Powerful Platform
          </h2>

          <Text
            className="animate-item"
            style={{
              fontSize: "1rem",
              color: "#444",
              lineHeight: 1.5,
              padding: "0 1.5rem",
              maxWidth: "90%",
            }}
          >
            Simplify school operations with a powerful all-in-one management
            platform. Easily handle admissions, attendance, exams, fees, and
            reports — all from a single dashboard.
          </Text>

          <Group
            gap="md"
            justify="center"
            style={{ flexDirection: "row", flexWrap: "wrap" }}
          >
            <Button
              onClick={() => router.push("/auth")}
              className="main-hero-button"
              radius="sm"
              size="md"
              variant="gradient"
              gradient={{ from: "#46affaff", to: "#284ffcff", deg: 60 }}
              style={{ minWidth: "120px" }}
            >
              Get Started
            </Button>
            <Button
              onClick={scrollToContact}
              className="main-hero-button"
              bg="white"
              c="blue"
              radius="sm"
              size="md"
              style={{
                border: "1px solid #284ffc",
                fontWeight: 600,
                minWidth: "120px",
              }}
            >
              Book Demo
            </Button>
          </Group>
        </Group>
      </Box>
    </Box>
  );
};

export default HeroSection;
