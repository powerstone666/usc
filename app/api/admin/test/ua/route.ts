import { NextResponse } from "next/server";
import { collectTelemetry } from "@/app/(common-lib)/telemetry";

export async function GET() {
  const headers = new Headers({
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  try {
    const t = await collectTelemetry(headers);
    return NextResponse.json({
      ok: true,
      detail: `Browser: ${t.browser} ${t.browserVersion} | OS: ${t.os} ${t.osVersion} | Device: ${t.deviceType} ${t.deviceVendor} ${t.deviceModel}`,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      detail: err instanceof Error ? err.message : "UA parsing failed",
    });
  }
}
