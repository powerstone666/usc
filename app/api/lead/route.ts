import { NextResponse } from "next/server";
import type { LeadInput } from "@/app/(common-lib)/types";
import { insertLead } from "@/app/(server-lib)/supabase";
import { collectTelemetry } from "@/app/(server-lib)/telemetry";
import { generateFingerprint } from "@/app/(server-lib)/fingerprint";
import { sendLeadNotification } from "@/app/(server-lib)/telegram";

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

  const leadId = `lead_${Date.now().toString(36)}`;
  const receivedAt = new Date().toISOString();
  const ct = body.telemetry || {};

  const srv = await collectTelemetry(req.headers);
  const fingerprint = generateFingerprint({
    ipAddress: srv.ipAddress,
    userAgent: srv.userAgent,
    screenResolution: ct.screen_resolution || "",
    language: ct.language || "",
    timezone: ct.timezone || "",
    colorDepth: ct.color_depth,
    deviceType: ct.device_type || srv.deviceType,
  });

  await insertLead({
    id: leadId,
    receivedAt,
    appliance: body.appliance,
    issue: body.issue || "",
    name: body.name || "",
    phone,
    source: body.source || "unknown",
    pageUrl: ct.page_url || srv.userAgent,
    userAgent: srv.userAgent,
    ipAddress: srv.ipAddress,
    city: srv.city,
    region: srv.region,
    country: srv.country,
    isp: srv.isp,
    asn: srv.asn,
    browser: srv.browser,
    browserVersion: srv.browserVersion,
    os: srv.os,
    osVersion: srv.osVersion,
    deviceType: srv.deviceType,
    deviceModel: srv.deviceModel,
    deviceVendor: srv.deviceVendor,
    sessionId: ct.session_id || "",
    timeOnPage: ct.time_on_page || 0,
    screenResolution: ct.screen_resolution || "",
    viewport: ct.viewport || "",
    language: ct.language || "",
    referrer: ct.referrer || "",
    trafficSource: ct.traffic_source || "",
    trafficMedium: ct.traffic_medium || "",
    trafficCategory: ct.traffic_category || "",
    trafficCampaign: ct.traffic_campaign || "",
    gclid: ct.gclid || "",
    fingerprint,
  });

  await sendLeadNotification({
    leadId,
    appliance: body.appliance,
    issue: body.issue || "",
    name: body.name || "",
    phone: phone,
    source: body.source || "unknown",
    city: srv.city,
    region: srv.region,
    isp: srv.isp,
    browser: srv.browser,
    os: srv.os,
    deviceType: srv.deviceType,
    screenResolution: ct.screen_resolution || "",
    trafficSource: ct.traffic_source || "",
    trafficMedium: ct.traffic_medium || "",
    trafficCategory: ct.traffic_category || "",
    timeOnPage: ct.time_on_page || 0,
    fingerprint,
    pageUrl: ct.page_url || "",
  });

  return NextResponse.json({ ok: true, id: leadId });
}
