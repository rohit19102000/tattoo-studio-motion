"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Artist {
  initials: string;
  name: string;
  specialty: string;
  bio: string;
}

const ARTISTS: Artist[] = [
  {
    initials: "MV",
    name: "MARCUS VALE",
    specialty: "Japanese Traditional",
    bio: "Marcus translates ancient Irezumi iconography into powerful modern narratives, combining bold saturation with deep respect for classical flow.",
  },
  {
    initials: "EC",
    name: "ELENA CROSS",
    specialty: "Fine Line & Botanical",
    bio: "Elena approaches the skin with single-needle precision, crafting delicate, whisper-thin botanical illustrations that trace the natural contours of the body.",
  },
  {
    initials: "JO",
    name: "JAY OKONKWO",
    specialty: "Blackwork & Sacred Geometry",
    bio: "Jay specializes in hypnotic geometric structures and heavy blackwork, carving sacred symmetry and structural form out of negative space.",
  },
];

export default function ArtistsSection() {
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
      id="artists"
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
            The Artists
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
              marginBottom: "4rem",
            }}
          >
            Masters of the Mark
          </motion.h2>

          {/* Grid */}
          <motion.div
            variants={itemVariants}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {ARTISTS.map((artist, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1px solid rgba(200, 55, 45, 0.25)",
                  paddingTop: "1.5rem",
                  backgroundColor: "transparent",
                }}
              >
                {/* Full-bleed placeholder image area */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "3/4",
                    background: "linear-gradient(135deg, #111111 0%, #1a1a1a 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                    border: "1px solid var(--border-neutral)",
                  }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    style={{
                      width: "60%",
                      height: "60%",
                    }}
                  >
                    <text
                      x="50%"
                      y="54%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fill="var(--accent)"
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "32px",
                        fontWeight: 300,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {artist.initials}
                    </text>
                  </svg>
                </div>

                {/* Name */}
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 400,
                    fontSize: "1.5rem",
                    color: "var(--text-primary)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {artist.name}
                </h3>

                {/* Specialty Tag */}
                <span
                  className="label-style"
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.28em",
                    marginBottom: "1rem",
                    display: "block",
                  }}
                >
                  {artist.specialty}
                </span>

                {/* Bio */}
                <p
                  style={{
                    fontFamily: "var(--font-grotesk)",
                    fontWeight: 300,
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    color: "var(--text-body)",
                  }}
                >
                  {artist.bio}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
