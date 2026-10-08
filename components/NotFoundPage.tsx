"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home, Volume2 } from "lucide-react";
import { LiquidBlobs } from "@components/FeaturesGallery";
import { useVoice } from "@lib/voice/VoiceProvider";

const MESSAGE =
  "This command was not recognised. The page you asked for is not in my vocabulary. Say Home, or click here to go back.";

/** 404 — EFFECT-17 liquid blob + SpeechSynthesis reading of the message. */
export default function NotFoundPage() {
  const { speak, hasActivated } = useVoice();
  const [spoken, setSpoken] = useState(false);
  const spokenOnce = useRef(false);

  const readAloud = () => {
    if (spokenOnce.current) return;
    spokenOnce.current = true;
    setSpoken(true);
    speak(MESSAGE);
  };

  // No audio autoplay: speak only after a user gesture in this session,
  // or immediately if the visitor already activated the mic earlier.
  useEffect(() => {
    if (hasActivated) {
      readAloud();
      return;
    }
    const onGesture = () => {
      window.setTimeout(readAloud, 250);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasActivated]);

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[46vh]" aria-hidden="true">
        <LiquidBlobs className="h-full opacity-70" />
      </div>
      <div className="container-site relative grid min-h-[62vh] items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="meta">Error 404</p>
          <h1 className="mt-3">This command was not recognised.</h1>
          <p className="mt-4 max-w-[52ch] text-[17px]">
            The page you asked for is not in Raphael&apos;s vocabulary. It may have moved, or the
            link may be mistyped.
          </p>
          <p className="mt-6 text-[16px] font-bold text-[var(--color-dark)]">
            Say <span className="text-[var(--color-primary-ink)]">“Home”</span> or{" "}
            <Link href="/" className="link-underline">
              click here to go back
            </Link>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/" className="btn btn-primary">
              <Home size={15} aria-hidden="true" /> Go home
            </Link>
            <button type="button" className="btn btn-outline" onClick={readAloud} aria-pressed={spoken}>
              <Volume2 size={15} aria-hidden="true" /> {spoken ? "Reading…" : "Read aloud"}
            </button>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="blob-stage h-[320px]" aria-hidden="true">
            <span className="blob" style={{ width: "52%", height: "52%", left: "10%", top: "14%" }} />
            <span className="blob" style={{ width: "40%", height: "40%", left: "46%", top: "40%" }} />
            <span className="blob" style={{ width: "28%", height: "28%", left: "28%", top: "58%" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
