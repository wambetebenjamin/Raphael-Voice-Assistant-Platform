"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Accessibility,
  Code2,
  Home,
  Mail,
  Menu,
  Mic,
  Users,
  Wallet,
  X,
} from "lucide-react";
import Wordmark from "@components/Wordmark";
import { NAV } from "@lib/site";

const ICONS: Record<string, typeof Home> = {
  home: Home,
  accessibility: Accessibility,
  wallet: Wallet,
  code: Code2,
  users: Users,
  mail: Mail,
};

/** Sticky navbar — EFFECT-10 logo, EFFECT-11 icon motion, EFFECT-28 glass. */
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onVoice = () => setOpen(true);
    window.addEventListener("raphael:open-menu", onVoice);
    return () => window.removeEventListener("raphael:open-menu", onVoice);
  }, []);

  return (
    <div className={`nav-shell ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="container-site flex min-h-[var(--nav-h)] items-center justify-between gap-3 py-2" aria-label="Primary">
        {/* EFFECT-10: logo draws once, replays on click */}
        <Link
          href="/"
          aria-label="Raphael Voice Home"
          className="flex items-center gap-2 text-[var(--color-primary-ink)]"
        >
          <span className="logo-btn grid h-10 w-10 place-items-center rounded-full bg-[var(--color-theme-light)]">
            <Mic size={18} aria-hidden="true" />
          </span>
          <Wordmark mode="click" className="h-7 w-auto" title="Raphael" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const Icon = ICONS[item.icon];
            const active = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link-item ${clicked === item.name ? "is-clicked" : ""}`}
                  onClick={() => {
                    setClicked(item.name);
                    window.setTimeout(() => setClicked(null), 420);
                  }}
                >
                  <Icon size={15} aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link href="/pricing" className="btn btn-primary hidden sm:inline-flex">
            Try It Free
          </Link>
          <button
            type="button"
            className="grid h-12 w-12 place-items-center rounded-full text-[var(--color-dark)] hover:bg-[var(--color-theme-light)] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* mobile nav + EFFECT-21 doodle driven by aria-expanded */}
      <div id="mobile-nav" hidden={!open} className="border-t border-[var(--color-border)] bg-white/95 lg:hidden">
        <ul className="container-site flex flex-col py-2">
          {NAV.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="nav-link-item w-full justify-start"
                  onClick={() => setOpen(false)}
                >
                  <Icon size={16} aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            );
          })}
          <li className="py-2">
            <Link href="/pricing" className="btn btn-primary w-full" onClick={() => setOpen(false)}>
              Try It Free
            </Link>
          </li>
        </ul>
        <svg
          viewBox="0 0 220 40"
          className="doodle mx-auto mb-2 h-8 w-[220px]"
          aria-hidden="true"
        >
          <path d="M6 26 C 30 8, 52 34, 76 18 S 120 30, 142 14 S 190 30, 214 12" />
          <path d="M28 32 c 6 -8 14 -8 20 0" opacity={open ? 1 : 0.35} />
        </svg>
      </div>
    </div>
  );
}
