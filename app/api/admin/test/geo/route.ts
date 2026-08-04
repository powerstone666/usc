import { NextResponse } from "next/server";
import { collectTelemetry } from "@/app/(server-lib)/telemetry";

export async function GET() {
  const headers = new Headers({
    "x-forwarded-for": "49.205.123.45",
    "user-agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/537.36",
  });

  try {
    const telemetry = await collectTelemetry(headers);
    return NextResponse.json({
      ok: true,
      detail: `IP: ${telemetry.ipAddress} → ${telemetry.city}, ${telemetry.region}, ${telemetry.country} | ISP: ${telemetry.isp}`,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      detail: err instanceof Error ? err.message : "Geo resolution failed",
    });
  }
}
