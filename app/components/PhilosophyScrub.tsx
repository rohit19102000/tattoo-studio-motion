"use client";

import { useEffect, useRef } from "react";

interface PhilosophyScrubProps {
  frameCount: number;
  framePath: string; // e.g. "/philosophy_frames/frame_"
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function PhilosophyScrub({
  frameCount,
  framePath,
  containerRef,
}: PhilosophyScrubProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentIdxRef = useRef<number>(-1);

  useEffect(() => {
    // 1. Preload all images
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, "0");
      img.src = `${framePath}${frameNum}.jpg`;
      img.onload = () => {
        if (i === 1) {
          draw(0);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    // 2. Cover-fit draw function
    function draw(index: number) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = imagesRef.current[index];
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

        ctx.fillStyle = "#0A0A0A";
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, x, y, w, h);
        currentIdxRef.current = index;
      }
    }

    // 3. requestAnimationFrame loop — no scroll event listeners
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

      const progress = Math.max(0, Math.min(1, offsetTop / totalScrollable));
      const targetIdx = Math.round(progress * (frameCount - 1));

      if (targetIdx !== currentIdxRef.current) {
        draw(targetIdx);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // 4. Resize handler
    const handleResize = () => {
      if (currentIdxRef.current !== -1) {
        draw(currentIdxRef.current);
      }
    };
    window.addEventListener("resize", handleResize);

    // 5. Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [frameCount, framePath, containerRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
