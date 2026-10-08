"use client";

import { RefreshCw } from "lucide-react";
import "./globals.css";

/** Last-resort 500 screen (renders its own <html>/<body>). */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="grid min-h-screen place-items-center p-6 text-center">
          <div>
            <p className="meta">Error 500</p>
            <h1 className="mt-3">Voice assistant temporarily offline.</h1>
            <p className="mt-4 text-[17px]">Please try again.</p>
            <button type="button" className="btn btn-primary mt-8" onClick={reset}>
              <RefreshCw size={15} aria-hidden="true" /> Try Again
            </button>
            <p className="mt-6 text-[13px] text-[var(--color-ink-soft)]">
              If this persists, email hello@raphaelvoice.co.ke or use WhatsApp.
            </p>
            {error.digest ? (
              <p className="mt-2 text-[11px] uppercase tracking-widest text-[var(--color-ink-soft)]">
                Reference: {error.digest}
              </p>
            ) : null}
          </div>
        </main>
      </body>
    </html>
  );
}
