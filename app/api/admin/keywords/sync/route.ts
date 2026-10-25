import { NextResponse } from "next/server";
import { refreshTopicPaths, syncKeywords } from "@/app/(server-lib)/keyword-sync";

// Admin-only (proxy.ts guards /api/admin/*). Finds new keywords and publishes them straight away.
export async function POST() {
  const result = await syncKeywords();
  if (result.added > 0) refreshTopicPaths(result.pages.map((p) => p.slug));
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
