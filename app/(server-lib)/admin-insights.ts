// Pure analytics for the admin: rows in, answers out. No database or framework imports, so it
// can be tested with plain fixtures (scripts/test-admin-insights.mjs).
//
// Definitions (shown to the owner in the admin as well):
//  - Lead: a form submission (name + phone), a call tap, or a WhatsApp tap. Taps carry no phone.
//  - Unique visitor: browser fingerprint, falling back to the session id.
//  - Last active: the latest page view or lead for that visitor.
//  - Returning visitor: two or more sessions in the selected range.
//  - Times are bucketed in IST.
import type { LeadRow, PageViewRow } from "./supabase";

export type RangeKey = "today" | "7d" | "30d" | "all";
export const RANGES: { key: RangeKey; label: string; phrase: string }[] = [
  { key: "today", label: "Today", phrase: "today" },
  { key: "7d", label: "7 days", phrase: "the last 7 days" },
  { key: "30d", label: "30 days", phrase: "the last 30 days" },
  { key: "all", label: "All time", phrase: "all time" },
];

export type LeadType = "form" | "call" | "whatsapp";
export type ChannelGroup = "paid" | "campaign" | "ai" | "search" | "maps" | "social" | "whatsapp" | "direct" | "referral";
export type Channel = { label: string; group: ChannelGroup };

export type Visitor = {
  id: string;
  firstSeen: string;
  lastActive: string;
  sessions: number;
  pageViews: number;
  lastPage: string;
  deviceType: string;
  device: string;
  source: string;
  city: string;
  leads: number;
  returning: boolean;
};

export type RankedRow = { label: string; visitors: number; leads: number; conversionPct: number };
export type CampaignRow = { source: string; medium: string; campaign: string; visitors: number; leads: number; conversionPct: number };
export type PageRow = { path: string; group: string; views: number; visitors: number; leads: number };
export type CountRow = { label: string; count: number };

export type AdminData = {
  range: RangeKey;
  since: string | null;
  totals: {
    leads: number;
    formLeads: number;
    callTaps: number;
    whatsappTaps: number;
    visitors: number;
    sessions: number;
    pageViews: number;
    returningVisitors: number;
    convertedVisitors: number;
    conversionPct: number;
    mobilePct: number;
  };
  leadsByDay: { day: string; form: number; call: number; whatsapp: number }[];
  visitorsByDay: { day: string; count: number }[];
  channels: (RankedRow & { group: ChannelGroup })[];
  campaigns: CampaignRow[];
  pages: PageRow[];
  leadPages: PageRow[];
  cities: RankedRow[];
  leadAreas: CountRow[];
  leadServices: CountRow[];
  leadSources: CountRow[];
  devices: { types: CountRow[]; os: CountRow[]; browsers: CountRow[]; models: CountRow[] };
  leadsByHour: number[];
  leadsByWeekday: number[];
  visitors: Visitor[];
  recentLeads: LeadRow[];
  insights: string[];
  hiddenTestRows: number;
};

const IST_MS = 5.5 * 3600 * 1000;
const DAY_MS = 86400000;
const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 1000) / 10 : 0);
const clean = (s: unknown) => (typeof s === "string" ? s.trim() : "");

function ist(iso: string) {
  const d = new Date(new Date(iso).getTime() + IST_MS);
  return { day: d.toISOString().slice(0, 10), hour: d.getUTCHours(), dow: d.getUTCDay() };
}

export function sinceOf(range: RangeKey, now: Date): Date | null {
  if (range === "all") return null;
  if (range === "today") {
    const d = ist(now.toISOString()).day;
    return new Date(new Date(`${d}T00:00:00.000Z`).getTime() - IST_MS);
  }
  return new Date(now.getTime() - (range === "7d" ? 7 : 30) * DAY_MS);
}

export const applianceLabels: Record<string, string> = {
  "microwave-repair": "Microwave",
  "ac-repair": "AC",
  "washing-machine-repair": "Washing machine",
  "refrigerator-repair": "Refrigerator",
  "water-filter-repair": "Water filter",
  "chimney-repair": "Chimney",
  general: "Not specified",
};

