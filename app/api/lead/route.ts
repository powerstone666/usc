import { NextResponse } from "next/server";
import type { LeadInput } from "@/app/(common-lib)/types";

const PHONE_RE = /^[6-9]\d{9}$/;

export async function POST(req: Request) {
  let body: LeadInput;
  try {
    body = (await req.json()) as LeadInput;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const phone = (body.phone || "").replace(/\D/g, "").slice(-10);

  if (!body.appliance) {
    return NextResponse.json(
      { ok: false, error: "Missing appliance." },
      { status: 422 },
    );
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid 10-digit Indian mobile number." },
      { status: 422 },
    );
  }

  // TODO(step-2): email this lead to the team via Hostinger SMTP
  // and emit the GA4 dataLayer event (analytics integration).
  const lead = {
    ...body,
    phone,
    receivedAt: new Date().toISOString(),
    id: `lead_${Date.now().toString(36)}`,
  };
  console.log("[lead]", JSON.stringify(lead));

  return NextResponse.json({ ok: true, id: lead.id });
}
