export const dynamic = "force-dynamic";

import Link from "next/link";
import { isDemo, loadAdminData } from "@/app/(server-lib)/admin-data";
import { RANGES, toLeadItems, type RangeKey } from "@/app/(server-lib)/admin-insights";
import { fmtDateTime, plural, timeAgo } from "./_ui/format";
import { Banner, DayBars, EmptyNote, HourBars, PageHeader, Panel, RangeTabs, RankedBars, StatCard } from "./_ui/parts";
import { TYPE_STYLE } from "./_ui/lead-type";

function parseRange(v?: string): RangeKey {
  return RANGES.some((r) => r.key === v) ? (v as RangeKey) : "7d";
}

export default async function AdminOverview({ searchParams }: { searchParams: Promise<{ range?: string; test?: string }> }) {
  const sp = await searchParams;
  const range = parseRange(sp.range);
  const includeTest = sp.test === "1";
  const { data: d, error, generatedAt } = await loadAdminData(range, includeTest);
  const t = d.totals;
  const recent = toLeadItems(d.recentLeads, { includeTest: true });
  const phrase = RANGES.find((r) => r.key === range)!.phrase;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Overview"
        subtitle={`Where your leads and visitors come from, for ${phrase}.`}
        right={<RangeTabs current={range} path="/admin" test={includeTest} />}
      />

      {isDemo() && <Banner tone="info"><strong>Demo data.</strong> These numbers are generated samples so you can preview the screens. Remove ADMIN_DEMO to see real data.</Banner>}
      {error && <Banner tone="warn"><strong>Some data could not be loaded:</strong> {error}</Banner>}
      {d.hiddenTestRows > 0 && (
        <Banner tone="warn">
          {plural(d.hiddenTestRows, "test row")} from localhost or dev traffic {d.hiddenTestRows === 1 ? "is" : "are"} hidden.{" "}
          <Link href={`/admin?range=${range}&test=1`} className="font-bold underline">Show them</Link>
        </Banner>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Leads"
          value={t.leads}
          note={`${t.formLeads} form · ${t.callTaps} call · ${t.whatsappTaps} WhatsApp`}
        />
        <StatCard label="Unique visitors" value={t.visitors} note={`${t.returningVisitors} came back · ${plural(t.pageViews, "page view")}`} />
        <StatCard label="Visitors who became leads" value={`${t.conversionPct}%`} note={`${t.convertedVisitors} of ${t.visitors}`} />
        <StatCard label="On a phone or tablet" value={`${t.mobilePct}%`} note="of unique visitors" />
      </div>

      {t.leads === 0 && t.visitors === 0 ? (
        <Panel title="No data yet for this period">
          <EmptyNote>
            Visits and leads appear here as soon as people use the site. Try a longer range, or open the website and tap a call button to see a lead arrive.
          </EmptyNote>
        </Panel>
      ) : (
        <>
          {d.insights.length > 0 && (
            <Panel title="What stands out">
              <ul className="space-y-2">
                {d.insights.map((line) => (
                  <li key={line} className="flex gap-3 text-base text-on-surface">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel title="Leads per day" hint="Form requests, call taps and WhatsApp taps (IST).">
            <DayBars days={d.leadsByDay} />
          </Panel>

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Where leads come from" hint="Traffic channel. The note shows how many visitors from it became a lead.">
              <RankedBars
                empty="No leads yet in this period."
                rows={d.channels.filter((c) => c.leads > 0).slice(0, 6).map((c) => ({ label: c.label, bar: c.leads, value: `${c.leads}`, note: `${plural(c.visitors, "visitor")} · ${c.conversionPct}% became leads` }))}
              />
            </Panel>
            <Panel title="Pages that start leads" hint="The page the visitor was on when they got in touch.">
              <RankedBars
                empty="No leads yet in this period."
                rows={d.leadPages.filter((p) => p.leads > 0).slice(0, 6).map((p) => ({ label: p.path, bar: p.leads, value: `${p.leads}`, note: p.group }))}
              />
            </Panel>
            <Panel title="Area pages" hint="Leads that started on a /areas/ page, so you can see which neighbourhoods ask.">
              <RankedBars empty="No leads from area pages yet." rows={d.leadAreas.slice(0, 6).map((a) => ({ label: a.label, bar: a.count, value: `${a.count}` }))} />
            </Panel>
            <Panel title="Services asked for">
              <RankedBars empty="No leads yet in this period." rows={d.leadServices.slice(0, 6).map((s) => ({ label: s.label, bar: s.count, value: `${s.count}` }))} />
            </Panel>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="When leads arrive" hint="By hour of the day, IST. Useful for when to keep phones free and when to run ads.">
              <HourBars counts={d.leadsByHour} />
            </Panel>
            <Panel title="Devices" hint="Unique visitors by device type, and the phone models behind leads.">
              <RankedBars
                empty="No visitors yet."
                rows={d.devices.types.map((x) => ({ label: x.label.replace(/^\w/, (c) => c.toUpperCase()), bar: x.count, value: `${x.count}`, note: `${Math.round((x.count / Math.max(t.visitors, 1)) * 100)}% of visitors` }))}
              />
              {d.devices.models.length > 0 && (
                <p className="mt-4 text-sm text-on-surface-variant">
                  <span className="font-bold text-on-surface">Top phones for leads:</span> {d.devices.models.slice(0, 4).map((m) => `${m.label} (${m.count})`).join(", ")}
                </p>
              )}
            </Panel>
          </div>

          <Panel title="Latest leads">
            {recent.length === 0 ? (
              <EmptyNote>No leads in this period.</EmptyNote>
            ) : (
              <ul className="divide-y divide-outline-variant">
                {recent.map((l) => (
                  <li key={l.id} className="flex items-start justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold text-on-surface">
                        <span className={TYPE_STYLE[l.type].text}>{TYPE_STYLE[l.type].label}</span>
                        {l.name ? ` · ${l.name}` : ""}
                      </p>
                      <p className="truncate text-sm text-on-surface-variant">{l.appliance}{l.issue ? ` · ${l.issue}` : ""} · {l.channel}</p>
                    </div>
                    <p className="shrink-0 text-right text-sm text-muted" title={fmtDateTime(l.receivedAt)}>{timeAgo(l.receivedAt, generatedAt)}</p>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3">
              <Link href="/admin/leads" className="text-sm font-bold text-primary hover:underline">See all leads</Link>
            </p>
          </Panel>

          <details className="rounded-2xl bg-surface p-4 text-sm text-on-surface-variant ring-1 ring-outline-variant">
            <summary className="cursor-pointer text-base font-bold text-on-surface">How to read these numbers</summary>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li><strong>Lead</strong>: a form request, a call tap or a WhatsApp tap. Call and WhatsApp taps do not include a phone number.</li>
              <li><strong>Unique visitor</strong>: one browser fingerprint. The same person on two devices counts twice.</li>
              <li><strong>Became a lead</strong>: unique visitors who produced at least one lead, divided by unique visitors.</li>
              <li><strong>City</strong> comes from the visitor&apos;s IP address, so mobile users can show the carrier&apos;s city. Area pages are a better guide to neighbourhoods.</li>
            </ul>
          </details>
        </>
      )}
    </div>
  );
}
