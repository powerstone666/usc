import { supabase } from "@/app/(server-lib)/supabase";
import type { LeadRow, PageViewRow } from "@/app/(server-lib)/supabase";
import { areas } from "@/app/(config)/site";
import { makeDemoData } from "@/app/(server-lib)/admin-demo";
import { RANGES, buildAdminData, sinceOf, toLeadItems, type AdminData, type LeadItem, type LeadType, type RangeKey } from "@/app/(server-lib)/admin-insights";

const PAGE = 1000;
const MAX_ROWS = 50000;

export const isDemo = () => process.env.ADMIN_DEMO === "1";

async function fetchAll<T>(table: "leads" | "page_views", since: Date | null): Promise<{ rows: T[]; error: string | null }> {
  const rows: T[] = [];
  for (let from = 0; from < MAX_ROWS; from += PAGE) {
    let q = supabase.from(table).select("*").order("received_at", { ascending: false }).range(from, from + PAGE - 1);
    if (since) q = q.gte("received_at", since.toISOString());
    const { data, error } = await q;
    if (error) return { rows, error: error.message };
    rows.push(...((data ?? []) as T[]));
    if (!data || data.length < PAGE) break;
  }
  return { rows, error: null };
}

async function load(range: RangeKey): Promise<{ leads: LeadRow[]; views: PageViewRow[]; error: string | null }> {
  if (isDemo()) return { ...makeDemoData(), error: null };
  const since = sinceOf(range, new Date());
  const [l, v] = await Promise.all([fetchAll<LeadRow>("leads", since), fetchAll<PageViewRow>("page_views", since)]);
  return { leads: l.rows, views: v.rows, error: l.error ?? v.error };
}

export async function loadAdminData(range: RangeKey, includeTest: boolean): Promise<{ data: AdminData; error: string | null; generatedAt: number }> {
  const { leads, views, error } = await load(range);
  return { data: buildAdminData({ leads, views, range, includeTest, areaNames: areas }), error, generatedAt: Date.now() };
}

export type LeadQuery = {
  range: RangeKey;
  includeTest: boolean;
  type: "all" | LeadType;
  service: string;
  channel: string;
  q: string;
  page: number;
  pageSize: number;
};

export type LeadParams = { range?: string; test?: string; type?: string; service?: string; channel?: string; q?: string; page?: string };

export function parseLeadQuery(sp: LeadParams, pageSize: number): LeadQuery {
  const range = RANGES.some((r) => r.key === sp.range) ? (sp.range as RangeKey) : "30d";
  const type = sp.type === "form" || sp.type === "call" || sp.type === "whatsapp" ? sp.type : "all";
  return {
    range,
    includeTest: sp.test === "1",
    type,
    service: sp.service || "all",
    channel: sp.channel || "all",
    q: (sp.q || "").slice(0, 80),
    page: Math.max(1, parseInt(sp.page ?? "1", 10) || 1),
    pageSize,
  };
}

export type LeadPage = {
  items: LeadItem[];
  total: number;
  page: number;
  pages: number;
  counts: { all: number; form: number; call: number; whatsapp: number };
  services: string[];
  channels: string[];
  error: string | null;
  generatedAt: number;
};

// Filters and paginates on the server so the browser only ever receives one page of leads.
export async function queryLeads(query: LeadQuery): Promise<LeadPage> {
  const { leads, error } = await load(query.range);
  const all = toLeadItems(leads, { includeTest: query.includeTest, since: sinceOf(query.range, new Date()) });
  const needle = query.q.trim().toLowerCase();
  const filtered = all.filter(
    (l) =>
      (query.type === "all" || l.type === query.type) &&
      (query.service === "all" || l.appliance === query.service) &&
      (query.channel === "all" || l.channel === query.channel) &&
      (!needle || [l.name, l.phone, l.issue, l.page, l.city, l.appliance, l.channel, l.campaign].some((v) => v.toLowerCase().includes(needle))),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / query.pageSize));
  const page = Math.min(Math.max(1, query.page), pages);
  return {
    items: filtered.slice((page - 1) * query.pageSize, page * query.pageSize),
    total: filtered.length,
    page,
    pages,
    counts: {
      all: all.length,
      form: all.filter((l) => l.type === "form").length,
      call: all.filter((l) => l.type === "call").length,
      whatsapp: all.filter((l) => l.type === "whatsapp").length,
    },
    services: [...new Set(all.map((l) => l.appliance))].sort(),
    channels: [...new Set(all.map((l) => l.channel))].sort(),
    error,
    generatedAt: Date.now(),
  };
}
