import { NextResponse } from "next/server";
import { refreshTopicPaths, setPublished } from "@/app/(server-lib)/keyword-sync";

// Admin-only (proxy.ts guards /api/admin/*). Unpublish a keyword page, or bring it back.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { slug?: unknown; published?: unknown } | null;
  const slug = typeof body?.slug === "string" ? body.slug : "";
  if (!/^[a-z0-9-]{3,140}$/.test(slug) || typeof body?.published !== "boolean") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const result = await setPublished(slug, body.published);
  if (result.ok) refreshTopicPaths([slug]);
  return NextResponse.json(result, { status: result.ok ? 200 : 404 });
}
