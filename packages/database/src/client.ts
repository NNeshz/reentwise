import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as otherSchema from "./other";

function getDatabaseUrl(): string {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is required");
  return dbUrl;
}

// For query purposes
const queryClient = postgres(getDatabaseUrl());

export const db = drizzle(queryClient, { schema: { ...schema, ...otherSchema } });

export type Database = typeof db;
