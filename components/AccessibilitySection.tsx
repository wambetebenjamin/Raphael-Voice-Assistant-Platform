import Image from "next/image";
import Link from "next/link";
import { AudioLines, CircleCheck, Keyboard, ShieldCheck } from "lucide-react";
import { PHOTOS, SITE } from "@lib/site";

const BADGES = [
  { icon: CircleCheck, label: "Screen reader tested", detail: "NVDA, JAWS, VoiceOver & TalkBack, quarterly." },
  { icon: Keyboard, label: "Keyboard-only navigable", detail: "Every control reachable, visible focus, no traps." },
  { icon: AudioLines, label: "Voice-activated", detail: "The whole site runs on spoken commands." },
  { icon: ShieldCheck, label: "WCAG 2.2 AA", detail: "Audited against all A & AA success criteria." },
];

/** Accessibility commitment (section 13). */
export default function AccessibilitySection() {
  return (
    <section className="section-pad bg-white" aria-labelledby="a11y-title">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="meta">Accessibility commitment</p>
          <h2 id="a11y-title" className="h2 mt-2">
            Accessibility is the product, not a feature
          </h2>
          <p className="mt-4 max-w-[58ch] text-[16px]">
            Raphael Voice commits to <strong>WCAG 2.2 AA</strong> conformance across every surface
            we ship — this website, the embeddable widget and the API documentation. Voice is an
            enhancement, never a requirement: every voice feature has a text and keyboard
            equivalent, and nothing autoplays, ever.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {BADGES.map((badge) => (
              <li key={badge.label} className="card-surface flex items-start gap-3 p-4">
                <badge.icon size={22} className="mt-0.5 shrink-0 text-[var(--color-primary-ink)]" aria-hidden="true" />
                <div>
                  <p className="font-bold text-[var(--color-dark)]">{badge.label}</p>
                  <p className="text-[13px]">{badge.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-4">
            <a
              className="btn btn-primary"
              href={`mailto:${SITE.email}?subject=${encodeURIComponent("Request an Accessibility Audit")}`}
            >
              Request an Accessibility Audit
            </a>
            <Link className="btn btn-outline" href="/legal/accessibility">
              Accessibility statement
            </Link>
          </div>
        </div>
        <div className="relative">
          <Image
            src={PHOTOS.whiteCanePath.src}
            alt={PHOTOS.whiteCanePath.alt}
            width={PHOTOS.whiteCanePath.width}
            height={PHOTOS.whiteCanePath.height}
            loading="lazy"
            className="w-full rounded-[var(--radius-card)] object-cover shadow-[var(--shadow-card-lg)]"
          />
          <blockquote className="card-surface absolute -bottom-6 left-4 right-4 p-4 text-[14px] italic sm:left-8 sm:right-8">
            “I stopped needing a sighted friend to pay my water bill. I just tell the page what I
            want.” — <cite className="not-italic font-bold">Wanjiru K., Nairobi</cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
