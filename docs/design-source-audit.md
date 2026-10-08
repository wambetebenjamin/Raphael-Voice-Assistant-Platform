# Design Source Audit — `bigspring-v1.0.0.zip` (Bigspring Light Next.js, Themefisher/ThemeWagon)

Inspected on 2026-10-08 against the checkout at commit `9d044b5`.
The ZIP was unpacked **completely** to `_design_source/` (git-ignored, reference only).
This audit is the single source of truth for every value reused by the Raphael Voice build.

---

## 1. Full file tree of the ZIP

```
.editorconfig                .eslintrc.json             .gitignore
.sitepins/config.json        .sitepins/schema/blogs.json
LICENSE                      README.md                  jsconfig.json
netlify.toml                 next.config.js             package.json
postcss.config.js            tailwind.config.js
app/[regular]/page.js        app/blogs/[single]/page.js app/blogs/page.js
app/blogs/page/[slug]/page.js                           app/helper/MDXContent.js
app/layout.js                app/not-found.js           app/page.js
config/config.json           config/menu.json           config/social.json
config/theme.json
content/404.md               content/_index.md          content/blogs/_index.md
content/blogs/blog-1..5.md   content/contact.md         content/elements.md
content/faq.md               content/pricing.md
layouts/404.js               layouts/Contact.js         layouts/Default.js
layouts/Faq.js               layouts/PostSingle.js      layouts/Pricing.js
layouts/SeoMeta.js
layouts/components/Cta.js    layouts/components/Logo.js layouts/components/Pagination.js
layouts/components/Social.js layouts/components/TwSizeIndicator.js
layouts/components/YoutubePlayer.js
layouts/partials/Footer.js   layouts/partials/Header.js layouts/partials/HomeBanner.js
layouts/partials/HomeFeatures.js                        layouts/partials/Posts.js
layouts/partials/Providers.js                           layouts/partials/Services.js
layouts/partials/Workflow.js
layouts/shortcodes/Button.jsx                           layouts/shortcodes/all.js
lib/contentParser.js         lib/taxonomyParser.js      lib/utils/mdxParser.js
lib/utils/textConverter.js
public/.htaccess             public/robots.txt          public/sitepins-manifest.json
public/.well-known/sitepins.json
public/images/arrow-right.svg  public/images/banner-art.svg  public/images/banner.svg
public/images/blog-1..6.jpg    public/images/checkmark-circle.svg  public/images/cloud.svg
public/images/code.svg         public/images/cta.svg     public/images/favicon.png
public/images/logo.png         public/images/love.svg    public/images/oop.svg
public/images/service-slide-1..3.png  public/images/speedometer.svg  public/images/user-clock.svg
styles/base.scss  styles/buttons.scss  styles/components.scss
styles/navigation.scss  styles/style.scss  styles/utilities.scss
```

Stack inside the ZIP: **Next.js ^14.2.7 (App Router, JS), React ^18.3.1, Tailwind CSS ^3.4.10 + SCSS,
MDX content (`gray-matter`, `next-mdx-remote`, `marked`), Swiper ^8, react-icons ^5, GTM module.**

---

## 2. CSS custom properties / design tokens extracted (FROM ZIP — SACRED)

Source: `config/theme.json` → compiled by `tailwind.config.js`.

| Token | ZIP value | Raphael custom property |
|---|---|---|
| Primary | `#0aa8a7` | `--color-primary` |
| Body / surface | `#fff` | `--color-body` |
| Border | `#e9e9e9` | `--color-border` |
| Theme light (tint) | `#edf6f5` | `--color-theme-light` |
| Text default | `#777` | `--color-text` |
| Text dark (headings) | `#222` | `--color-dark` |
| Shadow | `0 12px 24px -6px rgba(45,67,121,.1)` | `--shadow-card` |
| Container max | `1140px` (`max-w-[1140px] px-4`) | `--container-max` |
| Section padding | `70px` (`pt-[70px] pb-[70px]`) | `--section-pad` |
| Header padding | `14px` mobile / `9px` desktop (`py-[14px]` / `md:py-[9px]`) | `--header-pad` |
| Button radius | `30px` (`rounded-[30px]`) | `--radius-pill` |
| Button padding | `px-7 py-[17px] leading-[18px]` | `--btn-pad` |
| Card radius | `4px` (`rounded-[4px]`) | `--radius-card` |
| Screens | sm 540 / md 768 / lg 1024 / xl 1280 / 2xl 1536 | Tailwind `screens` (kept) |
| Focus colour | derived from `#0aa8a7` | `--color-focus` |

Derived (accessibility, AA on white — the ZIP's `#0aa8a7` is only 2.9:1 as *text*, so a darker
"primary ink" is introduced for text/icons while `#0aa8a7` stays the fill/accent brand colour):

| Token | Value | Use |
|---|---|---|
| `--color-primary-ink` | `#0b6e6d` | body-text-safe teal (AA ≥ 4.6:1 on white) |
| `--color-primary-deep` | `#084e4d` | hover / pressed |
| `--color-on-primary` | `#ffffff` | text on teal fills |
| `--color-surface-glass` | `rgba(255,255,255,.72)` | EFFECT-28 glass |
| `--color-whatsapp` | `#25D366` | WhatsApp brand (not present in ZIP; official brand colour) |
| `--color-whatsapp-ink` | `#0b3d2c` | AA text on WhatsApp green |

