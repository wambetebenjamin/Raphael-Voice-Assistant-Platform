import type { ReactNode } from "react";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="section-pad">
      <div className="container-site max-w-[820px]">
        <p className="meta">Legal</p>
        <h1 className="mt-3">{title}</h1>
        <p className="mt-2 text-[13px] text-[var(--color-ink-soft)]">Last updated: {updated}</p>
        <div className="prose-body mt-8 space-y-6 text-[16px] leading-relaxed text-[var(--color-text)] [&_h2]:mt-8 [&_h2]:text-h3-sm [&_h2]:text-[var(--color-dark)] [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-[var(--color-dark)]">
          {children}
        </div>
      </div>
    </div>
  );
}
