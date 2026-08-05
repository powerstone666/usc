export const dynamic = "force-dynamic";

import { supabase } from "@/app/(server-lib)/supabase";

type EventRow = {
  event_id: string;
  received_at: string;
  session_id: string;
  event_type: string;
  event_source: string;
  page_url: string;
  page_title: string;
  city: string;
  country: string;
  isp: string;
  browser: string;
  os: string;
  device_type: string;
  traffic_category: string;
  time_on_page: number;
  fingerprint: string;
  extra: Record<string, unknown>;
};

const eventColors: Record<string, string> = {
  click_to_call: "bg-blue-500/20 text-blue-400",
  whatsapp_click: "bg-green-500/20 text-green-400",
  diagnostic_open: "bg-purple-500/20 text-purple-400",
  diagnostic_category_selected: "bg-indigo-500/20 text-indigo-400",
  diagnostic_submit: "bg-pink-500/20 text-pink-400",
  lead_form_submit: "bg-orange-500/20 text-orange-400",
  generate_lead: "bg-emerald-500/20 text-emerald-400",
  scroll_depth: "bg-gray-500/20 text-gray-400",
  session_start: "bg-cyan-500/20 text-cyan-400",
  page_view: "bg-slate-500/20 text-slate-400",
};

function formatTime(ms: number): string {
  if (!ms) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function BarChart({ data, color = "#0d47a1" }: { data: { label: string; count: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  if (data.length === 0) return <p className="py-4 text-sm text-white/30">No events yet</p>;
  return (
    <div className="flex flex-col gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-3">
          <span className="w-32 shrink-0 truncate text-[10px] text-white/60 sm:w-40 sm:text-xs">{d.label}</span>
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

export default async function AdminEvents() {
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("received_at", { ascending: false })
    .limit(500);

  const events = (data || []) as EventRow[];

  const typeCounts = new Map<string, number>();
  const sourceCounts = new Map<string, number>();
  const sessionIds = new Set<string>();
  const fingerprints = new Set<string>();

  for (const e of events) {
    typeCounts.set(e.event_type, (typeCounts.get(e.event_type) || 0) + 1);
    sourceCounts.set(e.event_source, (sourceCounts.get(e.event_source) || 0) + 1);
    if (e.session_id) sessionIds.add(e.session_id);
    if (e.fingerprint) fingerprints.add(e.fingerprint);
  }

  const byType = [...typeCounts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  const bySource = [...sourceCounts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);

  const sessionCounts = new Map<string, number>();
  for (const e of events) {
    if (e.session_id) sessionCounts.set(e.session_id, (sessionCounts.get(e.session_id) || 0) + 1);
  }
  const avgEventsPerSession = sessionIds.size > 0 ? events.length / sessionIds.size : 0;

  return (
    <div>
      <h1 className="text-lg font-extrabold text-white sm:text-xl">Events</h1>
      <p className="mt-1 text-[10px] text-white/40 sm:text-xs">
        {events.length} total events · {sessionIds.size} sessions · {fingerprints.size} unique users · {avgEventsPerSession.toFixed(1)} avg events/session
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 sm:mt-6">
        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <p className="text-[10px] font-medium text-white/40 sm:text-xs">Total Events</p>
          <p className="mt-1.5 text-2xl font-extrabold text-[#2196f3] sm:text-3xl">{events.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <p className="text-[10px] font-medium text-white/40 sm:text-xs">Unique Sessions</p>
          <p className="mt-1.5 text-2xl font-extrabold text-[#4caf50] sm:text-3xl">{sessionIds.size}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <p className="text-[10px] font-medium text-white/40 sm:text-xs">Unique Users</p>
          <p className="mt-1.5 text-2xl font-extrabold text-[#ff9800] sm:text-3xl">{fingerprints.size}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <p className="text-[10px] font-medium text-white/40 sm:text-xs">Avg Events/Session</p>
          <p className="mt-1.5 text-2xl font-extrabold text-[#9c27b0] sm:text-3xl">{avgEventsPerSession.toFixed(1)}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:gap-6 lg:grid-cols-2 sm:mt-6">
        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold text-white/80 sm:mb-4 sm:text-sm">Events by Type</h2>
          <BarChart data={byType} color="#0d47a1" />
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:rounded-2xl sm:p-5">
          <h2 className="mb-3 text-xs font-bold text-white/80 sm:mb-4 sm:text-sm">Events by Source (which button)</h2>
          <BarChart data={bySource} color="#1565c0" />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:mt-6 sm:rounded-2xl sm:p-5">
        <h2 className="mb-3 text-xs font-bold text-white/80 sm:mb-4 sm:text-sm">Recent Events (Last 200)</h2>
        {events.length === 0 ? (
          <p className="py-4 text-sm text-white/30">No events yet — open the site and interact to generate events</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px] sm:text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="whitespace-nowrap py-2 pr-2 font-medium sm:pr-4">When</th>
                  <th className="whitespace-nowrap py-2 pr-2 font-medium sm:pr-4">Event</th>
                  <th className="whitespace-nowrap py-2 pr-2 font-medium sm:pr-4">Source</th>
                  <th className="whitespace-nowrap py-2 pr-2 font-medium sm:pr-4">City</th>
                  <th className="whitespace-nowrap py-2 pr-2 font-medium sm:pr-4">Device</th>
                  <th className="whitespace-nowrap py-2 pr-2 font-medium sm:pr-4">Traffic</th>
                  <th className="whitespace-nowrap py-2 pr-2 font-medium sm:pr-4">Time</th>
                  <th className="whitespace-nowrap py-2 pr-2 font-medium sm:pr-4">Page</th>
                  <th className="whitespace-nowrap py-2 pr-2 font-medium sm:pr-4">Extra</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 200).map((e) => (
                  <tr key={e.event_id} className="border-b border-white/5 text-white/70">
                    <td className="whitespace-nowrap py-2 pr-2 text-white/40 sm:pr-4">{formatTimeAgo(e.received_at)}</td>
                    <td className="whitespace-nowrap py-2 pr-2 sm:pr-4">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${eventColors[e.event_type] || "bg-white/5 text-white/60"}`}>
                        {e.event_type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-2 pr-2 text-white/50 sm:pr-4">{e.event_source || "—"}</td>
                    <td className="whitespace-nowrap py-2 pr-2 text-white/50 sm:pr-4">{e.city || "—"}</td>
                    <td className="whitespace-nowrap py-2 pr-2 text-white/50 sm:pr-4">{e.device_type}</td>
                    <td className="whitespace-nowrap py-2 pr-2 text-white/50 sm:pr-4">{e.traffic_category || "—"}</td>
                    <td className="whitespace-nowrap py-2 pr-2 text-white/50 sm:pr-4">{formatTime(e.time_on_page)}</td>
                    <td className="max-w-24 truncate py-2 pr-2 text-white/40 sm:max-w-32 sm:pr-4" title={e.page_url}>
                      {e.page_url ? new URL(e.page_url).pathname : "—"}
                    </td>
                    <td className="whitespace-nowrap py-2 pr-2 text-white/40 sm:pr-4">
                      {e.extra && Object.keys(e.extra).length > 0 ? JSON.stringify(e.extra) : "—"}
                    </td>
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
