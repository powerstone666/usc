export const dynamic = "force-dynamic";

import { getSourceStats } from "@/app/(server-lib)/supabase-queries";

function formatTime(ms: number | null | undefined): string {
  if (!ms) return "—";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}m ${remaining}s`;
}

function BarChart({
  data,
  color = "#0d47a1",
}: {
  data: { label: string; count: number; sub?: string }[];
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  if (data.length === 0)
    return <p className="py-4 text-sm text-white/30">No data yet</p>;

  return (
    <div className="flex flex-col gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-24 shrink-0 truncate text-[10px] sm:w-40 sm:text-xs text-white/60">{d.label}</span>
          <div className="h-6 sm:h-7 flex-1 overflow-hidden rounded-md bg-white/5">
            <div
              className="flex h-full items-center justify-end rounded-md pr-2 transition-all"
              style={{
                width: `${(d.count / max) * 100}%`,
                backgroundColor: color,
                minWidth: "30px",
              }}
            >
              <span className="text-[10px] font-bold text-white/90">
                {d.count}
              </span>
            </div>
          </div>
          {d.sub && (
            <span className="w-20 text-right text-xs text-white/40">
              {d.sub}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default async function AdminSources() {
  const stats = await getSourceStats();

  return (
    <div>
      <h1 className="text-lg font-extrabold sm:text-xl text-white">Sources & Conversions</h1>
      <p className="mt-1 text-[10px] text-white/40 sm:text-xs">
        Which buttons, forms, and pages drive leads
      </p>

      <div className="mt-4 grid gap-3 sm:gap-6 lg:grid-cols-2 sm:mt-6">
        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold sm:mb-4 sm:text-sm text-white/80">
            Leads by Source (which button/form)
          </h2>
          <BarChart
            data={stats.bySource.map((d) => ({
              label: d.label,
              count: d.count,
            }))}
            color="#0d47a1"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold sm:mb-4 sm:text-sm text-white/80">
            Leads by Appliance
          </h2>
          <BarChart
            data={stats.byAppliance.map((d) => ({
              label: d.label,
              count: d.count,
            }))}
            color="#1565c0"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold sm:mb-4 sm:text-sm text-white/80">
            Avg Time on Page Before Lead (by source)
          </h2>
          <BarChart
            data={stats.avgTimeBySource.map((d) => ({
              label: d.source,
              count: d.count,
              sub: formatTime(d.avg_ms),
            }))}
            color="#7b1fa2"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold sm:mb-4 sm:text-sm text-white/80">
            Appliance × Source Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="py-2 pr-4 font-medium">Appliance</th>
                  <th className="py-2 pr-4 font-medium">Source</th>
                  <th className="py-2 pr-4 font-medium text-right">Leads</th>
                </tr>
              </thead>
              <tbody>
                {stats.byApplianceSource.map((d, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 text-white/70"
                  >
                    <td className="py-2 pr-4">{d.appliance}</td>
                    <td className="py-2 pr-4 text-white/50">{d.source}</td>
                    <td className="py-2 pr-4 text-right font-bold">
                      {d.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
