// Keyword discovery. Two sources, both automatic:
//  1. Google autocomplete (no key, no account): what people actually type after our service words.
//  2. Search Console (optional, needs a service account): searches that already show our site.
// Candidates pass through keyword-rules and are published straight away as /topics/<slug> pages.
// The owner can unpublish any page afterwards. Main pages are never touched.
import { createSign } from "node:crypto";
import { revalidatePath } from "next/cache";
import type { ServiceSlug } from "@/app/(common-lib)/types";
import { keywords as staticKeywords } from "@/app/(config)/keywords";
import { brands, serviceProblems } from "@/app/(config)/content";
import { areas, site } from "@/app/(config)/site";
import { supabase } from "@/app/(server-lib)/supabase";
import { evaluateCandidate, keyOf, SKIP_LABELS, type Candidate, type RuleContext, type SkipReason } from "@/app/(server-lib)/keyword-rules";

export type KeywordStatus = "approved" | "rejected";
export type KeywordSource = "autocomplete" | "search_console" | "manual";

export type KeywordRecord = {
  slug: string;
  title: string;
  service: ServiceSlug;
  problem: string;
  query: string;
  source: KeywordSource;
  status: KeywordStatus;
  impressions: number;
  clicks: number;
  position: number | null;
  discoveredAt: string;
  reviewedAt: string | null;
};

export type AddedPage = { title: string; slug: string; source: KeywordSource };

export type SyncResult = {
  ok: boolean;
  error?: string;
  fetched: number;
  added: number;
  pages: AddedPage[];
  skipped: { reason: string; count: number }[];
  /** Per-source notes, e.g. a source that could not be reached. */
  notes: string[];
};

export type Overview = {
  demo: boolean;
  gscConfigured: boolean;
  suggestEnabled: boolean;
  tableReady: boolean;
  error?: string;
  published: number;
  unpublished: number;
  page: number;
  pages: number;
  pageSize: number;
  items: KeywordRecord[];
  lastDiscoveredAt: string | null;
};

const TABLE = "dynamic_keywords";
const RUNS = "keyword_discovery_runs";
const TABLE_MISSING = "The dynamic_keywords table does not exist yet. Run the keyword section of supabase-schema.sql in the Supabase SQL editor.";
const isDemo = () => process.env.ADMIN_DEMO === "1";
const minImpressions = () => Math.max(0, parseInt(process.env.KEYWORD_MIN_IMPRESSIONS ?? "", 10) || 20);
const maxPerRun = () => Math.max(1, parseInt(process.env.KEYWORD_MAX_PER_RUN ?? "", 10) || 10);
const MAX_TOTAL = 300;
const suggestEnabled = () => process.env.KEYWORD_SUGGEST_ENABLED !== "0";

// ---------------------------------------------------------------- storage
type Row = {
  slug: string; title: string; service: string; problem: string; query: string | null; source: string; status: string;
  impressions: number; clicks: number; position: number | null; discovered_at: string; reviewed_at: string | null;
};

const fromRow = (r: Row): KeywordRecord => ({
  slug: r.slug, title: r.title, service: r.service as ServiceSlug, problem: r.problem, query: r.query ?? r.title,
  source: r.source === "manual" ? "manual" : r.source === "autocomplete" ? "autocomplete" : "search_console",
  status: r.status === "approved" ? "approved" : "rejected",
  impressions: r.impressions ?? 0, clicks: r.clicks ?? 0, position: r.position, discoveredAt: r.discovered_at, reviewedAt: r.reviewed_at,
});

const isMissingTable = (e: { code?: string; message?: string }) => e.code === "42P01" || e.code === "PGRST205" || /does not exist|schema cache/i.test(e.message ?? "");

