/** Voice command router — pure matching, no side effects. */

export type IntentId =
  | "home"
  | "features"
  | "pricing"
  | "developers"
  | "about"
  | "contact"
  | "read"
  | "stop-reading"
  | "read-slower"
  | "read-faster"
  | "scroll-down"
  | "scroll-up"
  | "demo"
  | "stop-demo"
  | "immersive"
  | "exit-immersive"
  | "menu"
  | "whatsapp"
  | "licence"
  | "newsletter"
  | "mic-off";

type Rule = { intent: IntentId; label: string; pattern: RegExp };

const RULES: Rule[] = [
  { intent: "stop-reading", label: "Stop reading", pattern: /\b(stop (reading|talking|speaking)|be quiet|silence|shut up)\b/ },
  { intent: "read-slower", label: "Read slower", pattern: /\b(read|speak) (more )?slower\b/ },
  { intent: "read-faster", label: "Read faster", pattern: /\b(read|speak) (more )?faster\b/ },
  { intent: "read", label: "Read this page", pattern: /\bread (this |the |aloud )?(page|content|screen)\b/ },
  { intent: "scroll-down", label: "Scroll down", pattern: /\b(scroll|go|move) (down|downwards?|a bit down)\b|\bpage down\b/ },
  { intent: "scroll-up", label: "Scroll up", pattern: /\b(scroll|go|move) (up|upwards?|a bit up)\b|\bpage up\b/ },
  { intent: "stop-demo", label: "Stop demo", pattern: /\b(stop|exit|close|end) (the )?demo\b/ },
  { intent: "demo", label: "Play demo", pattern: /\b(play|start|try|open|show) (the )?(voice )?demo\b/ },
  { intent: "exit-immersive", label: "Exit immersive mode", pattern: /\b(exit|leave|stop) immersive( mode)?\b/ },
  { intent: "immersive", label: "Enter immersive mode", pattern: /\b(enter|start|open) immersive( mode)?\b/ },
  { intent: "menu", label: "Open menu", pattern: /\b(open|show|toggle) (the )?(mobile )?(menu|navigation)\b/ },
  { intent: "whatsapp", label: "WhatsApp us", pattern: /\b(whats ?app)( us)?\b/ },
  { intent: "licence", label: "Request API access", pattern: /\b(request|get|apply for) (an? )?(api )?(access|key|licence|license)\b/ },
  { intent: "newsletter", label: "Sign me up", pattern: /\b(sign me up|subscribe|newsletter)\b/ },
  { intent: "contact", label: "Contact us", pattern: /\bcontact( us)?\b|\bget in touch\b/ },
  { intent: "home", label: "Go home", pattern: /\bgo (to )?home\b|\bhome ?page\b|\btake me home\b/ },
  { intent: "pricing", label: "Open pricing", pattern: /\b(open|show|go to) (the )?pricing\b|\bhow much\b|\bplans?\b/ },
  { intent: "developers", label: "Open developers", pattern: /\b(open|show) (the )?(developer|developers|api|docs|documentation)\b/ },
  { intent: "about", label: "Open about", pattern: /\b(open|show) (the )?about( us)?\b|\bwho (are|is) raphael\b/ },
  { intent: "features", label: "Open services", pattern: /\b(open|show) (the )?(services?|features?)\b|\bwhat can you do\b/ },
  { intent: "mic-off", label: "Stop listening", pattern: /\b(stop listening|mic off|turn (the )?mic(rophone)? off|stop microphone)\b/ },
];

export function matchCommand(raw: string): { intent: IntentId; label: string } | null {
  const text = raw
    .toLowerCase()
    .replace(/[.,!?;:"'’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  for (const rule of RULES) {
    if (rule.pattern.test(text)) return { intent: rule.intent, label: rule.label };
  }
  return null;
}

export const CONFIRMATIONS: Record<IntentId, string> = {
  home: "Going home.",
  features: "Opening services and features.",
  pricing: "Opening pricing.",
  developers: "Opening developer documentation.",
  about: "Opening about Raphael.",
  contact: "Opening the contact form.",
  read: "Reading this page.",
  "stop-reading": "Stopped.",
  "read-slower": "Reading slower.",
  "read-faster": "Reading faster.",
  "scroll-down": "Scrolling down.",
  "scroll-up": "Scrolling up.",
  demo: "Opening the voice demo. Click activate when you are ready.",
  "stop-demo": "Demo closed.",
  immersive: "Entering immersive voice mode.",
  "exit-immersive": "Leaving immersive voice mode.",
  menu: "Opening the menu.",
  whatsapp: "Opening WhatsApp.",
  licence: "Opening the API licence application.",
  newsletter: "Opening the newsletter sign-up.",
  "mic-off": "Microphone off. Press space or click the mic to talk again.",
};
