import { NextResponse } from "next/server";
import type { LeadInput } from "@/app/(common-lib)/types";
import { insertLead } from "@/app/(server-lib)/supabase";
import { collectTelemetry } from "@/app/(server-lib)/telemetry";
import { generateFingerprint } from "@/app/(server-lib)/fingerprint";
import { sendLeadNotification } from "@/app/(server-lib)/telegram";
import {
  normalizePhone,
  getPhoneValidationError,
} from "@/app/(common-lib)/validation";

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

  const phone = normalizePhone(body.phone || "");

  if (!body.appliance) {
    return NextResponse.json(
      { ok: false, error: "Missing appliance." },
      { status: 422 },
    );
  }

  const phoneError = getPhoneValidationError(phone);
  if (phoneError) {
    return NextResponse.json(
      { ok: false, error: phoneError },
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
    appliance: body.appliance,
    issue: body.issue || "",
    name: body.name || "",
    phone: phone,
    city: srv.city,
    region: srv.region,
    country: srv.country,
    ipAddress: srv.ipAddress,
    isp: srv.isp,
    deviceType: srv.deviceType,
    browser: srv.browser,
    os: srv.os,
  });

  return NextResponse.json({ ok: true, id: leadId });
}
