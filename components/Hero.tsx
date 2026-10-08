"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AudioLines, Code2 } from "lucide-react";
import AmbientParticles from "@components/AmbientParticles";
import Headline from "@components/Headline";
import { useVoice } from "@lib/voice/VoiceProvider";

const WaveformSphere = dynamic(() => import("@components/WaveformSphere"), {
  ssr: false,
  loading: () => <div className="sphere-stage" aria-hidden="true" />,
});

/** Hero — EFFECT-01, 04, 06, 18, 23. Entrance completes under 1.6s. */
export default function Hero() {
  const { micState } = useVoice();

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="hero-gradient" aria-hidden="true" />
      <AmbientParticles />

      <div className="container-site grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="meta entrance" style={{ ["--d" as string]: "0ms" }}>
            Nairobi · East Africa · WCAG 2.2 AA
          </p>
          <div id="hero-heading" className="mt-4">
            <Headline />
          </div>
          <p
            className="entrance mt-5 max-w-[52ch] text-[17px] leading-relaxed text-[var(--color-text)]"
            style={{ ["--d" as string]: "520ms" }}
          >
            Voice navigation. Screen reader enhancement. Accessible interfaces for every East
            African user.
          </p>
          <div className="entrance mt-7 flex flex-wrap gap-4" style={{ ["--d" as string]: "760ms" }}>
            <Link href="#demo" className="btn btn-primary">
              <AudioLines size={15} aria-hidden="true" /> Try the Demo
            </Link>
            <Link href="#licence" className="btn btn-outline">
              <Code2 size={15} aria-hidden="true" /> Get API Access
            </Link>
          </div>
          <p className="entrance mt-5 text-[13px] text-[var(--color-ink-soft)]" style={{ ["--d" as string]: "980ms" }}>
            Or just say it: <strong>“Play demo”</strong>, <strong>“Open pricing”</strong>,{" "}
            <strong>“Read this page”</strong>. Press <kbd className="rounded border border-[var(--color-border)] bg-white px-1">Space</kbd> to toggle the mic.
          </p>
        </div>

        {/* hidden below 768px per brief */}
        <div className="entrance hidden md:block" style={{ ["--d" as string]: "900ms" }}>
          <WaveformSphere active={micState === "listening"} />
          <p className="mt-2 text-center text-[11px] uppercase tracking-widest text-[var(--color-ink-soft)]">
            {micState === "listening" ? "Sphere is hearing you" : "Sphere idle — mic off"}
          </p>
        </div>
      </div>
    </section>
  );
}
