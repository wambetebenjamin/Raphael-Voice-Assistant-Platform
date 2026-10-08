"use client";

import Link from "next/link";
import { Code2, MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@lib/site";

/** CTA band with the waving mascot variant (EFFECT-13). */
export default function CtaBand() {
  return (
    <section className="section-pad bg-[var(--color-primary)] text-white" aria-labelledby="cta-title">
      <div className="container-site flex flex-col items-center gap-8 lg:flex-row">
        {/* waving mascot variant */}
        <svg viewBox="0 0 140 120" className="fx-mascot h-[130px] w-[150px] shrink-0" aria-hidden="true">
          <rect x="40" y="34" width="60" height="48" rx="12" fill="#ffffff" stroke="#062f2f" strokeWidth="3" />
          <circle className="mascot-eye" cx="60" cy="56" r="5" fill="#062f2f" />
          <circle className="mascot-eye" cx="82" cy="56" r="5" fill="#062f2f" />
          <path d="M60 70 q11 8 22 0" fill="none" stroke="#062f2f" strokeWidth="3" strokeLinecap="round" />
          <line x1="70" y1="34" x2="70" y2="20" stroke="#062f2f" strokeWidth="3" />
          <circle cx="70" cy="16" r="5" fill="#ffffff" />
          <rect x="98" y="46" width="12" height="22" rx="6" fill="#062f2f" />
          <g className="mascot-arm">
            <path d="M40 52 q-18 0 -22 -16" fill="none" stroke="#062f2f" strokeWidth="4" strokeLinecap="round" />
            <circle cx="17" cy="34" r="6" fill="#ffffff" />
          </g>
        </svg>
        <div className="text-center lg:text-left">
          <h2 id="cta-title" className="h2 text-white">
            Ready to make your website speak?
          </h2>
          <p className="mt-3 max-w-[56ch] text-[16px] text-white/85">
            Join the banks, counties and shops across East Africa that already answer before
            their visitors type a single letter.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link href="#licence" className="btn bg-white text-[var(--color-primary-deep)] hover:bg-[var(--color-theme-light)]">
              <Code2 size={15} aria-hidden="true" /> Get API Access
            </Link>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <MessageCircle size={15} aria-hidden="true" /> WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
