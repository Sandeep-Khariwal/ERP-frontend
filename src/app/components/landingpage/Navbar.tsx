"use client";

import { Anchor, Box, Button, Group } from "@mantine/core";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const animateLetters = (selector: string) => {
      document.querySelectorAll(selector).forEach((element) => {
        const el = element as HTMLElement;
        const originalText = el.textContent || "";
        el.innerHTML = "";

        for (const char of originalText) {
          const wrapper = document.createElement("span");
          wrapper.className = "letter-wrapper";
          wrapper.style.display = "inline-block";
          wrapper.style.position = "relative";
          wrapper.style.overflow = "hidden";

          const top = document.createElement("span");
          top.textContent = char;
          top.style.display = "inline-block";
          top.style.transform = "translateY(0)";
          top.style.transition = "transform 0.35s ease-out";

          const bottom = document.createElement("span");
          bottom.textContent = char;
          bottom.style.display = "inline-block";
          bottom.style.position = "absolute";
          bottom.style.top = "100%";
          bottom.style.left = "0";
          bottom.style.transform = "translateY(0)";
          bottom.style.transition = "transform 0.35s ease-out";

          wrapper.appendChild(top);
          wrapper.appendChild(bottom);
          el.appendChild(wrapper);
        }

        const parent = el.closest(".hover-animate") as HTMLElement;
        if (parent) {
          parent.addEventListener("mouseenter", () => {
            el.querySelectorAll(".letter-wrapper").forEach((span, i) => {
              const [top, bottom] = span.children as any;
              top.style.transform = "translateY(-100%)";
              bottom.style.transform = "translateY(-100%)";
              top.style.transitionDelay = `${i * 0.045}s`;
              bottom.style.transitionDelay = `${i * 0.045}s`;
            });
          });

          parent.addEventListener("mouseleave", () => {
            el.querySelectorAll(".letter-wrapper").forEach((span, i) => {
              const [top, bottom] = span.children as any;
              top.style.transform = "translateY(0%)";
              bottom.style.transform = "translateY(0%)";
              top.style.transitionDelay = `${i * 0.045}s`;
              bottom.style.transitionDelay = `${i * 0.045}s`;
            });
          });
        }
      });
    };

    animateLetters(".nav-link-text");
    animateLetters(".navbar-logo-text");

    // Button hover animation
    gsap.utils.toArray<HTMLElement>(".navbar-button").forEach((button) => {
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
          backgroundColor: "transparent", // Reset to gradient background
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    // Cleanup event listeners
    return () => {
      gsap.utils.toArray<HTMLElement>(".navbar-button").forEach((button) => {
        button.removeEventListener("mouseenter", () => {});
        button.removeEventListener("mouseleave", () => {});
      });
      document.querySelectorAll(".hover-animate").forEach((parent) => {
        parent.removeEventListener("mouseenter", () => {});
        parent.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "About Us", href: "#aboutus" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact Us", href: "#contactus" },
  ];

  return (
    <Box style={{ position: "relative", zIndex: 100 }}>
      <Group m="1.75rem" justify="space-between" align="center">
        {/* Logo */}
        <Box className="hover-animate navbar-logo">
          <Link
            href="#"
            className="navbar-logo-text"
            style={{
              textDecoration: "none",
              color: "black",
              fontSize: "1.5rem",
              fontWeight: 700,
              display: "inline-block",
            }}
          >
            Siksha Pay
          </Link>
        </Box>

        {/* Nav Links */}
        <Group className="nav-links" gap="xl">
          {navLinks.map(({ label, href }) => (
            <Anchor
              key={href}
              href={href}
              className="hover-animate nav-link"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, "", href);
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "1rem",
                position: "relative",
                display: "inline-block",
              }}
            >
              <span className="nav-link-text">{label}</span>
            </Anchor>
          ))}
        </Group>

        {/* Get Started Button */}
        <Button
          onClick={() => router.push("/auth")}
          className="navbar-button get-started"
          variant="gradient"
          gradient={{ from: "#46affaff", to: "#284ffcff", deg: 60 }}
          radius="sm"
          size="md"
          style={{
            transition: "all 0.4s ease",
            border: "2px solid transparent",
            backgroundClip: "padding-box",
            borderRadius: "5px",
          }}
        >
          Get Started
        </Button>
      </Group>
    </Box>
  );
};

export default Navbar;
