"use client";

import { useRef, useState, type FormEvent } from "react";
import { MessageCircle, Send } from "lucide-react";
import { CALL_BANDS, INDUSTRIES } from "@lib/site";
import { captchaEnabled, captchaV2Available, getCaptchaToken, renderCaptchaV2 } from "@lib/captcha";

type Reply = {
  ok?: boolean;
  id?: string;
  whatsappUrl?: string;
  requiresChallenge?: boolean;
  error?: string;
  captchaDisabled?: boolean;
};

/** API licence application (section 12) — saves, then offers WhatsApp + email. */
export default function LicenceForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [needsChallenge, setNeedsChallenge] = useState(false);
  const v2Ref = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const post = async (body: Record<string, unknown>, v2Token?: string) => {
    const token = v2Token ?? (await getCaptchaToken("licence"));
    const res = await fetch("/api/licence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, captchaToken: token, captchaV2Token: v2Token ?? null }),
    });
    const json = (await res.json()) as Reply;
    return { res, json };
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setMessage("");
    setNeedsChallenge(false);
    try {
      let { res, json } = await post(data);
      if (res.status === 409 && json.requiresChallenge && captchaV2Available && v2Ref.current) {
        setStatus("idle");
        setNeedsChallenge(true);
        setMessage("Low trust score — please tick the checkbox to continue.");
        const v2Token = await renderCaptchaV2(v2Ref.current);
        setStatus("sending");
        const retry = await post(data, v2Token);
        res = retry.res;
        json = retry.json;
      }
      if (res.ok && json.ok) {
        setStatus("ok");
        setWhatsappUrl(json.whatsappUrl ?? null);
        setMessage(
          `Application ${json.id} received. We reply by email within one business day — or continue on WhatsApp now.`
        );
        form.reset();
      } else {
        setStatus("error");
        setMessage(json.error || "Could not submit the application. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <section id="licence" className="section-pad scroll-mt-32 bg-[var(--color-theme-light)]" aria-labelledby="licence-title">
      <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="meta">API licence application</p>
          <h2 id="licence-title" className="h2 mt-2">
            Put a voice in your product
          </h2>
          <p className="mt-4 max-w-[52ch] text-[16px]">
            Tell us what you are building and how many conversations you expect. We provision
            keys, send the integration pack and pair you with an accessibility engineer.
          </p>
          <p className="mt-4 text-[13px] text-[var(--color-ink-soft)]">
            Protected by reCAPTCHA v3{captchaEnabled ? "" : " (keys not configured in this environment — verification disabled)"};
            suspicious submissions get a checkbox challenge.
          </p>
        </div>

        <form ref={formRef} onSubmit={(e) => void onSubmit(e)} className="card-surface grid gap-4 p-6 sm:grid-cols-2 lg:p-8">
          <div>
            <label className="field-label" htmlFor="lf-company">Company name</label>
            <input id="lf-company" name="company" required className="field-input" autoComplete="organization" />
          </div>
          <div>
            <label className="field-label" htmlFor="lf-name">Contact name</label>
            <input id="lf-name" name="contactName" required className="field-input" autoComplete="name" />
          </div>
          <div>
            <label className="field-label" htmlFor="lf-email">Email</label>
            <input id="lf-email" name="email" type="email" required className="field-input" autoComplete="email" />
          </div>
          <div>
            <label className="field-label" htmlFor="lf-phone">Phone</label>
            <input id="lf-phone" name="phone" type="tel" required className="field-input" autoComplete="tel" placeholder="+254…" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="lf-usecase">Use case description</label>
            <textarea id="lf-usecase" name="useCase" required className="field-input" placeholder="e.g. voice-driven bill payment for our banking app…" />
          </div>
          <div>
            <label className="field-label" htmlFor="lf-calls">Expected monthly API calls</label>
            <select id="lf-calls" name="expectedCalls" required className="field-input">
              <option value="">Select…</option>
              {CALL_BANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="lf-industry">Industry</label>
            <select id="lf-industry" name="industry" required className="field-input">
              <option value="">Select…</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          {needsChallenge && captchaEnabled ? <div ref={v2Ref} className="sm:col-span-2" /> : null}
          <div className="sm:col-span-2">
            <button type="submit" className="btn btn-primary w-full" disabled={status === "sending"}>
              <Send size={15} aria-hidden="true" /> {status === "sending" ? "Submitting…" : "Submit application"}
            </button>
          </div>
          <p className={`sm:col-span-2 text-[14px] ${status === "error" ? "text-[#a4343a]" : "text-[var(--color-primary-deep)]"}`} role="status">
            {message}
          </p>
          {whatsappUrl ? (
            <div className="sm:col-span-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
                <MessageCircle size={15} aria-hidden="true" /> Continue on WhatsApp
              </a>
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
