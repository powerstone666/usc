import { after, NextResponse } from "next/server";
import { collectTelemetry } from "@/app/(server-lib)/telemetry";
import { generateFingerprint } from "@/app/(server-lib)/fingerprint";
import { supabase } from "@/app/(server-lib)/supabase";
import { sendContactTapNotification } from "@/app/(server-lib)/telegram";

// One alert per visitor and kind every 5 minutes, so repeated taps do not flood Telegram.
// In memory, so it is best effort across serverless instances.
const recentAlerts = new Map<string, number>();
const ALERT_GAP_MS = 5 * 60 * 1000;

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

  // Only direct contact actions are stored, and only as leads:
  // 1. WhatsApp tap (wa.me link)
  // 2. Phone call tap (tel: link, excluding the post-submit "diagnostic-done" one to avoid duplicates)
  // Every other interaction is analytics-only (GA4/GTM) and is not recorded here.
  const isDirectCall = body.event === "tel_click" && body.source !== "diagnostic-done";
  const isWhatsApp = body.event === "whatsapp_click";
  if (!isDirectCall && !isWhatsApp) return NextResponse.json({ ok: true });

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

  const leadId = `${isWhatsApp ? "wa" : "call"}_${Date.now().toString(36)}`;
  const now = new Date().toISOString();

  // Infer appliance from URL or extra metadata
  let appliance = (body.extra?.service as string) || "";
  const pageUrl = (ct.page_url as string) || "";
  if (!appliance && pageUrl) {
    if (pageUrl.includes("microwave")) appliance = "microwave-repair";
    else if (pageUrl.includes("washing-machine")) appliance = "washing-machine-repair";
    else if (pageUrl.includes("refrigerator") || pageUrl.includes("fridge")) appliance = "refrigerator-repair";
    else if (pageUrl.includes("ac-") || pageUrl.includes("air-conditioner")) appliance = "ac-repair";
    else if (pageUrl.includes("water-filter") || pageUrl.includes("water-purifier") || pageUrl.includes("ro-")) appliance = "water-filter-repair";
    else if (pageUrl.includes("chimney")) appliance = "chimney-repair";
  }

  const cleanSource = isWhatsApp ? "whatsapp-now" : "call-now";
  const defaultIssue = isWhatsApp ? "WhatsApp Inquiry" : "Direct Phone Call";

  await supabase.from("leads").insert({
    id: leadId,
    received_at: now,
    appliance: appliance || "general",
    issue: defaultIssue,
    name: "",
    phone: "",
    phone_hash: "",
    phone_last4: "",
    source: cleanSource,
    page_url: pageUrl,
    user_agent: srv.userAgent,
    ip_address: srv.ipAddress,
    city: srv.city,
    region: srv.region,
    country: srv.country,
    isp: srv.isp,
    asn: srv.asn,
    browser: srv.browser,
    browser_version: srv.browserVersion,
    os: srv.os,
    os_version: srv.osVersion,
    device_type: srv.deviceType,
    device_model: srv.deviceModel,
    device_vendor: srv.deviceVendor,
    session_id: (ct.session_id as string) || "",
    time_on_page: (ct.time_on_page as number) || 0,
    screen_resolution: (ct.screen_resolution as string) || "",
    viewport: (ct.viewport as string) || "",
    language: (ct.language as string) || "",
    referrer: (ct.referrer as string) || "",
    traffic_source: (ct.traffic_source as string) || "",
    traffic_medium: (ct.traffic_medium as string) || "",
    traffic_category: (ct.traffic_category as string) || "",
    traffic_campaign: (ct.traffic_campaign as string) || "",
    gclid: (ct.gclid as string) || "",
    fingerprint,
  });

  // Heads-up on Telegram. Skipped for localhost and other dev traffic, and for repeat taps.
  const isTest = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/i.test(pageUrl);
  const alertKey = `${fingerprint}:${isWhatsApp ? "wa" : "call"}`;
  const last = recentAlerts.get(alertKey) ?? 0;
  if (!isTest && Date.now() - last > ALERT_GAP_MS) {
    recentAlerts.set(alertKey, Date.now());
    if (recentAlerts.size > 500) for (const [k, t] of recentAlerts) if (Date.now() - t > ALERT_GAP_MS) recentAlerts.delete(k);
    after(async () => {
      await sendContactTapNotification({
        kind: isWhatsApp ? "whatsapp" : "call",
        appliance: appliance || "general",
        pageUrl,
        city: srv.city,
        region: srv.region,
        deviceType: srv.deviceType,
        os: srv.os,
        browser: srv.browser,
      }).catch(() => {});
    });
  }

  return NextResponse.json({ ok: true });
}
