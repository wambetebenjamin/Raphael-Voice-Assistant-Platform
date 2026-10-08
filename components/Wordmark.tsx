"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * EFFECT-08 — the RAPHAEL monoline wordmark.
 * Path lengths are measured at runtime (getTotalLength) and the mark draws
 * itself once. `mode="click"` replays the draw on click (used by the navbar
 * logo, EFFECT-10). Reduced motion renders it fully drawn and static (CSS).
 */

const LETTERS: { d: string[]; x: number }[] = [
  { x: 0, d: ["M12,92 V8 H40 C58,8 58,48 40,48 H12", "M38,48 L56,92"] }, // R
  { x: 64, d: ["M8,92 L32,8 L56,92", "M17,62 H47"] }, // A
  { x: 128, d: ["M12,92 V8 H40 C58,8 58,48 40,48 H12"] }, // P
  { x: 192, d: ["M12,8 V92", "M56,8 V92", "M12,50 H56"] }, // H
  { x: 256, d: ["M8,92 L32,8 L56,92", "M17,62 H47"] }, // A
  { x: 320, d: ["M52,8 H14 V92 H52", "M14,50 H44"] }, // E
  { x: 384, d: ["M14,8 V92 H52"] }, // L
];

interface WordmarkProps {
  mode?: "once" | "click" | "static";
  className?: string;
  title?: string;
}

export default function Wordmark({
  mode = "once",
  className = "",
  title = "Raphael",
}: WordmarkProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(mode === "static");

  const measure = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.querySelectorAll<SVGGeometryElement>("path").forEach((path) => {
      const len = Math.ceil(path.getTotalLength());
      path.style.setProperty("--len", String(len));
    });
  }, []);

  useEffect(() => {
    measure();
    if (mode === "static") return;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
    return () => cancelAnimationFrame(raf);
  }, [measure, mode]);

  const replay = useCallback(() => {
    if (mode !== "click") return;
    measure();
    setDrawn(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
  }, [measure, mode]);

  // flatten letter strokes once per render — no mutation during render
  const strokes = LETTERS.reduce<{ d: string; x: number; delay: number }[]>((acc, letter) => {
    for (const d of letter.d) {
      acc.push({ d, x: letter.x, delay: acc.length * 110 });
    }
    return acc;
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 448 100"
      role="img"
      aria-label={title}
      className={`wordmark ${drawn ? "is-drawn" : ""} ${mode === "static" ? "is-static" : ""} ${className}`}
      onClick={mode === "click" ? replay : undefined}
    >
      {LETTERS.map((letter, li) => (
        <g key={li} transform={`translate(${letter.x} 0)`}>
          {strokes
            .filter((stroke) => stroke.x === letter.x)
            .map((stroke, di) => (
              <path
                key={di}
                d={stroke.d}
                style={{ ["--draw-delay" as string]: `${stroke.delay}ms` }}
              />
            ))}
        </g>
      ))}
    </svg>
  );
}
