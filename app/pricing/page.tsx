import type { Metadata } from "next";
import CtaBand from "@components/CtaBand";
import LicenceForm from "@components/LicenceForm";
import PageHeader from "@components/PageHeader";
import PricingSection from "@components/PricingSection";

export const revalidate = 600; // ISR: pricing refresh every 10 minutes

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Platform subscriptions and voice integration API licences: Community free, Professional KES 4,999/month, Enterprise custom. Monthly or annual billing, VAT-exclusive, NGO and county discounts.",
  openGraph: {
    title: "Pricing · Raphael Voice",
    description:
      "Community free · Professional KES 4,999/month · Enterprise custom. API licences with WCAG 2.2 AA audits included.",
    url: "/pricing",
  },
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        meta="Pricing & API licences"
        title="Pay for conversations, not seats"
        lede="Three tiers, one promise: every plan includes the full accessibility stack — voice navigation, screen-reader enhancement and reduced-motion fallbacks."
      />
      <PricingSection />
      <LicenceForm />
      <CtaBand />
    </>
  );
}
