"use client";

import { useState, type FormEvent } from "react";
import { Keyboard, Mic, MicOff } from "lucide-react";
import { useVoice } from "@lib/voice/VoiceProvider";

const STATE_COPY: Record<string, string> = {
  off: "Mic off",
  listening: "Listening...",
  processing: "Processing...",
  command: "Command received.",
};

/** Global voice activation bar — always visible, full width, above the nav. */
export default function VoiceActivationBar() {
  const { micState, lastCommand, toggleMic, supported, runTextCommand, transcript } = useVoice();
  const [typed, setTyped] = useState("");
  const [hint, setHint] = useState<string | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!typed.trim()) return;
    const ok = runTextCommand(typed);
    setHint(ok ? null : "Not recognised — try “go home”, “open services” or “play demo”.");
    if (ok) setTyped("");
  };

  return (
    <div className="voice-bar" data-state={micState}>
      <div className="container-site flex min-h-[var(--bar-h)] flex-wrap items-center gap-x-4 gap-y-1 py-1">
        <div className="voice-bar-wave" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <p className="text-[12px] font-bold tracking-wide text-white" aria-live="off">
          {STATE_COPY[micState]}
          {micState === "command" && lastCommand ? (
            <span className="ml-2 text-[#7fe0df]">“{lastCommand}”</span>
          ) : null}
          {micState === "listening" && transcript ? (
            <span className="ml-2 hidden font-normal text-white/70 sm:inline">
              {transcript.slice(-38)}
            </span>
          ) : null}
        </p>

        <form onSubmit={onSubmit} className="ml-auto flex items-center gap-2" data-space-allowed>
          <label className="sr-only" htmlFor="typed-command">
            Type a voice command (text fallback)
          </label>
          <input
            id="typed-command"
            className="h-8 w-[130px] rounded-full border border-white/25 bg-white/10 px-3 text-[12px] text-white placeholder:text-white/55 focus:border-[#7fe0df] sm:w-[210px]"
            placeholder="Type a command…"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
          />
          <button
            type="submit"
            className="h-8 rounded-full px-3 text-[12px] font-bold text-[#062f2f] bg-[#7fe0df] hover:bg-white transition-colors"
          >
            Send
          </button>
        </form>

        <button
          type="button"
          onClick={toggleMic}
          aria-pressed={micState !== "off"}
          aria-label={micState === "off" ? "Turn microphone on" : "Turn microphone off"}
          className="flex h-9 min-w-9 items-center justify-center gap-2 rounded-full border border-white/30 px-3 text-[12px] font-bold text-white transition-colors hover:bg-white/15"
          title={supported ? "Toggle microphone (Space)" : "Voice recognition unsupported here"}
        >
          {micState === "off" ? <Mic size={16} aria-hidden="true" /> : <MicOff size={16} aria-hidden="true" />}
          <span className="hidden sm:inline">{micState === "off" ? "Mic" : "Stop"}</span>
        </button>

        <p className="hidden items-center gap-1 text-[11px] text-white/70 lg:flex">
          <Keyboard size={13} aria-hidden="true" /> Space toggles the mic
        </p>
      </div>
      {hint ? (
        <p className="container-site pb-1 text-[11px] text-[#ffd9d9]" role="alert">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
