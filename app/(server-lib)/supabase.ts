import { createHash } from "crypto";
import { query, execute } from "@/app/(server-lib)/db";

export type LeadRow = {
  id: string;
  received_at: string;
  appliance: string;
  issue: string;
  name: string;
  phone: string;
  phone_hash: string;
  phone_last4: string;
  source: string;
  page_url: string;
  user_agent: string;
  ip_address: string;
  city: string;
  region: string;
  country: string;
  isp: string;
  asn: string;
  browser: string;
  browser_version: string;
  os: string;
  os_version: string;
  device_type: string;
  device_model: string;
  device_vendor: string;
  session_id: string;
  time_on_page: number;
  screen_resolution: string;
  viewport: string;
  language: string;
  referrer: string;
  traffic_source: string;
  traffic_medium: string;
  traffic_category: string;
  traffic_campaign: string;
  gclid: string;
  fingerprint: string;
};

export type LeadInput = {
  id: string;
  receivedAt: string;
  appliance: string;
  issue: string;
  name: string;
  phone: string;
  source: string;
  pageUrl: string;
  userAgent: string;
  ipAddress: string;
  city: string;
  region: string;
  country: string;
  isp: string;
  asn: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: string;
  deviceModel: string;
  deviceVendor: string;
  sessionId: string;
  timeOnPage: number;
  screenResolution: string;
  viewport: string;
  language: string;
  referrer: string;
  trafficSource: string;
  trafficMedium: string;
  trafficCategory: string;
  trafficCampaign: string;
  gclid: string;
  fingerprint: string;
};

export async function insertLead(record: LeadInput): Promise<boolean> {
  const phoneHash = createHash("sha256").update(record.phone).digest("hex");
  const sql = `INSERT INTO leads (
    id, received_at, appliance, issue, name, phone, phone_hash, phone_last4,
    source, page_url, user_agent, ip_address, city, region, country,
    isp, asn, browser, browser_version, os, os_version,
    device_type, device_model, device_vendor, session_id, time_on_page,
    screen_resolution, viewport, language, referrer, traffic_source,
    traffic_medium, traffic_category, traffic_campaign, gclid, fingerprint
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36)`;

  const params = [
    record.id, record.receivedAt, record.appliance, record.issue || "",
    record.name || "", record.phone, phoneHash, record.phone.slice(-4),
    record.source, record.pageUrl, record.userAgent, record.ipAddress,
    record.city, record.region, record.country, record.isp, record.asn,
    record.browser, record.browserVersion, record.os, record.osVersion,
    record.deviceType, record.deviceModel, record.deviceVendor,
    record.sessionId, record.timeOnPage, record.screenResolution,
    record.viewport, record.language, record.referrer,
    record.trafficSource, record.trafficMedium, record.trafficCategory,
    record.trafficCampaign, record.gclid, record.fingerprint,
  ];

  const ok = await execute(sql, params);
  return ok;
}

export type PageViewRow = {
  view_id: string;
  received_at: string;
  session_id: string;
  page_url: string;
  page_path: string;
  page_title: string;
  referrer: string;
  ip_address: string;
  city: string;
  region: string;
  country: string;
  isp: string;
  browser: string;
  os: string;
  device_type: string;
  screen_resolution: string;
  language: string;
  traffic_source: string;
  traffic_medium: string;
  traffic_category: string;
  time_on_page: number;
  fingerprint: string;
};

export async function insertPageView(record: PageViewRow): Promise<boolean> {
  const sql = `INSERT INTO page_views (
    view_id, received_at, session_id, page_url, page_path, page_title,
    referrer, ip_address, city, region, country, isp, browser, os,
    device_type, screen_resolution, language, traffic_source,
    traffic_medium, traffic_category, time_on_page, fingerprint
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)`;

  const params = [
    record.view_id, record.received_at, record.session_id,
    record.page_url, record.page_path, record.page_title,
    record.referrer, record.ip_address, record.city, record.region,
    record.country, record.isp, record.browser, record.os,
    record.device_type, record.screen_resolution, record.language,
    record.traffic_source, record.traffic_medium, record.traffic_category,
    record.time_on_page, record.fingerprint,
  ];

  return execute(sql, params);
}

export { query, isDbConfigured } from "@/app/(server-lib)/db";
