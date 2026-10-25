import { NextResponse } from "next/server";
import { supabase } from "@/app/(server-lib)/supabase";

export async function DELETE(req: Request) {
  let body: { id?: string; ids?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const idsToDelete: string[] = [];
  if (body.id) idsToDelete.push(body.id);
  if (Array.isArray(body.ids)) idsToDelete.push(...body.ids);

  if (idsToDelete.length === 0) {
    return NextResponse.json(
      { ok: false, error: "No lead IDs provided" },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("leads").delete().in("id", idsToDelete);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, deleted: idsToDelete.length });
}

