"use client";

import type { ReactNode } from "react";
import CookieBanner from "@components/CookieBanner";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import Preloader from "@components/Preloader";
import VoiceActivationBar from "@components/VoiceActivationBar";
import WhatsAppButton from "@components/WhatsAppButton";
import { VoiceProvider } from "@lib/voice/VoiceProvider";

/** Global chrome wrapped in the voice engine (voice bar + nav need context). */
export default function Shell({ children }: { children: ReactNode }) {
  return (
    <VoiceProvider>
      <Preloader />
      <a href="#main-content" className="sr-only-focusable btn btn-primary fixed left-4 top-4 z-[110]">
        Skip to main content
      </a>
      <VoiceActivationBar />
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <CookieBanner />
      <WhatsAppButton />
    </VoiceProvider>
  );
}
