import { getBigQuery } from "@/app/(server-lib)/bigquery";

const datasetId = process.env.BIGQUERY_DATASET_ID || "analytics";
const tableId = process.env.BIGQUERY_TABLE_ID || "leads";
const table = `\`${process.env.BIGQUERY_PROJECT_ID}.${datasetId}.${tableId}\``;
const pvTable = `\`${process.env.BIGQUERY_PROJECT_ID}.${datasetId}.page_views\``;

export type LeadRow = {
  lead_id: string;
  received_at: string;
  appliance: string;
  issue: string;
  name: string;
  phone_last4: string;
  source: string;
  page_url: string;
  ip_address: string;
  city: string;
  region: string;
  country: string;
  isp: string;
  browser: string;
  os: string;
  device_type: string;
  device_model: string;
  device_vendor: string;
  session_id: string;
  time_on_page: number;
  screen_resolution: string;
  referrer: string;
};

export type OverviewStats = {
  totalLeads: number;
  todayLeads: number;
  uniqueUsers: number;
  totalPageViews: number;
  todayPageViews: number;
  uniqueVisitors: number;
  uniqueFingerprints: number;
  returningVisitors: number;
  avgTimeOnPage: number;
  byAppliance: { appliance: string; count: number }[];
  bySource: { source: string; count: number }[];
  byDay: { day: string; count: number }[];
  recentLeads: LeadRow[];
  topPages: { page_path: string; count: number }[];
  viewsByDay: { day: string; count: number }[];
};

export type GeoStats = {
  byCity: { city: string; count: number }[];
  byIsp: { isp: string; count: number }[];
  byDevice: { device_type: string; count: number }[];
  byBrowser: { browser: string; count: number }[];
  byOs: { os: string; count: number }[];
};

export type SourceStats = {
  bySource: { source: string; count: number }[];
  byAppliance: { appliance: string; count: number }[];
  byApplianceSource: { appliance: string; source: string; count: number }[];
  avgTimeBySource: { source: string; avg_ms: number | null; count: number }[];
};

async function runQuery<T>(query: string): Promise<T[]> {
  const bq = getBigQuery();
  if (!bq) return [];
  try {
    const [rows] = await bq.query(query);
    return rows as T[];
  } catch (err) {
    console.error("[bigquery-query] Error:", err);
    return [];
  }
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const totalQuery = `SELECT COUNT(*) as count FROM ${table}`;
  const todayQuery = `SELECT COUNT(*) as count FROM ${table} WHERE DATE(received_at) = CURRENT_DATE()`;
  const uniqueQuery = `SELECT COUNT(DISTINCT phone_hash) as count FROM ${table}`;
  const avgTimeQuery = `SELECT AVG(time_on_page) as avg_ms FROM ${table}`;
  const byApplianceQuery = `SELECT appliance, COUNT(*) as count FROM ${table} GROUP BY appliance ORDER BY count DESC`;
  const bySourceQuery = `SELECT source, COUNT(*) as count FROM ${table} GROUP BY source ORDER BY count DESC`;
  const byDayQuery = `SELECT DATE(received_at) as day, COUNT(*) as count FROM ${table} GROUP BY day ORDER BY day DESC LIMIT 30`;
  const recentQuery = `SELECT * FROM ${table} ORDER BY received_at DESC LIMIT 20`;

  const pvTotalQuery = `SELECT COUNT(*) as count FROM ${pvTable}`;
  const pvTodayQuery = `SELECT COUNT(*) as count FROM ${pvTable} WHERE DATE(received_at) = CURRENT_DATE()`;
  const pvUniqueQuery = `SELECT COUNT(DISTINCT session_id) as count FROM ${pvTable}`;
  const pvTopPagesQuery = `SELECT page_path, COUNT(*) as count FROM ${pvTable} GROUP BY page_path ORDER BY count DESC LIMIT 10`;
  const pvByDayQuery = `SELECT DATE(received_at) as day, COUNT(*) as count FROM ${pvTable} GROUP BY day ORDER BY day DESC LIMIT 30`;
  const pvFingerprintsQuery = `SELECT COUNT(DISTINCT fingerprint) as count FROM ${pvTable}`;
  const pvReturningQuery = `SELECT COUNT(*) as count FROM (SELECT fingerprint, COUNT(*) as c FROM ${pvTable} WHERE fingerprint != '' GROUP BY fingerprint HAVING c > 1)`;

  const [
    totalRes, todayRes, uniqueRes, avgTimeRes,
    byAppliance, bySource, byDay, recentLeads,
    pvTotalRes, pvTodayRes, pvUniqueRes, topPages, viewsByDay,
    pvFingerprintsRes, pvReturningRes,
  ] = await Promise.all([
    runQuery<{ count: number }>(totalQuery),
    runQuery<{ count: number }>(todayQuery),
    runQuery<{ count: number }>(uniqueQuery),
    runQuery<{ avg_ms: number | null }>(avgTimeQuery),
    runQuery<{ appliance: string; count: number }>(byApplianceQuery),
    runQuery<{ source: string; count: number }>(bySourceQuery),
    runQuery<{ day: string; count: number }>(byDayQuery),
    runQuery<LeadRow>(recentQuery),
    runQuery<{ count: number }>(pvTotalQuery),
    runQuery<{ count: number }>(pvTodayQuery),
    runQuery<{ count: number }>(pvUniqueQuery),
    runQuery<{ page_path: string; count: number }>(pvTopPagesQuery),
    runQuery<{ day: string; count: number }>(pvByDayQuery),
    runQuery<{ count: number }>(pvFingerprintsQuery),
    runQuery<{ count: number }>(pvReturningQuery),
  ]);

  return {
    totalLeads: totalRes[0]?.count ?? 0,
    todayLeads: todayRes[0]?.count ?? 0,
    uniqueUsers: uniqueRes[0]?.count ?? 0,
    totalPageViews: pvTotalRes[0]?.count ?? 0,
    todayPageViews: pvTodayRes[0]?.count ?? 0,
    uniqueVisitors: pvUniqueRes[0]?.count ?? 0,
    uniqueFingerprints: pvFingerprintsRes[0]?.count ?? 0,
    returningVisitors: pvReturningRes[0]?.count ?? 0,
    avgTimeOnPage: avgTimeRes[0]?.avg_ms ?? 0,
    byAppliance, bySource, byDay, recentLeads,
    topPages, viewsByDay,
  };
}

