"use client";

import { useRef, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { captchaEnabled, captchaV2Available, getCaptchaToken, renderCaptchaV2 } from "@lib/captcha";

type ApiReply = {
  ok?: boolean;
  requiresChallenge?: boolean;
  error?: string;
  captchaDisabled?: boolean;
};

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [needsChallenge, setNeedsChallenge] = useState(false);
  const v2Ref = useRef<HTMLDivElement>(null);

  const post = async (v2Token?: string) => {
    const token = v2Token ?? (await getCaptchaToken("newsletter"));
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, captchaToken: token, captchaV2Token: v2Token ?? null }),
    });
    const json = (await res.json()) as ApiReply;
    return { res, json };
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    setNeedsChallenge(false);
    try {
      let { res, json } = await post();
      if (res.status === 409 && json.requiresChallenge && captchaV2Available && v2Ref.current) {
        // v3 score below 0.5 → interactive v2 checkbox fallback.
        setStatus("idle");
        setNeedsChallenge(true);
        setMessage("One more step: tick the checkbox to confirm you are human.");
        const v2Token = await renderCaptchaV2(v2Ref.current);
        setStatus("sending");
        const retry = await post(v2Token);
        res = retry.res;
        json = retry.json;
      }
      if (res.ok && json.ok) {
        setStatus("ok");
        setMessage("Karibu! Check your inbox to confirm your subscription.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(json.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <form onSubmit={(e) => void onSubmit(e)} className={compact ? "flex flex-col gap-2" : "flex flex-col gap-3 sm:flex-row sm:items-end"} noValidate>
      <div className={compact ? "" : "flex-1"}>
        <label className="field-label" htmlFor={compact ? "nl-email-c" : "nl-email"}>
          Email address
        </label>
        <input
          id={compact ? "nl-email-c" : "nl-email"}
          type="email"
          required
          autoComplete="email"
          className="field-input"
          placeholder="you@example.co.ke"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
        <Send size={14} aria-hidden="true" /> {status === "sending" ? "Signing up…" : "Sign up"}
      </button>
      <p
        className={`w-full text-[13px] ${status === "error" ? "text-[#a4343a]" : "text-[var(--color-primary-ink)]"}`}
        role="status"
      >
        {message}
      </p>
      {needsChallenge && captchaEnabled ? <div ref={v2Ref} className="mt-1" /> : null}
    </form>
  );
}