function applianceOf(raw: string): string {
  const k = clean(raw).toLowerCase();
  if (!k) return "Not specified";
  if (applianceLabels[k]) return applianceLabels[k];
  const withSuffix = applianceLabels[`${k}-repair`];
  if (withSuffix) return withSuffix;
  return k.replace(/-repair$/, "").replace(/[-_]/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export function leadTypeOf(r: Pick<LeadRow, "id" | "source">): LeadType {
  if (r.id?.startsWith("wa_") || r.source === "whatsapp-now") return "whatsapp";
  if (r.id?.startsWith("call_") || r.source === "call-now") return "call";
  return "form";
}

// Old versions logged modal-opening clicks as leads; they are not leads.
function isRealLead(r: LeadRow): boolean {
  const s = clean(r.source);
  return !s.startsWith("click_to_call:") && s !== "tel_click:diagnostic-done";
}

function isTest(r: { page_url?: string; referrer?: string; ip_address?: string }): boolean {
  const local = /localhost|127\.0\.0\.1/;
  return local.test(r.page_url || "") || local.test(r.referrer || "") || ["127.0.0.1", "::1", "0.0.0.0"].includes(r.ip_address || "");
}

export function pathOf(url: string): string {
  const u = clean(url);
  if (!u) return "(unknown)";
  try {
    const p = new URL(u).pathname.replace(/\/$/, "");
    return p || "/";
  } catch {
    return u.startsWith("/") ? u.split("?")[0].replace(/\/$/, "") || "/" : "(unknown)";
  }
}

function pageGroup(path: string): string {
  if (path === "/") return "Home";
  const first = path.split("/")[1];
  const map: Record<string, string> = {
    services: "Service page",
    areas: "Area page",
    brands: "Brand page",
    blog: "Blog",
    keywords: "Problem guide",
    "near-me": "Near me page",
    about: "About",
    contact: "Contact",
    coverage: "Coverage",
    reviews: "Reviews",
  };
  return map[first] ?? "Other";
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function areaFromPath(path: string, names: Map<string, string>): string | null {
  const m = path.match(/^\/areas\/([^/]+)/);
  if (!m) return null;
  return names.get(m[1]) ?? m[1].split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

type Attribution = { referrer?: string; traffic_category?: string; traffic_source?: string; traffic_medium?: string; traffic_campaign?: string; gclid?: string };

export function channelOf(r: Attribution): Channel {
  const ref = clean(r.referrer).toLowerCase();
  const cat = clean(r.traffic_category).toLowerCase();
  const src = clean(r.traffic_source).toLowerCase();
  const med = clean(r.traffic_medium).toLowerCase();
  const camp = clean(r.traffic_campaign);
  const has = (s: string, list: string[]) => list.some((x) => s.includes(x));

  if (clean(r.gclid) || ["cpc", "ppc", "paid", "paidsocial", "paid_social"].includes(med) || cat === "ppc") {
    return { label: src && !["google-ads", "google", "cpc", "ppc"].includes(src) ? `${src} (paid)` : "Google Ads", group: "paid" };
  }
  const ai = ["chatgpt", "openai", "perplexity", "claude", "anthropic", "copilot.microsoft", "gemini.google", "poe.com"];
  if (cat === "ai-search" || has(ref, ai) || has(src, ai)) {
    const name = has(`${ref} ${src}`, ["perplexity"]) ? "Perplexity" : has(`${ref} ${src}`, ["claude", "anthropic"]) ? "Claude" : has(`${ref} ${src}`, ["gemini"]) ? "Gemini" : has(`${ref} ${src}`, ["copilot"]) ? "Copilot" : "ChatGPT";
    return { label: `${name} (AI search)`, group: "ai" };
  }
  if (cat === "utm" || camp) {
    return { label: src ? (med && med !== "none" ? `${src} / ${med}` : src) : "Tagged campaign", group: "campaign" };
  }
  if (cat === "google-maps" || has(ref, ["maps.google", "google.com/maps", "maps.app.goo.gl", "maps.apple"]) || has(src, ["maps"])) {
    return { label: "Google Maps", group: "maps" };
  }
  if (cat === "whatsapp" || has(ref, ["wa.me", "whatsapp"]) || has(src, ["whatsapp"])) {
    return { label: "WhatsApp", group: "whatsapp" };
  }
  if (cat === "social" || has(ref, ["facebook", "fb.com", "instagram", "t.co/", "twitter", "x.com", "linkedin", "youtube"]) || has(src, ["facebook", "instagram"])) {
    const name = has(ref, ["instagram"]) || has(src, ["instagram"]) ? "Instagram" : has(ref, ["youtube"]) ? "YouTube" : has(ref, ["linkedin"]) ? "LinkedIn" : has(ref, ["twitter", "x.com", "t.co/"]) ? "X / Twitter" : "Facebook";
    return { label: name, group: "social" };
  }
  if (cat === "organic-search" || cat === "organic" || has(ref, ["google.", "bing.", "yahoo.", "duckduckgo."])) {
    const name = has(ref, ["bing."]) ? "Bing search" : has(ref, ["duckduckgo."]) ? "DuckDuckGo" : has(ref, ["yahoo."]) ? "Yahoo search" : "Google search";
    return { label: name, group: "search" };
  }
  if (!ref || cat === "direct" || ref === "—") return { label: "Direct", group: "direct" };
  let domain = ref;
  try {
    domain = new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    /* keep raw referrer */
  }
  return { label: domain, group: "referral" };
}

function isCampaignRow(r: Attribution): boolean {
  const med = clean(r.traffic_medium).toLowerCase();
  return Boolean(clean(r.traffic_campaign) || clean(r.gclid) || clean(r.traffic_category).toLowerCase() === "utm" || ["cpc", "ppc", "paid"].includes(med));
}

const visitorKeyOf = (r: { fingerprint?: string; session_id?: string; ip_address?: string }) =>
  clean(r.fingerprint) || clean(r.session_id) || clean(r.ip_address) || "unknown";

function deviceLabel(vendor: string, model: string, os: string, browser: string, type: string): string {
  const hw = [vendor, model].filter(Boolean).join(" ");
  if (hw) return hw;
  const sw = [os, browser].filter(Boolean).join(" · ");
  return sw || (type ? type : "Unknown");
}

function top(map: Map<string, number>, n: number): CountRow[] {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([label, count]) => ({ label, count }));
}
const bump = (m: Map<string, number>, k: string, by = 1) => m.set(k, (m.get(k) ?? 0) + by);

export function fmtHour(h: number): string {
  const label = (x: number) => {
    const hh = ((x % 24) + 24) % 24;
    return `${hh % 12 === 0 ? 12 : hh % 12} ${hh < 12 ? "AM" : "PM"}`;
  };
  return `${label(h)}–${label(h + 1)}`;
}

export function buildAdminData(input: {
  leads: LeadRow[];
  views: PageViewRow[];
  range: RangeKey;
  now?: Date;
  includeTest?: boolean;
  /** Real area names (e.g. "HSR Layout") used to label /areas/<slug> pages. */
  areaNames?: string[];
}): AdminData {
  const areaLookup = new Map((input.areaNames ?? []).map((n) => [slug(n), n]));
  const now = input.now ?? new Date();
  const since = sinceOf(input.range, now);
  const inRange = (iso: string) => !since || new Date(iso) >= since;

  let hidden = 0;
  const keep = <T extends { page_url?: string; referrer?: string; ip_address?: string }>(rows: T[]) =>
    rows.filter((r) => {
      if (!input.includeTest && isTest(r)) {
        hidden++;
        return false;
      }
      return true;
    });

  const leads = keep(input.leads.filter((r) => inRange(r.received_at) && isRealLead(r)));
  const views = keep(input.views.filter((r) => inRange(r.received_at)));

  // ---- visitors
  type V = Visitor & { sessionSet: Set<string>; firstTs: number; lastTs: number; firstChannel: Channel; model: string; os: string; browser: string };
  const vmap = new Map<string, V>();
  const touch = (
    key: string,
    ts: string,
    row: { session_id?: string; city?: string; device_type?: string; os?: string; browser?: string; device_model?: string; device_vendor?: string },
    channel: Channel,
    page: string,
  ) => {
    const t = new Date(ts).getTime();
    let v = vmap.get(key);
    if (!v) {
      v = {
        id: key.slice(0, 8),
        firstSeen: ts,
        lastActive: ts,
        sessions: 0,
        pageViews: 0,
        lastPage: page,
        deviceType: clean(row.device_type) || "unknown",
        device: "",
        source: channel.label,
        city: clean(row.city) || "Unknown",
        leads: 0,
        returning: false,
        sessionSet: new Set(),
        firstTs: t,
        lastTs: t,
        firstChannel: channel,
        model: "",
        os: "",
        browser: "",
      };
      vmap.set(key, v);
    }
    if (clean(row.session_id)) v.sessionSet.add(clean(row.session_id));
    if (t < v.firstTs) {
      v.firstTs = t;
      v.firstSeen = ts;
      v.firstChannel = channel;
      v.source = channel.label;
    }
    if (t >= v.lastTs) {
      v.lastTs = t;
      v.lastActive = ts;
      v.lastPage = page;
      if (clean(row.device_type)) v.deviceType = clean(row.device_type);
    }
    if (clean(row.city)) v.city = clean(row.city);
    if (clean(row.os)) v.os = clean(row.os);
    if (clean(row.browser)) v.browser = clean(row.browser);
    const hw = [clean(row.device_vendor), clean(row.device_model)].filter(Boolean).join(" ");
    if (hw) v.model = hw;
    return v;
  };

  // ---- channel / campaign / page / city accumulators
  const channelMap = new Map<string, { group: ChannelGroup; visitors: Set<string>; leadVisitors: Set<string>; leads: number }>();
  // page_views has no campaign column, so campaigns group by source + medium and take names from leads.
  const campaignMap = new Map<string, { source: string; medium: string; names: Set<string>; visitors: Set<string>; leadVisitors: Set<string>; leads: number }>();
  const pageMap = new Map<string, { views: number; visitors: Set<string>; leads: number }>();
  const cityMap = new Map<string, { visitors: Set<string>; leadVisitors: Set<string>; leads: number }>();
  const osMap = new Map<string, number>();
  const browserMap = new Map<string, number>();
  const visitorsDay = new Map<string, Set<string>>();

  const chan = (c: Channel) => {
    let e = channelMap.get(c.label);
    if (!e) channelMap.set(c.label, (e = { group: c.group, visitors: new Set(), leadVisitors: new Set(), leads: 0 }));
    return e;
  };
  const camp = (r: Attribution) => {
    if (!isCampaignRow(r)) return null;
    const source = clean(r.traffic_source) || (clean(r.gclid) ? "google" : "(not set)");
    const medium = clean(r.traffic_medium) || (clean(r.gclid) ? "cpc" : "(not set)");
    const k = `${source}|${medium}`;
    let e = campaignMap.get(k);
    if (!e) campaignMap.set(k, (e = { source, medium, names: new Set(), visitors: new Set(), leadVisitors: new Set(), leads: 0 }));
    if (clean(r.traffic_campaign)) e.names.add(clean(r.traffic_campaign));
    return e;
  };
  const city = (name: string) => {
    const k = clean(name) || "Unknown";
    let e = cityMap.get(k);
    if (!e) cityMap.set(k, (e = { visitors: new Set(), leadVisitors: new Set(), leads: 0 }));
    return e;
  };

  const sortedViews = [...views].sort((a, b) => +new Date(a.received_at) - +new Date(b.received_at));
  for (const r of sortedViews) {
    const key = visitorKeyOf(r);
    const channel = channelOf(r);
    const path = clean(r.page_path) || pathOf(r.page_url);
    const v = touch(key, r.received_at, r, channel, path);
    v.pageViews++;
    chan(channel).visitors.add(key);
    camp(r)?.visitors.add(key);
    city(r.city).visitors.add(key);
    const p = pageMap.get(path) ?? { views: 0, visitors: new Set<string>(), leads: 0 };
    p.views++;
    p.visitors.add(key);
    pageMap.set(path, p);
    const d = ist(r.received_at).day;
    (visitorsDay.get(d) ?? visitorsDay.set(d, new Set()).get(d)!).add(key);
  }

  const leadPageMap = new Map<string, { views: number; visitors: Set<string>; leads: number }>();
  const typeCount = { form: 0, call: 0, whatsapp: 0 };
  const sources = new Map<string, number>();
  const services = new Map<string, number>();
  const areas = new Map<string, number>();
  const models = new Map<string, number>();
  const leadDeviceTypes = new Map<string, number>();
  const leadsByHour = Array<number>(24).fill(0);
  const leadsByWeekday = Array<number>(7).fill(0);
  const leadsDay = new Map<string, { form: number; call: number; whatsapp: number }>();

  const sortedLeads = [...leads].sort((a, b) => +new Date(a.received_at) - +new Date(b.received_at));
  for (const r of sortedLeads) {
    const key = visitorKeyOf(r);
    const channel = channelOf(r);
    const path = pathOf(r.page_url);
    const type = leadTypeOf(r);
    const v = touch(key, r.received_at, r, channel, path);
    v.leads++;
    typeCount[type]++;
    const ce = chan(channel);
    ce.visitors.add(key);
    ce.leadVisitors.add(key);
    ce.leads++;
    const ca = camp(r);
    if (ca) {
      ca.visitors.add(key);
      ca.leadVisitors.add(key);
      ca.leads++;
    }
    const cy = city(r.city);
    cy.visitors.add(key);
    cy.leadVisitors.add(key);
    cy.leads++;
    const lp = leadPageMap.get(path) ?? { views: 0, visitors: new Set<string>(), leads: 0 };
    lp.leads++;
    lp.visitors.add(key);
    leadPageMap.set(path, lp);
    const pg = pageMap.get(path) ?? { views: 0, visitors: new Set<string>(), leads: 0 };
    pg.leads++;
    pageMap.set(path, pg);
    bump(sources, type === "form" ? clean(r.source) || "unknown" : type === "call" ? "Call button" : "WhatsApp button");
    bump(services, applianceOf(r.appliance));
    const area = areaFromPath(path, areaLookup);
    if (area) bump(areas, area);
    const hw = [clean(r.device_vendor), clean(r.device_model)].filter(Boolean).join(" ");
    if (hw) bump(models, hw);
    bump(leadDeviceTypes, clean(r.device_type) || "unknown");
    const t = ist(r.received_at);
    leadsByHour[t.hour]++;
    leadsByWeekday[t.dow]++;
    const ld = leadsDay.get(t.day) ?? { form: 0, call: 0, whatsapp: 0 };
    ld[type]++;
    leadsDay.set(t.day, ld);
    const d = t.day;
    (visitorsDay.get(d) ?? visitorsDay.set(d, new Set()).get(d)!).add(key);
  }

  // ---- finish visitors
  const visitors: Visitor[] = [...vmap.values()]
    .map((v) => {
      const sessions = Math.max(v.sessionSet.size, 1);
      return {
        id: v.id,
        firstSeen: v.firstSeen,
        lastActive: v.lastActive,
        sessions,
        pageViews: v.pageViews,
        lastPage: v.lastPage,
        deviceType: v.deviceType,
        device: deviceLabel("", v.model, v.os, v.browser, v.deviceType),
        source: v.source,
        city: v.city,
        leads: v.leads,
        returning: sessions >= 2,
      };
    })
    .sort((a, b) => +new Date(b.lastActive) - +new Date(a.lastActive));

  for (const v of vmap.values()) {
    if (v.os) bump(osMap, v.os);
    if (v.browser) bump(browserMap, v.browser);
  }
  const typeMap = new Map<string, number>();
  for (const v of visitors) bump(typeMap, v.deviceType === "unknown" ? "desktop" : v.deviceType);

  const totalVisitors = visitors.length;
  const converted = visitors.filter((v) => v.leads > 0).length;
  const mobile = visitors.filter((v) => ["mobile", "tablet"].includes(v.deviceType)).length;

  const ranked = (e: { visitors: Set<string>; leadVisitors: Set<string>; leads: number }, label: string): RankedRow => ({
    label,
    visitors: e.visitors.size,
    leads: e.leads,
    conversionPct: pct(e.leadVisitors.size, e.visitors.size),
  });

  const channels = [...channelMap.entries()]
    .map(([label, e]) => ({ ...ranked(e, label), group: e.group }))
    .sort((a, b) => b.leads - a.leads || b.visitors - a.visitors)
    .slice(0, 12);
  const campaigns: CampaignRow[] = [...campaignMap.values()]
    .map((e) => ({ source: e.source, medium: e.medium, campaign: [...e.names].join(", ") || "not recorded", visitors: e.visitors.size, leads: e.leads, conversionPct: pct(e.leadVisitors.size, e.visitors.size) }))
    .sort((a, b) => b.leads - a.leads || b.visitors - a.visitors)
    .slice(0, 20);
  const toPageRows = (m: Map<string, { views: number; visitors: Set<string>; leads: number }>, n: number, byLeads: boolean): PageRow[] =>
    [...m.entries()]
      .map(([path, e]) => ({ path, group: pageGroup(path), views: e.views, visitors: e.visitors.size, leads: e.leads }))
      .sort((a, b) => (byLeads ? b.leads - a.leads || b.views - a.views : b.views - a.views || b.leads - a.leads))
      .slice(0, n);
  const pagesOut = toPageRows(pageMap, 12, false);
  const leadPages = toPageRows(leadPageMap, 8, true);
  const cities = [...cityMap.entries()]
    .map(([label, e]) => ranked(e, label))
    .sort((a, b) => b.leads - a.leads || b.visitors - a.visitors)
    .slice(0, 8);

  // ---- day series (IST), capped at 30 bars
  const lastDay = ist(now.toISOString()).day;
  const dayKeys: string[] = [];
  const endMs = new Date(`${lastDay}T00:00:00.000Z`).getTime();
  const count = input.range === "today" ? 1 : input.range === "7d" ? 7 : 30;
  for (let i = count - 1; i >= 0; i--) dayKeys.push(new Date(endMs - i * DAY_MS).toISOString().slice(0, 10));
  const leadsByDay = dayKeys.map((day) => ({ day, ...(leadsDay.get(day) ?? { form: 0, call: 0, whatsapp: 0 }) }));
  const visitorsByDay = dayKeys.map((day) => ({ day, count: visitorsDay.get(day)?.size ?? 0 }));

  const totalLeads = leads.length;
  const data: AdminData = {
    range: input.range,
    since: since ? since.toISOString() : null,
    totals: {
      leads: totalLeads,
      formLeads: typeCount.form,
      callTaps: typeCount.call,
      whatsappTaps: typeCount.whatsapp,
      visitors: totalVisitors,
      sessions: visitors.reduce((s, v) => s + v.sessions, 0),
      pageViews: views.length,
      returningVisitors: visitors.filter((v) => v.returning).length,
      convertedVisitors: converted,
      conversionPct: pct(converted, totalVisitors),
      mobilePct: pct(mobile, totalVisitors),
    },
    leadsByDay,
    visitorsByDay,
    channels,
    campaigns,
    pages: pagesOut,
    leadPages,
    cities,
    leadAreas: top(areas, 8),
    leadServices: top(services, 6),
    leadSources: top(sources, 8),
    devices: { types: top(typeMap, 4), os: top(osMap, 5), browsers: top(browserMap, 5), models: top(models, 6) },
    leadsByHour,
    leadsByWeekday,
    visitors,
    recentLeads: [...leads].sort((a, b) => +new Date(b.received_at) - +new Date(a.received_at)).slice(0, 6),
    insights: [],
    hiddenTestRows: hidden,
  };
  data.insights = makeInsights(data);
  return data;
}

function makeInsights(d: AdminData): string[] {
  const out: string[] = [];
  const t = d.totals;
  const phrase = RANGES.find((r) => r.key === d.range)?.phrase ?? "this period";
  if (t.leads > 0) {
    const parts = [t.formLeads && `${t.formLeads} from forms`, t.callTaps && `${t.callTaps} call ${t.callTaps === 1 ? "tap" : "taps"}`, t.whatsappTaps && `${t.whatsappTaps} WhatsApp ${t.whatsappTaps === 1 ? "tap" : "taps"}`].filter(Boolean);
    out.push(`${t.leads} ${t.leads === 1 ? "lead" : "leads"} in ${phrase}: ${parts.join(", ")}.`);
  } else if (t.visitors > 0) {
    out.push(`${t.visitors} ${t.visitors === 1 ? "visitor" : "visitors"} in ${phrase}, but no leads yet.`);
  }
  const topChannel = d.channels[0];
  if (topChannel && t.leads >= 3 && topChannel.leads > 0) {
    out.push(`${topChannel.label} brings the most leads: ${topChannel.leads} of ${t.leads} (${pct(topChannel.leads, t.leads)}%).`);
  }
  const best = d.channels.filter((c) => c.visitors >= 20 && c.leads > 0).sort((a, b) => b.conversionPct - a.conversionPct)[0];
  if (best && best.label !== topChannel?.label) {
    out.push(`${best.label} converts best: ${best.conversionPct}% of its ${best.visitors} visitors became leads.`);
  }
  const wasted = d.channels.filter((c) => c.visitors >= 30 && c.leads === 0).sort((a, b) => b.visitors - a.visitors)[0];
  if (wasted) out.push(`${wasted.label} sent ${wasted.visitors} visitors but no leads yet.`);
  const topPage = d.leadPages[0];
  if (topPage && t.leads >= 3 && topPage.leads > 0) out.push(`Most leads start on ${topPage.path} (${topPage.leads}).`);
  const topArea = d.leadAreas[0];
  if (topArea && t.leads >= 3) out.push(`${topArea.label} is the area page generating the most leads (${topArea.count}).`);
  const maxHour = Math.max(...d.leadsByHour);
  if (t.leads >= 5 && maxHour > 0) out.push(`Leads peak around ${fmtHour(d.leadsByHour.indexOf(maxHour))} IST.`);
  if (t.visitors >= 10) out.push(`${t.mobilePct}% of visitors browse on a phone or tablet.`);
  if (t.returningVisitors > 0) out.push(`${t.returningVisitors} ${t.returningVisitors === 1 ? "visitor" : "visitors"} returned for more than one session.`);
  if (t.visitors >= 30 && d.campaigns.length === 0) out.push("No tagged campaign traffic yet. Use the UTM link builder on the Traffic page for ads and social posts.");
  return out.slice(0, 7);
}

// ---- row-level lead view for the Leads screen --------------------------------------------
export type LeadItem = {
  id: string;
  receivedAt: string;
  type: LeadType;
  name: string;
  phone: string;
  appliance: string;
  issue: string;
  button: string;
  page: string;
  channel: string;
  campaign: string;
  city: string;
  device: string;
  deviceType: string;
  /** The same visitor sent more than one lead. */
  repeat: boolean;
};

const BUTTON_LABELS: Record<string, string> = {
  "diagnostic-popup": "Booking pop-up",
  "call-now": "Call button",
  "whatsapp-now": "WhatsApp button",
};

export function toLeadItems(rows: LeadRow[], opts: { includeTest?: boolean; since?: Date | null } = {}): LeadItem[] {
  const real = rows.filter((r) => isRealLead(r) && (!opts.since || new Date(r.received_at) >= opts.since) && (opts.includeTest || !isTest(r)));
  const visits = new Map<string, Set<string>>();
  for (const r of rows) {
    const k = visitorKeyOf(r);
    (visits.get(k) ?? visits.set(k, new Set()).get(k)!).add(clean(r.id));
  }
  return real
    .sort((a, b) => +new Date(b.received_at) - +new Date(a.received_at))
    .map((r) => {
      const type = leadTypeOf(r);
      const src = clean(r.source);
      return {
        id: r.id,
        receivedAt: r.received_at,
        type,
        name: clean(r.name),
        phone: clean(r.phone),
        appliance: applianceOf(r.appliance),
        issue: type === "form" ? clean(r.issue) : "",
        button: BUTTON_LABELS[src] ?? (src.startsWith("area-") ? `Area page form (${src.slice(5)})` : src.replace(/-page$/, " page").replace(/[-_]/g, " ")),
        page: pathOf(r.page_url),
        channel: channelOf(r).label,
        campaign: clean(r.traffic_campaign),
        city: clean(r.city) || "Unknown",
        device: deviceLabel(clean(r.device_vendor), clean(r.device_model), clean(r.os), clean(r.browser), clean(r.device_type)),
        deviceType: clean(r.device_type) || "unknown",
        repeat: (visits.get(visitorKeyOf(r))?.size ?? 0) > 1,
      };
    });
}
