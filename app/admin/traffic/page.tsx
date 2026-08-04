export const dynamic = "force-dynamic";

import { getBigQuery } from "@/app/(server-lib)/bigquery";

const datasetId = process.env.BIGQUERY_DATASET_ID || "analytics";
const tableId = process.env.BIGQUERY_TABLE_ID || "leads";
const table = `\`${process.env.BIGQUERY_PROJECT_ID}.${datasetId}.${tableId}\``;

async function runQuery<T>(query: string): Promise<T[]> {
  const bq = getBigQuery();
  if (!bq) return [];
  try {
    const [rows] = await bq.query(query);
    return rows as T[];
  } catch {
    return [];
  }
}

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

export default async function AdminTraffic() {
  const byCategory = await runQuery<{ traffic_category: string; count: number }>(
    `SELECT traffic_category, COUNT(*) as count FROM ${table} GROUP BY traffic_category ORDER BY count DESC`,
  );
  const bySource = await runQuery<{ traffic_source: string; count: number }>(
    `SELECT traffic_source, COUNT(*) as count FROM ${table} GROUP BY traffic_source ORDER BY count DESC`,
  );
  const byMedium = await runQuery<{ traffic_medium: string; count: number }>(
    `SELECT traffic_medium, COUNT(*) as count FROM ${table} GROUP BY traffic_medium ORDER BY count DESC`,
  );
  const byCampaign = await runQuery<{ traffic_campaign: string; count: number }>(
    `SELECT traffic_campaign, COUNT(*) as count FROM ${table} WHERE traffic_campaign != '' GROUP BY traffic_campaign ORDER BY count DESC`,
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
          <BarChart data={byCategory.map((d) => ({ label: d.traffic_category, count: d.count }))} color="#0d47a1" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">Leads by Source</h2>
          <BarChart data={bySource.map((d) => ({ label: d.traffic_source, count: d.count }))} color="#1565c0" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">Leads by Medium</h2>
          <BarChart data={byMedium.map((d) => ({ label: d.traffic_medium, count: d.count }))} color="#7b1fa2" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d2843] p-5">
          <h2 className="mb-4 text-sm font-bold text-white/80">Leads by Campaign</h2>
          <BarChart data={byCampaign.map((d) => ({ label: d.traffic_campaign, count: d.count }))} color="#ff9800" />
        </div>
      </div>
    </div>
  );
}
