export const dynamic = "force-dynamic";

import { isDemo, loadAdminData } from "@/app/(server-lib)/admin-data";
import { RANGES, type RangeKey } from "@/app/(server-lib)/admin-insights";
import { Banner, PageHeader, Panel, RangeTabs, StatTable } from "../_ui/parts";
import { UtmBuilder } from "./utm-builder";

function parseRange(v?: string): RangeKey {
  return RANGES.some((r) => r.key === v) ? (v as RangeKey) : "30d";
}

export default async function AdminTraffic({ searchParams }: { searchParams: Promise<{ range?: string; test?: string }> }) {
  const sp = await searchParams;
  const range = parseRange(sp.range);
  const includeTest = sp.test === "1";
  const { data: d, error } = await loadAdminData(range, includeTest);
  const rate = (n: number) => `${n}%`;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Traffic"
        subtitle="Which channels and campaigns bring visitors, and which of them turn into leads."
        right={<RangeTabs current={range} path="/admin/traffic" test={includeTest} />}
      />
      {isDemo() && <Banner tone="info"><strong>Demo data.</strong> Sample traffic for previewing this screen.</Banner>}
      {error && <Banner tone="warn"><strong>Some data could not be loaded:</strong> {error}</Banner>}

      <Panel title="Channels" hint="Where visitors came from. Conv. is the share of those visitors who became a lead.">
        <StatTable
          headers={["Visitors", "Leads", "Conv."]}
          empty="No traffic recorded in this period."
          rows={[...d.channels].sort((a, b) => b.visitors - a.visitors).map((c) => ({ label: c.label, values: [c.visitors, c.leads, rate(c.conversionPct)] }))}
        />
      </Panel>

      <Panel title="UTM and campaigns" hint="Traffic from tagged links and ads, grouped by source and medium.">
        <StatTable
          headers={["Visitors", "Leads", "Conv."]}
          empty="No tagged traffic yet. Use the link builder below for ads, social posts and your Google Business Profile."
          rows={d.campaigns.map((c) => ({ label: `${c.source} / ${c.medium}`, sub: `Campaign: ${c.campaign}`, values: [c.visitors, c.leads, rate(c.conversionPct)] }))}
        />
        <p className="mt-3 text-sm text-muted">Campaign names are known only for visitors who became leads, because page views do not store the campaign yet.</p>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Top pages" hint="Most viewed pages, and how many leads started there.">
          <StatTable headers={["Views", "Visitors", "Leads"]} empty="No page views in this period." rows={d.pages.map((p) => ({ label: p.path, sub: p.group, values: [p.views, p.visitors, p.leads] }))} />
        </Panel>
        <Panel title="Cities" hint="From the visitor's IP address. Mobile networks can show the carrier's city.">
          <StatTable headers={["Visitors", "Leads", "Conv."]} empty="No locations recorded." rows={d.cities.map((c) => ({ label: c.label, values: [c.visitors, c.leads, rate(c.conversionPct)] }))} />
        </Panel>
      </div>

      <Panel title="UTM link builder" hint="Add these tags to any link you share, so the visit shows up under the right source and campaign above.">
        <UtmBuilder />
      </Panel>
    </div>
  );
}
