"use client";

import { useRef } from "react";
import { Mic } from "lucide-react";
import { COMMAND_CATEGORIES } from "@lib/site";
import { useVoice } from "@lib/voice/VoiceProvider";

/**
 * EFFECT-15 — horizontal scroll-snap rail of the 5 command categories.
 * Labelled "Command categories, 5 items", arrow-key navigable, plain grid
 * under reduced motion (CSS).
 */
export default function CommandRail() {
  const railRef = useRef<HTMLUListElement>(null);
  const { startListening, speak } = useVoice();

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const items = Array.from(railRef.current?.querySelectorAll<HTMLElement>("[data-rail-item]") ?? []);
    const current = items.indexOf(document.activeElement as HTMLElement);
    if (current === -1) return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? Math.min(current + 1, items.length - 1) : Math.max(current - 1, 0);
    items[next].focus();
    items[next].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  };

  const tryIt = (category: string) => {
    startListening();
    speak(`Microphone on. Try a ${category.toLowerCase()} command, for example: ${COMMAND_CATEGORIES.find((c) => c.name === category)?.example.replace(/[“”]/g, "")}`);
  };

  return (
    <section id="commands" className="section-pad scroll-mt-32 bg-white" aria-labelledby="commands-title">
      <div className="container-site">
        <p className="meta">Voice command reference</p>
        <h2 id="commands-title" className="h2 mt-2">
          Say the word, literally
        </h2>
        <p className="mt-3 max-w-[60ch] text-[16px]">
          Five categories cover the whole platform. Use ← → arrow keys to move along the rail.
        </p>

        <ul
          ref={railRef}
          className="cmd-rail mt-8"
          aria-label="Command categories, 5 items"
          onKeyDown={onKey}
        >
          {COMMAND_CATEGORIES.map((cat) => (
            <li key={cat.name} data-rail-item tabIndex={0} className="card-surface flex flex-col gap-3 p-5 focus-visible:outline-3">
              <h3 className="h4">{cat.name}</h3>
              <ul className="space-y-1 text-[15px]">
                {cat.commands.map((c) => (
                  <li key={c} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
              <p className="text-[13px] italic text-[var(--color-ink-soft)]">Example: {cat.example}</p>
              <button type="button" className="btn btn-outline motion-control mt-auto" onClick={() => tryIt(cat.name)}>
                <Mic size={14} aria-hidden="true" /> Try it
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