// Demo mode keeps a small in-memory list so the screens can be previewed without a database.
// Kept on globalThis because the API routes and the pages are bundled separately in production.
const demoStore = globalThis as { __uscDemoKeywords?: KeywordRecord[]; __uscDemoRuns?: Set<string> };
const demo = () =>
  (demoStore.__uscDemoKeywords ??= [
    { slug: "split-ac-gas-refill-bangalore", title: "Split AC Gas Refill in Bengaluru", service: "ac-repair", problem: "Gas refill needed", query: "split ac gas refill", source: "search_console", status: "approved", impressions: 640, clicks: 31, position: 5.8, discoveredAt: "2026-10-20T05:00:00Z", reviewedAt: null },
    { slug: "fridge-making-noise-bangalore", title: "Fridge Making Noise in Bengaluru", service: "refrigerator-repair", problem: "Not cooling", query: "fridge making noise", source: "manual", status: "approved", impressions: 0, clicks: 0, position: null, discoveredAt: "2026-10-19T05:00:00Z", reviewedAt: null },
  ]);

async function readAll(): Promise<{ rows: KeywordRecord[]; tableReady: boolean; error?: string }> {
  if (isDemo()) return { rows: demo(), tableReady: true };
  const { data, error } = await supabase.from(TABLE).select("*").order("discovered_at", { ascending: false }).limit(5000);
  if (error) return isMissingTable(error) ? { rows: [], tableReady: false } : { rows: [], tableReady: true, error: error.message };
  return { rows: (data as Row[]).map(fromRow), tableReady: true };
}

async function insertRows(rows: KeywordRecord[]): Promise<string | null> {
  if (isDemo()) {
    const have = new Set(demo().map((r) => r.slug));
    demo().unshift(...rows.filter((r) => !have.has(r.slug)));
    return null;
  }
  const payload = rows.map((r) => ({
    slug: r.slug, title: r.title, service: r.service, problem: r.problem, query: r.query, source: r.source, status: r.status,
    impressions: r.impressions, clicks: r.clicks, position: r.position, discovered_at: r.discoveredAt, reviewed_at: r.reviewedAt,
  }));
  // ignoreDuplicates: a keyword that already exists (or was unpublished) is never overwritten or revived.
  const { error } = await supabase.from(TABLE).upsert(payload, { onConflict: "slug", ignoreDuplicates: true });
  return error ? (isMissingTable(error) ? TABLE_MISSING : error.message) : null;
}

// ---------------------------------------------------------------- rules context
function buildContext(existing: KeywordRecord[], opts: { min: number; requireIntent: boolean; skipBrands: boolean }): RuleContext {
  const known = new Set<string>();
  for (const k of staticKeywords) {
    known.add(keyOf(k.slug.replace(/-/g, " ")));
    known.add(keyOf(k.title));
  }
  for (const k of existing) known.add(keyOf(k.query)).add(keyOf(k.slug.replace(/-/g, " "))); // includes unpublished, so they never come back
  return {
    knownKeys: known,
    areaNames: areas.map((a) => a.toLowerCase()),
    brandNames: brands.map((b) => b.toLowerCase()),
    problems: serviceProblems as Record<string, { title: string }[]>,
    fallbackProblem: {
      "microwave-repair": "Microwave not heating", "ac-repair": "AC not cooling", "washing-machine-repair": "Not draining",
      "refrigerator-repair": "Not cooling", "water-filter-repair": "Not purifying", "chimney-repair": "Not sucking smoke",
    },
    minImpressions: opts.min,
    requireIntent: opts.requireIntent,
    skipBrands: opts.skipBrands,
  };
}

// ---------------------------------------------------------------- Search Console (official API)
type GscConfig = { clientEmail: string; privateKey: string; siteUrl: string };

function gscConfig(): GscConfig | null {
  const clientEmail = process.env.GSC_CLIENT_EMAIL;
  const privateKey = process.env.GSC_PRIVATE_KEY;
  if (!clientEmail || !privateKey) return null;
  // URL-prefix property: https://example.com/   Domain property: sc-domain:example.com
  return { clientEmail, privateKey: privateKey.replace(/\\n/g, "\n"), siteUrl: process.env.GSC_SITE_URL || `${site.url}/` };
}

