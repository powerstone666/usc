import { Pool } from "pg";

const dbUrl = process.env.DATABASE_URL;

console.log("[db] DATABASE_URL present:", Boolean(dbUrl));
console.log("[db] NODE_ENV:", process.env.NODE_ENV);
if (dbUrl) {
  try {
    const parsed = new URL(dbUrl);
    console.log("[db] host:", parsed.hostname);
    console.log("[db] port:", parsed.port || "5432 (default)");
    console.log("[db] database:", parsed.pathname);
    console.log("[db] user:", parsed.username);
    console.log("[db] password set:", Boolean(parsed.password));
    console.log("[db] is pooler URL:", parsed.hostname.includes("pooler"));
  } catch {
    console.log("[db] URL parse failed — invalid format");
  }
}

export const pool = new Pool({
  connectionString: dbUrl,
  max: 3,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

pool.on("connect", () => {
  console.log("[db] Pool: new client connected");
});

pool.on("error", (err) => {
  console.error("[db] Pool error:", err.message);
});

export async function query<T extends Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const start = Date.now();
  console.log("[db] Query:", text.substring(0, 80), "| params:", params?.length ?? 0);
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`[db] Query done in ${duration}ms, ${res.rowCount} rows`);
    return res.rows as T[];
  } catch (err) {
    console.error("[db] Query error:", err instanceof Error ? err.message : err);
    console.error("[db] Query was:", text.substring(0, 120));
    return [];
  }
}

export async function execute(text: string, params: unknown[]): Promise<boolean> {
  const start = Date.now();
  console.log("[db] Execute:", text.substring(0, 80), "| params:", params.length);
  try {
    await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`[db] Execute done in ${duration}ms`);
    return true;
  } catch (err) {
    console.error("[db] Execute error:", err instanceof Error ? err.message : err);
    console.error("[db] Execute was:", text.substring(0, 120));
    return false;
  }
}

export async function isDbConfigured(): Promise<boolean> {
  console.log("[db] Testing connection...");
  try {
    const client = await pool.connect();
    console.log("[db] Connection acquired");
    try {
      await client.query("SELECT 1");
      console.log("[db] SELECT 1 OK — connection healthy");
      return true;
    } finally {
      client.release();
      console.log("[db] Client released");
    }
  } catch (err) {
    console.error("[db] Connection FAILED:", err instanceof Error ? err.message : err);
    console.error("[db] Error code:", (err as { code?: string }).code);
    console.error("[db] Error errno:", (err as { errno?: string }).errno);
    console.error("[db] Error syscall:", (err as { syscall?: string }).syscall);
    console.error("[db] Error address:", (err as { address?: string }).address);
    console.error("[db] Error port:", (err as { port?: number }).port);
    return false;
  }
}
