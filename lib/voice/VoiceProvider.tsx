"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSpeechRecognition, useSpeechSynthesis } from "react-speech-kit";
import { CONFIRMATIONS, matchCommand, type IntentId } from "./commands";
import { startAudioBus, stopAudioBus } from "./audio-bus";
import { WHATSAPP_LINK } from "../site";

export type MicState = "off" | "listening" | "processing" | "command";
export type VoiceLang = "sw-KE" | "en-KE" | "ki-KE";

export const LANG_OPTIONS: { value: VoiceLang; label: string }[] = [
  { value: "sw-KE", label: "Swahili" },
  { value: "en-KE", label: "English" },
  { value: "ki-KE", label: "Kikuyu" },
];

interface VoiceContextValue {
  micState: MicState;
  transcript: string;
  lastCommand: string | null;
  supported: boolean;
  ttsSupported: boolean;
  speaking: boolean;
  hasActivated: boolean;
  rate: number;
  volume: number;
  lang: VoiceLang;
  announcement: string;
  setRate: (n: number) => void;
  setVolume: (n: number) => void;
  setLang: (l: VoiceLang) => void;
  toggleMic: () => void;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  runTextCommand: (text: string) => boolean;
  readPage: () => void;
  announce: (message: string) => void;
}

const VoiceContext = createContext<VoiceContextValue | null>(null);

export function useVoice(): VoiceContextValue {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error("useVoice must be used inside <VoiceProvider>");
  return ctx;
}

const HERO_SUBTEXT =
  "Voice navigation. Screen reader enhancement. Accessible interfaces for every East African user.";

