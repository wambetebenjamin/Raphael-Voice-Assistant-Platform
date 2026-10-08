"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PLANS } from "@lib/site";

const fmt = (n: number) => `KES ${n.toLocaleString("en-KE")}`;

/**
 * Pricing — EFFECT-29 claymorphic plan buttons (AA contrast, physical press
 * deformation) + EFFECT-12 full motion states (120–320ms) with aria-pressed.
 */
export default function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const [selected, setSelected] = useState<string | null>("professional");

  return (
    <section id="pricing" className="section-pad scroll-mt-32" aria-labelledby="pricing-title">
      <div className="container-site">
        <p className="meta">Pricing</p>
        <h2 id="pricing-title" className="h2 mt-2">
          Subscriptions & API licences
        </h2>
        <p className="mt-3 max-w-[60ch] text-[16px]">
          Start free, scale to a national rollout. Annual billing gives you two months free.
        </p>

        <div className="mt-6 flex items-center gap-2" role="group" aria-label="Billing period">
          <button type="button" className="btn-clay-soft motion-control px-5 py-3 text-[12px] font-bold uppercase tracking-wide" aria-pressed={!annual} onClick={() => setAnnual(false)}>
            Monthly
          </button>
          <button type="button" className="btn-clay-soft motion-control px-5 py-3 text-[12px] font-bold uppercase tracking-wide" aria-pressed={annual} onClick={() => setAnnual(true)}>
            Annual <span className="ml-1 rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] text-white">−17%</span>
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const price = annual ? plan.annual : plan.monthly;
            const isSelected = selected === plan.id;
            return (
              <article
                key={plan.id}
                className={`fx-card ${plan.recommended ? "border-2 border-[var(--color-primary)] shadow-[var(--shadow-card-lg)]" : ""}`}
                aria-labelledby={`plan-${plan.id}`}
              >
                {plan.recommended ? (
                  <p className="absolute right-4 top-4 rounded-full bg-[var(--color-primary)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    Most chosen
                  </p>
                ) : null}
                <h3 id={`plan-${plan.id}`} className="h4">
                  {plan.name}
                </h3>
                <p className="text-[13px] text-[var(--color-ink-soft)]">{plan.subtitle}</p>
                <p className="mt-4 text-[var(--color-dark)]">
                  {price === null ? (
                    <span className="text-h3 font-bold">Custom</span>
                  ) : price === 0 ? (
                    <span className="text-h3 font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-h3 font-bold">{fmt(price)}</span>
                      <span className="text-[13px] text-[var(--color-text)]">/{annual ? "year" : "month"}</span>
                    </>
                  )}
                </p>
                <p className="mt-1 text-[13px] font-bold text-[var(--color-primary-ink)]">{plan.apiCalls}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[15px]">
                      <CheckCircle2 size={16} className="mt-1 shrink-0 text-[var(--color-primary-ink)]" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`mt-6 w-full px-6 py-4 text-[12px] font-bold uppercase tracking-wide ${plan.recommended ? "btn-clay" : "btn-clay-soft"} motion-control`}
                  aria-pressed={isSelected}
                  onClick={() => setSelected(plan.id)}
                >
                  {plan.cta}
                </button>
                {isSelected ? (
                  <p className="mt-3 text-center text-[13px] font-bold text-[var(--color-primary-deep)]" role="status">
                    {plan.name} selected —{" "}
                    <Link href="#licence" className="underline">
                      continue to the licence form
                    </Link>
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-[13px] text-[var(--color-ink-soft)]">
          Prices exclude 16% VAT. County governments, public schools and registered NGOs get 40%
          off Professional — say <strong>“contact us”</strong> and mention it.
        </p>
      </div>
    </section>
  );
}
