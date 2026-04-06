CREATE TYPE "public"."plan_tier" AS ENUM('freemium', 'trial', 'basico', 'pro', 'patron');--> statement-breakpoint
CREATE TYPE "public"."rooms_limit_mode" AS ENUM('total', 'per_property');--> statement-breakpoint
CREATE TABLE "plan_limits" (
	"tier" "plan_tier" PRIMARY KEY NOT NULL,
	"max_properties" integer NOT NULL,
	"max_rooms" integer NOT NULL,
	"rooms_limit_mode" "rooms_limit_mode" NOT NULL,
	"allow_reminder_t7" boolean NOT NULL,
	"allow_reminder_t3" boolean NOT NULL,
	"allow_reminder_today" boolean NOT NULL,
	"allow_email_payment_registered" boolean NOT NULL,
	"allow_whatsapp_payment_receipt" boolean NOT NULL
);--> statement-breakpoint
INSERT INTO "plan_limits" ("tier", "max_properties", "max_rooms", "rooms_limit_mode", "allow_reminder_t7", "allow_reminder_t3", "allow_reminder_today", "allow_email_payment_registered", "allow_whatsapp_payment_receipt") VALUES
	('freemium', 1, 2, 'total', false, true, false, false, false),
	('trial', 2, 15, 'total', true, true, true, true, false),
	('basico', 2, 5, 'per_property', true, true, true, true, false),
	('pro', 4, 60, 'total', true, true, true, true, true),
	('patron', 12, 200, 'total', true, true, true, true, true);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "subscription_current_period_end" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripe_price_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "currency" varchar(3);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "timezone" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "locale" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "business_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "tax_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "plan_tier" "plan_tier" DEFAULT 'freemium' NOT NULL;--> statement-breakpoint
UPDATE "user" SET "plan_tier" = 'basico' WHERE "plan_type" = 'Básico';--> statement-breakpoint
UPDATE "user" SET "plan_tier" = 'pro' WHERE "plan_type" = 'Pro';--> statement-breakpoint
UPDATE "user" SET "plan_tier" = 'patron' WHERE "plan_type" = 'Patrón';--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "plan_type";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_plan_tier_plan_limits_tier_fk" FOREIGN KEY ("plan_tier") REFERENCES "public"."plan_limits"("tier") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "archived_at" timestamp with time zone;
