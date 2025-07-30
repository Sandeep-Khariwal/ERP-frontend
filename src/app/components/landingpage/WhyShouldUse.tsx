import { Box, Button, Flex, Group, Text } from "@mantine/core";
import React, { useEffect, useRef } from "react";
import { IoStarSharp } from "react-icons/io5";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const WhyShouldUse: React.FC = () => {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll animations for .animate-item elements
    const elements = containerRef.current?.querySelectorAll(".animate-item");

    if (elements) {
      elements.forEach((element: Element, index: number) => {
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

    // Button hover animation
    gsap.utils.toArray<HTMLElement>(".hero-button").forEach((button) => {
      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          y: -5,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#1e90ff",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          y: 0,
          boxShadow: "none",
          backgroundColor: "transparent", // Reset to gradient
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    // Cleanup ScrollTriggers and button event listeners
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.utils.toArray<HTMLElement>(".hero-button").forEach((button) => {
        button.removeEventListener("mouseenter", () => {});
        button.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  return (
    <Flex
      ref={containerRef}
      p={"10% 10% 5% 10%"}
      gap={"3.5rem"}
      direction={"column"}
      style={{
        overflow: "hidden",
      }}
    >
      {/* Header Section - Desktop */}
      <Group gap={"xl"} className="animate-item" visibleFrom="md">
        <Box w={"55%"}>
          <Text
            style={{
              fontWeight: 800,
              fontSize: "2.75rem",
            }}
          >
            Why you should use our
            <span
              style={{
                fontWeight: 800,
                fontSize: "2.75rem",
                width: "fit-content",
                color: "blue",
                margin: "1rem",
              }}
            >
              SikshaPay
            </span>
            software
          </Text>
        </Box>
        <Box w={"33%"}>
          <Text>
            We provide comprehensive support to ensure a smooth experience with
            our software. Here's what you can expect:
          </Text>
        </Box>
      </Group>

      {/* Header Section - Mobile/Tablet */}
      <Flex
        direction={"column"}
        gap={"lg"}
        className="animate-item"
        hiddenFrom="md"
        style={{
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            width: "fit-content",
            fontWeight: 800,
            fontSize: "1.5rem",
            lineHeight: 1.2,
          }}
        >
          Why you should use our
          <span
            style={{
              width: "fit-content",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "blue",
              // display: "block",
              margin: "0.5rem",
            }}
          >
            SikshaPay
          </span>
          software
        </Text>
        <Text
          style={{
            maxWidth: "90%",
            lineHeight: 1.5,
          }}
        >
          We provide comprehensive support to ensure a smooth experience with
          our software. Here's what you can expect:
        </Text>
      </Flex>

      {/* Features Row 1 - Desktop */}
      <Group className="animate-item" visibleFrom="md">
        <Box style={{ width: "40%" }}>
          <Flex gap={"xl"}>
            <Box>
              <IoStarSharp
                style={{
                  marginTop: "5%",
                  fontSize: "1.5rem",
                  color: "blue",
                  background:
                    "linear-gradient(to bottom, #b9c9f5ff 0%, #ffffff 100%)",
                  padding: "10px",
                  width: "50px",
                  height: "50px",
                  borderRadius: "15px",
                }}
              />
            </Box>
            <Box>
              <Flex direction={"column"}>
                <Text style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                  Accelerate Efficiency
                </Text>
                <Text style={{ fontSize: "0.85rem" }}>
                  Supercharge your school's operations with automation and smart
                  workflows. SikshaPay reduces manual workload, helping staff
                  focus on what truly matters—educating students.
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
        <Box style={{ width: "40%", marginLeft: "4rem" }}>
          <Flex gap={"xl"}>
            <Box>
              <IoStarSharp
                style={{
                  marginTop: "5%",
                  fontSize: "1.5rem",
                  color: "#1D3110",
                  background:
                    "linear-gradient(to bottom, #b9c9f5ff 0%, #ffffff 100%)",
                  padding: "10px",
                  width: "50px",
                  height: "50px",
                  borderRadius: "15px",
                }}
              />
            </Box>
            <Box>
              <Flex direction={"column"}>
                <Text style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                  Make Smarter Decisions with Insights
                </Text>
                <Text style={{ fontSize: "0.85rem" }}>
                  Access powerful dashboards and reports that give you clear
                  visibility into student performance, finances, and staff
                  productivity—empowering administrators to make data-driven
                  decisions.
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Group>

      {/* Features Row 2 - Desktop */}
      <Group className="animate-item" visibleFrom="md">
        <Box style={{ width: "40%", marginLeft: "6rem" }}>
          <Flex gap={"xl"}>
            <Box>
              <IoStarSharp
                style={{
                  marginTop: "5%",
                  fontSize: "1.5rem",
                  color: "#B94E58",
                  background:
                    "linear-gradient(to bottom, #b9c9f5ff 0%, #ffffff 100%)",
                  padding: "10px",
                  width: "50px",
                  height: "50px",
                  borderRadius: "15px",
                }}
              />
            </Box>
            <Box>
              <Flex direction={"column"}>
                <Text style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                  Ensure Data Security & Accuracy
                </Text>
                <Text style={{ fontSize: "0.85rem" }}>
                  With real-time data management and robust access controls,
                  SikshaPay ensures your school's data is always secure,
                  accurate, and easy to retrieve—no more lost records or human
                  errors.
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
        <Box style={{ width: "40%", marginLeft: "4rem" }}>
          <Flex gap={"xl"}>
            <Box>
              <IoStarSharp
                style={{
                  marginTop: "5%",
                  fontSize: "1.5rem",
                  color: "#2C9585",
                  background:
                    "linear-gradient(to bottom, #b9c9f5ff 0%, #ffffff 100%)",
                  padding: "10px",
                  width: "50px",
                  height: "50px",
                  borderRadius: "15px",
                }}
              />
            </Box>
            <Box>
              <Flex direction={"column"}>
                <Text style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                  Unlock Time-Saving Potential
                </Text>
                <Text style={{ fontSize: "0.85rem" }}>
                  Harness the power of our cutting-edge ERP system to automate
                  repetitive tasks like attendance, fee tracking, and report
                  generation—saving hours every week.
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Group>

      {/* Features Mobile/Tablet - Vertical Stack */}
      <Flex direction={"column"} gap={"xl"} hiddenFrom="md">
        {/* Feature 1 */}
        <Flex
          gap={"md"}
          className="animate-item"
          style={{
            alignItems: "flex-start",
          }}
        >
          <Box style={{ flexShrink: 0 }}>
            <IoStarSharp
              style={{
                fontSize: "1.5rem",
                color: "blue",
                background:
                  "linear-gradient(to bottom, #b9c9f5ff 0%, #ffffff 100%)",
                padding: "10px",
                width: "50px",
                height: "50px",
                borderRadius: "15px",
              }}
            />
          </Box>
          <Flex direction={"column"} gap={"xs"}>
            <Text style={{ fontSize: "1.15rem", fontWeight: 700 }}>
              Accelerate Efficiency
            </Text>
            <Text style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              Supercharge your school's operations with automation and smart
              workflows. SikshaPay reduces manual workload, helping staff focus
              on what truly matters—educating students.
            </Text>
          </Flex>
        </Flex>

        {/* Feature 2 */}
        <Flex
          gap={"md"}
          className="animate-item"
          style={{
            alignItems: "flex-start",
          }}
        >
          <Box style={{ flexShrink: 0 }}>
            <IoStarSharp
              style={{
                fontSize: "1.5rem",
                color: "#1D3110",
                background:
                  "linear-gradient(to bottom, #b9c9f5ff 0%, #ffffff 100%)",
                padding: "10px",
                width: "50px",
                height: "50px",
                borderRadius: "15px",
              }}
            />
          </Box>
          <Flex direction={"column"} gap={"xs"}>
            <Text style={{ fontSize: "1.15rem", fontWeight: 700 }}>
              Make Smarter Decisions with Insights
            </Text>
            <Text style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              Access powerful dashboards and reports that give you clear
              visibility into student performance, finances, and staff
              productivity—empowering administrators to make data-driven
              decisions.
            </Text>
          </Flex>
        </Flex>

        {/* Feature 3 */}
        <Flex
          gap={"md"}
          className="animate-item"
          style={{
            alignItems: "flex-start",
          }}
        >
          <Box style={{ flexShrink: 0 }}>
            <IoStarSharp
              style={{
                fontSize: "1.5rem",
                color: "#B94E58",
                background:
                  "linear-gradient(to bottom, #b9c9f5ff 0%, #ffffff 100%)",
                padding: "10px",
                width: "50px",
                height: "50px",
                borderRadius: "15px",
              }}
            />
          </Box>
          <Flex direction={"column"} gap={"xs"}>
            <Text style={{ fontSize: "1.15rem", fontWeight: 700 }}>
              Ensure Data Security & Accuracy
            </Text>
            <Text style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              With real-time data management and robust access controls,
              SikshaPay ensures your school's data is always secure, accurate,
              and easy to retrieve—no more lost records or human errors.
            </Text>
          </Flex>
        </Flex>

        {/* Feature 4 */}
        <Flex
          gap={"md"}
          className="animate-item"
          style={{
            alignItems: "flex-start",
          }}
        >
          <Box style={{ flexShrink: 0 }}>
            <IoStarSharp
              style={{
                fontSize: "1.5rem",
                color: "#2C9585",
                background:
                  "linear-gradient(to bottom, #b9c9f5ff 0%, #ffffff 100%)",
                padding: "10px",
                width: "50px",
                height: "50px",
                borderRadius: "15px",
              }}
            />
          </Box>
          <Flex direction={"column"} gap={"xs"}>
            <Text style={{ fontSize: "1.15rem", fontWeight: 700 }}>
              Unlock Time-Saving Potential
            </Text>
            <Text style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              Harness the power of our cutting-edge ERP system to automate
              repetitive tasks like attendance, fee tracking, and report
              generation—saving hours every week.
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* CTA Button */}
      <Flex justify={"center"} className="animate-item">
        <Button
          className="hero-button get-started"
          variant="gradient"
          gradient={{ from: "#46affaff", to: "#284ffcff", deg: 60 }}
          onClick={() => router.push("/auth")}
          style={{
            padding: "0 3rem",
            fontSize: "1.05rem",
          }}
        >
          Get Started
        </Button>
      </Flex>
    </Flex>
  );
};

export default WhyShouldUse;
