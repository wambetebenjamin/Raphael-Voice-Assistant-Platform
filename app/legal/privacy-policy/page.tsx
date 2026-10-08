import type { Metadata } from "next";
import LegalLayout from "@components/LegalLayout";
import { SITE } from "@lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Raphael Voice handles voice data, analytics data and account data — and your rights under the Kenya Data Protection Act 2019.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="8 October 2026">
      <p>
        This policy explains what {SITE.legalName} (“Raphael Voice”, “we”) collects, why we
        collect it, and the rights you hold under the <strong>Kenya Data Protection Act, 2019</strong>{" "}
        (KDPA) and, where applicable, the GDPR. It applies to this website and to the Raphael
        Voice widget and APIs.
      </p>

      <h2>1. Voice Data</h2>
      <p>
        <strong>Voice commands are processed locally in your browser and are NOT sent to any
        server.</strong> Speech recognition runs through your browser&apos;s Web Speech API on
        your device; the recognised text is matched against command patterns in page memory and
        then discarded. We do not record, transmit, store or train on your audio. No microphone
        is ever opened without an explicit click on a mic control, and closing the mic stops all
        processing immediately.
      </p>
      <p>
        Speech synthesis (the voice that reads pages to you) likewise runs on your device using
        your operating system&apos;s voices.
      </p>

      <h2>2. Analytics Data</h2>
      <p>
        If you accept analytics cookies, we count anonymous aggregate events: page views, demo
        activations and the number of concurrent voice sessions shown on our live board. These
        counts contain no audio, no transcripts, no IP addresses and no device fingerprints.
        Analytics is off by default and can be withdrawn at any time via{" "}
        <strong>Manage Preferences</strong> in the cookie banner.
      </p>

      <h2>3. User Account Data</h2>
      <p>
        When you apply for an API licence, subscribe to a plan, join the newsletter or contact
        us, we store the details you type: company, contact name, email, phone, use-case
        description, expected API volume and industry. This data is used solely to respond to
        you, provision licences and issue invoices. It is held in Vercel KV (EU/US regions,
        encrypted at rest) and in our email system, and is retained for 24 months after your
        last interaction unless a contract requires longer.
      </p>
      <p>
        Form submissions are protected by Google reCAPTCHA v3, which receives your IP address
        and browser signals in order to score the request; Google&apos;s own privacy policy
        governs that processing.
      </p>

      <h2>4. Cookies</h2>
      <p>
        We set a strictly necessary cookie-consent record, and — only with your consent —
        functional cookies that remember your voice rate, volume and language, plus the
        analytics counter described above. See our Cookie Policy for the full list.
      </p>

      <h2>5. Your Rights</h2>
      <p>Under the KDPA you may:</p>
      <ul>
        <li>request access to the personal data we hold about you;</li>
        <li>request correction of inaccurate data;</li>
        <li>request deletion (“right to be forgotten”) of your data;</li>
        <li>object to or restrict processing, including for marketing;</li>
        <li>data portability — receive your data in a machine-readable format;</li>
        <li>withdraw consent at any time, without affecting prior lawful processing;</li>
        <li>complain to the Office of the Data Protection Commissioner (ODPC), Kenya.</li>
      </ul>
      <p>
        We answer verified requests within 30 days at no cost. Because voice data never leaves
        your device, there is no voice data for us to disclose or delete.
      </p>

      <h2>6. International transfers</h2>
      <p>
        Hosting and KV storage run on Vercel&apos;s infrastructure. Where data leaves Kenya we
        rely on KDPA section 48 safeguards (adequate jurisdiction or contractual protections).
      </p>

      <h2>7. Contact</h2>
      <p>
        Data Protection contact: {SITE.email} · {SITE.phone} · {SITE.address}. Our Data
        Protection Officer responds within 14 days.
      </p>
    </LegalLayout>
  );
}
