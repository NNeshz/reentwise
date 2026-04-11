/**
 * Idempotente: crea enums + tabla `plan_limits` y filas seed si faltan.
 * Útil cuando `db:migrate` falla en migraciones antiguas (p. ej. "account already exists")
 * y nunca llegó a aplicarse `0003_plan_limits_user_profile.sql`.
 */
import postgres from "postgres";
import { resolveDirectDatabaseUrl } from "./src/lib/direct-database-url";

async function main() {
  const url = resolveDirectDatabaseUrl();
  const sql = postgres(url, { max: 1 });

  try {
    await sql`
      DO $$ BEGIN
        CREATE TYPE "public"."plan_tier" AS ENUM('freemium', 'trial', 'basico', 'pro', 'patron');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        CREATE TYPE "public"."rooms_limit_mode" AS ENUM('total', 'per_property');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "plan_limits" (
        "tier" "plan_tier" PRIMARY KEY NOT NULL,
        "max_properties" integer NOT NULL,
        "max_rooms" integer NOT NULL,
        "rooms_limit_mode" "rooms_limit_mode" NOT NULL,
        "allow_reminder_t7" boolean NOT NULL,
        "allow_reminder_t3" boolean NOT NULL,
        "allow_reminder_today" boolean NOT NULL,
        "allow_email_payment_registered" boolean NOT NULL,
        "allow_whatsapp_payment_receipt" boolean NOT NULL
      );
    `;

    await sql`
      INSERT INTO "plan_limits" (
        "tier",
        "max_properties",
        "max_rooms",
        "rooms_limit_mode",
        "allow_reminder_t7",
        "allow_reminder_t3",
        "allow_reminder_today",
        "allow_email_payment_registered",
        "allow_whatsapp_payment_receipt"
      ) VALUES
        ('freemium', 1, 2, 'total', false, true, false, false, false),
        ('trial', 2, 15, 'total', true, true, true, true, false),
        ('basico', 2, 5, 'per_property', true, true, true, true, false),
        ('pro', 4, 60, 'total', true, true, true, true, true),
        ('patron', 12, 200, 'total', true, true, true, true, true)
      ON CONFLICT ("tier") DO NOTHING;
    `;

    const [{ n }] = await sql<[{ n: string }]>`SELECT count(*)::text AS n FROM "plan_limits"`;
    console.log(`plan_limits: ${n} filas (esperado 5). Listo.`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
