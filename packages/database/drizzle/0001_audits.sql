CREATE TYPE "public"."audit_channel" AS ENUM('email', 'whatsapp');
--> statement-breakpoint
CREATE TYPE "public"."audit_status" AS ENUM('pending', 'sending', 'sent', 'failed');
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
ALTER TABLE "audits" ADD CONSTRAINT "audits_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "audits_tenant_id_idx" ON "audits" USING btree ("tenant_id");
--> statement-breakpoint
CREATE INDEX "audits_logged_at_idx" ON "audits" USING btree ("logged_at" DESC);
