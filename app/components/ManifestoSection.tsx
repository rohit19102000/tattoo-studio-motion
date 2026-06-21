"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import PhilosophyScrub from "./PhilosophyScrub";

const PHILOSOPHY_FRAME_COUNT = 361; // Will be updated after frame extraction

export default function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-20% 0px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0, 0, 1],
      },
    },
  };

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        height: "600vh",
        backgroundColor: "var(--bg-deep)",
      }}
      id="manifesto"
    >
      {/* Sticky viewport */}
      <div
        className="manifesto-sticky"
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          backgroundColor: "var(--bg-deep)",
        }}
      >
        {/* LEFT COLUMN — Text Content */}
        <div
          ref={textRef}
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(40px, 6vw, 80px)",
            overflow: "hidden",
          }}
        >
          {/* Noise Grain Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "var(--noise-grain)",
              opacity: 0.03,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          <div style={{ position: "relative", zIndex: 2, maxWidth: "560px" }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {/* Label */}
              <motion.span
                variants={itemVariants}
                className="label-style"
                style={{ display: "block", marginBottom: "2rem" }}
              >
                Our Philosophy
              </motion.span>

              {/* Pull Quote */}
              <motion.h2
                variants={itemVariants}
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontSize: "clamp(1.8rem, 3.5vw, 3.2rem)",
                  color: "var(--text-primary)",
                  lineHeight: 1.25,
                  marginBottom: "2.5rem",
                }}
              >
                &ldquo;We don&rsquo;t decorate skin. We mark moments that refuse
                to be forgotten.&rdquo;
              </motion.h2>

              {/* Thin Horizontal Red Rule */}
              <motion.div
                variants={itemVariants}
                style={{
                  width: "60px",
                  height: "1px",
                  backgroundColor: "var(--accent)",
                  marginBottom: "2.5rem",
                }}
              />

              {/* Body Text — stacked on single column in the left panel */}
              <motion.div
                variants={itemVariants}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.8rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-grotesk)",
                    fontWeight: 300,
                    fontSize: "0.92rem",
                    lineHeight: 1.85,
                    color: "var(--text-body)",
                  }}
                >
                  At Inkwell, we believe a tattoo is more than an aesthetic
                  arrangement; it is an externalization of the internal
                  landscape. The relationship between artist and client is
                  sacred, built on absolute trust and mutual vision. We approach
                  the craft not as a service, but as an ancient ritual of
                  transformation. Each needle stroke is deliberate, etching
                  permanence onto a canvas that is constantly in motion.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-grotesk)",
                    fontWeight: 300,
                    fontSize: "0.92rem",
                    lineHeight: 1.85,
                    color: "var(--text-body)",
                  }}
                >
                  To honor this intimacy, we operate strictly by appointment,
                  ensuring each session receives undivided dedication and space.
                  We do not participate in the rushed nature of walk-in culture;
                  every mark we place is designed to settle deeply and mature
                  beautifully with the body over a lifetime. We create markings
                  that do not merely sit on the skin, but become an inseparable
                  part of your history.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT COLUMN — Canvas Scrub */}
        <div
          className="manifesto-canvas-col"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderLeft: "1px solid var(--border-subtle)",
            backgroundColor: "#0A0A0A",
          }}
        >
          <PhilosophyScrub
            frameCount={PHILOSOPHY_FRAME_COUNT}
            framePath="/philosophy_frames/frame_"
            containerRef={containerRef}
          />

          {/* Subtle bottom gradient */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "20%",
              background:
                "linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Responsive overrides */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 767px) {
          .manifesto-sticky {
            grid-template-columns: 1fr !important;
            grid-template-rows: 55vh 45vh !important;
          }
          .manifesto-canvas-col {
            border-left: none !important;
            border-top: 1px solid var(--border-subtle) !important;
          }
        }
      `,
        }}
      />
    </section>
  );
}
