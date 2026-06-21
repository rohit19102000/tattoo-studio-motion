"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function ClosingCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });

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
      ref={ref}
      style={{
        backgroundColor: "var(--bg-deep)",
        backgroundImage: "radial-gradient(ellipse at center, rgba(200, 55, 45, 0.12) 0%, transparent 68%)",
        padding: "160px min(40px, 6vw)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderTop: "1px solid var(--border-neutral)",
      }}
      id="closing-cta"
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Label */}
          <motion.span
            variants={itemVariants}
            className="label-style"
            style={{ display: "block", marginBottom: "1.5rem" }}
          >
            Begin Your Story
          </motion.span>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              color: "var(--text-primary)",
              lineHeight: 0.9,
              marginBottom: "2.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>Permanent work.</span>
            <span
              style={{
                fontStyle: "italic",
                color: "var(--text-body)",
                marginTop: "0.2rem",
              }}
            >
              Impermanent appointments.
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            style={{
              fontFamily: "var(--font-grotesk)",
              fontWeight: 300,
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "var(--text-body)",
              maxWidth: "480px",
              marginBottom: "3rem",
            }}
          >
            Our booking cycles open quarterly for custom projects. Walk-ins are accommodated strictly on Saturdays, subject to artist availability. High-demand projects carry a 4-to-6 week lead time.
          </motion.p>

          {/* Buttons Side by Side */}
          <motion.div
            variants={itemVariants}
            className="cta-buttons-container"
            style={{
              display: "flex",
              gap: "1.5rem",
              marginBottom: "4rem",
            }}
          >
            {/* Primary Button */}
            <motion.a
              href="mailto:bookings@inkwell.studio?subject=Tattoo%20Consultation%20Request"
              whileHover={{ scale: 1.02 }}
              style={{
                display: "inline-block",
                backgroundColor: "var(--accent)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-grotesk)",
                fontWeight: 500,
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "1.2rem 2.8rem",
                textDecoration: "none",
                borderRadius: 0,
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent)";
              }}
            >
              Book Now
            </motion.a>

            {/* Secondary Button */}
            <motion.a
              href="#artists"
              whileHover={{ scale: 1.02 }}
              style={{
                display: "inline-block",
                backgroundColor: "transparent",
                color: "var(--text-body)",
                fontFamily: "var(--font-grotesk)",
                fontWeight: 500,
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "1.2rem 2.8rem",
                textDecoration: "none",
                borderRadius: 0,
                border: "1px solid rgba(200, 55, 45, 0.6)",
                cursor: "pointer",
                transition: "background-color 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-body)";
              }}
            >
              View Portfolio
            </motion.a>
          </motion.div>

          {/* Studio Details */}
          <motion.div
            variants={itemVariants}
            style={{
              fontFamily: "var(--font-grotesk)",
              fontWeight: 300,
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              color: "var(--dim-text)",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            <span>120 Redchurch Street, Shoreditch, London</span>
            <span>+44 (0) 20 7739 5111 · instagram: @inkwell.london</span>
          </motion.div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 580px) {
          .cta-buttons-container {
            flex-direction: column !important;
            width: 100%;
            gap: 1rem !important;
          }
          .cta-buttons-container > a {
            width: 100%;
            text-align: center;
          }
        }
      `}} />
    </section>
  );
}
