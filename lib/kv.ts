/**
 * Key-value store used for demo sessions, licence applications, newsletter
 * signups and the live presence board.
 *
 * Primary: Vercel KV / Upstash Redis over its REST API (zero extra deps, the
 * KV integration injects KV_REST_API_URL / KV_REST_API_TOKEN automatically).
 * Fallback: an in-process Map so the site is fully functional with no env.
 */

const KV_URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const KV_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

export const kvConfigured = Boolean(KV_URL && KV_TOKEN);

const memory = new Map<string, string>();

async function cmd(...args: (string | number)[]): Promise<unknown> {
  if (!kvConfigured) {
    const [op, key, value] = args as [string, string, string?];
    switch (op) {
      case "GET":
        return memory.get(key) ?? null;
      case "SET":
        memory.set(key, String(value));
        return "OK";
      case "INCRBY": {
        const next = (Number(memory.get(key) ?? "0") || 0) + Number(value);
        memory.set(key, String(next));
        return next;
      }
      case "KEYS": {
        const prefix = String(key);
        return [...memory.keys()].filter((k) =>
          prefix === "*" ? true : k.startsWith(prefix.replace("*", ""))
        );
      }
      default:
        return null;
    }
  }
  const res = await fetch(KV_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`kv-error-${res.status}`);
  const json = (await res.json()) as { result?: unknown };
  return json.result;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  try {
    const raw = (await cmd("GET", key)) as string | null;
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  try {
    await cmd("SET", key, JSON.stringify(value));
  } catch {
    /* non-fatal */
  }
}

export async function kvIncrBy(key: string, by = 1): Promise<number> {
  try {
    return Number(await cmd("INCRBY", key, by)) || 0;
  } catch {
    return 0;
  }
}

export async function kvKeys(prefix: string): Promise<string[]> {
  try {
    return ((await cmd("KEYS", `${prefix}*`)) as string[]) ?? [];
  } catch {
    return [];
  }
}

/** Append to a JSON list stored at `key`, capped at `cap` entries. */
export async function kvPush<T>(key: string, item: T, cap = 200): Promise<void> {
  const list = (await kvGet<T[]>(key)) ?? [];
  list.unshift(item);
  await kvSet(key, list.slice(0, cap));
}

export async function kvList<T>(key: string): Promise<T[]> {
  return (await kvGet<T[]>(key)) ?? [];
}
