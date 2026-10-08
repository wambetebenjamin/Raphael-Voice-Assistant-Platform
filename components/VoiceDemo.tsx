"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AudioLines, Send, X } from "lucide-react";
import NeumorphicCluster from "@components/NeumorphicCluster";
import { useVoice } from "@lib/voice/VoiceProvider";

/**
 * EFFECT-03 — the demo bay "Try Raphael Voice".
 * Strictly opt-in: nothing starts until "Activate Voice Demo" is pressed.
 * Optional WebXR "Enter Immersive Voice Mode" (graceful overlay when WebXR is
 * unavailable). A persistent, always-focusable Exit control is present.
 * Unsupported browsers get a text command input whose responses are spoken
 * with SpeechSynthesis.
 */
export default function VoiceDemo() {
  const { startListening, stopListening, micState, runTextCommand, supported, transcript, announce } =
    useVoice();
  const [activated, setActivated] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const [xrNote, setXrNote] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const exitRef = useRef<HTMLButtonElement>(null);
  const logged = useRef(false);

  const activate = useCallback(() => {
    setActivated(true);
    startListening();
    if (!logged.current) {
      logged.current = true;
      void fetch("/api/demo/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startedAt: new Date().toISOString() }),
      }).catch(() => undefined);
    }
  }, [startListening]);

  const deactivate = useCallback(() => {
    setActivated(false);
    setImmersive(false);
    stopListening();
  }, [stopListening]);

  const enterImmersive = useCallback(async () => {
    setActivated(true);
    const xr = (navigator as Navigator & { xr?: { isSessionSupported: (m: string) => Promise<boolean>; requestSession: (m: string) => Promise<unknown> } }).xr;
    if (xr) {
      try {
        const ok = await xr.isSessionSupported("inline");
        if (ok) await xr.requestSession("inline");
        setXrNote(null);
      } catch {
        setXrNote("WebXR session could not start here — continuing in voice-only overlay mode.");
      }
    } else {
      setXrNote("WebXR is not available in this browser — continuing in voice-only overlay mode.");
    }
    setImmersive(true);
    window.setTimeout(() => exitRef.current?.focus(), 60);
    announce("Immersive voice mode on. Press Exit at any time.");
  }, [announce]);

  // voice command hooks
  useEffect(() => {
    const on = () => activate();
    const off = () => deactivate();
    const xrOn = () => void enterImmersive();
    const xrOff = () => setImmersive(false);
    window.addEventListener("raphael:activate-demo", on);
    window.addEventListener("raphael:stop-demo", off);
    window.addEventListener("raphael:immersive-on", xrOn);
    window.addEventListener("raphael:immersive-off", xrOff);
    return () => {
      window.removeEventListener("raphael:activate-demo", on);
      window.removeEventListener("raphael:stop-demo", off);
      window.removeEventListener("raphael:immersive-on", xrOn);
      window.removeEventListener("raphael:immersive-off", xrOff);
    };
  }, [activate, deactivate, enterImmersive]);

  const onTyped = (event: FormEvent) => {
    event.preventDefault();
    if (!typed.trim()) return;
    runTextCommand(typed);
    setTyped("");
  };

  return (
    <section id="demo" className="scroll-mt-32 bg-[var(--color-theme-light)] section-pad" aria-labelledby="demo-title">
      <div className="container-site">
        <p className="meta">Interactive voice demo</p>
        <h2 id="demo-title" className="h2 mt-2">
          Try Raphael Voice
        </h2>
        <p className="mt-3 max-w-[60ch] text-[16px]">
          Nothing listens until you say so. Press <strong>Activate Voice Demo</strong> and your
          browser — not us — will ask for microphone permission.
        </p>

        <div className="card-surface mt-8 grid gap-8 p-6 lg:grid-cols-[1fr_1fr] lg:p-10">
          <div>
            {!activated ? (
              <div className="flex flex-col items-start gap-4">
                <button type="button" className="btn btn-primary" onClick={activate}>
                  <AudioLines size={16} aria-hidden="true" /> Activate Voice Demo
                </button>
                <p className="text-[13px] text-[var(--color-ink-soft)]">
                  Opt-in only. The microphone is requested by your browser at this moment and
                  never before. Audio is processed locally and never uploaded.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[15px] font-bold text-[var(--color-primary-deep)]" role="status">
                  {micState === "listening"
                    ? "Listening — try “read this page” or “scroll down”."
                    : micState === "processing"
                      ? "Processing…"
                      : "Demo ready."}
                </p>
                {transcript ? (
                  <p className="rounded-lg bg-white p-3 text-[14px] italic text-[var(--color-text)]">
                    “{transcript.slice(-120)}”
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  <button type="button" className="btn btn-outline" onClick={() => void enterImmersive()}>
                    Enter Immersive Voice Mode
                  </button>
                  <button ref={exitRef} type="button" className="btn btn-ghost" onClick={deactivate}>
                    <X size={15} aria-hidden="true" /> Exit
                  </button>
                </div>
                {xrNote ? (
                  <p className="text-[13px] text-[var(--color-ink-soft)]" role="status">
                    {xrNote}
                  </p>
                ) : null}
              </div>
            )}

            <form onSubmit={onTyped} className="mt-6" data-space-allowed>
              <label className="field-label" htmlFor="demo-typed">
                Text command fallback (for browsers without speech recognition)
              </label>
              <div className="flex gap-2">
                <input
                  id="demo-typed"
                  className="field-input"
                  placeholder="e.g. read this page"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" aria-label="Run typed command">
                  <Send size={15} aria-hidden="true" />
                </button>
              </div>
              {!supported ? (
                <p className="mt-2 text-[13px] text-[#a4343a]">
                  Speech recognition is unsupported in this browser — the text fallback above
                  gives you the full experience, spoken back with SpeechSynthesis.
                </p>
              ) : null}
            </form>
          </div>

          <NeumorphicCluster />
        </div>
      </div>

      {immersive ? (
        <div
          className="fixed inset-0 z-[85] grid place-items-center bg-[#062f2f]/95 p-6 text-center text-white"
          role="dialog"
          aria-modal="true"
          aria-label="Immersive voice mode"
        >
          <div className="max-w-lg">
            <p className="meta text-[#7fe0df]">Immersive voice mode</p>
            <p className="mt-4 text-[20px] leading-relaxed">
              {micState === "listening"
                ? `Hearing you: “${transcript.slice(-80) || "…"}”`
                : "Microphone is off. Press the mic or Space to speak."}
            </p>
            <p className="mt-3 text-[13px] text-white/70">
              Say “exit immersive mode”, “go home” or “read this page”.
            </p>
            <button
              ref={exitRef}
              type="button"
              className="btn mt-6 border-white/40 bg-white/10 text-white hover:bg-white/20"
              onClick={() => setImmersive(false)}
            >
              <X size={15} aria-hidden="true" /> Exit immersive mode
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
