export const dynamic = "force-dynamic";

import { getAllLeads } from "@/app/(server-lib)/bigquery-queries";

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
      <h1 className="text-xl font-extrabold text-white">All Leads</h1>
      <p className="mt-1 text-xs text-white/40">
        {leads.length} leads · showing last 200
      </p>

      {leads.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0d2843] p-6 text-center">
          <p className="text-sm text-white/60">No leads yet.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#0d2843]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Appliance</th>
                <th className="px-4 py-3 font-medium">Issue</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">ISP</th>
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium">Browser</th>
                <th className="px-4 py-3 font-medium">OS</th>
                <th className="px-4 py-3 font-medium">Device</th>
                <th className="px-4 py-3 font-medium">Screen</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Referrer</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.lead_id}
                  className="border-b border-white/5 text-white/70 hover:bg-white/5"
                >
                  <td className="px-4 py-2 text-white/40">
                    {formatDate(lead.received_at)}
                  </td>
                  <td className="px-4 py-2 font-medium text-white/90">
                    {lead.appliance}
                  </td>
                  <td className="px-4 py-2 text-white/50">
                    {lead.issue || "—"}
                  </td>
                  <td className="px-4 py-2">{lead.name || "—"}</td>
                  <td className="px-4 py-2 font-mono">
                    ****{lead.phone_last4}
                  </td>
                  <td className="px-4 py-2">
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px]">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-white/50">
                    {lead.city || "—"}
                  </td>
                  <td className="px-4 py-2 text-white/50">
                    {lead.isp || "—"}
                  </td>
                  <td className="px-4 py-2 font-mono text-white/40">
                    {lead.ip_address}
                  </td>
                  <td className="px-4 py-2 text-white/50">
                    {lead.browser || "—"}
                  </td>
                  <td className="px-4 py-2 text-white/50">
                    {lead.os || "—"}
                  </td>
                  <td className="px-4 py-2 text-white/50">
                    {lead.device_type}
                    {lead.device_model ? ` (${lead.device_model})` : ""}
                  </td>
                  <td className="px-4 py-2 text-white/40">
                    {lead.screen_resolution || "—"}
                  </td>
                  <td className="px-4 py-2 text-white/50">
                    {formatTime(lead.time_on_page)}
                  </td>
                  <td className="px-4 py-2 max-w-32 truncate text-white/40">
                    {lead.referrer || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
