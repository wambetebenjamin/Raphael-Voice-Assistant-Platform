import { NextResponse } from "next/server";
import { kvGet, kvIncrBy, kvSet } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Live usage board feed.
 *
 * Vercel Functions cannot hold WebSocket connections open, so the transport is
 * HTTP: GET returns the current board state and POST ?action=join records an
 * optimistic presence tick. The client prefers a real WebSocket when
 * NEXT_PUBLIC_WS_URL is configured; both speak this exact JSON contract:
 *   { activeToday: number; currentlyActive: number; dots: number[] }
 */

const BASE_SESSIONS = 3241; // simulated historical baseline for a new deployment

type Board = { activeToday: number; currentlyActive: number; dots: number[]; updatedAt: string };

function withDots(count: number): number[] {
  const total = Math.max(1, Math.min(count, 60));
  return Array.from({ length: total }, (_, i) => (i % 4) + 1);
}

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const [todayTicks, presence] = await Promise.all([
    kvGet<number>(`rv:board:today:${today}`),
    kvGet<{ active: number; at: number }>("rv:board:presence"),
  ]);

  const now = Date.now();
  const freshPresence = presence && now - presence.at < 90_000 ? presence.active : 0;

  const board: Board = {
    activeToday: BASE_SESSIONS + (Number(todayTicks) || 0),
    currentlyActive: Math.max(1, freshPresence),
    dots: withDots(Math.max(1, freshPresence)),
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json(board, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const action = new URL(request.url).searchParams.get("action");
  if (action !== "join") {
    return NextResponse.json({ ok: false, error: "Unsupported action." }, { status: 400 });
  }
  const today = new Date().toISOString().slice(0, 10);
  const ticks = await kvIncrBy(`rv:board:today:${today}`, 1);

  const presence = (await kvGet<{ active: number; at: number }>("rv:board:presence")) ?? { active: 0, at: 0 };
  const fresh = Date.now() - presence.at < 90_000 ? presence.active : 0;
  const active = fresh + 1;
  await kvSet("rv:board:presence", { active, at: Date.now() });

  return NextResponse.json({
    ok: true,
    activeToday: BASE_SESSIONS + ticks,
    currentlyActive: active,
    dots: withDots(active),
  });
}
