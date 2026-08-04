export const dynamic = "force-dynamic";

import { getOverviewStats } from "@/app/(server-lib)/bigquery-queries";

function formatTime(ms: number): string {
  if (!ms) return "—";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}m ${remaining}s`;
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function StatCard({
  label, value, sub, color,
}: {
  label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
      <p className="text-xs font-medium text-white/40">{label}</p>
      <p className="mt-2 text-3xl font-extrabold" style={{ color }}>{value}</p>
      {sub && <p className="mt-1 text-xs text-white/30">{sub}</p>}
    </div>
  );
}

function BarChart({ data, color = "#0d47a1" }: { data: { label: string; count: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  if (data.length === 0) return <p className="py-4 text-sm text-white/30">No data yet</p>;
  return (
    <div className="flex flex-col gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-32 truncate text-xs text-white/60">{d.label}</span>
          <div className="h-6 flex-1 overflow-hidden rounded-md bg-white/5">
            <div className="h-full rounded-md transition-all" style={{ width: `${(d.count / max) * 100}%`, backgroundColor: color, minWidth: "2px" }} />
          </div>
          <span className="w-8 text-right text-xs font-bold text-white/80">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

export default async function AdminOverview() {
  const stats = await getOverviewStats();

  return (
    <div>
      <h1 className="text-xl font-extrabold text-white">Overview</h1>
      <p className="mt-1 text-xs text-white/40">
        {stats.todayPageViews > 0 ? `${stats.todayPageViews} page views today` : "No data yet — open the site to start tracking"}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Page Views" value={stats.totalPageViews} sub={`${stats.todayPageViews} today`} color="#2196f3" />
        <StatCard label="Unique Visitors" value={stats.uniqueVisitors} color="#4caf50" />
        <StatCard label="Total Leads" value={stats.totalLeads} sub={`${stats.todayLeads} today`} color="#ff9800" />
        <StatCard label="Avg Time on Page" value={formatTime(stats.avgTimeOnPage)} color="#9c27b0" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Unique Fingerprints" value={stats.uniqueFingerprints} sub="distinct devices" color="#00bcd4" />
        <StatCard label="Returning Visitors" value={stats.returningVisitors} sub="visited more than once" color="#e91e63" />
        <StatCard label="Conversion Rate" value={stats.totalPageViews > 0 ? `${((stats.totalLeads / stats.totalPageViews) * 100).toFixed(1)}%` : "—"} sub={`${stats.totalLeads} leads / ${stats.totalPageViews} views`} color="#8bc34a" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">Top Pages</h2>
          <BarChart data={stats.topPages.map((d) => ({ label: d.page_path, count: d.count }))} color="#0d47a1" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">Leads by Source (which button)</h2>
          <BarChart data={stats.bySource.map((d) => ({ label: d.source, count: d.count }))} color="#1565c0" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">Page Views (Last 30 Days)</h2>
          {stats.viewsByDay.length === 0 ? (
            <p className="py-4 text-sm text-white/30">No data yet</p>
          ) : (
            <div className="flex items-end gap-1">
              {stats.viewsByDay.slice().reverse().map((d, i) => {
                const max = Math.max(...stats.viewsByDay.map((x) => x.count), 1);
                return (
                  <div key={i} className="flex-1" title={`${d.day}: ${d.count} views`}>
                    <div className="w-full rounded-t-sm bg-[#1565c0] transition-all hover:bg-[#1976d2]" style={{ height: `${Math.max((d.count / max) * 120, 2)}px` }} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">Leads (Last 30 Days)</h2>
          {stats.byDay.length === 0 ? (
            <p className="py-4 text-sm text-white/30">No leads yet</p>
          ) : (
            <div className="flex items-end gap-1">
              {stats.byDay.slice().reverse().map((d, i) => {
                const max = Math.max(...stats.byDay.map((x) => x.count), 1);
                return (
                  <div key={i} className="flex-1" title={`${d.day}: ${d.count} leads`}>
                    <div className="w-full rounded-t-sm bg-[#0d47a1] transition-all hover:bg-[#1565c0]" style={{ height: `${Math.max((d.count / max) * 120, 2)}px` }} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d2843] p-5">
        <h2 className="mb-4 text-sm font-bold text-white/80">Recent Leads (Last 20)</h2>
        {stats.recentLeads.length === 0 ? (
          <p className="py-4 text-sm text-white/30">No leads yet — page views are being tracked above</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="py-2 pr-4 font-medium">When</th>
                  <th className="py-2 pr-4 font-medium">Appliance</th>
                  <th className="py-2 pr-4 font-medium">Source</th>
                  <th className="py-2 pr-4 font-medium">Phone</th>
                  <th className="py-2 pr-4 font-medium">City</th>
                  <th className="py-2 pr-4 font-medium">Device</th>
                  <th className="py-2 pr-4 font-medium">Time on page</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLeads.map((lead) => (
                  <tr key={lead.lead_id} className="border-b border-white/5 text-white/70">
                    <td className="py-2 pr-4 text-white/40">{formatTimeAgo(lead.received_at)}</td>
                    <td className="py-2 pr-4">{lead.appliance}</td>
                    <td className="py-2 pr-4 text-white/50">{lead.source}</td>
                    <td className="py-2 pr-4 font-mono">****{lead.phone_last4}</td>
                    <td className="py-2 pr-4 text-white/50">{lead.city || "—"}</td>
                    <td className="py-2 pr-4 text-white/50">{lead.device_type}</td>
                    <td className="py-2 pr-4 text-white/50">{formatTime(lead.time_on_page)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
