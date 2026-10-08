import { NextResponse } from "next/server";
import { kvConfigured, kvPush } from "@/lib/kv";
import { mailConfigured, sendMail } from "@/lib/mailer";
import { verifyCaptcha } from "@/lib/recaptcha-server";
import { SITE, WHATSAPP_LINK } from "@/lib/site";

export const runtime = "nodejs";

type LicenceApplication = {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  useCase: string;
  expectedCalls: string;
  industry: string;
  submittedAt: string;
  captcha: string;
};

const str = (v: unknown, max = 400) => String(v ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const company = str(body.company, 160);
  const contactName = str(body.contactName, 120);
  const email = str(body.email, 160);
  const phone = str(body.phone, 40);
  const useCase = str(body.useCase, 2000);
  const expectedCalls = str(body.expectedCalls, 80);
  const industry = str(body.industry, 80);

  const missing = [
    ["company", company],
    ["contactName", contactName],
    ["email", email],
    ["phone", phone],
    ["useCase", useCase],
    ["expectedCalls", expectedCalls],
    ["industry", industry],
  ]
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length) {
    return NextResponse.json(
      { ok: false, error: `Please complete: ${missing.join(", ")}.` },
      { status: 422 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 422 });
  }

  // ── reCAPTCHA v3 (v2 fallback handled below 0.5) ──────────────────────────
  const captcha = await verifyCaptcha(
    str(body.captchaToken, 4000) || null,
    str(body.captchaV2Token, 4000) || null,
    0.5
  );
  if (captcha.status === "low") {
    return NextResponse.json(
      { ok: false, requiresChallenge: true, error: "Additional verification required." },
      { status: 409 }
    );
  }
  if (captcha.status === "failed" || captcha.status === "missing") {
    return NextResponse.json({ ok: false, error: "Captcha verification failed." }, { status: 403 });
  }

  const application: LicenceApplication = {
    id: `RV-${Date.now().toString(36).toUpperCase()}`,
    company,
    contactName,
    email,
    phone,
    useCase,
    expectedCalls,
    industry,
    submittedAt: new Date().toISOString(),
    captcha: captcha.kind,
  };

  await kvPush("rv:licences", application, 500);

  const mail = await sendMail({
    subject: `Raphael Voice API licence application — ${company} (${application.id})`,
    to: process.env.MAIL_TO,
    text: [
      `Application ${application.id}`,
      `Company: ${company}`,
      `Contact: ${contactName} <${email}> ${phone}`,
      `Industry: ${industry}`,
      `Expected monthly calls: ${expectedCalls}`,
      `Captcha: ${captcha.kind}${captcha.score !== undefined ? ` (score ${captcha.score})` : ""}`,
      "",
      "Use case:",
      useCase,
    ].join("\n"),
  });

  const whatsappUrl = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
    `Hello! I am ${contactName} from ${company}. I just submitted API licence application ${application.id} for ${industry.toLowerCase()} (${expectedCalls} calls/month).`
  )}`;

  return NextResponse.json({
    ok: true,
    id: application.id,
    whatsappUrl: whatsappUrl || WHATSAPP_LINK,
    emailsSent: mail.sent,
    stored: kvConfigured,
    mailConfigured,
    captchaDisabled: captcha.kind === "disabled",
  });
}
