"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { FEATURES, PHOTOS } from "@lib/site";
import Wordmark from "@components/Wordmark";
import { useReducedMotion } from "@lib/voice/useReducedMotion";

/* ── EFFECT-07 · looping line-art waveform ───────────────────────────────── */
function WaveLine() {
  const wave = (offset: number) =>
    Array.from({ length: 9 }, (_, i) => `${i * 20 + offset},${40 + Math.sin(i * 1.1) * 22}`).join(" ");
  return (
    <svg viewBox="0 0 160 80" className="h-[110px] w-[220px]" role="img" aria-label="Voice waveform">
      <g className="fx-wave-anim">
        <polyline className="fx-wave-line" points={wave(0)} fill="none" />
        <polyline className="fx-wave-line" points={wave(160)} fill="none" opacity={0.5} />
      </g>
    </svg>
  );
}

/* ── EFFECT-09 · matched-point morph mic → ear → speech bubble ───────────── */
type Pt = [number, number];
const stadium = (cx: number, cy: number, w: number, h: number, n: number): Pt[] => {
  const r = w / 2;
  const pts: Pt[] = [];
  for (let i = 0; i < n; i += 1) {
    const t = (i / n) * Math.PI * 2;
    const top = cy - h / 2 + r;
    const bottom = cy + h / 2 - r;
    if (t < Math.PI) pts.push([cx + Math.cos(t - Math.PI / 2) * r, top + Math.sin(t - Math.PI / 2) * r]);
    else pts.push([cx + Math.cos(t - Math.PI / 2) * r, bottom + Math.sin(t - Math.PI / 2) * r]);
  }
  return pts;
};
const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n: number): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / (n - 1);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as Pt;
  });
const rectPerimeter = (x: number, y: number, w: number, h: number, n: number): Pt[] => {
  const per = 2 * (w + h);
  return Array.from({ length: n }, (_, i) => {
    let d = (i / n) * per;
    if (d < w) return [x + d, y] as Pt;
    d -= w;
    if (d < h) return [x + w, y + d] as Pt;
    d -= h;
    if (d < w) return [x + w - d, y + h] as Pt;
    d -= w;
    return [x, y + h - d] as Pt;
  });
};

const MIC: Pt[] = [...stadium(50, 34, 26, 40, 18), ...arc(50, 52, 24, Math.PI * 0.12, Math.PI * 0.88, 10)];
const EAR: Pt[] = [...arc(50, 42, 26, -Math.PI * 0.5, Math.PI * 0.95, 18), ...arc(54, 44, 12, Math.PI * 0.9, -Math.PI * 0.25, 10)];
const BUBBLE: Pt[] = [...rectPerimeter(24, 20, 52, 38, 18), [[38, 58], [34, 72], [48, 60], [42, 66], [36, 70], [40, 62], [44, 60], [46, 62], [40, 64], [38, 60]] as Pt[]].flat() as Pt[];

const toPath = (pts: Pt[]) => `M ${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ")}`;

function MorphGlyph() {
  const reduced = useReducedMotion();
  const [target, setTarget] = useState(0);
  const pointsRef = useRef<Pt[]>(MIC);
  const pathRef = useRef<SVGPathElement>(null);
  const raf = useRef(0);
  const shapes = [MIC, EAR, BUBBLE];

  // auto-cycle while mounted
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTarget((t) => (t + 1) % 3), 2600);
    return () => window.clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return; // crossfade below is CSS-only
    const step = () => {
      const from = pointsRef.current;
      const to = shapes[target];
      const next = from.map(([x, y], i) => [x + (to[i][0] - x) * 0.14, y + (to[i][1] - y) * 0.14] as Pt);
      pointsRef.current = next;
      if (pathRef.current) pathRef.current.setAttribute("d", toPath(next));
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduced]);

  if (reduced) {
    // crossfade under reduced motion
    return (
      <svg viewBox="0 0 100 84" className="h-[110px] w-[130px]" role="img" aria-label="Morphing glyph: microphone, ear, speech bubble">
        {shapes.map((s, i) => (
          <path key={i} d={toPath(s)} className="fx-morph" style={{ opacity: target === i ? 1 : 0, transition: "opacity 500ms ease" }} fill="none" />
        ))}
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 100 84"
      className="fx-morph h-[110px] w-[130px]"
      role="img"
      aria-label="Morphing glyph cycling between microphone, ear and speech bubble"
      tabIndex={0}
      onMouseLeave={() => setTarget(0)}
      onFocus={() => setTarget((t) => (t + 1) % 3)}
    >
      <path ref={pathRef} d={toPath(MIC)} />
    </svg>
  );
}

