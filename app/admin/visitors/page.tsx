export const dynamic = "force-dynamic";

import Link from "next/link";
import { isDemo, loadAdminData } from "@/app/(server-lib)/admin-data";
import { RANGES, type RangeKey } from "@/app/(server-lib)/admin-insights";
import { fmtDateTime, plural, timeAgo } from "../_ui/format";
import { Pagination } from "../_ui/pagination";
import { Banner, EmptyNote, PageHeader, RangeTabs, StatCard } from "../_ui/parts";

const PAGE_SIZE = 25;

function parseRange(v?: string): RangeKey {
  return RANGES.some((r) => r.key === v) ? (v as RangeKey) : "30d";
}

export default async function AdminVisitors({ searchParams }: { searchParams: Promise<{ range?: string; test?: string; only?: string; page?: string }> }) {
  const sp = await searchParams;
  const range = parseRange(sp.range);
  const includeTest = sp.test === "1";
  const onlyLeads = sp.only === "leads";
  const { data: d, error, generatedAt } = await loadAdminData(range, includeTest);
  const pool = onlyLeads ? d.visitors.filter((v) => v.leads > 0) : d.visitors;
  const pages = Math.max(1, Math.ceil(pool.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, parseInt(sp.page ?? "1", 10) || 1), pages);
  const shown = pool.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const t = d.totals;
  const base = new URLSearchParams({ range });
  if (includeTest) base.set("test", "1");
  const link = (extra: Record<string, string>) => `/admin/visitors?${new URLSearchParams({ ...Object.fromEntries(base), ...extra })}`;
  const now = generatedAt;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Visitors"
        subtitle="One row per unique visitor, newest activity first."
        right={<RangeTabs current={range} path="/admin/visitors" test={includeTest} />}
      />
      {isDemo() && <Banner tone="info"><strong>Demo data.</strong> Sample visitors for previewing this screen.</Banner>}
      {error && <Banner tone="warn"><strong>Some data could not be loaded:</strong> {error}</Banner>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Unique visitors" value={t.visitors} />
        <StatCard label="Returning" value={t.returningVisitors} note="2 or more visits" />
        <StatCard label="Became leads" value={t.convertedVisitors} note={`${t.conversionPct}% of visitors`} />
        <StatCard label="Visits" value={t.sessions} note={`${plural(t.pageViews, "page view")}`} />
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter visitors">
        <Link href={link({})} aria-current={!onlyLeads ? "true" : undefined} className={`inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold ${!onlyLeads ? "bg-primary text-on-primary" : "bg-surface text-on-surface-variant ring-1 ring-outline-variant hover:bg-surface-variant"}`}>All visitors</Link>
        <Link href={link({ only: "leads" })} aria-current={onlyLeads ? "true" : undefined} className={`inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold ${onlyLeads ? "bg-primary text-on-primary" : "bg-surface text-on-surface-variant ring-1 ring-outline-variant hover:bg-surface-variant"}`}>Only visitors who became leads</Link>
      </div>

      {shown.length === 0 ? (
        <EmptyNote>No visitors in this period.</EmptyNote>
      ) : (
        <ul className="space-y-3">
          {shown.map((v) => (
            <li key={v.id + v.firstSeen} className="rounded-2xl bg-surface p-4 ring-1 ring-outline-variant sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <p className="text-base font-extrabold text-on-surface">
                  <span className="font-mono text-primary">#{v.id}</span>
                  <span className="ml-2 text-sm font-medium text-muted">{v.device}</span>
                </p>
                <p className="text-sm text-on-surface-variant">
                  <span className="font-bold text-on-surface">Last active {timeAgo(v.lastActive, now)}</span>
                  <span className="block text-muted sm:text-right">{fmtDateTime(v.lastActive)}</span>
                </p>
              </div>
              <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <Item k="Visits" v={`${v.sessions}${v.returning ? " (returning)" : ""} · ${plural(v.pageViews, "page")}`} />
                <Item k="First seen" v={fmtDateTime(v.firstSeen)} />
                <Item k="First source" v={v.source} />
                <Item k="City" v={v.city} />
                <Item k="Last page" v={v.lastPage} />
                <Item k="Leads" v={v.leads > 0 ? plural(v.leads, "lead") : "None"} strong={v.leads > 0} />
              </dl>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} pages={pages} total={pool.length} pageSize={PAGE_SIZE} noun="visitors" hrefFor={(p) => link({ ...(onlyLeads ? { only: "leads" } : {}), ...(p > 1 ? { page: String(p) } : {}) })} />

      <p className="text-sm text-muted">
        A visitor is one browser fingerprint, so the same person on two devices counts twice, and two people on identical phones on the same network can occasionally merge.
      </p>
    </div>
  );
}

function Item({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 text-muted">{k}</dt>
      <dd className={`min-w-0 break-words ${strong ? "font-extrabold text-success" : "font-medium text-on-surface"}`}>{v}</dd>
    </div>
  );
}
