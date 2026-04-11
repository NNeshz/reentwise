-- Columnas de facturación agnósticas del PSP; renombrar sin perder datos.
ALTER TABLE "user" RENAME COLUMN "stripe_customer_id" TO "billing_customer_id";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "stripe_subscription_id" TO "billing_subscription_id";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "stripe_price_id" TO "billing_price_id";
