import type { MetadataRoute } from "next";
import { SITE } from "@lib/site";

/** PWA manifest — so Raphael Voice can be installed as an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: SITE.url,
    name: "Raphael Voice — voice-activated web platform",
    short_name: "Raphael Voice",
    description:
      "Navigate the entire site by voice. Voice navigation, screen-reader enhancement and accessible interfaces for every East African user.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#0aa8a7",
    lang: "en-KE",
    dir: "ltr",
    categories: ["accessibility", "productivity", "utilities"],
    icons: [
      { src: "/images/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/images/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/images/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Try the voice demo", url: "/#demo", description: "Open the interactive demo bay" },
      { name: "Command reference", url: "/#commands", description: "All voice commands" },
      { name: "Get API access", url: "/#licence", description: "Apply for an API licence" },
    ],
  };
}
