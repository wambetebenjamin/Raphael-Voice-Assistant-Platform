"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

/**
 * Cookie consent — Kenya Data Protection Act 2019 compliant.
 * localStorage-persisted, never shown again once a choice is saved.
 * Microphone permission is NEVER requested here (only by the mic button).
 */

type Consent = { necessary: true; functional: boolean; analytics: boolean; at: string };
const KEY = "rv-cookie-consent";

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [functional, setFunctional] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // localStorage is unavailable during SSR; show the banner only after mount
    // and only when no choice has been stored yet.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate post-hydration consent read
    if (!readConsent()) setVisible(true);
  }, []);

  const save = (consent: Consent) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(consent));
    } catch {
      /* private mode */
    }
    setVisible(false);
    setModal(false);
  };

  useEffect(() => {
    if (modal) acceptRef.current?.focus();
  }, [modal]);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  if (!visible && !modal) return null;

  return (
    <>
      {visible && (
        <div className="cookie-banner" role="region" aria-label="Cookie consent">
          <div className="container-site flex flex-col gap-4 py-5 md:flex-row md:items-center">
            <p className="max-w-[62ch] text-[15px] leading-relaxed text-[var(--color-dark)]">
              Raphael Voice uses cookies to personalise your experience. Microphone access
              requires separate browser permission. See our{" "}
              <Link href="/legal/cookie-policy" className="link-underline">
                Cookie Policy
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-3 md:ml-auto">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  save({ necessary: true, functional: true, analytics: true, at: new Date().toISOString() })
                }
              >
                Accept All
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setModal(true)}>
                Manage Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          onMouseDown={(e) => {
            if (!modalRef.current?.contains(e.target as Node)) setModal(false);
          }}
        >
          <div ref={modalRef} className="card-surface w-full max-w-lg p-6">
            <h2 id="cookie-modal-title" className="h4 mb-4">
              Cookie preferences
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start justify-between gap-4 rounded-lg bg-[var(--color-theme-light)] p-4">
                <div>
                  <p className="flex items-center gap-2 font-bold text-[var(--color-dark)]">
                    <Lock size={14} aria-hidden="true" /> Necessary
                  </p>
                  <p className="text-[13px]">
                    Consent record, security and load-balancing. Always on — the site cannot
                    work without them.
                  </p>
                </div>
                <input type="checkbox" checked disabled aria-label="Necessary cookies (locked)" />
              </li>
              <li className="flex items-start justify-between gap-4 rounded-lg border border-[var(--color-border)] p-4">
                <div>
                  <p className="font-bold text-[var(--color-dark)]">Functional</p>
                  <p className="text-[13px]">
                    Remembers your voice rate, volume and language choices on this device.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={functional}
                  onChange={(e) => setFunctional(e.target.checked)}
                  aria-label="Functional cookies"
                />
              </li>
              <li className="flex items-start justify-between gap-4 rounded-lg border border-[var(--color-border)] p-4">
                <div>
                  <p className="font-bold text-[var(--color-dark)]">Analytics</p>
                  <p className="text-[13px]">
                    Anonymous usage counts (including the live sessions board). No voice audio
                    is ever recorded.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  aria-label="Analytics cookies"
                />
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>
                Cancel
              </button>
              <button
                ref={acceptRef}
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  save({ necessary: true, functional, analytics, at: new Date().toISOString() })
                }
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
