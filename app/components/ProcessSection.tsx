"use client";

import { useEffect, useRef, useState } from "react";

interface Step {
  num: string;
  accent: string;
  title: string;
  act: string;
  body: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    accent: "BEFORE THE NEEDLE",
    title: "Consultation",
    act: "The Dialogue",
    body: "A focused dialogue where concept meets intent. We discuss the placement, symbolic weight, and scale of your marking before any needle is prepared.",
    detail: "Consultations are collaborative and explore both placement and anatomical flow."
  },
  {
    num: "02",
    accent: "THE BLUEPRINT",
    title: "Design",
    act: "The Draft",
    body: "Your design is drafted by hand, tuning geometry and botanical curves to the specific muscle flow and topography of your body.",
    detail: "Custom stencils are refined until the geometry aligns perfectly with your form."
  },
  {
    num: "03",
    accent: "THE MARK IS MADE",
    title: "The Session",
    act: "The Transfer",
    body: "The transfer of ink to skin in a sterile, quiet environment. A meditative, patient process where time fades and the marking is realized.",
    detail: "We work at a deliberate, rhythm-driven pace, prioritizing precision and comfort."
  },
  {
    num: "04",
    accent: "IT BECOMES YOU",
    title: "Aftercare Ritual",
    act: "The Settling",
    body: "The journey does not end when you leave. We supply organic oils and precise recovery steps to bind the ink permanently into your living tissue.",
    detail: "Our dedicated support continues throughout the entirety of your skin's healing."
  }
];

