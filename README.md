# Raphael Voice — the voice-activated web platform

**Website 34 of 100 — the first voice-activated interface in the challenge.**
Raphael Voice is an accessibility-first platform for East Africa: visitors navigate the entire
site with voice commands (Web Speech API), screen readers get a cleaner, ordered experience, and
businesses across the region buy platform subscriptions and voice integration API licences.

Nairobi, Kenya · serving East Africa · English, Swahili and Kikuyu.

---

## Design source (inspected & cloned)

The design source ZIP (`bigspring-v1.0.0.zip`, Bigspring Light Next.js by Themefisher/ThemeWagon)
was unpacked **completely** and audited before any new code was written:

- **Full audit:** [`docs/design-source-audit.md`](docs/design-source-audit.md) — complete file
  tree, every CSS custom property, font declaration, component, and the ZIP-vs-this-build
  comparison table.
- **Tokens reproduced exactly from the ZIP:** primary `#0aa8a7`, body `#fff`, border `#e9e9e9`,
  theme-light `#edf6f5`, text `#777`, dark `#222`, container 1140px, section padding 70px,
  30px pill buttons, 4px card radius, the `0 12px 24px -6px rgba(45,67,121,.1)` shadow and the
  1.250 modular type scale on a 16px base.
- **Fonts are sacred:** the ZIP declares Lato 300/400/700 (Google Fonts family string). We ship
  the *same family and weights*, self-hosted through `@fontsource/lato` so there is no
  third-party request, no CSP hole and no layout shift.
- **Absent in the ZIP, built new:** loading screen, cookie banner, CAPTCHA, legal pages, 500
  page, API routes, PWA manifest, JSON-LD, `.env` contract, and the whole voice layer. The ZIP's
  own `public/robots.txt` already disallowed `/api/*` — that intent is kept.

## Stack (latest stable, Vercel-ready)

| Piece | Version | Why |
|---|---|---|
| Node.js | **24** (`engines.node: "24.x"`, `.nvmrc` 24.0.0) | Node 20 was retired on Vercel on 2026-10-01; Vercel rejects open ranges like `>=24.0.0` and needs an exact major. |
| Next.js | **16.4.0** (App Router, Turbopack) | Latest stable. `middleware.ts` → `proxy.ts`, fully-async request APIs and Turbopack builds are the v16 model; nothing deprecated is used. |
| React | **19.3.0** | Required by Next 16. |
| Tailwind CSS | **4.3.3** (`@tailwindcss/postcss`) | Utility layer compiled on top of the ZIP tokens in `app/globals.css`. |
| TypeScript | 5.9.3 | Strict mode, entire codebase typed. |
| `react-speech-kit` | **3.0.0** (pinned per brief) | Web Speech API wrapper (`useSpeechRecognition`, `useSpeechSynthesis`). Peer deps are React 16; resolved with a scoped `overrides` entry so it runs on React 19 (the hooks only use stable React APIs). Ambient types added in `types/react-speech-kit.d.ts`. |
| three | 0.186.1 | EFFECT-01 waveform sphere, dynamically imported client-side only. |
| lucide-react | 1.53.0 | The only icon set — mic, volume-2, ear, code-2, shield, users, accessibility, check-circle, globe. No decorative stars, diamonds or sparkles anywhere. |
| nodemailer | 10.0.16 | Contact + licence email, server-side only. |

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — every variable is optional
npm run dev                  # http://localhost:3000
```

```bash
npm run build      # production build (Turbopack)
npm run start      # serve the production build
npm run lint       # ESLint 9 flat config, eslint-config-next v16
npm run typecheck  # tsc --noEmit
npm run icons      # regenerate the sprite sheet + PWA icons (zero-dependency PNG writer)
```

### Environment variables

All optional — without them the site builds, deploys and works (captcha reports
`captchaDisabled`, KV uses an in-process store, mail logs a dry-run). See
[`.env.example`](.env.example) for the full list: `RECAPTCHA_SECRET_KEY`,
`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_V2_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY`,
`KV_REST_API_URL`/`KV_REST_API_TOKEN` (or Upstash equivalents), `SMTP_URL` or
`SMTP_HOST/PORT/USER/PASS`, `MAIL_FROM`, `MAIL_TO`, `NEXT_PUBLIC_WHATSAPP_NUMBER`,
`NEXT_PUBLIC_WS_URL`, `NEXT_PUBLIC_SITE_URL`.

## Voice layer

- **Global voice activation bar** above the sticky navbar: mic status (`Mic off`,
  `Listening...`, `Processing...`, `Command received.`), an animated waveform while listening,
  a mic toggle, a typed-command fallback and a **Spacebar** shortcut (ignored inside text
  fields).
- **Commands:** Go home · Open services · Open pricing · Open developers · Open about ·
  Contact us · Read this page · Stop reading · Read slower / faster · Scroll up / down ·
  Play demo · Stop demo · Enter / exit immersive mode · Open menu · WhatsApp us ·
  Request API access · Sign me up · Stop listening.
- **Privacy:** speech recognition runs in the browser via the Web Speech API. Commands are
  matched locally and never transmitted; no audio is uploaded, recorded or stored.
- **Never autoplays:** the microphone is only requested after an explicit click or keypress, and
  speech synthesis only speaks after a user gesture (including on the 404 and 500 screens).
- **Fallbacks:** every voice feature has a text equivalent; unsupported browsers get the demo's
  typed-command input with spoken responses.

## Pages

`/` · `/features` (ISR 600s) · `/pricing` (ISR 600s) · `/developers` · `/about` · `/contact` ·
`/legal/privacy-policy` · `/legal/terms` · `/legal/cookie-policy` · `/legal/accessibility` ·
404 (`This command was not recognised.`) · 500 (`Voice assistant temporarily offline.`) ·
`/manifest.webmanifest` · `/sitemap.xml` · `/robots.txt`.

## API routes

| Route | Purpose |
|---|---|
| `POST /api/licence` | API licence applications → KV + email + WhatsApp deep link; reCAPTCHA verified. |
| `POST /api/contact` | Nodemailer contact form; reCAPTCHA verified. |
| `POST /api/newsletter` | Newsletter signups in KV (deduplicated); reCAPTCHA verified. |
| `POST /api/demo/session` | Anonymous voice-demo session counter in KV. |
| `POST /api/captcha` | Server-side reCAPTCHA verification endpoint (v3 score, v2 fallback). |
| `GET/POST /api/ws` | Live usage board: board state + optimistic `?action=join` presence tick. |

**About WebSockets:** Vercel Functions cannot hold WebSocket connections open, so `/api/ws`
serves the same JSON contract over HTTP (`{ activeToday, currentlyActive, dots }`) and the client
poll-with-reconnect by default. Set `NEXT_PUBLIC_WS_URL` to an external WebSocket endpoint and
`LiveBoard` upgrades automatically, with auto-reconnect — the Edge runtime is not required.

## Accessibility

- WCAG 2.2 **AA** target; teal text uses a darker “primary ink” (`#0b6e6d`, ≥ 4.5:1 on white)
  while the brand fill stays `#0aa8a7`.
