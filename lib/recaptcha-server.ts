/** Server-side reCAPTCHA verification (v3 score + v2 checkbox fallback). */

export type CaptchaResult =
  | { status: "ok"; score?: number; kind: "v3" | "v2" | "disabled" }
  | { status: "missing" }
  | { status: "low"; score: number }
  | { status: "failed" };

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export async function verifyCaptcha(
  v3Token: string | null | undefined,
  v2Token: string | null | undefined,
  minScore = 0.5
): Promise<CaptchaResult> {
  const v3Secret = process.env.RECAPTCHA_SECRET_KEY || "";
  const v2Secret = process.env.RECAPTCHA_V2_SECRET_KEY || "";

  // v2 challenge response wins when present (it is only requested after a low score).
  if (v2Token && v2Secret) {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: v2Secret, response: v2Token }),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success ? { status: "ok", kind: "v2" } : { status: "failed" };
  }

  if (v3Token && v3Secret) {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: v3Secret, response: v3Token }),
    });
    const json = (await res.json()) as { success?: boolean; score?: number };
    if (!json.success) return { status: "failed" };
    const score = typeof json.score === "number" ? json.score : 1;
    return score >= minScore
      ? { status: "ok", score, kind: "v3" }
      : { status: "low", score };
  }

  if (!v3Secret && !v2Secret) {
    // No keys configured (local/dev): verification is disabled by design and
    // every route reports `captchaDisabled: true` so it is never silent.
    return { status: "ok", kind: "disabled" };
  }

  return v3Token || v2Token ? { status: "failed" } : { status: "missing" };
}