const FRAME_COUNT = 121;

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 2D Array for preloaded images: [stepIdx][frameIdx]
  const imagesRef = useRef<HTMLImageElement[][]>([[], [], [], []]);
  const currentIdxRef = useRef<number>(-1);
  const currentStepRef = useRef<number>(-1);
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const wipeOverlayRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const bigNumberRef = useRef<HTMLDivElement>(null);
  const inkLineRef = useRef<HTMLDivElement>(null);
  const actRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyParagraphRef = useRef<HTMLParagraphElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const needleFillRef = useRef<SVGLineElement>(null);
  const needleGroupRef = useRef<SVGGElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);

  useEffect(() => {
    // 1. Preload all 4 steps of image frames
    const stepCount = 4;

    for (let s = 0; s < stepCount; s++) {
      const stepIdx = s + 1;
      const stepImages: HTMLImageElement[] = [];
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        const frameNum = String(i).padStart(4, "0");
        img.src = `/ritual_frames/step${stepIdx}/frame_${frameNum}.jpg`;
        img.onload = () => {
          // Draw first frame of first step once loaded
          if (s === 0 && i === 1) {
            draw(0, 0);
          }
        };
        stepImages.push(img);
      }
      imagesRef.current[s] = stepImages;
    }

    // 2. Cover-fit draw function for active step frame
    function draw(stepIndex: number, frameIndex: number) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const stepImages = imagesRef.current[stepIndex];
      if (!stepImages) return;
      const img = stepImages[frameIndex];
      if (!img || !img.complete) return;

      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;

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

        ctx.fillStyle = "#060606";
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, x, y, w, h);
        
        currentIdxRef.current = frameIndex;
        currentStepRef.current = stepIndex;
      }
    }

    // 3. requestAnimationFrame loop
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

      // Calculate overall progress (0 to 1)
      const overallProgress = totalScrollable > 0 ? Math.max(0, Math.min(1, offsetTop / totalScrollable)) : 0;

      // Calculate active step and local progress
      let activeStepIndex = Math.floor(overallProgress * 4);
      if (activeStepIndex > 3) activeStepIndex = 3;

      const localProgress = (overallProgress * 4) - activeStepIndex;

      // Update active index state when crossing step boundaries
      if (activeStepIndex !== activeIdxRef.current) {
        activeIdxRef.current = activeStepIndex;
        setActiveIdx(activeStepIndex);
      }

      // Draw canvas background frame based on activeStepIndex and localProgress
      const targetFrameIdx = Math.round(localProgress * (FRAME_COUNT - 1));
      if (activeStepIndex !== currentStepRef.current || targetFrameIdx !== currentIdxRef.current) {
        draw(activeStepIndex, targetFrameIdx);
      }

      // Background Color Interpolation for viewport and overlay
      let v = 8;
      if (overallProgress <= 0.333) {
        const t = overallProgress / 0.333;
        v = 8 - 2 * t; // 8 to 6
      } else if (overallProgress <= 0.666) {
        const t = (overallProgress - 0.333) / 0.333;
        v = 6 - 1 * t; // 6 to 5
      } else {
        const t = (overallProgress - 0.666) / 0.334;
        v = 5 - 1 * t; // 5 to 4
      }
      const colorVal = Math.round(v);

      if (overlayRef.current) {
        overlayRef.current.style.backgroundColor = `rgba(${colorVal}, ${colorVal}, ${colorVal}, 0.88)`;
      }
      if (viewportRef.current) {
        const hex = colorVal.toString(16).padStart(2, "0");
        viewportRef.current.style.backgroundColor = `#${hex}${hex}${hex}`;
      }

      // Progress Bar
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${overallProgress * 100}%`;
      }

      // Black Wipe Overlay
      if (wipeOverlayRef.current) {
        let wipeOpacity = 0;
        if (localProgress > 0.92 && activeStepIndex < 3) {
          wipeOpacity = (localProgress - 0.92) / 0.08;
        } else if (localProgress < 0.08 && activeStepIndex > 0) {
          wipeOpacity = 1 - (localProgress / 0.08);
        }
        wipeOverlayRef.current.style.opacity = wipeOpacity.toString();
      }

      // Animations: Left Column
      if (accentRef.current) {
        const opacity = localProgress > 0.10 ? Math.min(1, (localProgress - 0.10) / 0.10) : 0;
        accentRef.current.style.opacity = opacity.toString();
      }

      if (bigNumberRef.current) {
        const progress = localProgress > 0.05 ? Math.min(1, (localProgress - 0.05) / 0.15) : 0;
        bigNumberRef.current.style.opacity = progress.toString();
        bigNumberRef.current.style.transform = `translateX(${-40 + progress * 40}px)`;
      }

      if (inkLineRef.current) {
        inkLineRef.current.style.transform = `scaleY(${localProgress})`;
      }

      if (actRef.current) {
        const opacity = localProgress > 0.15 ? Math.min(1, (localProgress - 0.15) / 0.10) : 0;
        actRef.current.style.opacity = opacity.toString();
      }

      // Animations: Center Column
      if (titleRef.current) {
        const progress = localProgress > 0.05 ? Math.min(1, (localProgress - 0.05) / 0.15) : 0;
        titleRef.current.style.opacity = progress.toString();
        titleRef.current.style.transform = `translateY(${16 * (1 - progress)}px)`;
      }

      // Word reveal
      if (bodyParagraphRef.current) {
        const wordSpans = bodyParagraphRef.current.children;
        const totalWords = wordSpans.length;
        const revealedCount = Math.floor(localProgress * totalWords);
        for (let i = 0; i < wordSpans.length; i++) {
          const span = wordSpans[i] as HTMLSpanElement;
          if (i < revealedCount) {
            span.style.opacity = "1";
            span.style.filter = "none";
          } else {
            span.style.opacity = "0.08";
            span.style.filter = "blur(2px)";
          }
        }
      }

      if (detailRef.current) {
        const opacity = localProgress > 0.75 ? Math.min(1, (localProgress - 0.75) / 0.15) : 0;
        detailRef.current.style.opacity = opacity.toString();
      }

      // Animations: Right Column (Needle SVG)
      if (needleFillRef.current) {
        needleFillRef.current.setAttribute("y2", (10 + localProgress * 290).toString());
      }
      if (needleGroupRef.current) {
        needleGroupRef.current.setAttribute("transform", `translate(0, ${localProgress * 290})`);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // 4. Resize handler
    const handleResize = () => {
      if (currentStepRef.current !== -1 && currentIdxRef.current !== -1) {
        draw(currentStepRef.current, currentIdxRef.current);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToStep = (idx: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const stepHeight = window.innerHeight * 1.5; // 150vh per step
    const targetScroll = containerTop + idx * stepHeight;
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const activeStep = STEPS[activeIdx];
  const words = activeStep.body.split(" ");

  return (
    <section
      ref={containerRef}
      className="process-section"
      style={{
        height: "600vh", // Pinned for 600vh total
        position: "relative",
        background: "#080808",
      }}
      id="process"
    >
      {/* Sticky Viewport */}
      <div
        ref={viewportRef}
        className="process-viewport"
        style={{
          position: "sticky",
          top: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#080808",
          transition: "background-color 0.1s ease",
        }}
      >
        {/* Background Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            zIndex: 1,
          }}
        />

        {/* Dynamic Dark Overlay */}
        <div
          ref={overlayRef}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(8, 8, 8, 0.88)",
            pointerEvents: "none",
            zIndex: 2,
            transition: "background-color 0.1s ease",
          }}
        />

        {/* Progress Bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "#1a1a1a",
            zIndex: 15,
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              height: "100%",
              width: "0%",
              background: "#c8a97e",
            }}
          />
        </div>

        {/* Transition Wipe Overlay */}
        <div
          ref={wipeOverlayRef}
          style={{
            position: "absolute",
            inset: 0,
            background: "#000000",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 10,
          }}
        />

        {/* Step Counter Strip (Left Edge) */}
        <div
          className="process-counter-strip"
          style={{
            position: "absolute",
            left: "40px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            zIndex: 12,
          }}
        >
          {STEPS.map((step, idx) => {
            const isActive = idx === activeIdx;
            const isPast = idx < activeIdx;
            const opacity = isActive ? 1 : isPast ? 0.45 : 0.25;

            return (
              <div
                key={idx}
                onClick={() => scrollToStep(idx)}
                className={`process-counter-item ${isActive ? "active" : ""}`}
                style={{
                  cursor: "pointer",
                  opacity,
                  transition: "opacity 0.4s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                {/* Clickable Dot */}
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: isActive ? "#c8a97e" : "transparent",
                    border: "1px solid #c8a97e",
                    transition: "background-color 0.4s ease",
                  }}
                />
                <div
                  className="process-counter-text"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    className="process-counter-num"
                    style={{
                      fontFamily: "'Courier New', Courier, monospace",
                      color: "#c8a97e",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      lineHeight: 1,
                    }}
                  >
                    {step.num}
                  </span>
                  <span
                    className="process-counter-title"
                    style={{
                      fontFamily: "Georgia, serif",
                      color: "#555",
                      fontSize: "0.7rem",
                      marginTop: "2px",
                      lineHeight: 1,
                      ...(isActive ? { color: "#e8e4dc" } : {}),
                    }}
                  >
                    {step.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Column Content Layout */}
        <div
          className="process-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr 50px",
            gap: "4rem",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            paddingLeft: "180px", // Padded to clear the step counter strip
            paddingRight: "60px",
            alignItems: "center",
            zIndex: 3, // Above canvas and overlay
          }}
        >
          {/* Left Column */}
          <div
            className="process-col-left"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              position: "relative",
            }}
          >
            {/* Accent Label */}
            <div
              ref={accentRef}
              className="process-accent"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: "0.65rem",
                fontWeight: "bold",
                letterSpacing: "0.15em",
                color: "#c8a97e",
                marginBottom: "0.5rem",
                opacity: 0,
              }}
            >
              {activeStep.accent}
            </div>

            {/* Big Outline Number Container */}
            <div className="process-num-container" style={{ position: "relative", width: "100%" }}>
              {/* Gold Ink Line Overlay */}
              <div
                ref={inkLineRef}
                className="process-ink-line"
                style={{
                  position: "absolute",
                  left: "0",
                  top: "0",
                  bottom: "0",
                  width: "1.5px",
                  backgroundColor: "#c8a97e",
                  transformOrigin: "top",
                  transform: "scaleY(0)",
                  zIndex: 2,
                }}
              />
              {/* Outline Number */}
              <div
                ref={bigNumberRef}
                className="process-big-number"
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(96px, 12vw, 160px)",
                  fontWeight: 300,
                  lineHeight: 0.9,
                  color: "transparent",
                  WebkitTextStroke: "1px #2a2a2a",
                  opacity: 0,
                  paddingLeft: "12px",
                }}
              >
                {activeStep.num}
              </div>
            </div>

            {/* Act Label */}
            <div
              ref={actRef}
              className="process-act"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: "0.75rem",
                fontStyle: "italic",
                color: "#b8b0a4",
                marginTop: "0.5rem",
                opacity: 0,
              }}
            >
              {activeStep.act}
            </div>
          </div>

          {/* Center Column */}
          <div
            className="process-col-center"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            {/* Step Title */}
            <h2
              ref={titleRef}
              className="process-title"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 300,
                color: "#e8e4dc",
                marginBottom: "1.5rem",
                opacity: 0,
              }}
            >
              {activeStep.title}
            </h2>

            {/* Word-Reveal Body Copy */}
            <p
              ref={bodyParagraphRef}
              className="process-body-para"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "17px",
                lineHeight: 1.85,
                color: "#b8b0a4",
                marginBottom: "2rem",
                maxWidth: "600px",
              }}
            >
              {words.map((word, idx) => (
                <span
                  key={idx}
                  style={{
                    opacity: 0.08,
                    filter: "blur(2px)",
                    display: "inline-block",
                    marginRight: "0.28em",
                    transition: "opacity 0.12s ease-out, filter 0.12s ease-out",
                  }}
                >
                  {word}
                </span>
              ))}
            </p>

            {/* Detail Footnote */}
            <div
              ref={detailRef}
              className="process-detail"
              style={{
                width: "100%",
                maxWidth: "600px",
                borderTop: "1px solid #1a1a1a",
                paddingTop: "1rem",
                opacity: 0,
              }}
            >
              <div
                className="process-detail-text"
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: "0.72rem",
                  color: "#555",
                  letterSpacing: "0.05em",
                }}
              >
                {activeStep.detail}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div
            className="process-col-right"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Vertical SVG Needle */}
            <svg width={50} height={320} viewBox="0 0 50 320">
              {/* Track line (dark) */}
              <line
                x1={25}
                y1={10}
                x2={25}
                y2={300}
                stroke="#1a1a1a"
                strokeWidth={1}
              />
              {/* Gold fill line */}
              <line
                ref={needleFillRef}
                x1={25}
                y1={10}
                x2={25}
                y2={10}
                stroke="#c8a97e"
                strokeWidth={1.5}
              />
              {/* Tip Group */}
              <g ref={needleGroupRef}>
                <circle cx={25} cy={10} r={3.5} fill="#c8a97e" />
                <polygon points="21,13 29,13 25,20" fill="#c8a97e" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Responsive overrides */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 1024px) {
          .process-counter-strip {
            left: 24px !important;
            gap: 1.5rem !important;
          }
          .process-counter-title {
            display: none !important;
          }
          .process-layout {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding-left: 90px !important;
            padding-right: 40px !important;
            max-width: 650px !important;
          }
          .process-col-right {
            display: none !important;
          }
          .process-big-number {
            font-size: clamp(80px, 10vw, 120px) !important;
          }
        }

        @media (max-width: 768px) {
          .process-counter-strip {
            left: 16px !important;
            gap: 1.25rem !important;
          }
          .process-layout {
            padding-left: 64px !important;
            padding-right: 24px !important;
            gap: 1.5rem !important;
          }
          .process-big-number {
            font-size: clamp(64px, 12vw, 88px) !important;
          }
          .process-title {
            font-size: clamp(28px, 6vw, 36px) !important;
            margin-bottom: 1rem !important;
          }
          .process-body-para {
            font-size: 15px !important;
            line-height: 1.75 !important;
            margin-bottom: 1.5rem !important;
          }
        }

        @media (max-width: 480px) {
          .process-counter-strip {
            left: 12px !important;
            gap: 1rem !important;
          }
          .process-layout {
            padding-left: 52px !important;
            padding-right: 16px !important;
            gap: 1rem !important;
          }
          .process-big-number {
            font-size: 56px !important;
          }
          .process-title {
            font-size: 22px !important;
            margin-bottom: 0.75rem !important;
          }
          .process-body-para {
            font-size: 13.5px !important;
            line-height: 1.6 !important;
            margin-bottom: 1rem !important;
          }
          .process-detail {
            padding-top: 0.75rem !important;
          }
        }
      `,
        }}
      />
    </section>
  );
}
