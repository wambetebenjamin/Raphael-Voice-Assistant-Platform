"use client";

import { useEffect, useRef, useState } from "react";

/**
 * EFFECT-04 — per-letter stagger entrance with a one-shot glitch pass on the
 * keyword "Voice". Visible letters are aria-hidden; screen readers get one
 * clean sentence from the sr-only span.
 */
export default function Headline() {
  const [glitch, setGlitch] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => {
    timer.current = window.setTimeout(() => {
      setGlitch(true);
      window.setTimeout(() => setGlitch(false), 700);
    }, 1050);
    return () => window.clearTimeout(timer.current);
  }, []);

  const line1 = "Your Website Now Speaks and Listens.";
  let index = 0;

  return (
    <h1 className="headline relative">
      <span aria-hidden="true" className="block">
        {line1.split("").map((ch, i) =>
          ch === " " ? (
            <span key={i} className="letter-space" />
          ) : (
            <span key={i} className="letter" style={{ ["--i" as string]: index++ }}>
              {ch}
            </span>
          )
        )}
      </span>
      <span aria-hidden="true" className="mt-2 block text-[var(--color-primary-ink)]">
        <span className="letter" style={{ ["--i" as string]: index++ }}>R</span>
        <span className="letter" style={{ ["--i" as string]: index++ }}>a</span>
        <span className="letter" style={{ ["--i" as string]: index++ }}>p</span>
        <span className="letter" style={{ ["--i" as string]: index++ }}>h</span>
        <span className="letter" style={{ ["--i" as string]: index++ }}>a</span>
        <span className="letter" style={{ ["--i" as string]: index++ }}>e</span>
        <span className="letter" style={{ ["--i" as string]: index++ }}>l</span>
        <span className="letter-space" />
        <span className={`glitch ${glitch ? "is-glitching" : ""}`} data-text="Voice">
          Voice
        </span>
      </span>
      <span className="sr-only">Your Website Now Speaks and Listens. Raphael Voice.</span>
    </h1>
  );
}
