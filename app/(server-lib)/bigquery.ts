import { BigQuery } from "@google-cloud/bigquery";
import { createHash } from "crypto";

function hashPhone(phone: string): string {
  return createHash("sha256").update(phone).digest("hex");
}

export function getBigQuery(): BigQuery | null {
  const projectId = process.env.BIGQUERY_PROJECT_ID;
  const credentialsJson = process.env.BIGQUERY_CREDENTIALS_JSON;

  if (!projectId || !credentialsJson) {
    return null;
  }

  try {
    const credentials = JSON.parse(credentialsJson);
    return new BigQuery({ projectId, credentials });
  } catch {
    console.error("[bigquery] Failed to parse BIGQUERY_CREDENTIALS_JSON");
    return null;
  }
}

export type LeadRecord = {
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
  latitude: string;
  longitude: string;
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

export async function insertLead(record: LeadRecord): Promise<boolean> {
  const bq = getBigQuery();
  if (!bq) {
    console.log("[bigquery] Not configured — skipping insert");
    return false;
  }

  const datasetId = process.env.BIGQUERY_DATASET_ID || "analytics";
  const tableId = process.env.BIGQUERY_TABLE_ID || "leads";

  const row = {
    lead_id: record.id,
    received_at: record.receivedAt,
    appliance: record.appliance,
    issue: record.issue || "",
    name: record.name || "",
    phone_hash: hashPhone(record.phone),
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
    latitude: record.latitude,
    longitude: record.longitude,
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
  };

  try {
    await bq
      .dataset(datasetId)
      .table(tableId)
      .insert([row]);
    console.log("[bigquery] Lead inserted:", record.id);
    return true;
  } catch (err) {
    console.error("[bigquery] Insert failed:", err);
    return false;
  }
}

export const bigQuerySchema = [
  { name: "lead_id", type: "STRING", mode: "REQUIRED" },
  { name: "received_at", type: "TIMESTAMP", mode: "REQUIRED" },
  { name: "appliance", type: "STRING", mode: "REQUIRED" },
  { name: "issue", type: "STRING" },
  { name: "name", type: "STRING" },
  { name: "phone_hash", type: "STRING", mode: "REQUIRED" },
  { name: "phone_last4", type: "STRING", mode: "REQUIRED" },
  { name: "source", type: "STRING", mode: "REQUIRED" },
  { name: "page_url", type: "STRING" },
  { name: "user_agent", type: "STRING" },
  { name: "ip_address", type: "STRING" },
  { name: "city", type: "STRING" },
  { name: "region", type: "STRING" },
  { name: "country", type: "STRING" },
  { name: "isp", type: "STRING" },
  { name: "asn", type: "STRING" },
  { name: "latitude", type: "STRING" },
  { name: "longitude", type: "STRING" },
  { name: "browser", type: "STRING" },
  { name: "browser_version", type: "STRING" },
  { name: "os", type: "STRING" },
  { name: "os_version", type: "STRING" },
  { name: "device_type", type: "STRING" },
  { name: "device_model", type: "STRING" },
  { name: "device_vendor", type: "STRING" },
  { name: "session_id", type: "STRING" },
  { name: "time_on_page", type: "INT64" },
  { name: "screen_resolution", type: "STRING" },
  { name: "viewport", type: "STRING" },
  { name: "language", type: "STRING" },
  { name: "referrer", type: "STRING" },
  { name: "traffic_source", type: "STRING" },
  { name: "traffic_medium", type: "STRING" },
  { name: "traffic_category", type: "STRING" },
  { name: "traffic_campaign", type: "STRING" },
  { name: "gclid", type: "STRING" },
  { name: "fingerprint", type: "STRING" },
];
