import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  product: z.string().trim().min(1).max(60),
  subjectType: z.enum(["GROUP", "USER", "GAME"]),
  subjectId: z.coerce.string().trim().min(1).max(40),
  key: z.string().trim().max(200).optional(),
});

// Simple in-memory per-IP rate limit (single instance): 60 requests / minute
const hits = new Map<string, { n: number; reset: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { n: 1, reset: now + 60_000 });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    return false;
  }
  return ++h.n > 60;
}

function authorized(req: Request) {
  const token = process.env.LICENSE_API_TOKEN;
  if (!token) return true; // token optional
  const got = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(got);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * POST /api/v1/licenses/verify
 * Body: { product, subjectType: "GROUP"|"USER"|"GAME", subjectId, key? }
 * Response: { valid: boolean, status: "valid"|"not_found"|"suspended"|"expired"|"key_mismatch", expiresAt? }
 */
export async function POST(req: Request) {
  // Behind the Cloudflare tunnel the real client IP is in cf-connecting-ip
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ valid: false, status: "rate_limited" }, { status: 429 });
  if (!authorized(req)) return NextResponse.json({ valid: false, status: "unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ valid: false, status: "bad_request" }, { status: 400 });
  const { product, subjectType, subjectId, key } = parsed.data;

  const lic = await db.license.findUnique({
    where: { product_subjectType_subjectId: { product, subjectType, subjectId } },
    select: { key: true, status: true, expiresAt: true, client: { select: { status: true } } },
  });
  const res = (valid: boolean, status: string, extra: object = {}) => NextResponse.json({ valid, status, ...extra });

  if (!lic) return res(false, "not_found");
  if (key && key !== lic.key) return res(false, "key_mismatch");
  if (lic.status === "SUSPENDED" || lic.client.status === "SUSPENDED") return res(false, "suspended");
  if (lic.expiresAt && lic.expiresAt < new Date()) return res(false, "expired");
  return res(true, "valid", { expiresAt: lic.expiresAt });
}
