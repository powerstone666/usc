import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ ok: false, detail: "DATABASE_URL not set in env" });
  }

  let maskedUrl = dbUrl;
  let host = "unknown";
  let port = "unknown";
  let isPooler = false;
  try {
    const u = new URL(dbUrl);
    maskedUrl = `${u.protocol}//${u.username}:***@${u.hostname}:${u.port}${u.pathname}`;
    host = u.hostname;
    port = u.port || "5432";
    isPooler = u.hostname.includes("pooler");
  } catch {}

  const pool = new Pool({
    connectionString: dbUrl,
    max: 1,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    try {
      const res = await client.query("SELECT version()");
      return NextResponse.json({
        ok: true,
        detail: `Connected to PostgreSQL`,
        debug: { host, port, isPooler, maskedUrl },
      });
    } finally {
      client.release();
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    const errObj = err as { code?: string; syscall?: string; address?: string; port?: number };
    return NextResponse.json({
      ok: false,
      detail: `${error.name}: ${error.message}`,
      debug: { host, port, isPooler, maskedUrl, errorCode: errObj.code, errorSyscall: errObj.syscall, errorAddress: errObj.address, errorPort: errObj.port },
      hint: !isPooler ? "Use pooler URL (port 6543) not direct (port 5432) on Vercel" : undefined,
    });
  } finally {
    await pool.end();
  }
}
