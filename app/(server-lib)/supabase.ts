import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

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
  try {
    const { error } = await supabase.from("leads").insert({
      id: record.id,
      received_at: record.receivedAt,
      appliance: record.appliance,
      issue: record.issue || "",
      name: record.name || "",
      phone: record.phone,
      phone_hash: phoneHash,
      phone_last4: record.phone.slice(-4),
      source: record.source,
      page_url: record.pageUrl,
      user_agent: record.userAgent,
      ip_address: record.ipAddress,
      city: record.city,
      region: record.region,
      country: record.country,
      isp: record.isp,
      asn: record.asn,
      browser: record.browser,
      browser_version: record.browserVersion,
      os: record.os,
      os_version: record.osVersion,
      device_type: record.deviceType,
      device_model: record.deviceModel,
      device_vendor: record.deviceVendor,
      session_id: record.sessionId,
      time_on_page: record.timeOnPage,
      screen_resolution: record.screenResolution,
      viewport: record.viewport,
      language: record.language,
      referrer: record.referrer,
      traffic_source: record.trafficSource,
      traffic_medium: record.trafficMedium,
      traffic_category: record.trafficCategory,
      traffic_campaign: record.trafficCampaign,
      gclid: record.gclid,
      fingerprint: record.fingerprint,
    });
    if (error) {
      console.error("[supabase] Lead insert failed:", error.message);
      return false;
    }
    console.log("[supabase] Lead inserted:", record.id);
    return true;
  } catch (err) {
    console.error("[supabase] Lead insert error:", err);
    return false;
  }
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
  try {
    const { error } = await supabase.from("page_views").insert(record);
    if (error) {
      console.error("[supabase] Page view insert failed:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[supabase] Page view insert error:", err);
    return false;
  }
}

export async function isSupabaseConfigured(): Promise<boolean> {
  const { error } = await supabase.from("leads").select("id").limit(1);
  return !error;
}
