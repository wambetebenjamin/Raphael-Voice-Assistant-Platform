/** Nodemailer transport with a graceful dry-run when SMTP is unconfigured. */

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function getTransport(): Transporter | null {
  if (transporter) return transporter;
  const url = process.env.SMTP_URL;
  if (url) {
    transporter = nodemailer.createTransport(url);
    return transporter;
  }
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 465),
      secure: Number(SMTP_PORT || 465) === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    return transporter;
  }
  return null;
}

export const mailConfigured = Boolean(process.env.SMTP_URL || process.env.SMTP_HOST);

export async function sendMail(opts: {
  subject: string;
  text: string;
  to?: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const transport = getTransport();
  const to = opts.to || process.env.MAIL_TO || "hello@raphaelvoice.co.ke";
  const from = process.env.MAIL_FROM || "Raphael Voice <no-reply@raphaelvoice.co.ke>";

  if (!transport) {
    // Dry-run: never throws, never blocks a form submission.
    console.info("[mail:dry-run]", { to, subject: opts.subject, body: opts.text });
    return { sent: false, reason: "smtp-not-configured" };
  }
  try {
    await transport.sendMail({ from, to, subject: opts.subject, text: opts.text });
    return { sent: true };
  } catch (error) {
    console.error("[mail:error]", error);
    return { sent: false, reason: "smtp-error" };
  }
}
