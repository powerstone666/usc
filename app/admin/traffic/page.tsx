export const dynamic = "force-dynamic";

import { query } from "@/app/(server-lib)/db";

function BarChart({ data, color = "#0d47a1" }: { data: { label: string; count: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  if (data.length === 0) return <p className="py-4 text-sm text-white/30">No data yet</p>;
  return (
    <div className="flex flex-col gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-24 shrink-0 truncate text-[10px] sm:w-40 sm:text-xs text-white/60">{d.label}</span>
          <div className="h-6 sm:h-7 flex-1 overflow-hidden rounded-md bg-white/5">
            <div
              className="flex h-full items-center justify-end rounded-md pr-2 transition-all"
              style={{ width: `${(d.count / max) * 100}%`, backgroundColor: color, minWidth: "30px" }}
            >
              <span className="text-[10px] font-bold text-white/90">{d.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const toNum = (v: string) => parseInt(v);

export default async function AdminTraffic() {
  const byCategory = await query<{ traffic_category: string; count: string }>(
    "SELECT traffic_category, COUNT(*) as count FROM leads GROUP BY traffic_category ORDER BY count DESC",
  );
  const bySource = await query<{ traffic_source: string; count: string }>(
    "SELECT traffic_source, COUNT(*) as count FROM leads GROUP BY traffic_source ORDER BY count DESC",
  );
  const byMedium = await query<{ traffic_medium: string; count: string }>(
    "SELECT traffic_medium, COUNT(*) as count FROM leads GROUP BY traffic_medium ORDER BY count DESC",
  );
  const byCampaign = await query<{ traffic_campaign: string; count: string }>(
    "SELECT traffic_campaign, COUNT(*) as count FROM leads WHERE traffic_campaign != '' GROUP BY traffic_campaign ORDER BY count DESC",
  );

  return (
    <div>
      <h1 className="text-lg font-extrabold sm:text-xl text-white">Traffic Sources</h1>
      <p className="mt-1 text-[10px] text-white/40 sm:text-xs">
        Where your leads come from — organic, PPC, WhatsApp, social, referral, direct
      </p>

      <div className="mt-4 grid gap-3 sm:gap-6 lg:grid-cols-2 sm:mt-6">
        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold sm:mb-4 sm:text-sm text-white/80">Leads by Traffic Category</h2>
          <BarChart data={byCategory.map((d) => ({ label: d.traffic_category, count: toNum(d.count) }))} color="#0d47a1" />
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold sm:mb-4 sm:text-sm text-white/80">Leads by Source</h2>
          <BarChart data={bySource.map((d) => ({ label: d.traffic_source, count: toNum(d.count) }))} color="#1565c0" />
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold sm:mb-4 sm:text-sm text-white/80">Leads by Medium</h2>
          <BarChart data={byMedium.map((d) => ({ label: d.traffic_medium, count: toNum(d.count) }))} color="#7b1fa2" />
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold sm:mb-4 sm:text-sm text-white/80">Leads by Campaign</h2>
          <BarChart data={byCampaign.map((d) => ({ label: d.traffic_campaign, count: toNum(d.count) }))} color="#ff9800" />
        </div>
      </div>
    </div>
  );
}
