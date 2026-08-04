import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://localhost:3000/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appliance: "microwave-repair",
        phone: "9999999999",
        source: "connection-test",
      }),
    });
    const data = await res.json();
    if (data.ok) {
      return NextResponse.json({
        ok: true,
        detail: "Lead API responding — test lead accepted",
      });
    }
    return NextResponse.json({
      ok: false,
      detail: `Lead API error: ${data.error}`,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      detail: err instanceof Error ? err.message : "Lead API unreachable",
    });
  }
}
