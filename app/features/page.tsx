import type { Metadata } from "next";
import AccessibilitySection from "@components/AccessibilitySection";
import CommandRail from "@components/CommandRail";
import CtaBand from "@components/CtaBand";
import FeaturesGallery from "@components/FeaturesGallery";
import PageHeader from "@components/PageHeader";

export const revalidate = 600; // ISR: features refresh every 10 minutes

export const metadata: Metadata = {
  title: "Features",
  description:
    "Ten working voice-interface effects: live waveforms, morphing input glyphs, conversational forms, low-bandwidth stop-motion metering and more — each with a reduced-motion equivalent.",
  openGraph: {
    title: "Features · Raphael Voice",
    description:
      "Voice waveforms, morphing glyphs, conversational forms and low-bandwidth voice metering — the full Raphael Voice feature gallery.",
    url: "/features",
  },
};

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        meta="Features"
        title="Every interface here listens"
        lede="The gallery below is not marketing art — each card is the live effect shipped in the platform, from the self-drawn wordmark to the 10fps stop-motion level meter that works on 3G."
      />
      <FeaturesGallery />
      <CommandRail />
      <AccessibilitySection />
      <CtaBand />
    </>
  );
}
