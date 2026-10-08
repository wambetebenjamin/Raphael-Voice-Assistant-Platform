import { NextResponse } from "next/server";
import { verifyCaptcha } from "@/lib/recaptcha-server";

export const runtime = "nodejs";

/** Server-side reCAPTCHA verification endpoint (used by all protected forms). */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const v3 = String(body.token ?? "").slice(0, 4000) || null;
  const v2 = String(body.v2Token ?? "").slice(0, 4000) || null;
  const minScore = typeof body.minScore === "number" ? body.minScore : 0.5;

  const result = await verifyCaptcha(v3, v2, minScore);

  const status = result.status === "ok" ? 200 : result.status === "low" ? 409 : 403;
  return NextResponse.json(
    {
      ok: result.status === "ok",
      status: result.status,
      score: "score" in result ? result.score : undefined,
      kind: "kind" in result ? result.kind : undefined,
      minScore,
    },
    { status }
  );
}
