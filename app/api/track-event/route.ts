import { NextResponse } from "next/server";
import { collectTelemetry } from "@/app/(server-lib)/telemetry";
import { generateFingerprint } from "@/app/(server-lib)/fingerprint";
import { sendEventNotification } from "@/app/(server-lib)/telegram";

export async function POST(req: Request) {
  let body: { event?: string; source?: string; telemetry?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!body.event) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const srv = await collectTelemetry(req.headers);
  const ct = body.telemetry || {};
  const fingerprint = generateFingerprint({
    ipAddress: srv.ipAddress,
    userAgent: srv.userAgent,
    screenResolution: (ct.screen_resolution as string) || "",
    language: (ct.language as string) || "",
    timezone: (ct.timezone as string) || "",
    colorDepth: ct.color_depth as number,
    deviceType: (ct.device_type as string) || srv.deviceType,
  });

  await sendEventNotification({
    event: body.event,
    source: body.source || "unknown",
    city: srv.city,
    isp: srv.isp,
    browser: srv.browser,
    os: srv.os,
    deviceType: srv.deviceType,
    trafficCategory: (ct.traffic_category as string) || "",
    timeOnPage: (ct.time_on_page as number) || 0,
    fingerprint,
    pageUrl: (ct.page_url as string) || "",
  });

  return NextResponse.json({ ok: true });
}
