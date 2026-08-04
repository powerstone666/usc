export const dynamic = "force-dynamic";

import { getGeoStats } from "@/app/(common-lib)/bigquery-queries";

function BarChart({
  data,
  color = "#0d47a1",
}: {
  data: { label: string; count: number }[];
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  if (data.length === 0)
    return <p className="py-4 text-sm text-white/30">No data yet</p>;

  return (
    <div className="flex flex-col gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-40 truncate text-xs text-white/60">{d.label}</span>
          <div className="h-7 flex-1 overflow-hidden rounded-md bg-white/5">
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
        </div>
      ))}
    </div>
  );
}

export default async function AdminGeo() {
  const stats = await getGeoStats();

  return (
    <div>
      <h1 className="text-xl font-extrabold text-white">Geo & Device</h1>
      <p className="mt-1 text-xs text-white/40">
        Where leads come from and what devices they use
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">
            Leads by City
          </h2>
          <BarChart
            data={stats.byCity.map((d) => ({
              label: d.city,
              count: d.count,
            }))}
            color="#0d47a1"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">
            Leads by ISP
          </h2>
          <BarChart
            data={stats.byIsp.map((d) => ({
              label: d.isp,
              count: d.count,
            }))}
            color="#1565c0"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">
            Leads by Device Type
          </h2>
          <BarChart
            data={stats.byDevice.map((d) => ({
              label: d.device_type,
              count: d.count,
            }))}
            color="#7b1fa2"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">
            Leads by Browser
          </h2>
          <BarChart
            data={stats.byBrowser.map((d) => ({
              label: d.browser,
              count: d.count,
            }))}
            color="#ff9800"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">
            Leads by OS
          </h2>
          <BarChart
            data={stats.byOs.map((d) => ({
              label: d.os,
              count: d.count,
            }))}
            color="#4caf50"
          />
        </div>
      </div>
    </div>
  );
}
