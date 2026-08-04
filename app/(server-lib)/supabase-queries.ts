import { query, type LeadRow, type PageViewRow } from "@/app/(server-lib)/supabase";

export type { LeadRow, PageViewRow };

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
  byAppliance: { label: string; count: number }[];
  bySource: { label: string; count: number }[];
  byDay: { day: string; count: number }[];
  recentLeads: LeadRow[];
  topPages: { label: string; count: number }[];
  viewsByDay: { day: string; count: number }[];
};

export async function getOverviewStats(): Promise<OverviewStats> {
  const [totalLeads] = await query<{ count: string }>("SELECT COUNT(*) as count FROM leads");
  const [todayLeads] = await query<{ count: string }>("SELECT COUNT(*) as count FROM leads WHERE received_at::date = CURRENT_DATE");
  const [uniqueUsers] = await query<{ count: string }>("SELECT COUNT(DISTINCT phone_hash) as count FROM leads");
  const [avgTime] = await query<{ avg: string | null }>("SELECT AVG(time_on_page) as avg FROM leads");
  const byAppliance = await query<{ appliance: string; count: string }>("SELECT appliance, COUNT(*) as count FROM leads GROUP BY appliance ORDER BY count DESC");
  const bySource = await query<{ source: string; count: string }>("SELECT source, COUNT(*) as count FROM leads GROUP BY source ORDER BY count DESC");
  const byDay = await query<{ day: string; count: string }>("SELECT received_at::date as day, COUNT(*) as count FROM leads GROUP BY day ORDER BY day DESC LIMIT 30");
  const recentLeads = await query<LeadRow>("SELECT * FROM leads ORDER BY received_at DESC LIMIT 20");

  const [pvTotal] = await query<{ count: string }>("SELECT COUNT(*) as count FROM page_views");
  const [pvToday] = await query<{ count: string }>("SELECT COUNT(*) as count FROM page_views WHERE received_at::date = CURRENT_DATE");
  const [pvUnique] = await query<{ count: string }>("SELECT COUNT(DISTINCT session_id) as count FROM page_views");
  const [pvFPs] = await query<{ count: string }>("SELECT COUNT(DISTINCT fingerprint) as count FROM page_views WHERE fingerprint != ''");
  const [pvReturning] = await query<{ count: string }>("SELECT COUNT(*) as count FROM (SELECT fingerprint FROM page_views WHERE fingerprint != '' GROUP BY fingerprint HAVING COUNT(*) > 1) t");
  const topPages = await query<{ page_path: string; count: string }>("SELECT page_path, COUNT(*) as count FROM page_views GROUP BY page_path ORDER BY count DESC LIMIT 10");
  const viewsByDay = await query<{ day: string; count: string }>("SELECT received_at::date as day, COUNT(*) as count FROM page_views GROUP BY day ORDER BY day DESC LIMIT 30");

  const toNum = (v: string | null | undefined) => v ? parseInt(v) : 0;

  return {
    totalLeads: toNum(totalLeads?.count),
    todayLeads: toNum(todayLeads?.count),
    uniqueUsers: toNum(uniqueUsers?.count),
    totalPageViews: toNum(pvTotal?.count),
    todayPageViews: toNum(pvToday?.count),
    uniqueVisitors: toNum(pvUnique?.count),
    uniqueFingerprints: toNum(pvFPs?.count),
    returningVisitors: toNum(pvReturning?.count),
    avgTimeOnPage: avgTime?.avg ? parseFloat(avgTime.avg) : 0,
    byAppliance: byAppliance.map((d) => ({ label: d.appliance, count: toNum(d.count) })),
    bySource: bySource.map((d) => ({ label: d.source, count: toNum(d.count) })),
    byDay: byDay.map((d) => ({ day: d.day, count: toNum(d.count) })),
    recentLeads,
    topPages: topPages.map((d) => ({ label: d.page_path, count: toNum(d.count) })),
    viewsByDay: viewsByDay.map((d) => ({ day: d.day, count: toNum(d.count) })),
  };
}

export async function getAllLeads(limit = 200, offset = 0): Promise<LeadRow[]> {
  return query<LeadRow>(`SELECT * FROM leads ORDER BY received_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
}

export type GeoStats = {
  byCity: { label: string; count: number }[];
  byIsp: { label: string; count: number }[];
  byDevice: { label: string; count: number }[];
  byBrowser: { label: string; count: number }[];
  byOs: { label: string; count: number }[];
};

export async function getGeoStats(): Promise<GeoStats> {
  const byCity = await query<{ city: string; count: string }>("SELECT city, COUNT(*) as count FROM page_views WHERE city != '' GROUP BY city ORDER BY count DESC LIMIT 20");
  const byIsp = await query<{ isp: string; count: string }>("SELECT isp, COUNT(*) as count FROM page_views WHERE isp != '' GROUP BY isp ORDER BY count DESC LIMIT 20");
  const byDevice = await query<{ device_type: string; count: string }>("SELECT device_type, COUNT(*) as count FROM page_views GROUP BY device_type ORDER BY count DESC");
  const byBrowser = await query<{ browser: string; count: string }>("SELECT browser, COUNT(*) as count FROM page_views WHERE browser != '' GROUP BY browser ORDER BY count DESC LIMIT 10");
  const byOs = await query<{ os: string; count: string }>("SELECT os, COUNT(*) as count FROM page_views WHERE os != '' GROUP BY os ORDER BY count DESC LIMIT 10");

  const toNum = (v: string) => parseInt(v);
  return {
    byCity: byCity.map((d) => ({ label: d.city, count: toNum(d.count) })),
    byIsp: byIsp.map((d) => ({ label: d.isp, count: toNum(d.count) })),
    byDevice: byDevice.map((d) => ({ label: d.device_type, count: toNum(d.count) })),
    byBrowser: byBrowser.map((d) => ({ label: d.browser, count: toNum(d.count) })),
    byOs: byOs.map((d) => ({ label: d.os, count: toNum(d.count) })),
  };
}

export type SourceStats = {
  bySource: { label: string; count: number }[];
  byAppliance: { label: string; count: number }[];
  byApplianceSource: { appliance: string; source: string; count: number }[];
  avgTimeBySource: { source: string; avg_ms: number | null; count: number }[];
};

export async function getSourceStats(): Promise<SourceStats> {
  const bySource = await query<{ source: string; count: string }>("SELECT source, COUNT(*) as count FROM leads GROUP BY source ORDER BY count DESC");
  const byAppliance = await query<{ appliance: string; count: string }>("SELECT appliance, COUNT(*) as count FROM leads GROUP BY appliance ORDER BY count DESC");
  const byApplianceSource = await query<{ appliance: string; source: string; count: string }>("SELECT appliance, source, COUNT(*) as count FROM leads GROUP BY appliance, source ORDER BY count DESC");
  const avgTimeBySource = await query<{ source: string; avg: string | null; count: string }>("SELECT source, AVG(time_on_page) as avg, COUNT(*) as count FROM leads GROUP BY source ORDER BY count DESC");

  const toNum = (v: string) => parseInt(v);
  return {
    bySource: bySource.map((d) => ({ label: d.source, count: toNum(d.count) })),
    byAppliance: byAppliance.map((d) => ({ label: d.appliance, count: toNum(d.count) })),
    byApplianceSource: byApplianceSource.map((d) => ({ appliance: d.appliance, source: d.source, count: toNum(d.count) })),
    avgTimeBySource: avgTimeBySource.map((d) => ({ source: d.source, avg_ms: d.avg ? parseFloat(d.avg) : null, count: toNum(d.count) })),
  };
}
