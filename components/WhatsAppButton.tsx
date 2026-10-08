"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@lib/site";

/** Floating WhatsApp CTA — fixed bottom right, tooltip on hover/focus. */
export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="Chat with Raphael Voice on WhatsApp"
    >
      <MessageCircle size={26} aria-hidden="true" />
      <span className="wa-tip" role="tooltip">
        Get API access or ask about voice integration
      </span>
    </a>
  );
}
