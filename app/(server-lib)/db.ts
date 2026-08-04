import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 5000,
  ssl: { rejectUnauthorized: false },
});

export async function query<T extends Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  try {
    const res = await pool.query(text, params);
    return res.rows as T[];
  } catch (err) {
    console.error("[db] Query error:", err instanceof Error ? err.message : err);
    return [];
  }
}

export async function execute(text: string, params: unknown[]): Promise<boolean> {
  try {
    await pool.query(text, params);
    return true;
  } catch (err) {
    console.error("[db] Execute error:", err instanceof Error ? err.message : err);
    return false;
  }
}

export async function isDbConfigured(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}
