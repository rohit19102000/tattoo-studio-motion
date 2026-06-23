"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const FRAME_COUNT = 361;

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentIdxRef = useRef<number>(-1);
  const [loadedFirst, setLoadedFirst] = useState(false);

  useEffect(() => {
    const loadedImages = new Map<number, HTMLImageElement>();
    let isCleanedUp = false;

    // 1. Helper to build URL
    function getImageUrl(index: number) {
      const frameNum = String(index + 1).padStart(4, "0");
      return `/frames/frame_${frameNum}.jpg`;
    }

    // 2. Helper to request an image
    function loadImage(index: number, onLoad?: (img: HTMLImageElement) => void) {
      if (index < 0 || index >= FRAME_COUNT || isCleanedUp) return;

      const cached = loadedImages.get(index);
      if (cached) {
        if (onLoad) onLoad(cached);
        return;
      }

      const img = new Image();
      img.src = getImageUrl(index);
      img.onload = () => {
        if (isCleanedUp) return;
        loadedImages.set(index, img);

        // Limit cache size to 60 images to prevent browser crash/OOM
        if (loadedImages.size > 60) {
          let furthestIdx = -1;
          let maxDist = -1;
          for (const key of loadedImages.keys()) {
            // Keep first frame always
            if (key === 0) continue;
            const dist = Math.abs(key - currentIdxRef.current);
            if (dist > maxDist) {
              maxDist = dist;
              furthestIdx = key;
            }
          }
          if (furthestIdx !== -1) {
            loadedImages.delete(furthestIdx);
          }
        }

        if (onLoad) onLoad(img);
      };
    }

    // Load first frame immediately
    loadImage(0, (img) => {
      setLoadedFirst(true);
      draw(0);
    });

    // 3. Cover-fit draw function
    function draw(index: number) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = loadedImages.get(index);
      if (!img || !img.complete) return;

      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;

      // Adjust resolution for high DPI displays
      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        ctx.scale(dpr, dpr);
      }

      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;

      if (iw && ih) {
        const scale = Math.max(cw / iw, ch / ih);
        const w = iw * scale;
        const h = ih * scale;
        const x = (cw - w) / 2;
        const y = (ch - h) / 2;

        ctx.fillStyle = "#0A0A0A";
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, x, y, w, h);
        currentIdxRef.current = index;
      }
    }

    // 4. requestAnimationFrame loop for scroll syncing
    let rafId: number;

    const tick = () => {
      const container = containerRef.current;
      if (!container) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const rect = container.getBoundingClientRect();
      const offsetTop = -rect.top;
      const totalScrollable = container.offsetHeight - window.innerHeight;

      // Calculate progress between 0 and 1
      const progress = Math.max(0, Math.min(1, offsetTop / totalScrollable));
      const targetIdx = Math.round(progress * (FRAME_COUNT - 1));

      if (targetIdx !== currentIdxRef.current) {
        loadImage(targetIdx, (img) => {
          if (isCleanedUp) return;
          draw(targetIdx);
        });
        currentIdxRef.current = targetIdx;

        // Preload next 5 and previous 5 frames
        for (let offset = 1; offset <= 5; offset++) {
          loadImage(targetIdx + offset);
          loadImage(targetIdx - offset);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // 5. Resize handler
    const handleResize = () => {
      if (currentIdxRef.current !== -1) {
        draw(currentIdxRef.current);
      }
    };
    window.addEventListener("resize", handleResize);

    // 6. Cleanup
    return () => {
      isCleanedUp = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      loadedImages.clear();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0], // easeOut style
      },
    },
  };

  return (
    <div
      ref={containerRef}
      style={{ height: "300vh", position: "relative" }}
      id="hero-container"
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "#0A0A0A",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
          }}
        />

        {/* Gradient Overlay & Content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            pointerEvents: "none",
            background:
              "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.40) 50%, transparent 100%)",
            padding: "min(80px, 8vw)",
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={loadedFirst ? "visible" : "hidden"}
            style={{
              maxWidth: "800px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {/* Red Rule */}
            <motion.div
              variants={itemVariants}
              style={{
                width: "40px",
                height: "1px",
                backgroundColor: "var(--accent)",
                marginBottom: "1.2rem",
              }}
            />

            {/* Label */}
            <motion.span
              variants={itemVariants}
              className="label-style"
              style={{ marginBottom: "0.8rem" }}
            >
              Since 2009 · East London
            </motion.span>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              style={{
                fontFamily: "var(--font-cormorant)",
                fontWeight: 300,
                fontSize: "clamp(3rem, 8vw, 7rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                marginBottom: "1.5rem",
              }}
            >
              INKWELL
              <br />
              STUDIO
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              style={{
                fontFamily: "var(--font-grotesk)",
                fontWeight: 300,
                color: "var(--text-body)",
                fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)",
                lineHeight: 1.6,
                maxWidth: "420px",
                marginBottom: "2rem",
              }}
            >
              An uncompromising space dedicated to the ritual of permanent line work and modern geometric botany.
            </motion.p>

            {/* CTA Button */}
            <motion.a
              variants={itemVariants}
              href="#closing-cta"
              style={{
                display: "inline-block",
                backgroundColor: "var(--accent)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-grotesk)",
                fontWeight: 500,
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "1rem 2.8rem",
                textDecoration: "none",
                pointerEvents: "auto",
                border: "none",
                borderRadius: 0,
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent)";
              }}
            >
              Book a Consultation
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
