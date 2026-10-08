import type { Metadata, Viewport } from "next";
import "@fontsource/lato/latin-300.css";
import "@fontsource/lato/latin-400.css";
import "@fontsource/lato/latin-700.css";
import "./globals.css";
import Shell from "@components/Shell";
import { SITE } from "@lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Raphael Voice — Your Website Now Speaks and Listens",
    template: "%s · Raphael Voice",
  },
  description:
    "Raphael Voice is the voice-activated web platform from Nairobi: voice navigation, screen-reader enhancement and accessible voice interfaces for every East African user. Buy platform subscriptions and voice integration API licences.",
  keywords: [
    "voice assistant",
    "voice navigation",
    "accessibility",
    "WCAG 2.2 AA",
    "screen reader",
    "voice API",
    "Kenya",
    "East Africa",
    "Swahili text to speech",
  ],
  authors: [{ name: SITE.legalName }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_KE",
    title: "Raphael Voice — Your Website Now Speaks and Listens",
    description:
      "Voice navigation, screen-reader enhancement and accessible interfaces for every East African user.",
    url: SITE.url,
    images: [{ url: "/images/icons/icon-512.png", width: 512, height: 512, alt: "Raphael Voice mark" }],
  },
  twitter: {
    card: "summary",
    title: "Raphael Voice — Your Website Now Speaks and Listens",
    description: "The voice-activated web platform built in Nairobi, Kenya.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/images/favicon.png", type: "image/png" },
      { url: "/images/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/images/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0aa8a7",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Raphael Voice Platform",
      applicationCategory: "AccessibilityApplication",
      operatingSystem: "Web",
      description:
        "Voice navigation, screen-reader enhancement and voice integration APIs for websites, built for East African users and languages.",
      url: SITE.url,
      offers: [
        { "@type": "Offer", name: "Community", price: "0", priceCurrency: "KES" },
        { "@type": "Offer", name: "Professional", price: "4999", priceCurrency: "KES" },
        { "@type": "Offer", name: "Enterprise", price: "0", priceCurrency: "KES", description: "Custom contract" },
      ],
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "212" },
      featureList: [
        "Global voice navigation",
        "Screen-reader enhancement",
        "Voice Commands API",
        "Text-to-Speech API (en-KE, sw-KE, ki-KE)",
        "WCAG 2.2 AA conformance",
      ],
    },
    {
      "@type": "WebApplication",
      name: "Raphael Voice",
      url: SITE.url,
      browserRequirements: "Requires a modern browser with the Web Speech API for voice features.",
      inLanguage: ["en-KE", "sw-KE", "ki-KE"],
      accessibilityFeature: [
        "fullVoiceControl",
        "screenReaderFriendly",
        "keyboardAccessible",
        "reducedMotionFallbacks",
        "highContrastDisplay",
      ],
      accessibilityHazard: "noMotionHazard",
      publisher: {
        "@type": "Organization",
        name: SITE.legalName,
        address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
        contactPoint: { "@type": "ContactPoint", telephone: SITE.phone, contactType: "sales" },
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
