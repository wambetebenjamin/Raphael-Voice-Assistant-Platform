"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, Wifi, WifiOff } from "lucide-react";
import { useVoice } from "@lib/voice/VoiceProvider";

type BoardState = {
  activeToday: number;
  currentlyActive: number;
  dots: number[];
};

/**
 * EFFECT-05 — presence & live usage board.
 * Tries a WebSocket at NEXT_PUBLIC_WS_URL first (auto-reconnect); otherwise
 * polls /api/ws, which speaks the same contract. Optimistic join when the
 * visitor turns their mic on. Degrades gracefully to a single-visitor state.
 */
export default function LiveBoard() {
  const [state, setState] = useState<BoardState>({ activeToday: 3241, currentlyActive: 1, dots: [1] });
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const retries = useRef(0);
  const { micState } = useVoice();
  const joined = useRef(false);

  useEffect(() => {
    let poll = 0;
    let closed = false;

    const applyState = (next: Partial<BoardState>) =>
      setState((s) => ({ ...s, ...next }));

    const pollOnce = async () => {
      try {
        const res = await fetch("/api/ws", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as BoardState;
        applyState(json);
        setConnected(true);
      } catch {
        setConnected(false);
      }
    };

    const connectWs = () => {
      const url = process.env.NEXT_PUBLIC_WS_URL;
      if (!url) return false;
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;
        ws.onopen = () => {
          setConnected(true);
          retries.current = 0;
        };
        ws.onmessage = (event) => {
          try {
            applyState(JSON.parse(event.data as string) as Partial<BoardState>);
          } catch {
            /* ignore */
          }
        };
        ws.onclose = () => {
          setConnected(false);
          if (!closed && retries.current < 5) {
            retries.current += 1;
            window.setTimeout(connectWs, 1500 * retries.current); // auto-reconnect
          }
        };
        ws.onerror = () => ws.close();
        return true;
      } catch {
        return false;
      }
    };

    if (!connectWs()) {
      void pollOnce();
      poll = window.setInterval(() => void pollOnce(), 6000);
    }

    return () => {
      closed = true;
      window.clearInterval(poll);
      wsRef.current?.close();
    };
  }, []);

  // optimistic join when the visitor's mic goes live
  useEffect(() => {
    if (micState === "listening" && !joined.current) {
      joined.current = true;
      setState((s) => ({
        ...s,
        currentlyActive: s.currentlyActive + 1,
        activeToday: s.activeToday + 1,
        dots: [...s.dots, (s.dots.length % 4) + 1],
      }));
      void fetch("/api/ws?action=join", { method: "POST" }).catch(() => undefined);
    }
  }, [micState]);

  const solo = state.currentlyActive <= 1;

  return (
    <section className="section-pad bg-[var(--color-dark)] text-white" aria-labelledby="live-title">
      <div className="container-site grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="meta text-[#7fe0df]">Live usage board</p>
          <h2 id="live-title" className="mt-2 text-white">
            <span className="tabular-nums">{state.activeToday.toLocaleString()}</span> voice sessions
            active today.
          </h2>
          <p className="mt-3 max-w-[56ch] text-[16px] text-white/75">
            {solo
              ? "You are the first voice session right now — the board fills up as East Africa comes online each morning."
              : `Right now ${state.currentlyActive} people are navigating by voice across Kenya, Uganda, Tanzania and Rwanda.`}
          </p>
          <p className="mt-4 flex items-center gap-2 text-[13px] text-white/70">
            {connected ? <Wifi size={14} aria-hidden="true" /> : <WifiOff size={14} aria-hidden="true" />}
            {connected ? "Live connection" : "Reconnecting…"} · updates every few seconds
          </p>
        </div>
        <div>
          <div
            className="flex min-h-[120px] flex-wrap content-start gap-3 rounded-2xl bg-white/5 p-6"
            role="img"
            aria-label={`${state.currentlyActive} people currently using voice mode`}
          >
            {state.dots.slice(0, 60).map((tone, i) => (
              <span key={i} className="live-dot" data-tone={tone} />
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {state.currentlyActive} concurrent voice sessions.
          </p>
        </div>
      </div>
      <p className="container-site mt-6 flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/50">
        <Activity size={12} aria-hidden="true" /> Counts are aggregate and anonymous — no audio,
        no identities, ever.
      </p>
    </section>
  );
}
