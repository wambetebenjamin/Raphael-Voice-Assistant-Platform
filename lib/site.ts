/** Site-wide content + configuration for Raphael Voice. */

export const SITE = {
  name: "Raphael Voice",
  legalName: "Raphael Voice Platform",
  tagline: "Your Website Now Speaks and Listens.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://raphael-voice.example.com",
  address: "Raphael Voice, 4th Floor, Nuru Centre, Waiyaki Way, Westlands, Nairobi, Kenya",
  phone: "+254 112 272 061",
  phoneHref: "tel:+254112272061",
  email: "hello@raphaelvoice.co.ke",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254112272061",
} as const;

export const WHATSAPP_LINK = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
  "Hello! I am interested in Raphael Voice Platform."
)}`;

export const NAV = [
  { name: "Home", href: "/", icon: "home" },
  { name: "Features", href: "/features", icon: "accessibility" },
  { name: "Pricing", href: "/pricing", icon: "wallet" },
  { name: "Developers", href: "/developers", icon: "code" },
  { name: "About", href: "/about", icon: "users" },
  { name: "Contact", href: "/contact", icon: "mail" },
] as const;

/** Global voice commands (voice activation bar). */
export const GLOBAL_COMMANDS = [
  { phrase: "Go home", description: "Returns you to the top of the home page." },
  { phrase: "Open services", description: "Jumps to the features gallery." },
  { phrase: "Contact us", description: "Opens and focuses the contact form." },
  { phrase: "Read this page", description: "Raphael reads the main content aloud." },
  { phrase: "Stop reading", description: "Cancels speech immediately." },
  { phrase: "Scroll down", description: "Scrolls one viewport down." },
  { phrase: "Scroll up", description: "Scrolls one viewport up." },
  { phrase: "Play demo", description: "Opens the interactive voice demo bay." },
  { phrase: "Open menu", description: "Opens the mobile navigation." },
  { phrase: "WhatsApp us", description: "Opens WhatsApp in a new tab." },
] as const;

/** EFFECT-15 command reference rail — 5 categories. */
export const COMMAND_CATEGORIES = [
  {
    name: "Navigation",
    commands: ["Go home", "Open services", "Open pricing", "Open developers", "Open menu"],
    example: "“Raphael, open pricing.”",
  },
  {
    name: "Reading",
    commands: ["Read this page", "Stop reading", "Read slower", "Read faster"],
    example: "“Read this page, please.”",
  },
  {
    name: "Forms",
    commands: ["Contact us", "Request API access", "Sign me up", "Clear the form"],
    example: "“Contact us about a licence.”",
  },
  {
    name: "Media",
    commands: ["Play demo", "Stop demo", "Enter immersive mode", "Exit immersive mode"],
    example: "“Play the demo.”",
  },
  {
    name: "Search",
    commands: ["Find features", "Find pricing", "Find documentation", "WhatsApp us"],
    example: "“Find the webhook documentation.”",
  },
] as const;

/** FEATURES gallery (10 cards) — copy for /features too. */
export const FEATURES = [
  {
    id: "voice-waveform",
    effect: "EFFECT-07",
    title: "Live voice waveform",
    body: "A breathing line-art waveform shows exactly when Raphael is hearing you — no guessing, no dead air.",
  },
  {
    id: "self-drawn-wordmark",
    effect: "EFFECT-08",
    title: "Self-drawn identity",
    body: "Our RAPHAEL wordmark draws itself stroke by stroke, the same way a screen reader builds a page: piece by piece, in order.",
  },
  {
    id: "morphing-input",
    effect: "EFFECT-09",
    title: "Mic, ear, speech bubble",
    body: "One morphing glyph for speaking, listening and replying — a single mental model for the whole conversation.",
  },
  {
    id: "mascot",
    effect: "EFFECT-13",
    title: "Raphael the guide",
    body: "A friendly robot with a microphone ear waves when you arrive and answers when you speak. Decorative, and proud of it.",
  },
  {
    id: "phone-ui",
    effect: "EFFECT-14",
    title: "Voice UI on every phone",
    body: "The same voice layer ships to mobile web: large targets, high contrast, and commands that work one-handed.",
  },
  {
    id: "east-african",
    effect: "EFFECT-16",
    title: "Built in East Africa",
    body: "Photographed with real users in Nairobi and Kisumu. Swahili and English ship on day one; Kikuyu is in the selector today.",
  },
  {
    id: "liquid-feedback",
    effect: "EFFECT-17",
    title: "Liquid state feedback",
    body: "Bounded liquid blobs communicate processing state for deaf and hard-of-hear users — motion instead of sound.",
  },
  {
    id: "device-ecosystem",
    effect: "EFFECT-19",
    title: "One API, every device",
    body: "Kiosks, smart speakers, POS terminals and websites assemble around a single voice integration.",
  },
  {
    id: "conversational-forms",
    effect: "EFFECT-21",
    title: "Conversational forms",
    body: "Every form on a Raphael-powered site can be filled by talking. Doodled speech bubbles mark the places you can speak.",
  },
  {
    id: "stop-motion-meter",
    effect: "EFFECT-31",
    title: "Low-bandwidth metering",
    body: "A 10fps stop-motion level meter keeps voice feedback usable on 3G — under 4 KB of sprite, no video.",
  },
] as const;

/** Pricing — 3 tiers, monthly/annual. */
export const PLANS = [
  {
    id: "community",
    name: "Community",
    subtitle: "For tinkerers and student projects",
    monthly: 0,
    annual: 0,
    apiCalls: "1,000 API calls / month",
    recommended: false,
    features: [
      "Voice navigation widget (1 site)",
      "English + Swahili voice packs",
      "1,000 API calls / month",
      "Community forum support",
    ],
    cta: "Start free",
  },
  {
    id: "professional",
    name: "Professional",
    subtitle: "For growing East African businesses",
    monthly: 4999,
    annual: 49990,
    apiCalls: "50,000 API calls / month",
    recommended: true,
    features: [
      "Everything in Community",
      "Voice Commands + Text-to-Speech APIs",
      "50,000 API calls / month",
      "Kikuyu voice pack + custom wake word",
      "WCAG 2.2 AA audit report",
      "Email & WhatsApp support (24h)",
    ],
    cta: "Choose Professional",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "For banks, telcos and government",
    monthly: null,
    annual: null,
    apiCalls: "Unlimited, contract-rated",
    recommended: false,
    features: [
      "Everything in Professional",
      "Unlimited API calls & SLA 99.9%",
      "On-prem / private-cloud voice stack",
      "Dedicated accessibility engineer",
      "Kenya DPA 2019 data-residency review",
    ],
    cta: "Talk to us",
  },
] as const;

/** EFFECT-30 flipbook documentation pages. */
export const DOCS_PAGES = [
  {
    title: "Getting Started",
    body: [
      "Install the widget: npm i @raphael/voice, then mount <RaphaelVoice siteKey=\"rv_live_…\" /> once in your app shell.",
      "The widget injects the voice activation bar, listens for opt-in only, and never requests the microphone until a visitor clicks the mic.",
      "Server-side, create a licence key in the dashboard and store it in RAPHAEL_API_KEY.",
    ],
    code: `import { RaphaelVoice } from "@raphael/voice";\n\nexport function App() {\n  return <RaphaelVoice siteKey={process.env.RAPHAEL_API_KEY} lang="sw-KE" />;\n}`,
  },
  {
    title: "Authentication",
    body: [
      "All requests carry Authorization: Bearer <licence key>.",
      "Keys are scoped per environment (rv_live_ / rv_test_) and can be rotated without downtime.",
      "Requests without a valid key return 401 {\"error\":\"unauthenticated\"}.",
    ],
    code: `curl https://api.raphaelvoice.co.ke/v1/commands \\\n  -H "Authorization: Bearer $RAPHAEL_API_KEY"`,
  },
  {
    title: "Voice Commands API",
    body: [
      "POST /v1/commands registers custom commands for your site; GET /v1/commands lists them.",
      "Each command maps an utterance pattern to an intent you handle client-side.",
      "Patterns support {slots} — e.g. \"book {service} on {date}\".",
    ],
    code: `POST /v1/commands\n{\n  "utterance": "book {service} on {date}",\n  "intent": "booking.create",\n  "lang": "en-KE"\n}`,
  },
  {
    title: "Text-to-Speech API",
    body: [
      "POST /v1/tts streams SSML-capable audio in en-KE, sw-KE and ki-KE voices.",
      "Response is audio/mpeg; pass rate 0.7–1.3 and volume 0–1.",
      "Screen-reader mode returns the same text as an aria-live payload instead of audio.",
    ],
    code: `POST /v1/tts\n{ "text": "Karibu Raphael.", "voice": "sw-KE-Neema", "rate": 1.0 }`,
  },
  {
    title: "Webhooks",
    body: [
      "Subscribe to session.started, command.recognised, session.ended and audit.completed.",
      "Deliveries are signed with X-Raphael-Signature (HMAC-SHA256 of the raw body).",
      "Retries: 5 attempts with exponential backoff over 30 minutes.",
    ],
    code: `X-Raphael-Signature: sha256=9f2c…\n{ "event": "command.recognised", "intent": "booking.create" }`,
  },
  {
    title: "Rate Limits",
    body: [
      "Community: 60 req/min. Professional: 600 req/min. Enterprise: contract.",
      "Limits are per licence key and returned on every response as X-RateLimit-* headers.",
      "Exceeding a limit yields 429 with Retry-After in seconds.",
    ],
    code: `X-RateLimit-Limit: 600\nX-RateLimit-Remaining: 597\nRetry-After: 12`,
  },
] as const;

