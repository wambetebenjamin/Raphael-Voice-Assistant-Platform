import type { Metadata } from "next";
import LegalLayout from "@components/LegalLayout";
import { SITE } from "@lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Raphael Voice terms: API licence terms, usage limits, acceptable use and governing law (Kenya).",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="8 October 2026">
      <p>
        These terms govern your use of the Raphael Voice website, widget and APIs. By creating
        an account, applying for a licence or embedding our widget you accept them.
      </p>

      <h2>1. API Licence Terms</h2>
      <ul>
        <li>
          Licences are granted per environment (production / test) and are personal to the
          licensee; keys may not be shared, resold or embedded in public repositories.
        </li>
        <li>
          Community licences are free for non-commercial evaluation and carry no uptime SLA.
          Professional and Enterprise licences include the SLA stated on your order form.
        </li>
        <li>
          Fees are quoted in Kenya Shillings, exclusive of 16% VAT, billed monthly or annually in
          advance. Annual plans carry a two-month discount and are non-refundable after 30 days.
        </li>
        <li>
          We may update the APIs with 60 days&apos; notice for breaking changes; versioned
          endpoints remain available for 12 months after deprecation notice.
        </li>
        <li>
          You retain ownership of your applications and data; we retain ownership of the Raphael
          Voice software, widget and documentation, licensed to you for the licence term.
        </li>
      </ul>

      <h2>2. Usage Limits</h2>
      <ul>
        <li>Community: 1,000 API calls/month, 60 requests/minute.</li>
        <li>Professional: 50,000 API calls/month, 600 requests/minute.</li>
        <li>Enterprise: as contracted. Overage is billed per 1,000 calls at the published rate.</li>
        <li>
          Fair use: licences may not be used to proxy traffic for unlicensed third parties. We
          may throttle abusive patterns with 24 hours&apos; notice except in security incidents.
        </li>
      </ul>

      <h2>3. Acceptable Use</h2>
      <ul>
        <li>
          You must not use voice synthesis to impersonate real persons, produce deceptive
          political content, or generate unlawful, harassing or discriminatory speech.
        </li>
        <li>
          You must surface an accessible opt-in: microphone access may only be requested after an
          explicit user action, and a non-voice equivalent must exist for every voice feature.
        </li>
        <li>
          You must not attempt to extract, scrape or reverse-engineer the voice models, keys or
          security controls, nor interfere with rate limits or audit logging.
        </li>
        <li>
          You are responsible for obtaining consents required in your jurisdiction for the
          personal data you process through the APIs.
        </li>
      </ul>

      <h2>4. Accessibility warranty</h2>
      <p>
        We warrant that the widget conforms to WCAG 2.2 AA at the time of each release. If a
        regression is reported we fix it within 30 days for Professional and Enterprise
        customers.
      </p>

      <h2>5. Liability</h2>
      <p>
        The service is provided “as available”. To the maximum extent permitted by Kenyan law,
        our aggregate liability in any 12-month period is limited to the fees you paid in that
        period. Nothing limits liability for fraud, death or personal injury caused by
        negligence, or data-protection fines arising from our own breach.
      </p>

      <h2>6. Governing Law — Kenya</h2>
      <p>
        These terms are governed by the laws of the Republic of Kenya. Disputes are first
        referred to good-faith negotiation, then to mediation in Nairobi under the CIArb (Kenya)
        rules, and finally to the courts of Nairobi, Kenya.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions: {SITE.email} · {SITE.phone} · {SITE.address}.
      </p>
    </LegalLayout>
  );
}
