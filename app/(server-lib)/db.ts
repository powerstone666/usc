import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
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
    console.error("[db] Query failed:", e.message, "| code:", e.code);
    return [];
  }
}

export async function execute(text: string, params: unknown[]): Promise<boolean> {
  try {
    await pool.query(text, params);
    return true;
  } catch (err) {
    const e = err as Error & { code?: string };
    console.error("[db] Execute failed:", e.message, "| code:", e.code);
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
    const e = err as Error & { code?: string };
    console.error("[db] Connection FAILED:", e.message, "| code:", e.code);
    return false;
  }
}
