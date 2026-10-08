"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, Code2, Text } from "lucide-react";
import { DOCS_PAGES } from "@lib/site";
import { useIsNarrow } from "@lib/voice/useReducedMotion";

/**
 * EFFECT-30 — flipbook documentation viewer.
 * 3D page-flip CSS transforms, keyboard navigation, announced page numbers
 * and a text reading-mode toggle (default on small screens).
 */
export default function DevApiSection() {
  const [index, setIndex] = useState(0);
  const [flipping, setFlipping] = useState<"fwd" | "back" | null>(null);
  const narrow = useIsNarrow(768);
  const [textModeOverride, setTextModeOverride] = useState<boolean | null>(null);
  // flipbook is unwieldy on phones → default to text mode there (SSR-safe)
  const textMode = textModeOverride ?? narrow;

  const go = (next: number, dir: "fwd" | "back") => {
    if (next < 0 || next >= DOCS_PAGES.length || flipping) return;
    setFlipping(dir);
    window.setTimeout(() => {
      setIndex(next);
      setFlipping(null);
    }, 320);
  };

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1, "fwd");
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1, "back");
    }
  };

  const page = DOCS_PAGES[index];

  return (
    <section id="developers" className="section-pad scroll-mt-32 bg-[var(--color-theme-light)]" aria-labelledby="dev-title">
      <div className="container-site">
        <p className="meta">Developer API</p>
        <h2 id="dev-title" className="h2 mt-2 flex items-center gap-3">
          <Code2 size={26} className="text-[var(--color-primary-ink)]" aria-hidden="true" />
          Documentation you can flip through
        </h2>
        <p className="mt-3 max-w-[62ch] text-[16px]">
          Six pages cover everything: getting started, authentication, the Voice Commands API,
          Text-to-Speech, webhooks and rate limits. Arrow keys turn pages.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn btn-outline motion-control"
            aria-pressed={textMode}
            onClick={() => setTextModeOverride(!textMode)}
          >
            <Text size={14} aria-hidden="true" /> {textMode ? "Flipbook view" : "Text reading mode"}
          </button>
          <p className="text-[13px] text-[var(--color-ink-soft)]" aria-live="polite">
            Page {index + 1} of {DOCS_PAGES.length}: {page.title}
          </p>
        </div>

        {textMode ? (
          <div className="card-surface mt-6 space-y-8 p-6 lg:p-10">
            {DOCS_PAGES.map((doc, i) => (
              <article key={doc.title} id={i === 4 ? "docs" : undefined}>
                <h3 className="h4">
                  {i + 1}. {doc.title}
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px]">
                  {doc.body.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--color-dark)] p-4 text-[13px] leading-relaxed text-[#a7f3f2]">
                  <code>{doc.code}</code>
                </pre>
              </article>
            ))}
          </div>
        ) : (
          <div
            className="flipbook card-surface mt-6 min-h-[420px] p-6 lg:p-10"
            tabIndex={0}
            onKeyDown={onKey}
            role="group"
            aria-roledescription="flipbook"
            aria-label={`API documentation, page ${index + 1} of ${DOCS_PAGES.length}. Use arrow keys to turn pages.`}
          >
            <div className={`flip-page ${flipping === "fwd" ? "" : ""}`} data-state={flipping === "fwd" ? "flipped" : flipping === "back" ? "next" : undefined}>
              <p className="meta">{`Page ${index + 1} / ${DOCS_PAGES.length}`}</p>
              <h3 className="h3 mt-2">{page.title}</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px]">
                {page.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <pre className="mt-5 overflow-x-auto rounded-lg bg-[var(--color-dark)] p-4 text-[13px] leading-relaxed text-[#a7f3f2]">
                <code>{page.code}</code>
              </pre>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button type="button" className="btn btn-ghost motion-control" onClick={() => go(index - 1, "back")} disabled={index === 0} aria-label="Previous page">
                <ChevronLeft size={16} aria-hidden="true" /> Prev
              </button>
              <span className="flex items-center gap-2 text-[13px] font-bold text-[var(--color-primary-ink)]">
                <BookOpen size={15} aria-hidden="true" /> {index + 1} / {DOCS_PAGES.length}
              </span>
              <button type="button" className="btn btn-ghost motion-control" onClick={() => go(index + 1, "fwd")} disabled={index === DOCS_PAGES.length - 1} aria-label="Next page">
                Next <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link href="#licence" className="btn btn-primary motion-control">
            <Code2 size={15} aria-hidden="true" /> Get API Key
          </Link>
        </div>
      </div>
    </section>
  );
}
