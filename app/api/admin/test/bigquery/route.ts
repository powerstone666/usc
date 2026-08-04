import { NextResponse } from "next/server";
import { supabase } from "@/app/(server-lib)/supabase";

export async function GET() {
  const { error, count } = await supabase.from("leads").select("*", { count: "exact", head: true });
  if (error) {
    return NextResponse.json({ ok: false, detail: `Supabase error: ${error.message}` });
  }
  return NextResponse.json({ ok: true, detail: `Connected | leads table: ${count ?? 0} rows` });
}