/* ── EFFECT-13 · robot mascot with microphone ear ────────────────────────── */
function Mascot() {
  return (
    <svg viewBox="0 0 140 120" className="fx-mascot h-[120px] w-[140px]" aria-hidden="true" tabIndex={0}>
      <rect x="40" y="34" width="60" height="48" rx="12" fill="#edf6f5" stroke="#0b6e6d" strokeWidth="3" />
      <circle className="mascot-eye" cx="60" cy="56" r="5" fill="#084e4d" />
      <circle className="mascot-eye" cx="82" cy="56" r="5" fill="#084e4d" />
      <path d="M60 70 q11 8 22 0" fill="none" stroke="#084e4d" strokeWidth="3" strokeLinecap="round" />
      <line x1="70" y1="34" x2="70" y2="20" stroke="#0b6e6d" strokeWidth="3" />
      <circle cx="70" cy="16" r="5" fill="#0aa8a7" />
      {/* microphone ear */}
      <rect x="98" y="46" width="12" height="22" rx="6" fill="#0aa8a7" />
      <path d="M96 62 q8 12 16 0" fill="none" stroke="#084e4d" strokeWidth="2.5" />
      <g className="mascot-arm">
        <path d="M40 52 q-16 4 -18 18" fill="none" stroke="#0b6e6d" strokeWidth="4" strokeLinecap="round" />
        <circle cx="21" cy="72" r="5" fill="#0aa8a7" />
      </g>
      <path d="M40 82 h60" stroke="#0b6e6d" strokeWidth="3" strokeLinecap="round" />
      <path d="M52 82 v14 M88 82 v14" stroke="#0b6e6d" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/* ── EFFECT-19 · isometric ecosystem assembling on scroll ────────────────── */
function IsoScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return; // fully assembled via CSS under reduced motion
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  const assembled = reduced || inView;
  return (
    <div ref={ref} className="grid h-[130px] place-items-center">
      <div className={`iso-stage ${assembled ? "is-assembled" : ""}`} aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="iso-tile" data-i={i} />
        ))}
      </div>
    </div>
  );
}

/* ── EFFECT-31 · stop-motion sprite, halted off-screen ───────────────────── */
function SpriteWave() {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPlaying(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="sprite-wave"
      style={{
        ["--sprite-url" as string]: "url(/images/sprites/wave-sprite.png)",
        animationPlayState: playing ? "running" : "paused",
      }}
      role="img"
      aria-label="Stop-motion voice level meter"
    />
  );
}

/* ── EFFECT-17 · bounded liquid blobs (also on 404) ──────────────────────── */
export function LiquidBlobs({ className = "" }: { className?: string }) {
  const [liquid, setLiquid] = useState(false);
  return (
    <div
      className={`blob-stage ${liquid ? "is-liquid" : ""} ${className}`}
      onMouseEnter={() => setLiquid(true)}
      onMouseLeave={() => setLiquid(false)}
      onFocus={() => setLiquid(true)}
      onBlur={() => setLiquid(false)}
      aria-hidden="true"
    >
      <span className="blob" style={{ width: "46%", height: "46%", left: "12%", top: "18%" }} />
      <span className="blob" style={{ width: "38%", height: "38%", left: "48%", top: "38%" }} />
      <span className="blob" style={{ width: "30%", height: "30%", left: "30%", top: "52%" }} />
    </div>
  );
}

