"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home, RefreshCw, Volume2 } from "lucide-react";
import { LiquidBlobs } from "@components/FeaturesGallery";

const MESSAGE = "Voice assistant temporarily offline. Please try again.";

/** 500 — "Voice assistant temporarily offline. Please try again." + Try Again. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [spoken, setSpoken] = useState(false);
  const spokenOnce = useRef(false);

  const readAloud = () => {
    if (spokenOnce.current || typeof window === "undefined" || !window.speechSynthesis) return;
    spokenOnce.current = true;
    setSpoken(true);
    const utterance = new SpeechSynthesisUtterance(MESSAGE);
    window.speechSynthesis.speak(utterance);
  };

  // No autoplay: only speak after a deliberate gesture on this page.
  useEffect(() => {
    const onGesture = () => window.setTimeout(readAloud, 250);
    window.addEventListener("pointerdown", onGesture, { once: true });
    window.addEventListener("keydown", onGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, []);

  useEffect(() => {
    // surface the failure for observability without leaking details to users
    console.error("[raphael:500]", error.digest ?? error.message);
  }, [error]);

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42vh]" aria-hidden="true">
        <LiquidBlobs className="h-full opacity-50" />
      </div>
      <div className="container-site relative grid min-h-[60vh] place-items-center text-center">
        <div>
          <p className="meta">Error 500</p>
          <h1 className="mt-3">Voice assistant temporarily offline.</h1>
          <p className="mt-4 text-[17px]">Please try again.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button type="button" className="btn btn-primary" onClick={reset}>
              <RefreshCw size={15} aria-hidden="true" /> Try Again
            </button>
            <Link href="/" className="btn btn-outline">
              <Home size={15} aria-hidden="true" /> Go home
            </Link>
            <button type="button" className="btn btn-ghost" onClick={readAloud} aria-pressed={spoken}>
              <Volume2 size={15} aria-hidden="true" /> Read aloud
            </button>
          </div>
          {error.digest ? (
            <p className="mt-6 text-[11px] uppercase tracking-widest text-[var(--color-ink-soft)]">
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
