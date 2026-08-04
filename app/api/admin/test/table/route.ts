import { NextResponse } from "next/server";
import { supabase } from "@/app/(server-lib)/supabase";

export async function GET() {
  const [leads, pv] = await Promise.all([
    supabase.from("leads").select("id").limit(1),
    supabase.from("page_views").select("view_id").limit(1),
  ]);

  const issues: string[] = [];
  if (leads.error) issues.push(`leads: ${leads.error.message}`);
  if (pv.error) issues.push(`page_views: ${pv.error.message}`);

  if (issues.length > 0) {
    return NextResponse.json({ ok: false, detail: `Tables not found — run supabase-schema.sql | ${issues.join("; ")}` });
  }

  return NextResponse.json({ ok: true, detail: "Tables OK — leads + page_views accessible" });
}