/* ── EFFECT-16 · mixed-media collage ─────────────────────────────────────── */
function Collage() {
  return (
    <div className="grain relative h-[130px] w-full overflow-hidden rounded-[var(--radius-card)]">
      <Image
        src={PHOTOS.voiceUserOutdoors.src}
        alt={PHOTOS.voiceUserOutdoors.alt}
        width={PHOTOS.voiceUserOutdoors.width}
        height={PHOTOS.voiceUserOutdoors.height}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <svg viewBox="0 0 200 60" className="absolute bottom-0 left-0 w-full" aria-hidden="true">
        <polyline
          points="0,40 20,40 30,14 42,52 56,26 70,44 86,10 100,48 116,30 132,42 148,18 164,46 180,32 200,40"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ── EFFECT-21 · doodle speech bubbles ───────────────────────────────────── */
function Doodle() {
  return (
    <svg viewBox="0 0 200 100" className="doodle h-[110px] w-[200px]" aria-hidden="true">
      <path d="M28 22 h70 a10 10 0 0 1 10 10 v22 a10 10 0 0 1 -10 10 h-40 l-16 14 v-14 h-14 a10 10 0 0 1 -10 -10 v-22 a10 10 0 0 1 10 -10 z" />
      <path d="M120 44 h52 a8 8 0 0 1 8 8 v14 a8 8 0 0 1 -8 8 h-30 l-12 10 v-10 h-10 a8 8 0 0 1 -8 -8 v-14 a8 8 0 0 1 8 -8 z" />
      <path d="M44 40 q8 -8 16 0 q8 8 16 0" />
      <path d="M136 58 h28 M136 66 h20" />
    </svg>
  );
}

/* ── EFFECT-14 · faux-3D phone ───────────────────────────────────────────── */
function Phone3D() {
  return (
    <div className="phone3d" aria-hidden="true">
      <div className="phone3d-layer" data-z="1" />
      <div className="phone3d-layer" data-z="2" />
      <div className="phone3d-layer grid place-items-center" data-z="3">
        <div className="w-[80%] space-y-2">
          <div className="mx-auto h-2 w-10 rounded-full bg-[var(--color-primary)]" />
          <div className="h-1.5 w-full rounded bg-[var(--color-border)]" />
          <div className="h-1.5 w-4/5 rounded bg-[var(--color-border)]" />
          <div className="mx-auto mt-3 grid h-9 w-9 place-items-center rounded-full bg-[var(--color-primary)]">
            <span className="block h-3 w-[2px] bg-white shadow-[4px_0_0_white,-4px_0_0_white]" />
          </div>
        </div>
      </div>
    </div>
  );
}

const STAGES: Record<string, ReactNode> = {
  "voice-waveform": <WaveLine />,
  "self-drawn-wordmark": <Wordmark mode="once" className="h-12 w-auto text-[var(--color-primary-ink)]" />,
  "morphing-input": <MorphGlyph />,
  mascot: <Mascot />,
  "phone-ui": <Phone3D />,
  "east-african": <Collage />,
  "liquid-feedback": <LiquidBlobs className="h-full" />,
  "device-ecosystem": <IsoScene />,
  "conversational-forms": <Doodle />,
  "stop-motion-meter": <SpriteWave />,
};

/** Features gallery — 10 cards, one signature effect each. */
export default function FeaturesGallery() {
  return (
    <section id="features" className="section-pad scroll-mt-32" aria-labelledby="features-title">
      <div className="container-site">
        <p className="meta">Features gallery</p>
        <h2 id="features-title" className="h2 mt-2">
          Ten interfaces, one voice
        </h2>
        <p className="mt-3 max-w-[62ch] text-[16px]">
          Every card below is a live, working effect from the platform — hover or focus any of
          them. Each one has a reduced-motion equivalent.
        </p>

        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <li key={feature.id} className="fx-card" tabIndex={0}>
              <div className="fx-stage">{STAGES[feature.id]}</div>
              <p className="meta text-[11px]">{feature.effect}</p>
              <h3 className="h4">{feature.title}</h3>
              <p className="text-[15px]">{feature.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
