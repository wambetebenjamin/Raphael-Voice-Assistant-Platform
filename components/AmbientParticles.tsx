"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion, useTabVisible } from "@lib/voice/useReducedMotion";

/**
 * EFFECT-06 — ambient sound-wave particles. aria-hidden, opacity below 0.2
 * (set in CSS), paused when the tab is hidden, frozen under reduced motion.
 */
export default function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const visible = useTabVisible();
  const visibleRef = useRef(visible);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const particles = Array.from({ length: 42 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random() * 2.4,
      speed: 0.00012 + Math.random() * 0.00028,
      phase: (i / 42) * Math.PI * 2,
    }));

    const size = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    size();
    window.addEventListener("resize", size);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0aa8a7";
      for (const p of particles) {
        const y = (p.y + Math.sin(t * 0.0004 + p.phase) * 0.02) * canvas.height;
        const x = ((p.x + t * p.speed * 0.06) % 1) * canvas.width;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // faint connecting sound-wave line
      ctx.strokeStyle = "rgba(10,168,167,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += 8) {
        const y = canvas.height * 0.5 + Math.sin(x * 0.02 + t * 0.0011) * 18;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visibleRef.current) return;
      draw(t);
    };

    if (reduced) draw(1200); // frozen single frame
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="particles-canvas" aria-hidden="true" />;
}
