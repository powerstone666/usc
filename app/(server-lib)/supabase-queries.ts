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

function aggregate(rows: Record<string, unknown>[], field: string): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const key = String(r[field] || "—");
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

function byDay(rows: { received_at: string }[]): { day: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const day = new Date(r.received_at).toISOString().split("T")[0];
    map.set(day, (map.get(day) || 0) + 1);
  }
  return [...map.entries()].map(([day, count]) => ({ day, count })).sort((a, b) => b.day.localeCompare(a.day)).slice(0, 30);
}

function isToday(iso: string): boolean {
  return new Date(iso).toDateString() === new Date().toDateString();
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const [{ data: leads }, { data: pv }] = await Promise.all([
    supabase.from("leads").select("*").order("received_at", { ascending: false }).limit(500),
    supabase.from("page_views").select("*").order("received_at", { ascending: false }).limit(2000),
  ]);

  const leadRows = (leads || []) as LeadRow[];
  const pvRows = (pv || []) as PageViewRow[];

  const uniquePhones = new Set(leadRows.map((l) => l.phone_hash));
  const uniqueSessions = new Set(pvRows.map((p) => p.session_id));
  const uniqueFPs = new Set(pvRows.map((p) => p.fingerprint).filter(Boolean));
  const fpCounts = new Map<string, number>();
  for (const p of pvRows) if (p.fingerprint) fpCounts.set(p.fingerprint, (fpCounts.get(p.fingerprint) || 0) + 1);

  return {
    totalLeads: leadRows.length,
    todayLeads: leadRows.filter((l) => isToday(l.received_at)).length,
    uniqueUsers: uniquePhones.size,
    totalPageViews: pvRows.length,
    todayPageViews: pvRows.filter((p) => isToday(p.received_at)).length,
    uniqueVisitors: uniqueSessions.size,
    uniqueFingerprints: uniqueFPs.size,
    returningVisitors: [...fpCounts.values()].filter((c) => c > 1).length,
    avgTimeOnPage: leadRows.length > 0 ? leadRows.reduce((s, l) => s + (l.time_on_page || 0), 0) / leadRows.length : 0,
    byAppliance: aggregate(leadRows, "appliance"),
    bySource: aggregate(leadRows, "source"),
    byDay: byDay(leadRows),
    recentLeads: leadRows.slice(0, 20),
    topPages: aggregate(pvRows, "page_path"),
    viewsByDay: byDay(pvRows),
  };
}

export async function getAllLeads(limit = 200, offset = 0): Promise<LeadRow[]> {
  const { data } = await supabase.from("leads").select("*").order("received_at", { ascending: false }).range(offset, offset + limit - 1);
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
  const { data } = await supabase.from("page_views").select("city, isp, device_type, browser, os").limit(5000);
  const rows = (data || []) as Record<string, unknown>[];
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
  const { data } = await supabase.from("leads").select("*").limit(5000);
  const rows = (data || []) as LeadRow[];

  const applianceSourceMap = new Map<string, number>();
  for (const r of rows) {
    const key = `${r.appliance}|${r.source}`;
    applianceSourceMap.set(key, (applianceSourceMap.get(key) || 0) + 1);
  }

  const sourceTimeMap = new Map<string, { total: number; count: number }>();
  for (const r of rows) {
    const s = r.source || "unknown";
    const e = sourceTimeMap.get(s) || { total: 0, count: 0 };
    e.total += r.time_on_page || 0;
    e.count += 1;
    sourceTimeMap.set(s, e);
  }

  return {
    bySource: aggregate(rows, "source"),
    byAppliance: aggregate(rows, "appliance"),
    byApplianceSource: [...applianceSourceMap.entries()].map(([key, count]) => {
      const [appliance, source] = key.split("|");
      return { appliance, source, count };
    }).sort((a, b) => b.count - a.count),
    avgTimeBySource: [...sourceTimeMap.entries()].map(([source, { total, count }]) => ({
      source,
      avg_ms: count > 0 ? total / count : null,
      count,
    })).sort((a, b) => b.count - a.count),
  };
}
