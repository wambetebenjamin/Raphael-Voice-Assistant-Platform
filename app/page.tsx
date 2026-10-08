import AccessibilitySection from "@components/AccessibilitySection";
import CommandRail from "@components/CommandRail";
import ContactSection from "@components/ContactSection";
import CtaBand from "@components/CtaBand";
import DevApiSection from "@components/DevApiSection";
import FeaturesGallery from "@components/FeaturesGallery";
import Hero from "@components/Hero";
import LicenceForm from "@components/LicenceForm";
import LiveBoard from "@components/LiveBoard";
import PricingSection from "@components/PricingSection";
import Scrollytelling from "@components/Scrollytelling";
import VoiceDemo from "@components/VoiceDemo";

export default function HomePage() {
  return (
    <>
      <Hero />
      <VoiceDemo />
      <Scrollytelling />
      <FeaturesGallery />
      <CommandRail />
      <LiveBoard />
      <DevApiSection />
      <PricingSection />
      <CtaBand />
      <LicenceForm />
      <AccessibilitySection />
      <ContactSection />
    </>
  );
}
