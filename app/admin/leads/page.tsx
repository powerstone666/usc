export const dynamic = "force-dynamic";

import { getAllLeads } from "@/app/(server-lib)/supabase-queries";

function formatTime(ms: number): string {
  if (!ms) return "—";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}m ${remaining}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminLeads() {
  const leads = await getAllLeads(200, 0);

  return (
    <div>
      <h1 className="text-lg font-extrabold text-white sm:text-xl">All Leads</h1>
      <p className="mt-1 text-[10px] text-white/40 sm:text-xs">
        {leads.length} leads · showing last 200
      </p>

      {leads.length === 0 ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-[#0d2843] p-4 text-center sm:mt-8 sm:rounded-2xl sm:p-6">
          <p className="text-sm text-white/60">No leads yet.</p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-[#0d2843] sm:mt-6 sm:rounded-2xl">
          <table className="w-full text-left text-[10px] sm:text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">Date</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">Appliance</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">Issue</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">Name</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">Phone</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">Source</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">City</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">ISP</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">IP</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">Browser</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">OS</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">Device</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">Screen</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">Time</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium sm:px-4 sm:py-3">Referrer</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-white/5 text-white/70 hover:bg-white/5"
                >
                  <td className="whitespace-nowrap px-2 py-2 text-white/40 sm:px-4">{formatDate(lead.received_at)}</td>
                  <td className="whitespace-nowrap px-2 py-2 font-medium text-white/90 sm:px-4">{lead.appliance}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-white/50 sm:px-4">{lead.issue || "—"}</td>
                  <td className="whitespace-nowrap px-2 py-2 sm:px-4">{lead.name || "—"}</td>
                  <td className="whitespace-nowrap px-2 py-2 font-mono sm:px-4">{lead.phone}</td>
                  <td className="whitespace-nowrap px-2 py-2 sm:px-4">
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px]">{lead.source}</span>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-white/50 sm:px-4">{lead.city || "—"}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-white/50 sm:px-4">{lead.isp || "—"}</td>
                  <td className="whitespace-nowrap px-2 py-2 font-mono text-white/40 sm:px-4">{lead.ip_address}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-white/50 sm:px-4">{lead.browser || "—"}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-white/50 sm:px-4">{lead.os || "—"}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-white/50 sm:px-4">{lead.device_type}{lead.device_model ? ` (${lead.device_model})` : ""}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-white/40 sm:px-4">{lead.screen_resolution || "—"}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-white/50 sm:px-4">{formatTime(lead.time_on_page)}</td>
                  <td className="max-w-24 truncate px-2 py-2 text-white/40 sm:max-w-32 sm:px-4">{lead.referrer || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
