import { NextResponse } from "next/server";
import { query } from "@/app/(server-lib)/db";

export async function GET() {
  const leads = await query<{ count: string }>("SELECT COUNT(*) as count FROM leads");
  const pv = await query<{ count: string }>("SELECT COUNT(*) as count FROM page_views");

  if (leads.length === 0 && pv.length === 0) {
    return NextResponse.json({
      ok: false,
      detail: "Tables not found — run supabase-schema.sql in Supabase SQL Editor",
    });
  }

  const toNum = (v: string | undefined) => v ? parseInt(v) : 0;
  return NextResponse.json({
    ok: true,
    detail: `Tables OK — leads: ${toNum(leads[0]?.count)} rows, page_views: ${toNum(pv[0]?.count)} rows`,
  });
}
