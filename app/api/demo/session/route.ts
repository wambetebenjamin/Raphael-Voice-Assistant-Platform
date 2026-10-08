import { NextResponse } from "next/server";
import { kvIncrBy, kvPush } from "@/lib/kv";

export const runtime = "nodejs";

/** Logs an opt-in voice demo session (anonymous: no audio, no identifiers). */
export async function POST(request: Request) {
  let startedAt = new Date().toISOString();
  try {
    const body = (await request.json()) as { startedAt?: string };
    if (body?.startedAt) startedAt = String(body.startedAt).slice(0, 40);
  } catch {
    /* empty body is fine */
  }

  const today = new Date().toISOString().slice(0, 10);
  const count = await kvIncrBy(`rv:demo:count:${today}`);
  await kvPush("rv:demo:sessions", { startedAt, at: new Date().toISOString() }, 500);

  return NextResponse.json({ ok: true, sessionsToday: count });
}
