import type { Metadata } from "next";
import LegalLayout from "@components/LegalLayout";
import { SITE } from "@lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "What cookies Raphael Voice sets, why, and how to change your mind. Microphone permission is separate from cookie consent and is never requested by the banner.",
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="8 October 2026">
      <p>
        Cookies and localStorage entries used by this site, in plain language. Your choice is
        stored on your device and the banner will not reappear once you have decided.
      </p>

      <h2>1. Necessary (always on)</h2>
      <ul>
        <li>
          <strong>rv-cookie-consent</strong> (localStorage, 12 months) — remembers your cookie
          choice so we do not ask twice.
        </li>
        <li>
          <strong>Load-balancer session cookie</strong> (session) — keeps you on one server node.
        </li>
      </ul>

      <h2>2. Functional (opt-in)</h2>
      <ul>
        <li>
          <strong>rv-voice-settings</strong> (localStorage, 12 months) — your speech rate, volume
          and language (Swahili / English / Kikuyu).
        </li>
        <li>
          <strong>rv-intro-spoken</strong> (sessionStorage) — prevents the welcome sentence from
          repeating in one session.
        </li>
      </ul>

      <h2>3. Analytics (opt-in)</h2>
      <ul>
        <li>
          <strong>rv-live-board</strong> (server-side KV, 24 hours) — anonymous concurrent-session
          counters behind the live usage board. No cookies identify you; no audio is stored.
        </li>
      </ul>

      <h2>4. Third parties</h2>
      <p>
        Google reCAPTCHA sets its own cookies when a form is submitted, to compute a trust
        score. We do not run advertising or cross-site tracking cookies of any kind.
      </p>

      <h2>5. Microphone permission is NOT cookie consent</h2>
      <p>
        For clarity: the cookie banner never requests microphone access. The microphone is
        requested separately by your browser, only when you click a mic control, and can be
        revoked in your browser site settings at any time.
      </p>

      <h2>6. Changing your mind</h2>
      <p>
        Clear the entries above in your browser settings, or contact us at {SITE.email} and we
        will walk you through it. Withdrawing consent does not affect processing that happened
        while consent was valid.
      </p>
    </LegalLayout>
  );
}
