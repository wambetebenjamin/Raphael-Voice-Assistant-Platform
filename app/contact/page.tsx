import type { Metadata } from "next";
import ContactSection from "@components/ContactSection";
import CtaBand from "@components/CtaBand";
import PageHeader from "@components/PageHeader";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Raphael Voice in Nairobi: phone, WhatsApp, email and a contact form protected by reCAPTCHA. Voice users can say “contact us” anywhere on the site.",
  openGraph: {
    title: "Contact · Raphael Voice",
    description: "Phone, WhatsApp, email or form — talk to a human in Nairobi.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        meta="Contact"
        title="Say hello — or just say it"
        lede="Our team answers in English and Swahili, Monday to Saturday, 8am–6pm EAT. Voice users: the command “contact us” opens the form anywhere on this site."
      />
      <ContactSection />
      <CtaBand />
    </>
  );
}
