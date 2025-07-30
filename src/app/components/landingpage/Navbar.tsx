"use client";

import { Anchor, Box, Button, Group, ActionIcon } from "@mantine/core";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const getStartedButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { label: "Features", href: "#Feature", isExternal: false },
    { label: "About Us", href: "#About", isExternal: false },
    { label: "Pricing", href: "/pricing", isExternal: true },
    { label: "Contact Us", href: "#Contact", isExternal: false },
  ];

  // Disable/enable scroll when menu is open/closed
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(document.body, {
        background: "rgba(0, 0, 0, 0.2)",
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      document.body.style.overflow = "";
      gsap.to(document.body, {
        background: "transparent",
        duration: 0.3,
        ease: "power2.out",
      });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Hamburger menu animations
  useEffect(() => {
    if (typeof window === "undefined" || !burgerRef.current) return;

    const toggleBurger = (open: boolean) => {
      if (open) {
        gsap.to(burgerRef.current, {
          backgroundColor: "#46affaff",
          scale: 1.1,
          rotate: 90,
          boxShadow: "0 6px 12px rgba(70, 175, 250, 0.5)",
          duration: 0.4,
          ease: "elastic.out(1, 0.75)",
        });
        gsap.to(burgerRef.current, {
          x: "+=5",
          yoyo: true,
          repeat: 2,
          duration: 0.1,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(burgerRef.current, {
          backgroundColor: "#ffffff",
          scale: 1,
          rotate: 0,
          boxShadow: "0 4px 8px rgba(70, 175, 250, 0.3)",
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(burgerRef.current, {
          x: "+=5",
          yoyo: true,
          repeat: 2,
          duration: 0.1,
          ease: "power2.inOut",
        });
      }
    };

    toggleBurger(menuOpen);

    const handleBurgerHover = () => {
      if (!menuOpen) {
        gsap.to(burgerRef.current, {
          scale: 1.15,
          boxShadow: "0 8px 16px rgba(70, 175, 250, 0.6)",
          backgroundColor: "#46affaff",
          duration: 0.3,
          ease: "power2.out",
          repeat: 1,
          yoyo: true,
        });
      }
    };

    const handleBurgerLeave = () => {
      if (!menuOpen) {
        gsap.to(burgerRef.current, {
          scale: 1,
          boxShadow: "0 4px 8px rgba(70, 175, 250, 0.3)",
          backgroundColor: "#ffffff",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    burgerRef.current.addEventListener("mouseenter", handleBurgerHover);
    burgerRef.current.addEventListener("mouseleave", handleBurgerLeave);

    return () => {
      burgerRef.current?.removeEventListener("mouseenter", handleBurgerHover);
      burgerRef.current?.removeEventListener("mouseleave", handleBurgerLeave);
    };
  }, [menuOpen]);

  // Text, button, and mobile menu animations
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Animate text for nav links and logo
    const animateText = (selector: string) => {
      document.querySelectorAll(selector).forEach((element) => {
        const el = element as HTMLElement;
        const text = el.dataset.original || el.textContent || "";
        el.dataset.original = text;
        el.innerHTML = "";

        text.split("").forEach((char, i) => {
          const wrapper = document.createElement("span");
          wrapper.className = "letter-wrapper";
          wrapper.style.display = "inline-block";
          wrapper.style.overflow = "hidden";

          const top = document.createElement("span");
          top.textContent = char;
          top.style.display = "inline-block";
          top.style.transform = "translateY(0)";
          top.style.transition = "transform 0.35s ease-out";

          const bottom = document.createElement("span");
          bottom.textContent = char;
          bottom.style.position = "absolute";
          bottom.style.top = "100%";
          bottom.style.left = "0";
          bottom.style.transform = "translateY(0)";
          bottom.style.transition = "transform 0.35s ease-out";

          wrapper.style.position = "relative";
          wrapper.appendChild(top);
          wrapper.appendChild(bottom);
          el.appendChild(wrapper);
        });

        const parent = el.closest(".hover-animate") as HTMLElement;
        if (parent) {
          const handleMouseEnter = () => {
            el.querySelectorAll(".letter-wrapper").forEach((span, i) => {
              const [top, bottom] = span.children as any;
              top.style.transform = "translateY(-100%)";
              bottom.style.transform = "translateY(-100%)";
              top.style.transitionDelay = `${i * 0.045}s`;
              bottom.style.transitionDelay = `${i * 0.045}s`;
            });
          };

          const handleMouseLeave = () => {
            el.querySelectorAll(".letter-wrapper").forEach((span, i) => {
              const [top, bottom] = span.children as any;
              top.style.transform = "translateY(0%)";
              bottom.style.transform = "translateY(0%)";
              top.style.transitionDelay = `${i * 0.045}s`;
              bottom.style.transitionDelay = `${i * 0.045}s`;
            });
          };

          parent.addEventListener("mouseenter", handleMouseEnter);
          parent.addEventListener("mouseleave", handleMouseLeave);

          return () => {
            parent.removeEventListener("mouseenter", handleMouseEnter);
            parent.removeEventListener("mouseleave", handleMouseLeave);
          };
        }
      });
    };

    animateText(".nav-link-text");
    animateText(".navbar-logo-text");

    // Button animations
    const buttons = gsap.utils.toArray<HTMLElement>(".navbar-button");
    buttons.forEach((button) => {
      const enter = () => {
        gsap.to(button, {
          y: -4,
          scale: 1.05,
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
          backgroundColor: "#1e90ff",
          duration: 0.3,
          ease: "power2.out",
        });
      };
      const leave = () => {
        gsap.to(button, {
          y: 0,
          scale: 1,
          boxShadow: "none",
          backgroundColor: "transparent",
          duration: 0.3,
          ease: "power2.out",
        });
      };
      button.addEventListener("mouseenter", enter);
      button.addEventListener("mouseleave", leave);

      return () => {
        button.removeEventListener("mouseenter", enter);
        button.removeEventListener("mouseleave", leave);
      };
    });

    // Mobile menu animations
    if (mobileMenuRef.current && menuOpen) {
      gsap.from(mobileMenuRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.from(mobileMenuRef.current.querySelectorAll(".mobile-nav-link"), {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "elastic.out(1, 0.75)",
      });
      if (getStartedButtonRef.current) {
        gsap.from(getStartedButtonRef.current, {
          y: 20,
          opacity: 0,
          scale: 0.8,
          duration: 0.8,
          delay: 0.4,
          ease: "bounce.out",
        });
      }
    }
  }, [menuOpen]);

  const handleNavClick = (
    href: string,
    isExternal: boolean,
    e: React.MouseEvent
  ) => {
    if (isExternal) {
      router.push(href);
    } else {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMobileNavClick = (
    href: string,
    isExternal: boolean,
    e: React.MouseEvent
  ) => {
    setMenuOpen(false);
    if (isExternal) {
      router.push(href);
    } else {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      style={{
        position: "sticky",
        top: 5,
        zIndex: 100,
        background: "white",
        overflow: "hidden",
      }}
    >
      {/* Top bar */}
      <Group
        m="1rem"
        justify="space-between"
        align="center"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}
      >
        {/* Logo */}
        <Box className="hover-animate navbar-logo">
          <Link
            href="#"
            className="navbar-logo-text"
            style={{
              textDecoration: "none",
              color: "black",
              fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
              fontWeight: 700,
              display: "inline-block",
            }}
          >
            Siksha Pay
          </Link>
        </Box>

        {/* Desktop Nav Links and Buttons */}
        <Group
        w={"60%"}
          gap="xl"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Box className="desktop-nav" style={{ display: "flex", gap: "2rem" }}>
            {navLinks.map(({ label, href, isExternal }) => (
              <Anchor
                key={href}
                href={href}
                className="hover-animate nav-link"
                onClick={(e) => handleNavClick(href, isExternal, e)}
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                  position: "relative",
                  padding: "0.5rem",
                }}
              >
                <span className="nav-link-text">{label}</span>
                <Box
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "0%",
                    height: "2px",
                    background: "#46affaff",
                    transition: "width 0.3s ease",
                  }}
                  className="underline"
                />
              </Anchor>
            ))}
          </Box>

          {/* Get Started Button (Desktop) */}
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

          {/* Hamburger Icon */}
          <ActionIcon
            ref={burgerRef}
            className="hamburger-icon"
            onClick={() => setMenuOpen((prev) => !prev)}
            variant="filled"
            color="#46affaff"
            size="lg"
            radius="xl"
            style={{
              display: "none",
              boxShadow: "0 4px 8px rgba(70, 175, 250, 0.3)",
              border: "2px solid #284ffcff",
              backgroundColor: "#ffffff",
              marginRight: "1rem",
            }}
          >
            {menuOpen ? (
              <IconX size={24} color="#284ffcff" />
            ) : (
              <IconMenu2 size={24} color="#284ffcff" />
            )}
          </ActionIcon>
        </Group>
      </Group>

      {/* Mobile Fullscreen Menu */}
      {menuOpen && (
        <Box
          ref={mobileMenuRef}
          className="mobile-menu"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "linear-gradient(180deg, #ffffff 0%, #e6f0ff 100%)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
            padding: "1rem",
          }}
        >
          {/* Cross Icon */}
          <Box
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              fontSize: "2rem",
              cursor: "pointer",
              color: "#333",
              zIndex: 10000,
            }}
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, {
                scale: 1.2,
                rotate: 90,
                duration: 0.3,
                ease: "elastic.out(1, 0.75)",
              })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, {
                scale: 1,
                rotate: 0,
                duration: 0.3,
                ease: "power2.out",
              })
            }
          >
            ×
          </Box>

          {navLinks.map(({ label, href, isExternal }) => (
            <Anchor
              key={href}
              href={href}
              className="mobile-nav-link"
              onClick={(e) => handleMobileNavClick(href, isExternal, e)}
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#1e1e1e",
                textDecoration: "none",
                padding: "0.5rem",
                borderRadius: "5px",
                zIndex: 9999,
              }}
              onMouseEnter={(e) =>
                gsap.to(e.currentTarget, {
                  color: "#46affaff",
                  scale: 1.05,
                  background: "rgba(70, 175, 250, 0.2)",
                  duration: 0.3,
                  ease: "power2.out",
                })
              }
              onMouseLeave={(e) =>
                gsap.to(e.currentTarget, {
                  color: "#1e1e1e",
                  scale: 1,
                  background: "transparent",
                  duration: 0.3,
                  ease: "power2.out",
                })
              }
            >
              {label}
            </Anchor>
          ))}

          {/* Get Started Button in Mobile Menu */}
          <Button
            ref={getStartedButtonRef}
            className="navbar-button get-started-mobile"
            onClick={() => {
              setMenuOpen(false);
              router.push("/auth");
            }}
            variant="gradient"
            gradient={{ from: "#46affaff", to: "#284ffcff", deg: 60 }}
            radius="sm"
            size="md"
            style={{
              padding: "0.6rem 2rem",
              fontSize: "1.2rem",
              display: "block",
              transform: "scale(1)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              zIndex: 9999,
              marginTop: "1rem",
            }}
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, {
                scale: 1.1,
                boxShadow: "0 10px 24px rgba(0,0,0,0.3)",
                background: "linear-gradient(60deg, #46affaff, #1e90ff)",
                duration: 0.3,
                ease: "power2.out",
              })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, {
                scale: 1,
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                background: "linear-gradient(60deg, #46affaff, #284ffcff)",
                duration: 0.3,
                ease: "power2.out",
              })
            }
          >
            Get Started
          </Button>
        </Box>
      )}

      {/* Consolidated CSS */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .navbar-button.get-started {
            display: none !important;
          }
          .hamburger-icon {
            display: flex !important;
          }
          .navbar-button.get-started-mobile {
            display: block !important;
          }
        }
        .nav-link:hover .underline {
          width: 100% !important;
        }
      `}</style>
    </Box>
  );
};

export default Navbar;
