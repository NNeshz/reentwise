import type Stripe from "stripe";
import type { PlanTier } from "@reentwise/database";
import { env } from "@reentwise/api/src/utils/envs";

/** Valores persistidos en `user.subscription_status` */
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status,
): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
      return "canceled";
    case "unpaid":
      return "past_due";
    case "incomplete":
    case "paused":
      return "trialing";
    case "incomplete_expired":
      return "canceled";
    default:
      return "canceled";
  }
}

export function planTierFromPriceId(priceId: string | undefined): PlanTier | null {
  if (!priceId) return null;
  if (priceId === env.STRIPE_PRICE_BASICO) return "basico";
  if (priceId === env.STRIPE_PRICE_PRO) return "pro";
  if (priceId === env.STRIPE_PRICE_PATRON) return "patron";
  return null;
}

export function periodEndFromSubscription(
  subscription: Stripe.Subscription,
): Date | null {
  const end = subscription.items.data[0]?.current_period_end;
  if (typeof end !== "number") return null;
  return new Date(end * 1000);
}

/** Price IDs configurados (solo los definidos en env). */
export function configuredStripePriceIds(): string[] {
  return [
    env.STRIPE_PRICE_BASICO,
    env.STRIPE_PRICE_PRO,
    env.STRIPE_PRICE_PATRON,
  ].filter((id): id is string => Boolean(id?.trim()));
}
