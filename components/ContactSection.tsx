"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { SITE, WHATSAPP_LINK } from "@lib/site";
import { captchaEnabled, captchaV2Available, getCaptchaToken, renderCaptchaV2 } from "@lib/captcha";

type Reply = { ok?: boolean; requiresChallenge?: boolean; error?: string };

/** Contact section (15) — voice command "Contact us" opens & focuses this form. */
export default function ContactSection() {
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const v2Ref = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [needsChallenge, setNeedsChallenge] = useState(false);

  useEffect(() => {
    const onVoice = () => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => firstFieldRef.current?.focus({ preventScroll: true }), 350);
    };
    window.addEventListener("raphael:open-contact", onVoice);
    return () => window.removeEventListener("raphael:open-contact", onVoice);
  }, []);

  const post = async (body: Record<string, unknown>, v2Token?: string) => {
    const token = v2Token ?? (await getCaptchaToken("contact"));
    const res = await fetch("/api/contact", {
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
    setNeedsChallenge(false);
    try {
      let { res, json } = await post(data);
      if (res.status === 409 && json.requiresChallenge && captchaV2Available && v2Ref.current) {
        setStatus("idle");
        setNeedsChallenge(true);
        setMessage("Please tick the checkbox to confirm you are human.");
        const v2Token = await renderCaptchaV2(v2Ref.current);
        setStatus("sending");
        const retry = await post(data, v2Token);
        res = retry.res;
        json = retry.json;
      }
      if (res.ok && json.ok) {
        setStatus("ok");
        setMessage("Asante! Your message is with our team — we reply within one business day.");
        form.reset();
      } else {
        setStatus("error");
        setMessage(json.error || "Could not send. Please try again or use WhatsApp.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again or use WhatsApp.");
    }
  };

  return (
    <section id="contact" className="section-pad scroll-mt-32 bg-white" aria-labelledby="contact-title">
      <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="meta">Contact</p>
          <h2 id="contact-title" className="h2 mt-2">
            Talk to a human, any way you like
          </h2>
          <ul className="mt-6 space-y-4 text-[15px]">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-1 shrink-0 text-[var(--color-primary-ink)]" aria-hidden="true" />
              {SITE.address}
            </li>
            <li>
              <a href={SITE.phoneHref} className="flex items-center gap-3 font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary-deep)]">
                <Phone size={18} className="text-[var(--color-primary-ink)]" aria-hidden="true" /> {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary-deep)]">
                <Mail size={18} className="text-[var(--color-primary-ink)]" aria-hidden="true" /> {SITE.email}
              </a>
            </li>
            <li>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary-deep)]">
                <MessageCircle size={18} className="text-[var(--color-whatsapp-ink)]" aria-hidden="true" /> WhatsApp: +{SITE.whatsappNumber}
              </a>
            </li>
          </ul>
          <p className="mt-6 rounded-lg bg-[var(--color-theme-light)] p-4 text-[14px]">
            Voice users: say <strong>“contact us”</strong> from anywhere and this form opens with
            the first field focused.
          </p>
        </div>

        <form ref={formRef} onSubmit={(e) => void onSubmit(e)} className="card-surface grid gap-4 p-6 lg:p-8">
          <div>
            <label className="field-label" htmlFor="ct-name">Your name</label>
            <input id="ct-name" name="name" required ref={firstFieldRef} className="field-input" autoComplete="name" />
          </div>
          <div>
            <label className="field-label" htmlFor="ct-email">Email</label>
            <input id="ct-email" name="email" type="email" required className="field-input" autoComplete="email" />
          </div>
          <div>
            <label className="field-label" htmlFor="ct-message">Message</label>
            <textarea id="ct-message" name="message" required className="field-input" placeholder="How can we help?" />
          </div>
          {needsChallenge && captchaEnabled ? <div ref={v2Ref} /> : null}
          <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
            <Send size={15} aria-hidden="true" /> {status === "sending" ? "Sending…" : "Send message"}
          </button>
          <p className={`text-[14px] ${status === "error" ? "text-[#a4343a]" : "text-[var(--color-primary-deep)]"}`} role="status">
            {message}
          </p>
        </form>
      </div>
    </section>
  );
}
