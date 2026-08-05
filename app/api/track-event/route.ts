import { NextResponse } from "next/server";
import { collectTelemetry } from "@/app/(server-lib)/telemetry";
import { generateFingerprint } from "@/app/(server-lib)/fingerprint";
import { sendEventNotification } from "@/app/(server-lib)/telegram";
import { supabase } from "@/app/(server-lib)/supabase";

export async function POST(req: Request) {
  let body: { event?: string; source?: string; telemetry?: Record<string, unknown>; extra?: Record<string, unknown> };
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

  const eventId = `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  await supabase.from("events").insert({
    event_id: eventId,
    received_at: new Date().toISOString(),
    session_id: (ct.session_id as string) || "",
    event_type: body.event,
    event_source: body.source || "",
    page_url: (ct.page_url as string) || "",
    page_title: (ct.page_title as string) || "",
    ip_address: srv.ipAddress,
    city: srv.city,
    country: srv.country,
    isp: srv.isp,
    browser: srv.browser,
    os: srv.os,
    device_type: srv.deviceType,
    traffic_category: (ct.traffic_category as string) || "",
    time_on_page: (ct.time_on_page as number) || 0,
    fingerprint,
    extra: body.extra || {},
  });

  if (body.event === "click_to_call" || body.event === "whatsapp_click") {
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
  }

  return NextResponse.json({ ok: true, id: eventId });
}
