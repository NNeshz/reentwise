CREATE TYPE "public"."plan_tier" AS ENUM('freemium', 'trial', 'basico', 'pro', 'patron');--> statement-breakpoint
CREATE TYPE "public"."rooms_limit_mode" AS ENUM('total', 'per_property');--> statement-breakpoint
CREATE TYPE "public"."audit_channel" AS ENUM('email', 'whatsapp');--> statement-breakpoint
CREATE TYPE "public"."audit_status" AS ENUM('pending', 'sending', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'transfer', 'deposit');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'partial', 'paid', 'late', 'annulled');--> statement-breakpoint
CREATE TYPE "public"."room_status" AS ENUM('vacant', 'occupied', 'maintenance', 'reserved');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"phone_number" text,
	"billing_customer_id" text,
	"billing_subscription_id" text,
	"subscription_status" text,
	"plan_tier" "plan_tier" DEFAULT 'freemium' NOT NULL,
	"subscription_current_period_end" timestamp with time zone,
	"billing_price_id" text,
	"currency" varchar(3),
	"timezone" text,
	"locale" text,
	"business_name" text,
	"tax_id" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"tenant_name" varchar(64) NOT NULL,
	"channel" "audit_channel" NOT NULL,
	"status" "audit_status" NOT NULL,
	"logged_at" timestamp with time zone DEFAULT now() NOT NULL,
	"note" varchar(160) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"amount_paid" numeric(10, 2) DEFAULT '0.00',
	"method" "payment_method",
	"status" "payment_status" DEFAULT 'pending',
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"paid_at" timestamp,
	"receipt_url" text,
	"is_annulled" boolean DEFAULT false,
	"annulled_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
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
);
--> statement-breakpoint
INSERT INTO "plan_limits" ("tier", "max_properties", "max_rooms", "rooms_limit_mode", "allow_reminder_t7", "allow_reminder_t3", "allow_reminder_today", "allow_email_payment_registered", "allow_whatsapp_payment_receipt", "allow_whatsapp_abono_receipt") VALUES
	('freemium', 1, 2, 'total', false, true, false, false, true, false),
	('trial', 2, 15, 'total', true, true, true, true, true, true),
	('basico', 2, 5, 'total', false, true, true, true, true, true),
	('pro', 4, 15, 'total', true, true, true, true, true, true),
	('patron', 12, 25, 'total', true, true, true, true, true, true);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"archived_at" timestamp with time zone,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"room_number" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"notes" text,
	"status" "room_status" DEFAULT 'vacant',
	"archived_at" timestamp with time zone,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text,
	"room_id" uuid,
	"name" text NOT NULL,
	"whatsapp" text NOT NULL,
	"email" text NOT NULL,
	"payment_day" integer NOT NULL,
	"deposit" numeric(10, 2) DEFAULT '0.00',
	"start_date" timestamp DEFAULT now(),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_plan_tier_plan_limits_tier_fk" FOREIGN KEY ("plan_tier") REFERENCES "public"."plan_limits"("tier") ON DELETE no action ON UPDATE no action;