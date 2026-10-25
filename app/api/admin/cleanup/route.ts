import { NextResponse } from "next/server";
import { supabase } from "@/app/(server-lib)/supabase";

export async function POST(req: Request) {
  let body: { target?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { target } = body;

  try {
    if (target === "junk_leads") {
      // Purge historical modal-opening clicks and post-submit duplicate clicks from leads
      const [r1, r2] = await Promise.all([
        supabase.from("leads").delete().like("source", "click_to_call:%"),
        supabase.from("leads").delete().eq("source", "tel_click:diagnostic-done"),
      ]);

      if (r1.error || r2.error) {
        return NextResponse.json(
          { ok: false, error: (r1.error || r2.error)?.message },
          { status: 500 },
        );
      }
      return NextResponse.json({
        ok: true,
        message: "Successfully purged all historical modal-opening clicks from leads",
      });
    }

    if (target === "all_leads") {
      // Delete all leads
      const { error } = await supabase.from("leads").delete().neq("id", "");
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, message: "All leads cleared successfully" });
    }

    if (target === "page_views") {
      // Clear page views
      const { error } = await supabase.from("page_views").delete().neq("view_id", "");
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, message: "Page views cleared successfully" });
    }

    if (target === "full_reset") {
      // Complete reset: leads and page views
      const [r1, r2] = await Promise.all([
        supabase.from("leads").delete().neq("id", ""),
        supabase.from("page_views").delete().neq("view_id", ""),
      ]);

      if (r1.error || r2.error) {
        return NextResponse.json(
          { ok: false, error: (r1.error || r2.error)?.message },
          { status: 500 },
        );
      }
      return NextResponse.json({
        ok: true,
        message: "Full reset completed: leads and visitor data cleared",
      });
    }

    return NextResponse.json(
      { ok: false, error: "Unknown cleanup target" },
      { status: 400 },
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Cleanup failed" },
      { status: 500 },
    );
  }
}

