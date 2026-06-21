"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Step {
  num: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    title: "Consultation",
    description: "A focused dialogue where concept meets intent. We discuss the placement, symbolic weight, and scale of your marking before any needle is prepared.",
  },
  {
    num: "02",
    title: "Design",
    description: "Your design is drafted by hand, tuning geometry and botanical curves to the specific muscle flow and topography of your body.",
  },
  {
    num: "03",
    title: "The Session",
    description: "The transfer of ink to skin in a sterile, quiet environment. A meditative, patient process where time fades and the marking is realized.",
  },
  {
    num: "04",
    title: "Aftercare Ritual",
    description: "The journey does not end when you leave. We supply organic oils and precise recovery steps to bind the ink permanently into your living tissue.",
  },
];

export default function ProcessSection() {
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
        padding: "120px min(40px, 6vw)",
        borderTop: "1px solid var(--border-neutral)",
      }}
      id="process"
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Label */}
          <motion.span
            variants={itemVariants}
            className="label-style"
            style={{ display: "block", marginBottom: "1rem" }}
          >
            The Ritual
          </motion.span>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
              color: "var(--text-primary)",
              lineHeight: 1.1,
              marginBottom: "5rem",
            }}
          >
            From consultation to healed skin.
          </motion.h2>

          {/* Responsive timeline */}
          <motion.div
            variants={itemVariants}
            className="timeline-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "2.5rem",
            }}
          >
            {STEPS.map((step, idx) => (
              <div
                key={idx}
                className="timeline-step"
                style={{
                  position: "relative",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                {/* Large Numeral */}
                <span
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 300,
                    fontSize: "4.5rem",
                    color: "var(--accent)",
                    opacity: 0.6,
                    lineHeight: 1,
                    marginBottom: "1rem",
                    zIndex: 2,
                  }}
                >
                  {step.num}
                </span>

                {/* Step Name */}
                <h3
                  style={{
                    fontFamily: "var(--font-grotesk)",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--text-primary)",
                    marginBottom: "0.8rem",
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-grotesk)",
                    fontWeight: 300,
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    color: "var(--text-body)",
                    maxWidth: "220px",
                  }}
                >
                  {step.description}
                </p>

                {/* Connector line (desktop only) */}
                {idx < 3 && (
                  <div
                    className="timeline-connector"
                    style={{
                      position: "absolute",
                      top: "2.25rem",
                      left: "5rem",
                      width: "calc(100% - 3.5rem)",
                      height: "0px",
                      borderTop: "1px dashed rgba(200, 55, 45, 0.3)",
                      zIndex: 1,
                    }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          .timeline-container {
            flex-direction: column !important;
            gap: 3.5rem !important;
          }
          .timeline-step {
            width: 100%;
          }
          .timeline-connector {
            display: none !important;
          }
        }
        @media (min-width: 768px) {
          .timeline-container {
            flex-direction: row !important;
            overflow-x: auto;
            padding-bottom: 1.5rem;
          }
          /* Custom scrollbar for horizontal timeline */
          .timeline-container::-webkit-scrollbar {
            height: 4px;
          }
          .timeline-container::-webkit-scrollbar-track {
            background: transparent;
          }
          .timeline-container::-webkit-scrollbar-thumb {
            background: rgba(200, 55, 45, 0.2);
          }
        }
      `}} />
    </section>
  );
}
