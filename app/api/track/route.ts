import { NextResponse } from "next/server";
import { collectTelemetry } from "@/app/(server-lib)/telemetry";
import { insertPageView } from "@/app/(server-lib)/supabase";
import { generateFingerprint } from "@/app/(server-lib)/fingerprint";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const srv = await collectTelemetry(req.headers);
  const ct = (body.telemetry || {}) as Record<string, unknown>;
  const fingerprint = generateFingerprint({
    ipAddress: srv.ipAddress,
    userAgent: srv.userAgent,
    screenResolution: (ct.screen_resolution as string) || "",
    language: (ct.language as string) || "",
    timezone: (ct.timezone as string) || "",
    colorDepth: ct.color_depth as number,
    deviceType: (ct.device_type as string) || srv.deviceType,
  });
  const viewId = `pv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  await insertPageView({
    view_id: viewId,
    received_at: new Date().toISOString(),
    session_id: (ct.session_id as string) || "",
    page_url: (ct.page_url as string) || "",
    page_path: (ct.page_path as string) || "",
    page_title: (ct.page_title as string) || "",
    referrer: (ct.referrer as string) || "",
    ip_address: srv.ipAddress,
    city: srv.city,
    region: srv.region,
    country: srv.country,
    isp: srv.isp,
    browser: srv.browser,
    os: srv.os,
    device_type: srv.deviceType,
    screen_resolution: (ct.screen_resolution as string) || "",
    language: (ct.language as string) || "",
    traffic_source: (ct.traffic_source as string) || "",
    traffic_medium: (ct.traffic_medium as string) || "",
    traffic_category: (ct.traffic_category as string) || "",
    time_on_page: (ct.time_on_page as number) || 0,
    fingerprint,
  });

  return NextResponse.json({ ok: true, id: viewId });
}
