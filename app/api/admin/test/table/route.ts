import { NextResponse } from "next/server";
import { supabase } from "@/app/(server-lib)/supabase";

export async function GET() {
  const [leadsRes, pvRes] = await Promise.all([
    supabase.from("leads").select("*").limit(1),
    supabase.from("page_views").select("*").limit(1),
  ]);

  const issues: string[] = [];
  if (leadsRes.error) issues.push(`leads: ${leadsRes.error.message}`);
  if (pvRes.error) issues.push(`page_views: ${pvRes.error.message}`);

  if (issues.length > 0) {
    return NextResponse.json({
      ok: false,
      detail: `Table check failed: ${issues.join("; ")}`,
    });
  }

  return NextResponse.json({
    ok: true,
    detail: "Tables OK: leads + page_views accessible",
  });
}
