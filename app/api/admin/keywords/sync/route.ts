import { NextResponse } from "next/server";
import { refreshTopicPaths, syncKeywords } from "@/app/(server-lib)/keyword-sync";

// Admin-only (proxy.ts guards /api/admin/*). Finds new keywords and publishes them straight away.
export async function POST() {
  const result = await syncKeywords();
  if (result.added > 0) refreshTopicPaths(result.pages.map((p) => p.slug));
  // Failures are reported in the body (ok: false, error) so the screen can show them; a 5xx would only add console noise.
  return NextResponse.json(result);
}