export const INDUSTRIES = [
  "Banking & finance",
  "Government & county services",
  "Healthcare",
  "Education",
  "Retail & e-commerce",
  "Transport & logistics",
  "Media & broadcasting",
  "NGO & development",
  "Other",
] as const;

export const CALL_BANDS = [
  "Under 1,000 / month",
  "1,000 – 10,000 / month",
  "10,000 – 100,000 / month",
  "100,000 – 1,000,000 / month",
  "Over 1,000,000 / month",
] as const;

/** Photography metadata (dimensions for width/height attrs — no layout shift). */
export const PHOTOS = {
  voiceUserOutdoors: { src: "/images/photos/voice-user-outdoors.jpg", width: 500, height: 333, alt: "An East African man in sunglasses using his smartphone outdoors while talking to it." },
  phoneLaptopDesk: { src: "/images/photos/phone-laptop-desk.jpg", width: 500, height: 333, alt: "Hands working across a smartphone and a laptop on a wooden desk." },
  womanGlassesSmartphone: { src: "/images/photos/woman-glasses-smartphone.jpg", width: 500, height: 520, alt: "A stylish African woman with glasses using a smartphone outdoors." },
  developerNairobi: { src: "/images/photos/developer-nairobi-office.jpg", width: 500, height: 333, alt: "An African developer coding on a desktop and laptop in a Nairobi office." },
  whiteCaneSofa: { src: "/images/photos/white-cane-sofa.jpg", width: 500, height: 333, alt: "A person holding a white cane with sunglasses on, seated on a sofa." },
  whiteCaneSteps: { src: "/images/photos/white-cane-steps.jpg", width: 500, height: 333, alt: "A visually impaired man using a white cane while walking down outdoor steps." },
  whiteCanePath: { src: "/images/photos/white-cane-path.jpg", width: 500, height: 333, alt: "Two people walking on a path, one guided by a white cane." },
  elderlyWhiteCanePark: { src: "/images/photos/elderly-white-cane-park.jpg", width: 500, height: 750, alt: "An elderly man with visual impairment walking in a park with a white cane and umbrella." },
  womanHeadphones: { src: "/images/photos/woman-headphones-window.jpg", width: 501, height: 750, alt: "A smiling woman with headphones listening beside a laptop by a window." },
} as const;

export const SOCIAL = [
  { name: "X (Twitter)", href: "https://x.com/raphaelvoice", icon: "globe" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/raphaelvoice", icon: "globe" },
  { name: "GitHub", href: "https://github.com/wambetebenjamin", icon: "code" },
  { name: "WhatsApp", href: WHATSAPP_LINK, icon: "message" },
] as const;