export async function getAllLeads(limit = 100, offset = 0): Promise<LeadRow[]> {
  const query = `SELECT * FROM ${table} ORDER BY received_at DESC LIMIT ${limit} OFFSET ${offset}`;
  return runQuery<LeadRow>(query);
}

export async function getGeoStats(): Promise<GeoStats> {
  const byCityQuery = `SELECT city, COUNT(*) as count FROM ${table} WHERE city != '' GROUP BY city ORDER BY count DESC LIMIT 20`;
  const byIspQuery = `SELECT isp, COUNT(*) as count FROM ${table} WHERE isp != '' GROUP BY isp ORDER BY count DESC LIMIT 20`;
  const byDeviceQuery = `SELECT device_type, COUNT(*) as count FROM ${table} GROUP BY device_type ORDER BY count DESC`;
  const byBrowserQuery = `SELECT browser, COUNT(*) as count FROM ${table} WHERE browser != '' GROUP BY browser ORDER BY count DESC LIMIT 10`;
  const byOsQuery = `SELECT os, COUNT(*) as count FROM ${table} WHERE os != '' GROUP BY os ORDER BY count DESC LIMIT 10`;

  const [byCity, byIsp, byDevice, byBrowser, byOs] = await Promise.all([
    runQuery<{ city: string; count: number }>(byCityQuery),
    runQuery<{ isp: string; count: number }>(byIspQuery),
    runQuery<{ device_type: string; count: number }>(byDeviceQuery),
    runQuery<{ browser: string; count: number }>(byBrowserQuery),
    runQuery<{ os: string; count: number }>(byOsQuery),
  ]);

  return { byCity, byIsp, byDevice, byBrowser, byOs };
}

export async function getSourceStats(): Promise<SourceStats> {
  const bySourceQuery = `SELECT source, COUNT(*) as count FROM ${table} GROUP BY source ORDER BY count DESC`;
  const byApplianceQuery = `SELECT appliance, COUNT(*) as count FROM ${table} GROUP BY appliance ORDER BY count DESC`;
  const byApplianceSourceQuery = `SELECT appliance, source, COUNT(*) as count FROM ${table} GROUP BY appliance, source ORDER BY count DESC`;
  const avgTimeBySourceQuery = `SELECT source, AVG(time_on_page) as avg_ms, COUNT(*) as count FROM ${table} GROUP BY source ORDER BY count DESC`;

  const [bySource, byAppliance, byApplianceSource, avgTimeBySource] =
    await Promise.all([
      runQuery<{ source: string; count: number }>(bySourceQuery),
      runQuery<{ appliance: string; count: number }>(byApplianceQuery),
      runQuery<{ appliance: string; source: string; count: number }>(
        byApplianceSourceQuery,
      ),
      runQuery<{ source: string; avg_ms: number | null; count: number }>(
        avgTimeBySourceQuery,
      ),
    ]);

  return { bySource, byAppliance, byApplianceSource, avgTimeBySource };
}
