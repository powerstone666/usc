import { NextResponse } from "next/server";

export async function GET() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;

  if (gtmId) {
    return NextResponse.json({
      ok: true,
      detail: `GTM Container: ${gtmId} (GA4 loaded via GTM)`,
    });
  }

  if (ga4Id) {
    return NextResponse.json({
      ok: true,
      detail: `GA4 gtag.js direct (no GTM). Measurement ID: ${ga4Id}`,
    });
  }

  return NextResponse.json({
    ok: false,
    detail: "No GTM or GA4 env vars set (NEXT_PUBLIC_GTM_ID / NEXT_PUBLIC_GA4_ID)",
  });
}
