import { NextResponse } from "next/server";
import { addKeyword, refreshTopicPaths } from "@/app/(server-lib)/keyword-sync";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { query?: unknown } | null;
  const query = typeof body?.query === "string" ? body.query.trim() : "";
  if (query.length < 4 || query.length > 100) {
    return NextResponse.json({ ok: false, error: "Enter a search phrase between 4 and 100 characters." }, { status: 400 });
  }
  const result = await addKeyword(query);
  if (result.ok && result.keyword) {
    refreshTopicPaths([result.keyword.slug]);
  }
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
