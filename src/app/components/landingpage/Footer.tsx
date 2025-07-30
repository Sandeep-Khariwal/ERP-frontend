"use client";

import { Flex, Box, Title, Text, Group, Anchor, Divider } from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { useState } from "react";

const Footer = () => {
  const socialLinks = [
    {
      icon: IconBrandInstagram,
      href: "https://www.instagram.com/ksjunction.in/profilecard/?igsh=ZDR3aWxyZTE1dG0x",
      color: "#E1306C",
    },
    {
      icon: IconBrandYoutube,
      href: "https://www.youtube.com/@sandeep_khariwal8137",
      color: "#FF0000",
    },
    {
      icon: IconBrandLinkedin,
      href: "https://www.linkedin.com/in/sandeep-khariwal-95b65522b",
      color: "#0077B5",
    },
    {
      icon: IconBrandWhatsapp,
      href: "https://wa.me/+919416059799",
      color: "#25D366",
    },
  ];

  const footerLinks = [
    { label: "About", href: "#About" },
    { label: "Contact", href: "#Contact" },
    { label: "Features", href: "#Feature" },
    { label: "Payments", href: "/pricing" },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Flex
      direction="column"
      w="100%"
      bg="linear-gradient(135deg, #1e3a8a, #5668F8)"
      pt={{ base: "2rem", md: "3rem" }}
      pb={{ base: "1rem", md: "1.5rem" }}
      px={{ base: "4%", sm: "5%", lg: "8%" }}
      style={{ color: "white" }}
    >
      {/* Main Footer Content */}
      <Flex
        justify={{ base: "center", md: "space-between" }}
        wrap="wrap"
        gap={{ base: "2rem", md: "1rem" }}
        mb={{ base: "1.5rem", md: "2rem" }}
        direction={{ base: "column", md: "row" }}
        align={{ base: "center", md: "flex-start" }}
      >
        {/* Brand Section */}
        <Flex
          direction="column"
          w={{ base: "100%", md: "auto" }}
          maw={{ base: "100%", md: 300 }}
          ta={{ base: "center", md: "left" }}
          mb={{ base: "1rem", md: 0 }}
        >
          <Title
            order={3}
            c="white"
            style={{
              fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
            }}
          >
            SikshaPay
          </Title>
          <Text
            size="sm"
            c="gray.3"
            mt="sm"
            style={{
              fontSize: "clamp(0.8rem, 3vw, 0.9rem)",
              lineHeight: "1.5",
              maxWidth: "300px",
            }}
            m={{ base: "0.5rem auto 0", md: "0.5rem 0 0" }}
          >
            SikshaPay navigates the education tech of the present to empower the
            future.
          </Text>

          {/* Social Links */}
          <Flex
            mt={{ base: "1rem", md: "lg" }}
            gap="md"
            justify={{ base: "center", md: "flex-start" }}
            wrap="wrap"
            w="100%"
          >
            {socialLinks.map(({ icon: Icon, href, color }, index) => (
              <Anchor
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor:
                      hoveredIndex === index ? color : "#ffffff10",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                    boxShadow:
                      hoveredIndex === index
                        ? `0 0 15px ${color}`
                        : "0 4px 8px rgba(0,0,0,0.2)",
                    transform:
                      hoveredIndex === index ? "scale(1.15)" : "scale(1)",
                    margin: "4px",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Icon
                    color="#fff"
                    size={18}
                    style={{ transition: "transform 0.3s ease" }}
                  />
                </Box>
              </Anchor>
            ))}
          </Flex>
        </Flex>

        {/* Links Container */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={{ base: "2rem", sm: "3rem", md: "4rem" }}
          w={"60%"}
          justify={"space-around"}
        >
          {/* Quick Links */}
          <Flex direction="column" gap="sm" ta={{ base: "center", sm: "left" }}>
            <Title
              order={5}
              c="white"
              style={{
                fontSize: "clamp(1rem, 3.5vw, 1.1rem)",
                marginBottom: "0.5rem",
              }}
            >
              Quick Links
            </Title>
            {footerLinks.map((link, i) => (
              <Anchor
                key={i}
                href={link.href}
                style={{
                  color: "#D1D5DB",
                  textDecoration: "none",
                  fontWeight: 400,
                  transition: "color 0.3s ease",
                  fontSize: "clamp(0.8rem, 3vw, 0.9rem)",
                  lineHeight: "1.6",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#D1D5DB")}
              >
                {link.label}
              </Anchor>
            ))}
          </Flex>

          {/* Support Links */}
          <Flex direction="column" gap="sm" ta={{ base: "center", sm: "left" }}>
            <Title
              order={5}
              c="white"
              style={{
                fontSize: "clamp(1rem, 3.5vw, 1.1rem)",
                marginBottom: "0.5rem",
              }}
            >
              Support
            </Title>
            <Anchor
              href="#Contact"
              style={{
                color: "#D1D5DB",
                textDecoration: "none",
                transition: "color 0.3s ease",
                fontSize: "clamp(0.8rem, 3vw, 0.9rem)",
                lineHeight: "1.6",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#D1D5DB")}
            >
              Help Center
            </Anchor>
            <Anchor
              href="#FAQ"
              style={{
                color: "#D1D5DB",
                textDecoration: "none",
                transition: "color 0.3s ease",
                fontSize: "clamp(0.8rem, 3vw, 0.9rem)",
                lineHeight: "1.6",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#D1D5DB")}
            >
              FAQs
            </Anchor>
          </Flex>
        </Flex>
      </Flex>

      {/* Divider and Copyright */}
      <Divider color="white" opacity={0.2} />
      <Text
        ta="center"
        size="xs"
        c="gray.3"
        mt={{ base: "xs", md: "sm" }}
        style={{
          fontSize: "clamp(0.7rem, 2.5vw, 0.8rem)",
          lineHeight: "1.4",
        }}
      >
        © {new Date().getFullYear()} SikshaPay. All rights reserved.
      </Text>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </Flex>
  );
};

export default Footer;