export function VoiceProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [micState, setMicState] = useState<MicState>("off");
  const [transcript, setTranscript] = useState("");
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [hasActivated, setHasActivated] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [lang, setLang] = useState<VoiceLang>("en-KE");

  const processedRef = useRef(0);
  const wasListeningRef = useRef(false);
  const speechEndRef = useRef<() => void>(() => undefined);
  /**
   * react-speech-kit binds its callbacks at listen() time, which captures a
   * stale render. Recognition results therefore travel through this ref so the
   * freshest render's handler always runs.
   */
  const onResultRef = useRef<(text: string) => void>(() => undefined);
  const toggleRef = useRef<() => void>(() => undefined);

  // ── speech synthesis ──────────────────────────────────────────────────────
  const {
    speak: speakKit,
    cancel,
    speaking,
    supported: ttsSupported,
    voices,
  } = useSpeechSynthesis({
    onEnd: () => speechEndRef.current(),
  });

  function speakText(text: string, then?: () => void) {
    if (!ttsSupported || !text) {
      then?.();
      return;
    }
    speechEndRef.current = then ?? (() => undefined);
    const prefix = lang.split("-")[0];
    const voice = voices.find((v) => v.lang?.toLowerCase().startsWith(prefix));
    // Recognition is paused while Raphael talks so he never hears himself.
    speakKit({ text, rate, volume, voice: voice ?? null });
  }

  // ── recognition ───────────────────────────────────────────────────────────
  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult: (text: string) => onResultRef.current(text),
    onError: (event: { error: string }) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setMicState("off");
        setAnnouncement("Microphone permission was declined. You can still type commands.");
      }
    },
  });

  function beginListening() {
    processedRef.current = 0;
    setTranscript("");
    setMicState("listening");
    listen({ lang, continuous: true, interimResults: true });
    void startAudioBus();
  }

  function endListening() {
    if (listening) stop();
    stopAudioBus();
    setMicState("off");
  }

  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.querySelector<HTMLElement>("a, button, input, textarea, select, [tabindex]")?.focus({
      preventScroll: true,
    });
  }

  function executeIntent(intent: IntentId, label: string) {
    setLastCommand(label);
    setMicState("processing");
    wasListeningRef.current = micState === "listening" || listening;
    if (listening) stop();
    stopAudioBus();

    const resume = () => {
      if (wasListeningRef.current && intent !== "mic-off" && intent !== "stop-reading") {
        beginListening();
      } else {
        setMicState("off");
      }
    };

    const onHome = pathname === "/";
    const jump = (id: string) => {
      if (!onHome) router.push("/");
      window.setTimeout(() => scrollToId(id), onHome ? 0 : 350);
    };

    switch (intent) {
      case "home":
        router.push("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "features":
        jump("features");
        break;
      case "pricing":
        router.push("/pricing");
        break;
      case "developers":
        router.push("/developers");
        break;
      case "about":
        router.push("/about");
        break;
      case "contact":
        jump("contact");
        window.dispatchEvent(new CustomEvent("raphael:open-contact"));
        break;
      case "read":
        speakText(
          (document.getElementById("main-content")?.innerText ?? "")
            .replace(/\s+/g, " ")
            .slice(0, 4000) || "There is nothing to read on this page.",
          resume
        );
        return;
      case "stop-reading":
        cancel();
        setMicState("off");
        setAnnouncement("Speech stopped.");
        return;
      case "read-slower":
        setRate((r) => Math.max(0.6, Number((r - 0.2).toFixed(2))));
        break;
      case "read-faster":
        setRate((r) => Math.min(1.6, Number((r + 0.2).toFixed(2))));
        break;
      case "scroll-down":
        window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
        break;
      case "scroll-up":
        window.scrollBy({ top: -window.innerHeight * 0.85, behavior: "smooth" });
        break;
      case "demo":
        jump("demo");
        window.dispatchEvent(new CustomEvent("raphael:activate-demo"));
        break;
      case "stop-demo":
        window.dispatchEvent(new CustomEvent("raphael:stop-demo"));
        break;
      case "immersive":
        window.dispatchEvent(new CustomEvent("raphael:immersive-on"));
        break;
      case "exit-immersive":
        window.dispatchEvent(new CustomEvent("raphael:immersive-off"));
        break;
      case "menu":
        window.dispatchEvent(new CustomEvent("raphael:open-menu"));
        break;
      case "whatsapp":
        window.open(WHATSAPP_LINK, "_blank", "noopener");
        break;
      case "licence":
        jump("licence");
        break;
      case "newsletter":
        jump("newsletter");
        break;
      case "mic-off":
        setMicState("off");
        break;
    }

    setMicState("command");
    setAnnouncement(`Command received: ${label}`);
    speakText(CONFIRMATIONS[intent], resume);
  }

  function startListening() {
    if (!supported) {
      setAnnouncement(
        "Voice recognition is not supported in this browser. You can type commands instead."
      );
      return;
    }
    setHasActivated(true);
    beginListening();
    setAnnouncement("Microphone on. Listening.");
    if (!sessionStorage.getItem("rv-intro-spoken")) {
      sessionStorage.setItem("rv-intro-spoken", "1");
      // Brief: voice reads the hero subtext aloud when the mic is activated.
      window.setTimeout(() => speakText(HERO_SUBTEXT), 450);
    }
  }

  function toggleMic() {
    if (micState === "off") startListening();
    else {
      endListening();
      setAnnouncement("Microphone off.");
    }
  }

  function runTextCommand(text: string): boolean {
    const hit = matchCommand(text);
    if (!hit) {
      speakText(
        `I did not recognise “${text}”. Try one of: go home, open services, contact us, read this page, scroll down, play demo.`
      );
      return false;
    }
    setHasActivated(true);
    executeIntent(hit.intent, hit.label);
    return true;
  }

  const announce = (message: string) => setAnnouncement(message);

  // Keep the freshest recognition handler reachable from the kit's callback.
  useEffect(() => {
    onResultRef.current = (text: string) => {
      setTranscript(text);
      const delta = text.slice(processedRef.current);
      processedRef.current = text.length;
      const hit = matchCommand(delta) ?? (delta.length > 24 ? matchCommand(text) : null);
      if (hit) executeIntent(hit.intent, hit.label);
    };
  });

  // Spacebar shortcut — outside text fields only (never autoplays anything).
  useEffect(() => {
    toggleRef.current = toggleMic;
  });
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable ||
        target.closest("[data-space-allowed]")
      )
        return;
      event.preventDefault();
      toggleRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Load saved voice settings after hydration (server has no localStorage, so
  // this must run post-mount to keep SSR and the first client render identical).
  useEffect(() => {
    try {
      const raw = localStorage.getItem("rv-voice-settings");
      if (raw) {
        const saved = JSON.parse(raw) as {
          rate?: number;
          volume?: number;
          lang?: VoiceLang;
        };
        // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate post-hydration sync from localStorage
        if (typeof saved.rate === "number") setRate(saved.rate);
        if (typeof saved.volume === "number") setVolume(saved.volume);
        if (saved.lang) setLang(saved.lang);
      }
    } catch {
      /* first run */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("rv-voice-settings", JSON.stringify({ rate, volume, lang }));
    } catch {
      /* private mode */
    }
  }, [rate, volume, lang]);

  const value: VoiceContextValue = {
    micState,
    transcript,
    lastCommand,
    supported,
    ttsSupported,
    speaking,
    hasActivated,
    rate,
    volume,
    lang,
    announcement,
    setRate,
    setVolume,
    setLang,
    toggleMic,
    startListening,
    stopListening: endListening,
    speak: (text: string) => speakText(text),
    stopSpeaking: () => {
      cancel();
      setAnnouncement("Speech stopped.");
    },
    runTextCommand,
    readPage: () => executeIntent("read", "Read this page"),
    announce,
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
    </VoiceContext.Provider>
  );
}
