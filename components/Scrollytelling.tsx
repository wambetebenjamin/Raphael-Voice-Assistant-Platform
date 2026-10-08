"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PHOTOS } from "@lib/site";
import { useVoice } from "@lib/voice/VoiceProvider";
import { useReducedMotion } from "@lib/voice/useReducedMotion";

const BEATS = [
  {
    title: "A website, behind glass",
    body: "Amina opens a county services website on her phone. Forms, menus, tiny labels — a wall of text she cannot see.",
    photo: PHOTOS.whiteCaneSofa,
    narration: "Beat one. A visually impaired user opens a website full of text she cannot see.",
  },
  {
    title: "She speaks instead",
    body: "She taps the mic once and says “open services”. No typing, no pinch-zoom, no guessing.",
    photo: PHOTOS.voiceUserOutdoors,
    narration: "Beat two. She activates voice and speaks a single command.",
  },
  {
    title: "Raphael hears and reads",
    body: "Raphael matches the command locally in her browser, moves the page, and reads the service list aloud in Swahili.",
    photo: PHOTOS.womanHeadphones,
    narration: "Beat three. Raphael processes the command and reads the page back to her.",
  },
  {
    title: "Task done, hands free",
    body: "Appointment booked by voice in under a minute. Not one keystroke, not one barrier.",
    photo: PHOTOS.phoneLaptopDesk,
    narration: "Beat four. She completes her task without typing a single letter.",
  },
];

/**
 * EFFECT-02 — pinned scrollytelling, 4 beats.
 * IntersectionObserver only (never hijacks wheel speed). Under reduced
 * motion the CSS un-pins the stage into a plain stacked article.
 */
export default function Scrollytelling() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { micState, speak } = useVoice();
  const spokenRef = useRef(-1);

  useEffect(() => {
    if (reduced) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.beat);
            setActive(idx);
          }
        }
      },
      { threshold: 0.55 }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [reduced]);

  // narrate each beat while the mic is active
  useEffect(() => {
    if (micState !== "listening" || reduced) return;
    if (spokenRef.current === active) return;
    spokenRef.current = active;
    speak(BEATS[active].narration);
  }, [active, micState, reduced, speak]);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const done = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? (done / total) * 100 : 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  return (
    <section className="section-pad" aria-labelledby="journey-title">
      <div className="container-site">
        <p className="meta">Scrollytelling</p>
        <h2 id="journey-title" className="h2 mt-2">
          One journey, four beats
        </h2>
      </div>

      <div ref={trackRef} className="scrolly relative mt-8">
        <div className="scrolly-progress" aria-hidden="true">
          <i style={{ ["--sp" as string]: `${progress}%` }} />
        </div>

        <div className="scrolly-pin">
          <div className="container-site grid items-center gap-8 lg:grid-cols-2">
            <div className="relative min-h-[300px]">
              {BEATS.map((beat, i) => (
                <div
                  key={beat.title}
                  className={`scrolly-beat ${i === active ? "is-active" : ""} ${
                    reduced ? "" : "absolute inset-0"
                  }`}
                  aria-hidden={i === active ? undefined : true}
                >
                  <p className="meta">{`Beat ${i + 1} of 4`}</p>
                  <h3 className="h3 mt-2">{beat.title}</h3>
                  <p className="mt-3 max-w-[48ch] text-[16px]">{beat.body}</p>
                </div>
              ))}
            </div>
            <div className="relative min-h-[260px]">
              {BEATS.map((beat, i) => (
                <div
                  key={beat.photo.src}
                  className={`scrolly-beat ${i === active ? "is-active" : ""} ${reduced ? "my-6" : "absolute inset-0"}`}
                  aria-hidden={i === active ? undefined : true}
                >
                  <Image
                    src={beat.photo.src}
                    alt={beat.photo.alt}
                    width={beat.photo.width}
                    height={beat.photo.height}
                    loading="lazy"
                    className="h-full w-full rounded-[var(--radius-card)] object-cover shadow-[var(--shadow-card-lg)]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* scroll markers drive the IntersectionObserver */}
        <div className="scrolly-markers container-site space-y-[46vh] py-[10vh]">
          {BEATS.map((beat, i) => (
            <div
              key={beat.title}
              data-beat={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="sr-only"
              aria-hidden="true"
            >
              {beat.title}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
