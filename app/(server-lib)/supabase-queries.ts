import { supabase, type LeadRow, type PageViewRow } from "@/app/(server-lib)/supabase";

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

function aggregate(rows: { [key: string]: unknown }[], field: string): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const key = String(r[field] || "unknown");
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function aggregateDay(rows: { received_at: string }[]): { day: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const day = new Date(r.received_at).toISOString().split("T")[0];
    map.set(day, (map.get(day) || 0) + 1);
  }
  return [...map.entries()]
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => b.day.localeCompare(a.day))
    .slice(0, 30);
}

function isToday(iso: string): boolean {
  return new Date(iso).toDateString() === new Date().toDateString();
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const [leadsRes, pvRes] = await Promise.all([
    supabase.from("leads").select("*").order("received_at", { ascending: false }).limit(500),
    supabase.from("page_views").select("*").order("received_at", { ascending: false }).limit(2000),
  ]);

  const leads = (leadsRes.data || []) as LeadRow[];
  const pageViews = (pvRes.data || []) as PageViewRow[];

  const uniquePhones = new Set(leads.map((l) => l.phone_hash));
  const uniqueSessions = new Set(pageViews.map((p) => p.session_id));
  const uniqueFPs = new Set(pageViews.map((p) => p.fingerprint).filter(Boolean));
  const fpCounts = new Map<string, number>();
  for (const p of pageViews) {
    if (p.fingerprint) {
      fpCounts.set(p.fingerprint, (fpCounts.get(p.fingerprint) || 0) + 1);
    }
  }
  const returningVisitors = [...fpCounts.values()].filter((c) => c > 1).length;

  const avgTime = leads.length > 0
    ? leads.reduce((sum, l) => sum + (l.time_on_page || 0), 0) / leads.length
    : 0;

  return {
    totalLeads: leads.length,
    todayLeads: leads.filter((l) => isToday(l.received_at)).length,
    uniqueUsers: uniquePhones.size,
    totalPageViews: pageViews.length,
    todayPageViews: pageViews.filter((p) => isToday(p.received_at)).length,
    uniqueVisitors: uniqueSessions.size,
    uniqueFingerprints: uniqueFPs.size,
    returningVisitors,
    avgTimeOnPage: avgTime,
    byAppliance: aggregate(leads, "appliance"),
    bySource: aggregate(leads, "source"),
    byDay: aggregateDay(leads),
    recentLeads: leads.slice(0, 20),
    topPages: aggregate(pageViews, "page_path"),
    viewsByDay: aggregateDay(pageViews),
  };
}

export async function getAllLeads(limit = 200, offset = 0): Promise<LeadRow[]> {
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("received_at", { ascending: false })
    .range(offset, offset + limit - 1);
  return (data || []) as LeadRow[];
}

export type GeoStats = {
  byCity: { label: string; count: number }[];
  byIsp: { label: string; count: number }[];
  byDevice: { label: string; count: number }[];
  byBrowser: { label: string; count: number }[];
  byOs: { label: string; count: number }[];
};

export async function getGeoStats(): Promise<GeoStats> {
  const { data } = await supabase
    .from("page_views")
    .select("city, isp, device_type, browser, os")
    .limit(5000);
  const rows = (data || []) as { city: string; isp: string; device_type: string; browser: string; os: string }[];

  return {
    byCity: aggregate(rows.filter((r) => r.city), "city"),
    byIsp: aggregate(rows.filter((r) => r.isp), "isp"),
    byDevice: aggregate(rows, "device_type"),
    byBrowser: aggregate(rows.filter((r) => r.browser), "browser"),
    byOs: aggregate(rows.filter((r) => r.os), "os"),
  };
}

export type SourceStats = {
  bySource: { label: string; count: number }[];
  byAppliance: { label: string; count: number }[];
  byApplianceSource: { appliance: string; source: string; count: number }[];
  avgTimeBySource: { source: string; avg_ms: number | null; count: number }[];
};

export async function getSourceStats(): Promise<SourceStats> {
  const { data } = await supabase
    .from("leads")
    .select("*")
    .limit(5000);
  const rows = (data || []) as LeadRow[];

  const bySource = aggregate(rows, "source");
  const byAppliance = aggregate(rows, "appliance");

  const applianceSourceMap = new Map<string, number>();
  for (const r of rows) {
    const key = `${r.appliance}|${r.source}`;
    applianceSourceMap.set(key, (applianceSourceMap.get(key) || 0) + 1);
  }
  const byApplianceSource = [...applianceSourceMap.entries()]
    .map(([key, count]) => {
      const [appliance, source] = key.split("|");
      return { appliance, source, count };
    })
    .sort((a, b) => b.count - a.count);

  const sourceTimeMap = new Map<string, { total: number; count: number }>();
  for (const r of rows) {
    const s = r.source || "unknown";
    const entry = sourceTimeMap.get(s) || { total: 0, count: 0 };
    entry.total += r.time_on_page || 0;
    entry.count += 1;
    sourceTimeMap.set(s, entry);
  }
  const avgTimeBySource = [...sourceTimeMap.entries()]
    .map(([source, { total, count }]) => ({
      source,
      avg_ms: count > 0 ? total / count : null,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return { bySource, byAppliance, byApplianceSource, avgTimeBySource };
}
