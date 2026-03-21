import { Pool } from "pg";
import { env } from "../config/env";

export const dbPool = new Pool({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,
  ssl: env.database.ssl ? { rejectUnauthorized: false } : false,
});

export async function verifyDatabaseConnection(): Promise<void> {
  await dbPool.query("SELECT 1");
}
