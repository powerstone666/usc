export const dynamic = "force-dynamic";

import { supabase } from "@/app/(server-lib)/supabase";

function BarChart({ data, color = "#0d47a1" }: { data: { label: string; count: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  if (data.length === 0) return <p className="py-4 text-sm text-white/30">No data yet</p>;
  return (
    <div className="flex flex-col gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-40 truncate text-xs text-white/60">{d.label}</span>
          <div className="h-7 flex-1 overflow-hidden rounded-md bg-white/5">
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

function aggregate(rows: Record<string, unknown>[], field: string): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const key = String(r[field] || "—");
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export default async function AdminTraffic() {
  const { data } = await supabase
    .from("leads")
    .select("traffic_source, traffic_medium, traffic_category, traffic_campaign")
    .limit(5000);

  const rows = (data || []) as Record<string, unknown>[];

  const byCategory = aggregate(rows, "traffic_category");
  const bySource = aggregate(rows, "traffic_source");
  const byMedium = aggregate(rows, "traffic_medium");
  const byCampaign = aggregate(
    rows.filter((r) => r.traffic_campaign),
    "traffic_campaign",
  );

  return (
    <div>
      <h1 className="text-xl font-extrabold text-white">Traffic Sources</h1>
      <p className="mt-1 text-xs text-white/40">
        Where your leads come from — organic, PPC, WhatsApp, social, referral, direct
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">Leads by Traffic Category</h2>
          <BarChart data={byCategory} color="#0d47a1" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">Leads by Source</h2>
          <BarChart data={bySource} color="#1565c0" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">Leads by Medium</h2>
          <BarChart data={byMedium} color="#7b1fa2" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">Leads by Campaign</h2>
          <BarChart data={byCampaign} color="#ff9800" />
        </div>
      </div>
    </div>
  );
}
