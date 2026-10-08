import type { Metadata } from "next";
import CtaBand from "@components/CtaBand";
import DevApiSection from "@components/DevApiSection";
import LicenceForm from "@components/LicenceForm";
import PageHeader from "@components/PageHeader";

export const metadata: Metadata = {
  title: "Developers",
  description:
    "Raphael Voice developer documentation: getting started, authentication, Voice Commands API, Text-to-Speech API in en-KE/sw-KE/ki-KE, signed webhooks and rate limits.",
  openGraph: {
    title: "Developers · Raphael Voice",
    description: "Voice Commands API, TTS API, webhooks and rate limits — documented in a flipbook you can flip or read as plain text.",
    url: "/developers",
  },
};

export default function DevelopersPage() {
  return (
    <>
      <PageHeader
        meta="Developers"
        title="Ship a voice interface this week"
        lede="One widget, six documentation pages, three languages. Mount the component, mint a key, and your product starts listening — only when your users ask it to."
      />
      <DevApiSection />
      <LicenceForm />
      <CtaBand />
    </>
  );
}
