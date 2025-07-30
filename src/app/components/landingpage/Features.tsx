import React, { useEffect, useRef } from "react";
import { Box, Flex, Group, Image, Text } from "@mantine/core";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const School_Fees_Management = "/School_Fees_Management.webp";
const Student_attendance_records = "/Student_attendance_records.webp";
const Test_Records = "/Test_Records.webp";
const Teacher_Salery_Management = "/Teacher_Salery_Management.webp";
const Parents_access_test = "/Parents_access_test.webp";
const Online_fee_recipt = "/Online_fee_recipt.webp";

const Features: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const elements = containerRef.current?.querySelectorAll(".animate-item");

    if (elements) {
      elements.forEach((element: Element, index: number) => {
        // Determine animation direction (left for even, right for odd)
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
              end: "bottom 30%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    // Cleanup ScrollTriggers
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Flex
      id="Feature"
      ref={containerRef}
      gap={"xl"}
      direction={"column"}
      p={"2.5% 5%"}
      style={{
        overflow: "hidden",
      }}
    >
      {/* Desktop Header Layout */}
      <Group justify="space-around" visibleFrom="md">
        <Flex
          direction={"column"}
          w={"45%"}
          style={{
            gap: "1.25rem",
          }}
        >
          <Box
            className="animate-item features-title"
            style={{
              width: "fit-content",
              backgroundColor: "#F2E6E6",
              padding: "5px 1rem",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            OUR FEATURES
          </Box>
          <Box
            className="animate-item features-title"
            style={{
              fontSize: "2.75rem",
              fontWeight: 700,
            }}
          >
            All your Business Solutions in One Place
          </Box>
        </Flex>
        <Box
          className="animate-item features-description"
          w={"35%"}
          mt={"1.25rem"}
        >
          Unlock the power of integrated solutions simplify, streamline and
          succeed with our comprehensive all-in-one platform.
        </Box>
      </Group>

      {/* Mobile/Tablet Header Layout */}
      <Flex
        direction={"column"}
        gap={"lg"}
        hiddenFrom="md"
        style={{
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <Box
          className="animate-item features-title"
          style={{
            width: "fit-content",
            backgroundColor: "#F2E6E6",
            padding: "5px 1rem",
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          OUR FEATURES
        </Box>
        <Box
          className="animate-item features-title"
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            lineHeight: 1.2,
            maxWidth: "90%",
          }}
        >
          All your Business Solutions in One Place
        </Box>
        <Text
          className="animate-item features-description"
          style={{
            fontSize: "1rem",
            lineHeight: 1.5,
            maxWidth: "85%",
          }}
        >
          Unlock the power of integrated solutions simplify, streamline and
          succeed with our comprehensive all-in-one platform.
        </Text>
      </Flex>

      {/* Features Grid - Desktop */}
      <Flex wrap={"wrap"} justify={"space-evenly"} gap={"md"} visibleFrom="md">
        <Flex
          className="animate-item feature-card"
          direction={"column"}
          w={"30%"}
          gap={"0.50rem"}
        >
          <Image
            src={School_Fees_Management}
            alt="Student Fees Management"
            w={250}
          />
          <h4
            style={{
              fontSize: "1.25rem",
            }}
          >
            Manage student fees records
          </h4>
          <Text
            style={{
              fontSize: "0.95rem",
            }}
          >
            Easily track and manage student fee payments with real-time updates.
            Automate billing, send reminders, and generate detailed reports —
            all in one place.
          </Text>
        </Flex>
        <Flex
          className="animate-item feature-card"
          direction={"column"}
          w={"30%"}
          gap={"0.50rem"}
        >
          <Image
            src={Student_attendance_records}
            alt="Student attendance records"
            w={250}
          />
          <h4
            style={{
              fontSize: "1.25rem",
            }}
          >
            Student attendance records
          </h4>
          <Text
            style={{
              fontSize: "0.95rem",
            }}
          >
            Track student attendance effortlessly with automated records and
            real-time insights. Mark, monitor, and manage daily attendance from
            one centralized dashboard.
          </Text>
        </Flex>
        <Flex
          className="animate-item feature-card"
          direction={"column"}
          w={"30%"}
          gap={"0.50rem"}
        >
          <Image src={Test_Records} alt="Test Records" w={250} />
          <h4
            style={{
              fontSize: "1.25rem",
            }}
          >
            Online test records
          </h4>
          <Text
            style={{
              fontSize: "0.95rem",
            }}
          >
            Maintain detailed records of all student tests, scores, and
            performance trends. Easily access test history and generate
            insightful academic reports.
          </Text>
        </Flex>
        <Flex
          className="animate-item feature-card"
          direction={"column"}
          w={"30%"}
          gap={"0.50rem"}
        >
          <Image
            src={Teacher_Salery_Management}
            alt="Teacher Salary Management"
            w={250}
          />
          <h4
            style={{
              fontSize: "1.25rem",
            }}
          >
            Teacher salary management
          </h4>
          <Text
            style={{
              fontSize: "0.95rem",
            }}
          >
            Manage teacher salaries with accuracy and ease. Automate payroll,
            track payments, deductions, and generate salary slips in just a few
            clicks.
          </Text>
        </Flex>
        <Flex
          className="animate-item feature-card"
          direction={"column"}
          w={"30%"}
          gap={"0.50rem"}
          mt={"lg"}
        >
          <Image src={Parents_access_test} alt="Parents Access Test" w={250} />
          <h4
            style={{
              fontSize: "1.25rem",
            }}
          >
            Progress visible to parents
          </h4>
          <Text
            style={{
              fontSize: "0.95rem",
            }}
          >
            Parents can stay connected with their child's academic journey from
            home. Track attendance, test scores, and class performance in
            real-time.
          </Text>
        </Flex>
        <Flex
          className="animate-item feature-card"
          direction={"column"}
          w={"30%"}
          gap={"0.50rem"}
        >
          <Image src={Online_fee_recipt} alt="Online Fee Receipt" w={250} />
          <h4
            style={{
              fontSize: "1.25rem",
            }}
          >
            Online fee receipt download
          </h4>
          <Text
            style={{
              fontSize: "0.95rem",
            }}
          >
            Students and parents can instantly download fee receipts online. No
            paperwork, no delays — all transactions are securely recorded and
            accessible.
          </Text>
        </Flex>
      </Flex>

      {/* Features Grid - Mobile/Tablet */}
      <Flex direction={"column"} gap={"xl"} hiddenFrom="md">
        <Flex
          className="animate-item feature-card"
          direction={"column"}
          gap={"md"}
          style={{
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Image
            src={School_Fees_Management}
            alt="Student Fees Management"
            style={{
              maxWidth: "250px",
              width: "100%",
              height: "auto",
            }}
          />
          <h4
            style={{
              fontSize: "1.25rem",
              margin: 0,
            }}
          >
            Manage student fees records
          </h4>
          <Text
            style={{
              fontSize: "0.95rem",
              maxWidth: "90%",
              lineHeight: 1.5,
            }}
          >
            Easily track and manage student fee payments with real-time updates.
            Automate billing, send reminders, and generate detailed reports —
            all in one place.
          </Text>
        </Flex>

        <Flex
          className="animate-item feature-card"
          direction={"column"}
          gap={"md"}
          style={{
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Image
            src={Student_attendance_records}
            alt="Student attendance records"
            style={{
              maxWidth: "250px",
              width: "100%",
              height: "auto",
            }}
          />
          <h4
            style={{
              fontSize: "1.25rem",
              margin: 0,
            }}
          >
            Student attendance records
          </h4>
          <Text
            style={{
              fontSize: "0.95rem",
              maxWidth: "90%",
              lineHeight: 1.5,
            }}
          >
            Track student attendance effortlessly with automated records and
            real-time insights. Mark, monitor, and manage daily attendance from
            one centralized dashboard.
          </Text>
        </Flex>

        <Flex
          className="animate-item feature-card"
          direction={"column"}
          gap={"md"}
          style={{
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Image
            src={Test_Records}
            alt="Test Records"
            style={{
              maxWidth: "250px",
              width: "100%",
              height: "auto",
            }}
          />
          <h4
            style={{
              fontSize: "1.25rem",
              margin: 0,
            }}
          >
            Online test records
          </h4>
          <Text
            style={{
              fontSize: "0.95rem",
              maxWidth: "90%",
              lineHeight: 1.5,
            }}
          >
            Maintain detailed records of all student tests, scores, and
            performance trends. Easily access test history and generate
            insightful academic reports.
          </Text>
        </Flex>

        <Flex
          className="animate-item feature-card"
          direction={"column"}
          gap={"md"}
          style={{
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Image
            src={Teacher_Salery_Management}
            alt="Teacher Salary Management"
            style={{
              maxWidth: "250px",
              width: "100%",
              height: "auto",
            }}
          />
          <h4
            style={{
              fontSize: "1.25rem",
              margin: 0,
            }}
          >
            Teacher salary management
          </h4>
          <Text
            style={{
              fontSize: "0.95rem",
              maxWidth: "90%",
              lineHeight: 1.5,
            }}
          >
            Manage teacher salaries with accuracy and ease. Automate payroll,
            track payments, deductions, and generate salary slips in just a few
            clicks.
          </Text>
        </Flex>

        <Flex
          className="animate-item feature-card"
          direction={"column"}
          gap={"md"}
          style={{
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Image
            src={Parents_access_test}
            alt="Parents Access Test"
            style={{
              maxWidth: "250px",
              width: "100%",
              height: "auto",
            }}
          />
          <h4
            style={{
              fontSize: "1.25rem",
              margin: 0,
            }}
          >
            Progress visible to parents
          </h4>
          <Text
            style={{
              fontSize: "0.95rem",
              maxWidth: "90%",
              lineHeight: 1.5,
            }}
          >
            Parents can stay connected with their child's academic journey from
            home. Track attendance, test scores, and class performance in
            real-time.
          </Text>
        </Flex>

        <Flex
          className="animate-item feature-card"
          direction={"column"}
          gap={"md"}
          style={{
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Image
            src={Online_fee_recipt}
            alt="Online Fee Receipt"
            style={{
              maxWidth: "250px",
              width: "100%",
              height: "auto",
            }}
          />
          <h4
            style={{
              fontSize: "1.25rem",
              margin: 0,
            }}
          >
            Online fee receipt download
          </h4>
          <Text
            style={{
              fontSize: "0.95rem",
              maxWidth: "90%",
              lineHeight: 1.5,
            }}
          >
            Students and parents can instantly download fee receipts online. No
            paperwork, no delays — all transactions are securely recorded and
            accessible.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Features;