async function googleJson(url: string, init: RequestInit): Promise<{ ok: boolean; status: number; body: Record<string, unknown> }> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(12000) });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, body };
}

async function fetchSearchConsole(cfg: GscConfig): Promise<{ rows: Candidate[] } | { error: string }> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const part = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const unsigned = `${part({ alg: "RS256", typ: "JWT" })}.${part({ iss: cfg.clientEmail, scope: "https://www.googleapis.com/auth/webmasters.readonly", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
    const signer = createSign("RSA-SHA256");
    signer.update(unsigned);
    const assertion = `${unsigned}.${signer.sign(cfg.privateKey, "base64url")}`;

    const token = await googleJson("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
    });
    const accessToken = token.body.access_token as string | undefined;
    if (!token.ok || !accessToken) return { error: `Google rejected the service-account key: ${String(token.body.error_description ?? token.body.error ?? token.status)}` };

    const end = new Date();
    const start = new Date(end.getTime() - 90 * 86400000);
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    const res = await googleJson(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(cfg.siteUrl)}/searchAnalytics/query`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: iso(start), endDate: iso(end), dimensions: ["query"], rowLimit: 1000,
        dimensionFilterGroups: [{ filters: [{ dimension: "country", operator: "equals", expression: "ind" }] }],
      }),
    });
    const apiMessage = String((res.body.error as { message?: string })?.message ?? "");
    if (res.status === 403 && /has not been used|is disabled|SERVICE_DISABLED|accessNotConfigured/i.test(`${apiMessage} ${JSON.stringify(res.body)}`)) {
      return { error: `The Google Search Console API is switched off in your Google Cloud project. Open https://console.cloud.google.com/apis/library/searchconsole.googleapis.com (select the project that owns ${cfg.clientEmail}), click Enable, wait a minute, then try again.` };
    }
    if (res.status === 403) return { error: `Search Console refused access to ${cfg.siteUrl}. In Search Console → Settings → Users, add ${cfg.clientEmail} as a user, and check that GSC_SITE_URL matches the property (domain properties look like sc-domain:example.com).` };
    if (res.status === 404) return { error: `Search Console has no property named ${cfg.siteUrl}. Set GSC_SITE_URL to the exact property name.` };
    if (!res.ok) return { error: `Search Console returned ${res.status}: ${String((res.body.error as { message?: string })?.message ?? "unknown error")}` };
    const rows = ((res.body.rows as { keys?: string[]; clicks?: number; impressions?: number; position?: number }[]) ?? [])
      .filter((r) => r.keys?.[0])
      .map((r) => ({ query: r.keys![0], impressions: r.impressions ?? 0, clicks: r.clicks ?? 0, position: r.position ?? 0 }));
    return { rows };
  } catch (e) {
    return { error: `Could not reach Google: ${(e as Error).message}` };
  }
}

// ---------------------------------------------------------------- Google autocomplete (no key)
// Public suggestion endpoint used by the Google search box. No account or key. We only read the
// phrases it offers after our own service words, never scrape result pages, and the rules below
// decide which phrases may become pages (the endpoint can return anything).
// Short prefixes: the endpoint completes what is typed, so a full sentence returns nothing.
const SUGGEST_SEEDS: string[] = [
  "microwave not", "microwave repair", "microwave oven service", "microwave sparking",
  "ac not", "ac repair", "ac gas", "ac water leaking", "split ac service", "inverter ac repair",
  "washing machine not", "washing machine repair", "front load washing machine", "washing machine noise",
  "fridge not", "refrigerator repair", "fridge making", "double door refrigerator",
  "ro water purifier not", "water purifier repair", "ro service", "water purifier low",
  "chimney not", "chimney repair", "kitchen chimney cleaning", "chimney suction",
];

