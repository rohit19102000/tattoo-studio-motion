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
    const loadedImages = new Map<number, HTMLImageElement>();
    let isCleanedUp = false;

    // 1. Helper to build URL
    function getImageUrl(index: number) {
      const frameNum = String(index + 1).padStart(4, "0");
      return `${framePath}${frameNum}.jpg`;
    }

    // 2. Helper to request an image
    function loadImage(index: number, onLoad?: (img: HTMLImageElement) => void) {
      if (index < 0 || index >= frameCount || isCleanedUp) return;

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
    loadImage(0, () => {
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

    // 4. requestAnimationFrame loop — no scroll event listeners
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
