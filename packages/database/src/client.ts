import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as otherSchema from "./other";

function getDatabaseUrl(): string {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is required");
  return dbUrl;
}

function isPoolerUrl(url: string): boolean {
  return (
    url.includes(":6543") || /[?&]pgbouncer=true/i.test(url)
  );
}

// Supabase pooler / PgBouncer (modo transacción): prepared statements desactivados
const dbUrl = getDatabaseUrl();
const queryClient = postgres(dbUrl, {
  prepare: !isPoolerUrl(dbUrl),
});

export const db = drizzle(queryClient, { schema: { ...schema, ...otherSchema } });

export type Database = typeof db;
