/**
 * Destructive: drops all tables (and public enums) in schema `public`,
 * and schema `drizzle` (historial de migraciones de drizzle-kit).
 * Only runs when NODE_ENV is exactly "development" — refuses otherwise.
 *
 * Usage from repo root: `bun run db:devreset` then `bun run db:migrate`.
 * Ensure `.env` has NODE_ENV=development (or prefix the command).
 */
import postgres from "postgres";
import { resolveDirectDatabaseUrl } from "./src/lib/direct-database-url";

async function main() {
  if (process.env.NODE_ENV !== "development") {
    console.error(
      'db:devreset refused: NODE_ENV must be exactly "development".\n' +
        "Set NODE_ENV=development in ../../.env or run:\n" +
        "  NODE_ENV=development bun run db:devreset",
    );
    process.exit(1);
  }

  const url = resolveDirectDatabaseUrl();
  const sql = postgres(url, { max: 1 });

  try {
    await sql.unsafe(`
      DO $drop$
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN (
          SELECT tablename FROM pg_tables WHERE schemaname = 'public'
        ) LOOP
          EXECUTE format('DROP TABLE IF EXISTS %I.%I CASCADE', 'public', r.tablename);
        END LOOP;

        FOR r IN (
          SELECT t.typname AS name
          FROM pg_type t
          JOIN pg_namespace n ON n.oid = t.typnamespace
          WHERE n.nspname = 'public' AND t.typtype = 'e'
        ) LOOP
          EXECUTE format('DROP TYPE IF EXISTS %I.%I CASCADE', 'public', r.name);
        END LOOP;
      END
      $drop$;
    `);
    await sql.unsafe(`DROP SCHEMA IF EXISTS "drizzle" CASCADE;`);
    console.log("Dropped all tables and enum types in schema public.");
    console.log('Dropped schema "drizzle" (migration history).');
    console.log("Run db:migrate to apply drizzle/0000_init.sql from a clean state.");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
