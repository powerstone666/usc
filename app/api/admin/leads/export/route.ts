import { parseLeadQuery, queryLeads } from "@/app/(server-lib)/admin-data";
import { TYPE_STYLE } from "@/app/admin/_ui/lead-type";
import { fmtDateTime } from "@/app/admin/_ui/format";

const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;

// CSV of every lead matching the current filters (not just the visible page). Auth: proxy.ts guards /api/admin/*.
export async function GET(req: Request) {
  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const query = { ...parseLeadQuery(sp, 100000), page: 1 };
  const { items } = await queryLeads(query);
  const head = ["Received (IST)", "Type", "Name", "Phone", "Service", "Issue", "Button", "Page", "Channel", "Campaign", "City", "Device"];
  const rows = items.map((l) => [fmtDateTime(l.receivedAt), TYPE_STYLE[l.type].label, l.name, l.phone, l.appliance, l.issue, l.button, l.page, l.channel, l.campaign, l.city, l.device].map(cell).join(","));
  return new Response([head.map(cell).join(","), ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="usc-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
