import { NextResponse } from "next/server";
import { collectSitemapUrls, indexNowKey, submitUrls } from "@/app/(server-lib)/indexnow";

// Admin-only (proxy.ts guards /api/admin/*). Sends every URL in the sitemaps to IndexNow.
export async function POST() {
  if (!indexNowKey()) return NextResponse.json({ ok: false, error: "IndexNow is off. Set INDEXNOW_KEY (see .env.local.example)." }, { status: 400 });
  const urls = await collectSitemapUrls();
  if ("error" in urls) return NextResponse.json({ ok: false, error: urls.error }, { status: 502 });
  const result = await submitUrls(urls);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
