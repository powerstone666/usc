import { NextResponse } from "next/server";
import { collectTelemetry } from "@/app/(server-lib)/telemetry";
import { getBigQuery } from "@/app/(server-lib)/bigquery";
import { generateFingerprint } from "@/app/(server-lib)/fingerprint";

const datasetId = process.env.BIGQUERY_DATASET_ID || "analytics";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const bq = getBigQuery();
  if (!bq) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const srv = await collectTelemetry(req.headers);
  const ct = (body.telemetry || {}) as Record<string, unknown>;
  const fingerprint = generateFingerprint({
    ipAddress: srv.ipAddress,
    userAgent: srv.userAgent,
    screenResolution: ct.screen_resolution as string || "",
    language: ct.language as string || "",
    timezone: ct.timezone as string || "",
    colorDepth: ct.color_depth as number,
    deviceType: ct.device_type as string || srv.deviceType,
  });
  const viewId = `pv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const receivedAt = new Date().toISOString();

  const row = {
    view_id: viewId,
    received_at: receivedAt,
    session_id: ct.session_id || "",
    page_url: ct.page_url || "",
    page_path: ct.page_path || "",
    page_title: ct.page_title || "",
    referrer: ct.referrer || srv.userAgent,
    ip_address: srv.ipAddress,
    city: srv.city,
    region: srv.region,
    country: srv.country,
    isp: srv.isp,
    browser: srv.browser,
    os: srv.os,
    device_type: srv.deviceType,
    screen_resolution: ct.screen_resolution || "",
    language: ct.language || "",
    traffic_source: ct.traffic_source || "",
    traffic_medium: ct.traffic_medium || "",
    traffic_category: ct.traffic_category || "",
    time_on_page: ct.time_on_page || 0,
    fingerprint,
  };

  try {
    await bq.dataset(datasetId).table("page_views").insert([row]);
  } catch (err) {
    console.error("[track] Insert failed:", err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ ok: true, id: viewId });
}
