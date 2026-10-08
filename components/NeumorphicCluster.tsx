"use client";

import { useEffect, useRef } from "react";
import { Languages, Mic, MicOff, Volume2 } from "lucide-react";
import { audioLevel } from "@lib/voice/audio-bus";
import { LANG_OPTIONS, useVoice, type VoiceLang } from "@lib/voice/VoiceProvider";
import { useReducedMotion } from "@lib/voice/useReducedMotion";

/**
 * EFFECT-27 — neumorphic voice controls cluster.
 * Mic toggle · volume dial · speech-rate slider · language selector
 * (Swahili / English / Kikuyu) · live waveform display.
 * Dual box-shadows, AA contrast, distinct pressed states. 2×2 on mobile.
 */
export default function NeumorphicCluster() {
  const { micState, toggleMic, rate, setRate, volume, setVolume, lang, setLang } = useVoice();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  // live waveform display from the local mic analyser
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 220;
    canvas.height = 56;
    let raf = 0;
    const bars = new Array(28).fill(4);
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const level = micState === "listening" ? audioLevel() : 0;
      bars.shift();
      bars.push(reduced ? 6 : 4 + level * 44 + Math.random() * (level > 0 ? 6 : 2));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0b6e6d";
      bars.forEach((h, i) => {
        const x = i * 8;
        ctx.fillRect(x, canvas.height / 2 - h / 2, 5, Math.max(3, h));
      });
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [micState, reduced]);

  return (
    <div className="neu-cluster" role="group" aria-label="Voice controls">
      <button
        type="button"
        className="neu-control"
        aria-pressed={micState !== "off"}
        onClick={toggleMic}
      >
        {micState === "off" ? <Mic size={20} aria-hidden="true" /> : <MicOff size={20} aria-hidden="true" />}
        <span className="text-[12px] font-bold uppercase tracking-wide">
          {micState === "off" ? "Mic off" : "Mic on"}
        </span>
      </button>

      <label className="neu-control cursor-pointer">
        <Volume2 size={20} aria-hidden="true" />
        <span className="text-[12px] font-bold uppercase tracking-wide">
          Volume {Math.round(volume * 100)}%
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="neu-range"
          style={{ ["--fill" as string]: `${volume * 100}%` }}
          aria-label="Speech volume"
        />
      </label>

      <label className="neu-control cursor-pointer">
        <Volume2 size={20} aria-hidden="true" className="opacity-70" />
        <span className="text-[12px] font-bold uppercase tracking-wide">Rate {rate.toFixed(2)}×</span>
        <input
          type="range"
          min={0.6}
          max={1.6}
          step={0.05}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="neu-range"
          style={{ ["--fill" as string]: `${((rate - 0.6) / 1) * 100}%` }}
          aria-label="Speech rate"
        />
      </label>

      <label className="neu-control cursor-pointer">
        <Languages size={20} aria-hidden="true" />
        <span className="sr-only">Speech language</span>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as VoiceLang)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-white px-2 py-2 text-[13px] font-bold text-[var(--color-primary-deep)]"
        >
          {LANG_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <div className="neu-control col-span-2 lg:col-span-4">
        <span className="text-[12px] font-bold uppercase tracking-wide">Live waveform</span>
        <canvas ref={canvasRef} className="h-[56px] w-[220px] max-w-full" aria-label="Live microphone waveform display" role="img" />
      </div>
    </div>
  );
}
