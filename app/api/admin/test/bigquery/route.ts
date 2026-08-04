import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;

  console.log("=== DB CONNECTION TEST ===");
  console.log("[test] DATABASE_URL present:", Boolean(dbUrl));
  console.log("[test] NODE_ENV:", process.env.NODE_ENV);
  console.log("[test] VERCEL:", process.env.VERCEL);

  if (!dbUrl) {
    return NextResponse.json({
      ok: false,
      detail: "DATABASE_URL not set in env",
    });
  }

  let maskedUrl = "parse-failed";
  let host = "unknown";
  let port = "unknown";
  let isPooler = false;
  let user = "unknown";

  try {
    const u = new URL(dbUrl);
    maskedUrl = `${u.protocol}//${u.username}:***@${u.hostname}:${u.port}${u.pathname}`;
    host = u.hostname;
    port = u.port || "5432";
    user = u.username;
    isPooler = u.hostname.includes("pooler");
    console.log("[test] URL parsed OK");
    console.log("[test] host:", host);
    console.log("[test] port:", port);
    console.log("[test] user:", user);
    console.log("[test] is pooler URL:", isPooler);
    console.log("[test] password length:", u.password.length);
  } catch (e) {
    console.error("[test] URL parse failed:", e instanceof Error ? e.message : e);
  }

  const sslConfig = process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : undefined;
  console.log("[test] SSL config:", JSON.stringify(sslConfig));

  const pool = new Pool({
    connectionString: dbUrl,
    max: 1,
    connectionTimeoutMillis: 10000,
    ssl: sslConfig,
  });

  console.log("[test] Attempting to connect...");

  try {
    const client = await pool.connect();
    console.log("[test] Connection acquired!");
    try {
      const res = await client.query("SELECT version()");
      console.log("[test] Query OK:", res.rows[0].version);
      return NextResponse.json({
        ok: true,
        detail: `Connected to: ${res.rows[0].version}`,
        debug: { host, port, user, isPooler, maskedUrl },
      });
    } finally {
      client.release();
      console.log("[test] Client released");
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    const errObj = err as { code?: string; errno?: string; syscall?: string; address?: string; port?: number };
    console.error("[test] Connection FAILED:");
    console.error("[test] Error name:", error.name);
    console.error("[test] Error message:", error.message);
    console.error("[test] Error code:", errObj.code);
    console.error("[test] Error errno:", errObj.errno);
    console.error("[test] Error syscall:", errObj.syscall);
    console.error("[test] Error address:", errObj.address);
    console.error("[test] Error port:", errObj.port);
    console.error("[test] Stack:", error.stack);

    return NextResponse.json({
      ok: false,
      detail: `${error.name}: ${error.message}`,
      debug: {
        host,
        port,
        user,
        isPooler,
        maskedUrl,
        errorCode: errObj.code,
        errorSyscall: errObj.syscall,
        errorAddress: errObj.address,
        errorPort: errObj.port,
        sslEnabled: Boolean(sslConfig),
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        region: process.env.VERCEL_REGION,
      },
      hint: !isPooler ? "Use pooler URL (port 6543) not direct (port 5432) on Vercel" : undefined,
    });
  } finally {
    await pool.end();
    console.log("[test] Pool ended");
    console.log("=== END DB CONNECTION TEST ===");
  }
}
