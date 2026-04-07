import { sql } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { resolveDirectDatabaseUrl } from "./src/lib/direct-database-url";

const queryClient = postgres(resolveDirectDatabaseUrl());
const db = drizzle(queryClient);

async function main() {
  console.log("Checking if column is_occupied exists before migrating...");

  try {
    await db.execute(sql`DO $$ BEGIN
        CREATE TYPE "public"."room_status" AS ENUM('vacant', 'occupied', 'maintenance', 'reserved');
     EXCEPTION
        WHEN duplicate_object THEN null;
     END $$;`);
    console.log("Enum created or already exists.");

    await db.execute(
      sql`ALTER TABLE "rooms" ADD COLUMN IF NOT EXISTS "status" "room_status" DEFAULT 'vacant';`,
    );
    console.log("Column status added or already exists.");
  } catch (e: any) {
    console.log("Step 1 log:", e.message);
  }

  try {
    console.log("Migrating data from is_occupied to status...");
    await db.execute(
      sql`UPDATE "rooms" SET "status" = 'occupied' WHERE "is_occupied" = 1;`,
    );
    await db.execute(
      sql`UPDATE "rooms" SET "status" = 'vacant' WHERE "is_occupied" = 0;`,
    );
    console.log("Data migrated successfully.");
  } catch (e: any) {
    if (e.message.includes("does not exist")) {
      console.log(
        "is_occupied column already dropped or doesn't exist. Skipping data migration.",
      );
    } else {
      console.error("Error migrating data:", e.message);
    }
  }

  try {
    console.log("Dropping old column...");
    await db.execute(
      sql`ALTER TABLE "rooms" DROP COLUMN IF EXISTS "is_occupied";`,
    );
    console.log("is_occupied dropped successfully.");
  } catch (e: any) {
    console.error("Error dropping column:", e.message);
  }

  console.log("Done!");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
