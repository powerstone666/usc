import { NextResponse } from "next/server";

export async function GET() {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  if (!ga4Id) {
    return NextResponse.json({ ok: false, detail: "NEXT_PUBLIC_GA4_ID not set" });
  }
  return NextResponse.json({
    ok: true,
    detail: `GA4 Measurement ID: ${ga4Id}`,
  });
}
