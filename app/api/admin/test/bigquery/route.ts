import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    return NextResponse.json({
      ok: false,
      detail: "DATABASE_URL not set in env",
    });
  }

  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString: dbUrl,
    max: 1,
    connectionTimeoutMillis: 8000,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    try {
      await client.query("SELECT 1");
      return NextResponse.json({
        ok: true,
        detail: `Connected | raw: ${dbUrl}`,
      });
    } finally {
      client.release();
    }
  } catch (err) {
    const e = err as Error;
    return NextResponse.json({
      ok: false,
      detail: `${e.message} | raw: ${dbUrl}`,
    });
  } finally {
    await pool.end();
  }
}
