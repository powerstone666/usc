import { NextResponse } from "next/server";
import { getBigQuery } from "@/app/(server-lib)/bigquery";

export async function GET() {
  const bq = getBigQuery();
  if (!bq) {
    return NextResponse.json({ ok: false, detail: "BigQuery not configured" });
  }

  const datasetId = process.env.BIGQUERY_DATASET_ID || "analytics";
  const tableId = process.env.BIGQUERY_TABLE_ID || "leads";

  try {
    const [table] = await bq.dataset(datasetId).table(tableId).get();
    const [meta] = await table.getMetadata();
    const schema = meta.schema?.fields || [];
    const rowCount = meta.numRows || "0";

    return NextResponse.json({
      ok: true,
      detail: `Table ${datasetId}.${tableId}: ${schema.length} columns, ${Number(rowCount).toLocaleString()} rows`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Table check failed";
    if (msg.includes("Not found") || msg.includes("does not exist")) {
      return NextResponse.json({
        ok: false,
        detail: `Table ${datasetId}.${tableId} not found. Run bigquery-schema.sql to create it.`,
      });
    }
    return NextResponse.json({ ok: false, detail: msg });
  }
}