## 3. Typography (FONTS ARE SACRED — reproduced exactly)

ZIP declares **no font files**; `config/theme.json` → `"primary": "Lato:wght@300;400;700"`,
`primary_type: sans-serif`, loaded in `app/layout.js` from **Google Fonts CSS API**.

Raphael reproduction: the **same family, same three weights** (`Lato 300/400/700`), but
**self-hosted** through `@fontsource/lato` (identical woff2 files, no third-party request,
CSP-friendly, no layout shift). `font-display: swap` is preserved.

- Modular scale from ZIP: `font_size.base = 16`, `scale = 1.250`
  → h6 1rem, h5 1.25rem, h4 1.5625rem, h3 1.953rem, h2 2.441rem, h1 3.052rem
  (with ZIP's `-sm` mobile variant = ×0.8). Kept verbatim as `--fs-h1 … --fs-h6`.
- Brief-imposed minimums applied on top: body ≥ 15px (ZIP base 16px satisfies it),
  metadata ≥ 11px (`--fs-meta: 11px` → used at 11.5/12px), navigation 13px, buttons 12px.
- Headings: `font-bold leading-tight text-dark` (from `styles/base.scss`) — kept.

## 4. Components audited in the ZIP

| Item | Present in ZIP? | Decision for Raphael |
|---|---|---|
| Loading screen / preloader | **Absent** | Built to EFFECT-25 + EFFECT-08 spec |
| Cookie consent banner | **Absent** | Built to spec (bottom-fixed, modal, localStorage, K-DPA 2019) |
| CAPTCHA | **Absent** | reCAPTCHA v3 + v2 fallback built (`/api/captcha`) |
| Legal pages | **Absent** (`#` links in footer) | Built: privacy-policy, terms, cookie-policy, accessibility |
| 404 | Minimal (`content/404.md` → `layouts/404.js`, plain centered text) | Rebuilt to EFFECT-17 + SpeechSynthesis |
| 500 | **Absent** | Built (`app/error.tsx` + `global-error.tsx`) |
| API routes | **Absent** (`robots.txt` already disallows `/api/*`) | Built: licence, contact, newsletter, demo/session, captcha, ws |
| Env vars | **Absent** (no `.env*`) | `.env.example` authored (10 vars) |
| PWA manifest | **Absent** | Built (`app/manifest.ts` + generated icons) |
| JSON-LD | **Absent** | SoftwareApplication + WebApplication |
| WebSocket | **Absent** | `/api/ws` + polling fallback |
| Header/nav | `layouts/partials/Header.js` (static white bar, burger toggles `max-h`) | Rebuilt glassmorphic sticky (EFFECT-10/11/28) keeping brand/logo slot |
| Footer | `layouts/partials/Footer.js` (`bg-theme-light`, 4 columns, social, copyright) | Rebuilt with same `--color-theme-light` band + required links |
| Buttons | `styles/buttons.scss` `.btn/.btn-primary/.btn-outline-primary`, pill 30px, expanding `::after` halo | Kept as `.btn` base; claymorphic variants (EFFECT-29) layered on |
| Cards | `.card` (white, 4px radius, border `rgba(0,0,0,.125)`, shadow) | Kept as gallery card base |
| Forms | `.form-input/.form-textarea` (`border-border`, `focus:border-primary`) | Kept tokens; rebuilt controls |
| Content prose | `.content` (typography plugin, teal list bullets) | Kept for legal pages |
| Favicon | `public/images/favicon.png` | Reused as site icon |

## 5. Package versions — ZIP vs Raphael

| Package | ZIP | Raphael (this build) |
|---|---|---|
| next | ^14.2.7 | **16.4.0** (latest; Turbopack default; Node 24 on Vercel) |
| react / react-dom | ^18.3.1 | **19.3.0** |
| tailwindcss | ^3.4.10 | **4.3.3** + `@tailwindcss/postcss` |
| typescript | – (JS) | **5.9.3** |
| react-speech-kit | – | **3.0.0** (pinned per brief; peer override for React 19) |
| three | – | **0.186.1** (EFFECT-01 sphere, dynamic import only) |
| lucide-react | – (react-icons) | **1.53.0** |
| nodemailer | – | **10.0.16** |
| @fontsource/lato | – (Google Fonts CDN) | **5.3.0** |
| node (engines) | – | **24.x** (Vercel rejects open ranges such as `>=24.0.0`; see README) |
| .nvmrc | – | **24.0.0** |

## 6. Environment variables (all optional — every route degrades gracefully)

`RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`,
`RECAPTCHA_V2_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY`,
`KV_REST_API_URL`/`KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL`/`..._TOKEN`),
`SMTP_URL` (or `SMTP_HOST/PORT/USER/PASS`), `MAIL_FROM`, `MAIL_TO`,
`NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_WS_URL`, `NEXT_PUBLIC_SITE_URL`.
