"use client";

import { useEffect, useRef, useState } from "react";
import Wordmark from "@components/Wordmark";

/**
 * EFFECT-25 — waveform preloader.
 * Three pulsing speech bars + progress fill; a Skip control appears at 3s;
 * role=status announces completion. Under prefers-reduced-motion the CSS
 * hides the bars and only the plain percentage text remains.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [skippable, setSkippable] = useState(false);
  const [gone, setGone] = useState(false);
  const [status, setStatus] = useState("Loading Raphael Voice");
  const startedAt = useRef<number>(0);

  useEffect(() => {
    startedAt.current = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - startedAt.current;
      // fast start, gentle tail — completes ~2.2s after window load
      const target = Math.min(100, (elapsed / 2200) * 100);
      setProgress((p) => (document.readyState === "complete" ? Math.max(p, target) : Math.min(p + 0.6, 88)));
      if (target < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const skipTimer = window.setTimeout(() => setSkippable(true), 3000);
    const finish = () => {
      setProgress(100);
      setStatus("Loading complete");
      window.setTimeout(() => setDone(true), 260);
      window.setTimeout(() => setGone(true), 900);
    };
    if (document.readyState === "complete") window.setTimeout(finish, 300);
    else window.addEventListener("load", () => window.setTimeout(finish, 300), { once: true });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(skipTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <div className="preloader" data-done={done} data-skippable={skippable}>
      <div className="flex flex-col items-center px-6 text-center">
        {/* EFFECT-08 wordmark, reused inside the preloader */}
        <Wordmark mode="once" className="mb-6 h-9 w-auto text-[var(--color-primary-ink)]" />
        <div className="preloader-wave" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div
          className="preloader-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Page loading progress"
        >
          <i style={{ ["--progress" as string]: `${progress}%` }} />
        </div>
        <p className="preloader-percent">{Math.round(progress)}%</p>
        <button
          type="button"
          className="preloader-skip btn btn-ghost"
          onClick={() => {
            setProgress(100);
            setStatus("Loading complete");
            setDone(true);
            window.setTimeout(() => setGone(true), 500);
          }}
        >
          Skip intro
        </button>
        <p role="status" aria-live="polite" className="sr-only">
          {status}
        </p>
      </div>
    </div>
  );
}
