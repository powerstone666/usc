import { NextResponse } from "next/server";
import { refreshTopicPaths, syncKeywords } from "@/app/(server-lib)/keyword-sync";

export const dynamic = "force-dynamic";

// Scheduled discovery (see vercel.json). Vercel sends "Authorization: Bearer <CRON_SECRET>" itself.
// Outside /api/admin on purpose, so it is guarded by the secret instead of the admin login.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "CRON_SECRET is not set." }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  const result = await syncKeywords();
  if (result.added > 0) refreshTopicPaths(result.pages.map((p) => p.slug));
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
