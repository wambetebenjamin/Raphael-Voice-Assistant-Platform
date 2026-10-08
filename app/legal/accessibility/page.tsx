import type { Metadata } from "next";
import LegalLayout from "@components/LegalLayout";
import { SITE } from "@lib/site";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Raphael Voice accessibility statement: WCAG 2.2 AA conformance, screen-reader and keyboard testing, voice activation, and how to report barriers.",
};

export default function AccessibilityStatementPage() {
  return (
    <LegalLayout title="Accessibility Statement" updated="8 October 2026">
      <p>
        {SITE.legalName} is committed to digital accessibility for people with disabilities,
        including visually impaired users, deaf and hard-of-hearing users, people with motor
        impairments, and elderly users less comfortable with typing.
      </p>

      <h2>Conformance status</h2>
      <p>
        This website is <strong>WCAG 2.2 Level AA</strong> conformant. Voice features are an
        enhancement: every voice capability has a keyboard and text equivalent, and no voice
        feature is mandatory.
      </p>

      <h2>What we support</h2>
      <ul>
        <li>Full-site voice navigation via the Web Speech API, with a typed-command fallback.</li>
        <li>
          Screen readers: semantic landmarks, one clean heading sentence where visual type is
          split for animation, live regions for mic state and command feedback.
        </li>
        <li>Keyboard: 48×48px minimum targets, visible focus over glass surfaces, no traps, skip link.</li>
        <li>
          Reduced motion: all 31 motion effects have static or simplified fallbacks honoured via
          <code> prefers-reduced-motion</code>.
        </li>
        <li>No audio autoplay under any condition; speech starts only after a user gesture.</li>
        <li>Colour contrast of at least 4.5:1 for text and 3:1 for UI components.</li>
      </ul>

      <h2>Testing</h2>
      <p>
        Quarterly audits with NVDA, JAWS, VoiceOver (macOS/iOS) and TalkBack; monthly keyboard-only
        walkthroughs; continuous automated checks (axe-core) in CI; and paid usability sessions
        with visually impaired users in Nairobi.
      </p>

      <h2>Known limitations</h2>
      <ul>
        <li>
          Speech recognition requires Chrome, Edge or Safari; Firefox users get the typed-command
          fallback with spoken responses.
        </li>
        <li>Kikuyu speech synthesis depends on voices installed on the visitor&apos;s device.</li>
      </ul>

      <h2>Feedback</h2>
      <p>
        If you meet a barrier, tell us: {SITE.email}, {SITE.phone}, or say{" "}
        <strong>“contact us”</strong> on this site. We respond within 2 business days and fix
        confirmed AA failures within 30 days. You may also escalate to the Office of the Data
        Protection Commissioner or the National Council for Persons with Disabilities (Kenya).
      </p>
    </LegalLayout>
  );
}
