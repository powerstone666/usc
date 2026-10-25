import { NextResponse } from "next/server";
import { autoDiscover, refreshTopicPaths } from "@/app/(server-lib)/keyword-sync";

export const dynamic = "force-dynamic";

// Called by <DiscoveryPing> when someone opens a topic page or the admin keyword screen.
// Public on purpose and safe to be: it takes no input, runs at most once a day (claimed in the
// database) and only ever publishes keywords that pass the rules. It never touches main pages.
export async function POST() {
  const { ran, result } = await autoDiscover();
  if (result && result.added > 0) refreshTopicPaths(result.pages.map((p) => p.slug));
  return NextResponse.json({ ran, added: result?.added ?? 0, pages: result?.pages ?? [] });
}