- 48×48 minimum touch targets, visible focus rings over the glass nav, skip link, landmarks,
  `aria-live` announcements for mic state and commands.
- All **31 motion effects** have reduced-motion fallbacks — see
  [`docs/reduced-motion.md`](docs/reduced-motion.md).
- No audio autoplay under any condition; the cookie banner never requests the microphone.

## Security headers

`vercel.json` sets CSP (including `microphone=(self)` via `Permissions-Policy`), HSTS,
`X-Content-Type-Options`, `Referrer-Policy`, COOP/CORP, a strict `Permissions-Policy` and a
one-year immutable cache for photography. CSP allows reCAPTCHA/frames from `google.com` and
`gstatic.com` only.

## Photography

Real stock photography from **Pexels** only, saved locally under `public/images/photos/` and
documented in [`image-credits.md`](image-credits.md). **No AI-generated images.**

## Deploying to Vercel

1. Push this branch and import the repository at vercel.com (framework auto-detected:
   Next.js).
2. Node runtime: `engines.node` is already `24.x`, which overrides the project setting — Vercel
   20.x deployments are rejected since 2026-10-01, so do not remove it.
3. Optional integrations: **KV / Upstash Redis** (injects `KV_REST_API_URL` + `KV_REST_API_TOKEN`),
   SMTP credentials, and the four reCAPTCHA keys.
4. Deploy. ISR revalidates `/features` and `/pricing` every 600 seconds; the PWA manifest,
   sitemap and robots routes are generated at build time.

```bash
# quick check before pushing
npm run typecheck && npm run lint && npm run build
```

## Project layout

```
app/                 App Router pages, API routes, globals.css (tokens) + effects.css (31 effects)
components/          Chrome, sections and effect components (all reduced-motion aware)
lib/site.ts          Content: nav, commands, features, plans, docs, photos
lib/voice/           VoiceProvider (state machine), command router, mic audio bus, motion hooks
lib/kv.ts            Vercel KV / Upstash REST client with in-process fallback
lib/mailer.ts        Nodemailer transport with dry-run fallback
lib/recaptcha-server.ts  Server-side v3 + v2 verification
scripts/             Zero-dependency PNG generator (sprite sheet + PWA icons)
docs/                Design-source audit · reduced-motion map
_design_source/      Unpacked design ZIP (git-ignored reference copy)
```

## Credits

Design tokens and layout foundations: **Bigspring Light Next.js** (Themefisher, MIT), distributed
by ThemeWagon — inspected from the supplied ZIP and reproduced as token values, not as page
content. Photography: Pexels contributors (see `image-credits.md`). Icons: Lucide.
