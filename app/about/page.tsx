import type { Metadata } from "next";
import Image from "next/image";
import AccessibilitySection from "@components/AccessibilitySection";
import CtaBand from "@components/CtaBand";
import LiveBoard from "@components/LiveBoard";
import PageHeader from "@components/PageHeader";
import { PHOTOS, SITE } from "@lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Raphael Voice is an accessibility technology company in Nairobi, Kenya, building voice navigation and screen-reader enhancement for East African websites, in English, Swahili and Kikuyu.",
  openGraph: {
    title: "About · Raphael Voice",
    description: "Built in Nairobi for East Africa: why we make websites that listen.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        meta="About us"
        title="We build websites that listen"
        lede="Raphael Voice started in 2023 in a Westlands co-working space, after our founder watched his grandmother abandon a government form she could not see and could not type."
      />

      <section className="section-pad">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div className="prose-body space-y-4 text-[16px]">
            <h2 className="h3">Why voice, why here</h2>
            <p>
              East Africa leaps over the keyboard. Millions of people who will never own a laptop
              carry a smartphone and a fluent voice. Meanwhile, visually impaired and elderly
              users are locked out of services that assume sighted, typing customers. Voice is
              not a novelty here — it is the shortest route to inclusion.
            </p>
            <p>
              Raphael Voice puts a conversation layer on any website: visitors speak, the page
              moves, and the page speaks back. Commands are recognised locally in the browser, so
              nobody&apos;s voice ever travels to our servers — a privacy promise we wrote into
              our architecture, not just our policy.
            </p>
            <h2 className="h3 pt-4">What we sell</h2>
            <p>
              Platform subscriptions for sites that want the voice layer, and API licences for
              product teams that want voice inside their own apps: Voice Commands, Text-to-Speech
              in English, Swahili and Kikuyu, signed webhooks and WCAG 2.2 AA audit reports.
            </p>
            <h2 className="h3 pt-4">How we work</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Nothing autoplays. No microphone opens without an explicit click.</li>
              <li>Every effect has a reduced-motion equivalent — all thirty-one of them.</li>
              <li>We test with screen readers and with real users in Nairobi, Kisumu and Mombasa.</li>
              <li>Kenya Data Protection Act 2019 compliance is a design input, not an afterthought.</li>
            </ul>
            <p className="pt-2 text-[14px] text-[var(--color-ink-soft)]">
              {SITE.legalName} · {SITE.address}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Image
              src={PHOTOS.developerNairobi.src}
              alt={PHOTOS.developerNairobi.alt}
              width={PHOTOS.developerNairobi.width}
              height={PHOTOS.developerNairobi.height}
              loading="lazy"
              className="w-full rounded-[var(--radius-card)] object-cover shadow-[var(--shadow-card)]"
            />
            <Image
              src={PHOTOS.womanGlassesSmartphone.src}
              alt={PHOTOS.womanGlassesSmartphone.alt}
              width={PHOTOS.womanGlassesSmartphone.width}
              height={PHOTOS.womanGlassesSmartphone.height}
              loading="lazy"
              className="w-full rounded-[var(--radius-card)] object-cover shadow-[var(--shadow-card)]"
            />
            <Image
              src={PHOTOS.elderlyWhiteCanePark.src}
              alt={PHOTOS.elderlyWhiteCanePark.alt}
              width={PHOTOS.elderlyWhiteCanePark.width}
              height={PHOTOS.elderlyWhiteCanePark.height}
              loading="lazy"
              className="w-full rounded-[var(--radius-card)] object-cover shadow-[var(--shadow-card)]"
            />
            <Image
              src={PHOTOS.whiteCaneSteps.src}
              alt={PHOTOS.whiteCaneSteps.alt}
              width={PHOTOS.whiteCaneSteps.width}
              height={PHOTOS.whiteCaneSteps.height}
              loading="lazy"
              className="w-full rounded-[var(--radius-card)] object-cover shadow-[var(--shadow-card)]"
            />
          </div>
        </div>
      </section>

      <LiveBoard />
      <AccessibilitySection />
      <CtaBand />
    </>
  );
}
