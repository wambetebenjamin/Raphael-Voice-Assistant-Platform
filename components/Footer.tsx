import Link from "next/link";
import { Code2, Globe, Mail, MessageCircle, Phone, MapPin } from "lucide-react";
import NewsletterForm from "@components/NewsletterForm";
import Wordmark from "@components/Wordmark";
import { SITE, SOCIAL, WHATSAPP_LINK } from "@lib/site";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { text: "Features", href: "/features" },
      { text: "Pricing", href: "/pricing" },
      { text: "Try the demo", href: "/#demo" },
      { text: "Command reference", href: "/#commands" },
    ],
  },
  {
    title: "Developers",
    links: [
      { text: "Developer docs", href: "/developers" },
      { text: "Get an API key", href: "/#licence" },
      { text: "Rate limits", href: "/developers#docs" },
      { text: "Webhooks", href: "/developers#docs" },
    ],
  },
  {
    title: "Legal & trust",
    links: [
      { text: "Privacy policy", href: "/legal/privacy-policy" },
      { text: "Terms", href: "/legal/terms" },
      { text: "Cookie policy", href: "/legal/cookie-policy" },
      { text: "Accessibility statement", href: "/legal/accessibility" },
    ],
  },
];

const SOCIAL_ICONS = { globe: Globe, code: Code2, message: MessageCircle } as const;

export default function Footer() {
  return (
    <footer className="bg-[var(--color-theme-light)] pt-[70px]">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" aria-label="Raphael Voice Home" className="inline-flex items-center gap-2 text-[var(--color-primary-ink)]">
              <Wordmark mode="static" className="h-8 w-auto" />
            </Link>
            <p className="mt-4 max-w-[46ch] text-[15px]">
              Voice navigation, screen-reader enhancement and accessible interfaces for every
              East African user. Built in Nairobi, Kenya.
            </p>
            <ul className="mt-5 space-y-2 text-[15px]">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 shrink-0 text-[var(--color-primary-ink)]" aria-hidden="true" />
                {SITE.address}
              </li>
              <li>
                <a href={SITE.phoneHref} className="flex items-center gap-2 font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary-deep)]">
                  <Phone size={16} className="text-[var(--color-primary-ink)]" aria-hidden="true" /> {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary-deep)]"
                >
                  <MessageCircle size={16} className="text-[var(--color-whatsapp-ink)]" aria-hidden="true" /> WhatsApp us
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary-deep)]">
                  <Mail size={16} className="text-[var(--color-primary-ink)]" aria-hidden="true" /> {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={`Footer ${col.title}`}>
              <h2 className="h5 mb-4">{col.title}</h2>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.text}>
                    <Link href={l.href} className="text-[15px] text-[var(--color-text)] hover:text-[var(--color-primary-deep)] hover:underline">
                      {l.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 grid gap-8 border-t border-[var(--color-border)] py-10 lg:grid-cols-2">
          <div id="newsletter" className="scroll-mt-32">
            <h2 className="h5">Newsletter</h2>
            <p className="mb-3 mt-1 text-[15px]">Accessible web tips and voice UI updates.</p>
            <NewsletterForm compact />
          </div>
          <div>
            <h2 className="h5 mb-3">Follow Raphael</h2>
            <ul className="flex flex-wrap gap-3">
              {SOCIAL.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon as keyof typeof SOCIAL_ICONS];
                return (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[48px] items-center gap-2 rounded-full border border-[var(--color-primary)] px-4 text-[13px] font-bold text-[var(--color-primary-deep)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
                    >
                      <Icon size={15} aria-hidden="true" /> {s.name}
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-[13px]">
              Prefer to talk? Say <strong>“WhatsApp us”</strong> anywhere on this site and we will
              open the chat for you.
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] py-6 text-center text-[13px]">
          © {new Date().getFullYear()} {SITE.legalName}, Nairobi, Kenya. Voice commands are
          processed locally in your browser and never leave your device.
        </div>
      </div>
    </footer>
  );
}
