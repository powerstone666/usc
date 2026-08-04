import { NextResponse } from "next/server";
import { getBigQuery } from "@/app/(common-lib)/bigquery";

export async function GET() {
  const bq = getBigQuery();
  if (!bq) {
    return NextResponse.json({
      ok: false,
      detail: "BigQuery not configured (missing BIGQUERY_PROJECT_ID or BIGQUERY_CREDENTIALS_JSON)",
    });
  }

  try {
    const projectId = process.env.BIGQUERY_PROJECT_ID;
    const [datasets] = await bq.getDatasets();
    const datasetIds = datasets.map((d) => d.id);
    return NextResponse.json({
      ok: true,
      detail: `Connected to project ${projectId}. Datasets: ${datasetIds.length > 0 ? datasetIds.join(", ") : "none"}`,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      detail: err instanceof Error ? err.message : "Connection failed",
    });
  }
}