async function fetchSuggestions(seed: string): Promise<string[]> {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=in&q=${encodeURIComponent(seed)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(4000), headers: { "User-Agent": `${site.name} keyword discovery (${site.url})` } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as unknown;
  const list = Array.isArray(body) && Array.isArray(body[1]) ? (body[1] as unknown[]) : [];
  return list.filter((x): x is string => typeof x === "string");
}

async function fetchAutocomplete(): Promise<{ rows: Candidate[]; note?: string }> {
  const settled = await Promise.allSettled(SUGGEST_SEEDS.map(fetchSuggestions));
  const failed = settled.filter((r) => r.status === "rejected").length;
  const seen = new Set<string>();
  const rows: Candidate[] = [];
  // Seeds are ordered service by service; interleave so one appliance cannot use up the whole run.
  const lists = settled.map((r) => (r.status === "fulfilled" ? r.value : []));
  for (let i = 0; i < 10; i++) {
    for (const list of lists) {
      const q = list[i];
      if (q && !seen.has(q.toLowerCase())) {
        seen.add(q.toLowerCase());
        rows.push({ query: q, impressions: 0, clicks: 0, position: 0 });
      }
    }
  }
  const note = failed === settled.length ? "Google autocomplete could not be reached from the server." : failed > 0 ? `${failed} of ${settled.length} autocomplete lookups failed; the rest were used.` : undefined;
  return { rows, note };
}

// Sample queries for demo mode: includes ones the rules must reject, so the screens show real behaviour.
const DEMO_QUERIES: Candidate[] = [
  { query: "fully automatic washing machine repair near me", impressions: 420, clicks: 18, position: 6.1 },
  { query: "carrier ac service bangalore", impressions: 160, clicks: 6, position: 9.4 },
  { query: "ro water purifier not working", impressions: 210, clicks: 9, position: 9.1 },
  { query: "urban company ac repair bangalore", impressions: 900, clicks: 40, position: 3.2 },
  { query: "samsung microwave service center", impressions: 380, clicks: 11, position: 8.8 },
  { query: "microwave repair indiranagar", impressions: 120, clicks: 7, position: 5.5 },
  { query: "washing machine repair delhi", impressions: 90, clicks: 1, position: 15 },
  { query: "ac gas refill", impressions: 8, clicks: 0, position: 22 },
  { query: "microwave not heating bangalore", impressions: 700, clicks: 33, position: 4.1 },
  { query: "microwave and ac repair bangalore", impressions: 60, clicks: 2, position: 11 },
  { query: "ac repair jobs", impressions: 140, clicks: 0, position: 30 },
];

// ---------------------------------------------------------------- operations
/** Makes new, changed or removed topic pages show up without waiting for the hourly refresh. */
export function refreshTopicPaths(slugs: string[]) {
  for (const slug of slugs) revalidatePath(`/topics/${slug}`);
  revalidatePath("/topics");
  revalidatePath("/sitemap-topics.xml");
  revalidatePath("/sitemap.xml");
}

function demoAutocomplete(): Candidate[] {
  // Offline stand-in used in demo mode so the screens work without network access.
  return ["microwave sparking inside bangalore", "microwave oven models bangalore", "microwave oven cover bangalore repair", "samsung microwave repair bangalore", "washing machine drum not spinning bangalore", "fridge compressor not starting bangalore", "ac water leaking from indoor unit bangalore"]
    .map((query) => ({ query, impressions: 0, clicks: 0, position: 0 }));
}

export async function syncKeywords(): Promise<SyncResult> {
  const fail = (error: string, extra: Partial<SyncResult> = {}): SyncResult => ({ ok: false, error, fetched: 0, added: 0, pages: [], skipped: [], notes: [], ...extra });
  const notes: string[] = [];
  const sources: { source: KeywordSource; rows: Candidate[]; ctxOpts: { min: number; requireIntent: boolean; skipBrands: boolean } }[] = [];

  if (isDemo()) {
    sources.push({ source: "search_console", rows: DEMO_QUERIES, ctxOpts: { min: 20, requireIntent: false, skipBrands: true } });
    if (suggestEnabled()) sources.push({ source: "autocomplete", rows: demoAutocomplete(), ctxOpts: { min: 0, requireIntent: true, skipBrands: true } });
  } else {
    if (suggestEnabled()) {
      const got = await fetchAutocomplete();
      if (got.note) notes.push(got.note);
      sources.push({ source: "autocomplete", rows: got.rows, ctxOpts: { min: 0, requireIntent: true, skipBrands: true } });
    }
    const cfg = gscConfig();
    if (cfg) {
      const got = await fetchSearchConsole(cfg);
      if ("error" in got) notes.push(`Search Console: ${got.error}`);
      else sources.push({ source: "search_console", rows: got.rows, ctxOpts: { min: minImpressions(), requireIntent: false, skipBrands: true } });
    }
  }
  const fetched = sources.reduce((n, s) => n + s.rows.length, 0);
  if (sources.length === 0) return fail(notes[0] ?? "No keyword source is turned on.", { notes });
  if (fetched === 0) return fail(notes[0] ?? "No suggestions came back.", { notes });

  const existing = await readAll();
  if (!existing.tableReady) return fail(TABLE_MISSING, { fetched, notes });
  if (existing.error) return fail(existing.error, { fetched, notes });

  const published = existing.rows.filter((r) => r.status === "approved").length;
  const room = Math.max(0, Math.min(maxPerRun(), MAX_TOTAL - published));
  const taken = new Set(existing.rows.map((r) => r.slug));
  const skipped = new Map<SkipReason, number>();
  const bump = (r: SkipReason) => skipped.set(r, (skipped.get(r) ?? 0) + 1);
  const fresh: KeywordRecord[] = [];
  const shared = buildContext(existing.rows, { min: 0, requireIntent: false, skipBrands: true });
  const knownKeys = shared.knownKeys;

  for (const src of sources) {
    const ctx = { ...buildContext(existing.rows, src.ctxOpts), knownKeys };
    for (const c of [...src.rows].sort((a, b) => b.impressions - a.impressions)) {
      const d = evaluateCandidate(c, ctx);
      if (!d.ok) { bump(d.reason); continue; }
      if (taken.has(d.keyword.slug)) { bump("duplicate"); continue; }
      if (fresh.length >= room) continue; // cap reached: left for the next run, not counted as skipped
      taken.add(d.keyword.slug);
      knownKeys.add(keyOf(c.query)); // near-identical queries in one run create one page
      const now = new Date().toISOString();
      fresh.push({ ...d.keyword, source: src.source, status: "approved", impressions: c.impressions, clicks: c.clicks, position: c.position || null, discoveredAt: now, reviewedAt: null });
    }
  }
  if (room === 0) notes.push(`The ${MAX_TOTAL}-page limit is reached. Unpublish some pages to make room.`);
  if (fresh.length > 0) {
    const err = await insertRows(fresh);
    if (err) return fail(err, { fetched, notes });
  }
  return {
    ok: true,
    fetched,
    added: fresh.length,
    pages: fresh.map((k) => ({ title: k.title, slug: k.slug, source: k.source })),
    skipped: [...skipped.entries()].sort((a, b) => b[1] - a[1]).map(([reason, count]) => ({ reason: SKIP_LABELS[reason], count })),
    notes,
  };
}

// Once-a-day gate so that opening pages never triggers more than one discovery run per day.
async function claimDailyRun(): Promise<boolean> {
  const bucket = new Date().toISOString().slice(0, 10);
  if (isDemo()) {
    const set = (demoStore.__uscDemoRuns ??= new Set());
    if (set.has(bucket)) return false;
    set.add(bucket);
    return true;
  }
  const { error } = await supabase.from(RUNS).insert({ bucket });
  return !error; // duplicate key (already ran today) or missing table both mean: do not run
}

let lastAttempt = 0;
/** Called when someone opens a topic page or the admin keywords page. Cheap when nothing is due. */
export async function autoDiscover(): Promise<{ ran: boolean; result?: SyncResult }> {
  if (!isDemo() && !suggestEnabled() && !gscConfig()) return { ran: false };
  if (Date.now() - lastAttempt < 10 * 60 * 1000) return { ran: false }; // per-server throttle on top of the daily claim
  lastAttempt = Date.now();
  if (!(await claimDailyRun())) return { ran: false };
  return { ran: true, result: await syncKeywords() };
}

export async function addKeyword(query: string): Promise<{ ok: boolean; error?: string; keyword?: KeywordRecord }> {
  const existing = await readAll();
  if (!existing.tableReady) return { ok: false, error: TABLE_MISSING };
  const ctx = buildContext(existing.rows, { min: 0, requireIntent: false, skipBrands: false });
  const d = evaluateCandidate({ query, impressions: 0, clicks: 0, position: 0 }, ctx);
  if (!d.ok) return { ok: false, error: `Not added: ${SKIP_LABELS[d.reason]}.` };
  if (existing.rows.some((r) => r.slug === d.keyword.slug)) return { ok: false, error: "Not added: already exists." };
  const now = new Date().toISOString();
  const rec: KeywordRecord = { ...d.keyword, source: "manual", status: "approved", impressions: 0, clicks: 0, position: null, discoveredAt: now, reviewedAt: null };
  const err = await insertRows([rec]);
  return err ? { ok: false, error: err } : { ok: true, keyword: rec };
}

/** "unpublish" hides the page and keeps the keyword blocked; "publish" brings it back. */
export async function setPublished(slug: string, published: boolean): Promise<{ ok: boolean; error?: string }> {
  const status: KeywordStatus = published ? "approved" : "rejected";
  const reviewedAt = published ? null : new Date().toISOString();
  if (isDemo()) {
    const row = demo().find((r) => r.slug === slug);
    if (!row) return { ok: false, error: "Keyword not found." };
    row.status = status;
    row.reviewedAt = reviewedAt;
    return { ok: true };
  }
  const { error, count } = await supabase.from(TABLE).update({ status, reviewed_at: reviewedAt }, { count: "exact" }).eq("slug", slug);
  if (error) return { ok: false, error: isMissingTable(error) ? TABLE_MISSING : error.message };
  return count === 0 ? { ok: false, error: "Keyword not found." } : { ok: true };
}

export async function getOverview(page = 1, pageSize = 20): Promise<Overview> {
  const { rows, tableReady, error } = await readAll();
  const live = rows.filter((r) => r.status === "approved");
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const p = Math.min(Math.max(1, page), pages);
  const stamps = rows.map((r) => r.discoveredAt).sort();
  return {
    demo: isDemo(),
    gscConfigured: isDemo() || gscConfig() !== null,
    suggestEnabled: suggestEnabled(),
    tableReady,
    error,
    published: live.length,
    unpublished: rows.length - live.length,
    page: p,
    pages,
    pageSize,
    items: rows.slice((p - 1) * pageSize, p * pageSize),
    lastDiscoveredAt: stamps.length ? stamps[stamps.length - 1] : null,
  };
}

// ---------------------------------------------------------------- public reads (published only)
export async function getApprovedTopics(): Promise<KeywordRecord[]> {
  const { rows } = await readAll();
  return rows.filter((r) => r.status === "approved");
}

export async function getApprovedTopic(slug: string): Promise<KeywordRecord | null> {
  if (isDemo()) return demo().find((r) => r.slug === slug && r.status === "approved") ?? null;
  const { data, error } = await supabase.from(TABLE).select("*").eq("slug", slug).eq("status", "approved").maybeSingle();
  return error || !data ? null : fromRow(data as Row);
}
