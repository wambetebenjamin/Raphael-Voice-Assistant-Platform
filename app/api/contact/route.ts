import { NextResponse } from "next/server";
import { kvConfigured, kvPush } from "@/lib/kv";
import { sendMail } from "@/lib/mailer";
import { verifyCaptcha } from "@/lib/recaptcha-server";

export const runtime = "nodejs";

const str = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const name = str(body.name, 120);
  const email = str(body.email, 160);
  const message = str(body.message, 4000);

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Name, email and message are all required." }, { status: 422 });
  }
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

  const record = { name, email, message, at: new Date().toISOString() };
  await kvPush("rv:contacts", record, 500);

  const mail = await sendMail({
    subject: `Website contact form — ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  return NextResponse.json({
    ok: true,
    emailsSent: mail.sent,
    stored: kvConfigured,
    captchaDisabled: captcha.kind === "disabled",
  });
}
