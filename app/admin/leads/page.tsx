export const dynamic = "force-dynamic";

import Link from "next/link";
import { isDemo, parseLeadQuery, queryLeads, type LeadParams } from "@/app/(server-lib)/admin-data";
import type { LeadType } from "@/app/(server-lib)/admin-insights";
import { TYPE_STYLE } from "../_ui/lead-type";
import { fmtDateTime, fmtPhone, timeAgo } from "../_ui/format";
import { Pagination } from "../_ui/pagination";
import { Banner, EmptyNote, PageHeader, RangeTabs } from "../_ui/parts";
import { DeleteLead } from "./delete-lead";

const PAGE_SIZE = 20;
const TYPES: { key: "all" | LeadType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "form", label: "Forms" },
  { key: "call", label: "Calls" },
  { key: "whatsapp", label: "WhatsApp" },
];

type SP = LeadParams;

export default async function AdminLeads({ searchParams }: { searchParams: Promise<SP> }) {
  const query = parseLeadQuery(await searchParams, PAGE_SIZE);
  const r = await queryLeads(query);
  const demo = isDemo();

  const href = (over: Partial<Record<keyof SP, string>>) => {
    const next: Record<string, string> = { range: query.range, ...(query.includeTest ? { test: "1" } : {}), ...(query.type !== "all" ? { type: query.type } : {}), ...(query.service !== "all" ? { service: query.service } : {}), ...(query.channel !== "all" ? { channel: query.channel } : {}), ...(query.q ? { q: query.q } : {}), ...over };
    for (const k of Object.keys(next)) if (!next[k] || next[k] === "all" || (k === "page" && next[k] === "1")) delete next[k];
    return `/admin/leads?${new URLSearchParams(next)}`;
  };
  const exportHref = `/api/admin/leads/export?${new URLSearchParams({ range: query.range, ...(query.includeTest ? { test: "1" } : {}), ...(query.type !== "all" ? { type: query.type } : {}), ...(query.service !== "all" ? { service: query.service } : {}), ...(query.channel !== "all" ? { channel: query.channel } : {}), ...(query.q ? { q: query.q } : {}) })}`;
  const filtered = query.type !== "all" || query.service !== "all" || query.channel !== "all" || query.q !== "";
  const field = "min-h-11 w-full rounded-xl border border-outline bg-background px-3 text-base text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-4">
      <PageHeader
        title="Leads"
        subtitle="Every request from the website: form submissions, call taps and WhatsApp taps."
        right={<RangeTabs current={query.range} path="/admin/leads" test={query.includeTest} />}
      />
      {demo && <Banner tone="info"><strong>Demo data.</strong> Sample leads for previewing this screen. Delete is disabled in demo mode.</Banner>}
      {r.error && <Banner tone="warn"><strong>Some data could not be loaded:</strong> {r.error}</Banner>}

      <form method="get" action="/admin/leads" className="space-y-3 rounded-2xl bg-surface p-4 ring-1 ring-outline-variant">
        <input type="hidden" name="range" value={query.range} />
        {query.includeTest && <input type="hidden" name="test" value="1" />}
        {query.type !== "all" && <input type="hidden" name="type" value={query.type} />}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Lead type">
          {TYPES.map((t) => (
            <Link key={t.key} href={href({ type: t.key, page: "1" })} aria-current={query.type === t.key ? "true" : undefined} className={`inline-flex min-h-11 items-center rounded-xl border px-4 text-sm font-bold transition-colors ${query.type === t.key ? "border-primary bg-primary text-on-primary" : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary hover:text-primary"}`}>
              {t.label} <span className="ml-1.5 font-medium opacity-80">{r.counts[t.key]}</span>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <input name="q" defaultValue={query.q} placeholder="Search name, phone, page, city…" aria-label="Search leads" className={`${field} col-span-2 sm:col-span-1`} />
          <select name="service" defaultValue={query.service} aria-label="Filter by service" className={field}>
            <option value="all">All services</option>
            {r.services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="channel" defaultValue={query.channel} aria-label="Filter by traffic source" className={field}>
            <option value="all">All traffic sources</option>
            {r.channels.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="btn-zoom min-h-11 rounded-xl bg-primary px-5 text-sm font-bold text-on-primary hover:bg-secondary">Apply filters</button>
          {filtered && <Link href={href({ type: "all", service: "all", channel: "all", q: "", page: "1" })} className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-bold text-on-surface-variant hover:bg-surface-variant">Clear</Link>}
          <a href={exportHref} className="btn-tonal ml-auto">Export {r.total.toLocaleString("en-IN")} to CSV</a>
        </div>
        <p className="text-sm text-muted">Call and WhatsApp taps have no phone number.</p>
      </form>

      {r.items.length === 0 ? (
        <EmptyNote>{r.counts.all === 0 ? "No leads in this period yet." : "No leads match these filters."}</EmptyNote>
      ) : (
        <ul className="space-y-3">
          {r.items.map((l) => {
            const style = TYPE_STYLE[l.type];
            const digits = l.phone.replace(/\D/g, "").slice(-10);
            return (
              <li key={l.id} className="rounded-2xl bg-surface p-4 ring-1 ring-outline-variant sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className={`inline-flex items-center gap-2 text-sm font-bold ${style.text}`}>
                    <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} aria-hidden="true" />
                    {style.label}
                    {l.repeat && <span className="font-medium text-muted">· repeat visitor</span>}
                  </p>
                  <p className="shrink-0 text-right text-sm text-muted" title={fmtDateTime(l.receivedAt)}>
                    {timeAgo(l.receivedAt, r.generatedAt)}
                    <span className="block">{fmtDateTime(l.receivedAt)}</span>
                  </p>
                </div>
                <div className="mt-2">
                  {l.phone ? (
                    <>
                      <p className="text-lg font-extrabold text-on-surface">{l.name || "No name given"}</p>
                      <a href={`tel:+91${digits}`} className="text-base font-bold text-primary hover:underline">{fmtPhone(l.phone)}</a>
                    </>
                  ) : (
                    <p className="text-lg font-extrabold text-on-surface">{l.type === "call" ? "Tapped the call button" : "Tapped the WhatsApp button"}</p>
                  )}
                  <p className="mt-1 text-base text-on-surface-variant">{l.appliance}{l.issue ? ` · ${l.issue}` : ""}</p>
                </div>
                <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                  <Row k="Page" v={l.page} />
                  <Row k="Source" v={l.campaign ? `${l.channel} · ${l.campaign}` : l.channel} />
                  <Row k="Button" v={l.button} />
                  <Row k="City" v={l.city} />
                  <Row k="Device" v={`${l.device} (${l.deviceType})`} />
                </dl>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {l.phone && (
                    <>
                      <a href={`tel:+91${digits}`} className="btn-zoom inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-bold text-on-primary hover:bg-secondary">Call</a>
                      <a href={`https://wa.me/91${digits}`} target="_blank" rel="noopener noreferrer" className="btn-zoom inline-flex min-h-11 items-center rounded-xl bg-success px-4 text-sm font-bold text-on-success hover:opacity-90">WhatsApp</a>
                    </>
                  )}
                  <DeleteLead id={l.id} demo={demo} />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Pagination page={r.page} pages={r.pages} total={r.total} pageSize={PAGE_SIZE} noun="leads" hrefFor={(p) => href({ page: String(p) })} />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-14 shrink-0 text-muted">{k}</dt>
      <dd className="min-w-0 break-words font-medium text-on-surface">{v}</dd>
    </div>
  );
}
