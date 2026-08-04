import { Pool } from "pg";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("[db] DATABASE_URL is not set");
} else {
  try {
    const parsed = new URL(dbUrl);
    console.log("[db] host:", parsed.hostname, "| port:", parsed.port || "5432", "| user:", parsed.username, "| db:", parsed.pathname, "| pooler:", parsed.hostname.includes("pooler"));
  } catch {
    console.error("[db] DATABASE_URL is malformed:", dbUrl.substring(0, 30) + "...");
  }
}

export const pool = new Pool({
  connectionString: dbUrl,
  max: 3,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

pool.on("error", (err) => {
  console.error("[db] Pool error:", err.message, "| code:", (err as { code?: string }).code);
});

export async function query<T extends Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  try {
    const res = await pool.query(text, params);
    return res.rows as T[];
  } catch (err) {
    const e = err as Error & { code?: string };
    console.error("[db] Query failed:", e.message, "| code:", e.code, "| sql:", text.substring(0, 80));
    return [];
  }
}

export async function execute(text: string, params: unknown[]): Promise<boolean> {
  try {
    await pool.query(text, params);
    return true;
  } catch (err) {
    const e = err as Error & { code?: string };
    console.error("[db] Execute failed:", e.message, "| code:", e.code, "| sql:", text.substring(0, 80));
    return false;
  }
}

export async function isDbConfigured(): Promise<boolean> {
  try {
    const client = await pool.connect();
    try {
      await client.query("SELECT 1");
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    const e = err as Error & { code?: string; syscall?: string; address?: string; port?: number };
    console.error("[db] Connection FAILED:", e.message, "| code:", e.code, "| syscall:", e.syscall, "| address:", e.address, "| port:", e.port);
    return false;
  }
}
