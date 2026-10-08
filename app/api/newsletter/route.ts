import { NextResponse } from "next/server";
import { kvGet, kvPush, kvSet } from "@/lib/kv";
import { sendMail } from "@/lib/mailer";
import { verifyCaptcha } from "@/lib/recaptcha-server";

export const runtime = "nodejs";

const str = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const email = str(body.email, 160).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 422 });
  }

  const captcha = await verifyCaptcha(
    str(body.captchaToken, 4000) || null,
    str(body.captchaV2Token, 4000) || null,
    0.5
  );
  if (captcha.status === "low") {
    return NextResponse.json({ ok: false, requiresChallenge: true }, { status: 409 });
  }
  if (captcha.status === "failed" || captcha.status === "missing") {
    return NextResponse.json({ ok: false, error: "Captcha verification failed." }, { status: 403 });
  }

  const existing = await kvGet<{ email: string; at: string }>(`rv:news:${email}`);
  if (!existing) {
    await kvSet(`rv:news:${email}`, { email, at: new Date().toISOString() });
    await kvPush("rv:newsletter", { email, at: new Date().toISOString() }, 1000);
    await sendMail({
      subject: "New newsletter subscriber — Accessible web tips",
      text: `${email} subscribed to the Raphael Voice newsletter.`,
    });
  }

  return NextResponse.json({
    ok: true,
    alreadySubscribed: Boolean(existing),
    captchaDisabled: captcha.kind === "disabled",
  });
}
