export const dynamic = "force-dynamic";

import { supabase } from "@/app/(server-lib)/supabase";

function BarChart({ data, color = "#0d47a1" }: { data: { label: string; count: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  if (data.length === 0) return <p className="py-4 text-sm text-white/30">No data yet</p>;
  return (
    <div className="flex flex-col gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-3">
          <span className="w-24 shrink-0 truncate text-[10px] text-white/60 sm:w-40 sm:text-xs">{d.label}</span>
          <div className="h-6 flex-1 overflow-hidden rounded-md bg-white/5 sm:h-7">
            <div className="flex h-full items-center justify-end rounded-md pr-2 transition-all" style={{ width: `${(d.count / max) * 100}%`, backgroundColor: color, minWidth: "30px" }}>
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
  return [...map.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

export default async function AdminTraffic() {
  const { data } = await supabase.from("leads").select("traffic_source, traffic_medium, traffic_category, traffic_campaign").limit(5000);
  const rows = (data || []) as Record<string, unknown>[];

  return (
    <div>
      <h1 className="text-lg font-extrabold text-white sm:text-xl">Traffic Sources</h1>
      <p className="mt-1 text-[10px] text-white/40 sm:text-xs">Where your leads come from — organic, PPC, WhatsApp, social, referral, direct</p>

      <div className="mt-4 grid gap-3 sm:gap-6 lg:grid-cols-2 sm:mt-6">
        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold text-white/80 sm:mb-4 sm:text-sm">Leads by Traffic Category</h2>
          <BarChart data={aggregate(rows, "traffic_category")} color="#0d47a1" />
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold text-white/80 sm:mb-4 sm:text-sm">Leads by Source</h2>
          <BarChart data={aggregate(rows, "traffic_source")} color="#1565c0" />
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold text-white/80 sm:mb-4 sm:text-sm">Leads by Medium</h2>
          <BarChart data={aggregate(rows, "traffic_medium")} color="#7b1fa2" />
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold text-white/80 sm:mb-4 sm:text-sm">Leads by Campaign</h2>
          <BarChart data={aggregate(rows.filter((r) => r.traffic_campaign), "traffic_campaign")} color="#ff9800" />
        </div>
      </div>
    </div>
  );
}
