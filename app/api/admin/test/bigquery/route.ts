import { NextResponse } from "next/server";
import { isDbConfigured } from "@/app/(server-lib)/db";

export async function GET() {
  const ok = await isDbConfigured();
  if (!ok) {
    return NextResponse.json({
      ok: false,
      detail: "PostgreSQL connection failed — check DATABASE_URL in env",
    });
  }
  return NextResponse.json({
    ok: true,
    detail: "Connected to PostgreSQL (Supabase)",
  });
}
