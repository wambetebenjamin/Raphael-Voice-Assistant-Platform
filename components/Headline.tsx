"use client";

import { Fragment, useEffect, useRef, useState } from "react";

/**
 * EFFECT-04 — per-letter stagger entrance with a one-shot glitch pass on the
 * keyword "Voice". Words stay together while lines wrap at natural spaces.
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

  const renderLetters = (word: string, prefix: string) => (
    <span className="headline-word" key={prefix}>
      {Array.from(word).map((ch, i) => {
        const letterIndex = index++;
        return (
          <span
            key={`${prefix}-${i}`}
            className="letter"
            style={{ ["--i" as string]: letterIndex }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );

  return (
    <h1 className="headline relative">
      <span aria-hidden="true" className="block">
        {line1.split(" ").map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            {i > 0 ? " " : null}
            {renderLetters(word, `headline-${i}`)}
          </Fragment>
        ))}
      </span>
      <span aria-hidden="true" className="mt-2 block text-[var(--color-primary-ink)]">
        {renderLetters("Raphael", "raphael")}{" "}
        <span className={`glitch ${glitch ? "is-glitching" : ""}`} data-text="Voice">
          Voice
        </span>
      </span>
      <span className="sr-only">Your Website Now Speaks and Listens. Raphael Voice.</span>
    </h1>
  );
}
