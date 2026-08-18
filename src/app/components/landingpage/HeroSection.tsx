"use client";

import { Box, Text } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;
const FRAME_FOLDER = "/frames/ezgif-50dbb0767801b18a-jpg";

// Matches: ezgif-frame-001.jpg, ezgif-frame-002.jpg ... ezgif-frame-240.jpg
const getFramePath = (index: number) => {
  const padded = String(index).padStart(3, "0");
  return `${FRAME_FOLDER}/ezgif-frame-${padded}.jpg`;
};

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameStateRef = useRef({ frame: 0 });

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        console.error("Failed to load frame:", img.src);
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, []);

  // Draw a given frame index onto canvas (cover-fit)
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasAspect = rect.width / rect.height;
    const imgAspect = img.width / img.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      drawHeight = rect.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (rect.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = rect.width;
      drawHeight = drawWidth / imgAspect;
      offsetX = 0;
      offsetY = (rect.height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Scroll-driven scrub animation
  useEffect(() => {
    if (!imagesLoaded || !canvasWrapRef.current) return;

    drawFrame(0);

    const st = gsap.to(frameStateRef.current, {
      frame: TOTAL_FRAMES - 1,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=100%", // reduced — was causing extra empty scroll after animation finished
        scrub: 0.5,
        pin: canvasWrapRef.current,
        pinType: "transform", // keeps it within parent layout, prevents overlapping fixed sidebar
        pinSpacing: true,
        anticipatePin: 1,
      },
      onUpdate: () => {
        const idx = Math.round(frameStateRef.current.frame);
        drawFrame(idx);
      },
    });

    const handleResize = () => drawFrame(Math.round(frameStateRef.current.frame));
    window.addEventListener("resize", handleResize);

    return () => {
      st.scrollTrigger?.kill();
      st.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [imagesLoaded]);

  return (
    <Box ref={containerRef} id="About" style={{ position: "relative" }}>
      {/* Pinned canvas frame animation */}
      <Box
        ref={canvasWrapRef}
        style={{
          height: "100vh",
          width: "100%",
          maxWidth: "100%",
          position: "relative",
          overflow: "hidden",
          background: "#f8f9fb",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />

        {!imagesLoaded && (
          <Box
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f8f9fb",
              zIndex: 3,
            }}
          >
            <Text c="#1e40af">Loading...</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HeroSection;