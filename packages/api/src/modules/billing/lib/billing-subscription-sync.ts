import type { PlanTier } from "@reentwise/database";
import { env } from "@reentwise/api/src/utils/envs";

/** Valores persistidos en `user.subscription_status` */
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

/** Mapea estados de suscripción del proveedor (Polar) al modelo local. */
export function mapProviderSubscriptionStatus(status: string): SubscriptionStatus {
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
    case "incomplete_expired":
      return "trialing";
    default:
      return "canceled";
  }
}

export function planTierFromProductId(
  productId: string | undefined,
): PlanTier | null {
  if (!productId) return null;
  if (productId === env.POLAR_PRODUCT_BASICO) return "basico";
  if (productId === env.POLAR_PRODUCT_PRO) return "pro";
  if (productId === env.POLAR_PRODUCT_PATRON) return "patron";
  return null;
}

export function configuredProductIds(): string[] {
  return [
    env.POLAR_PRODUCT_BASICO,
    env.POLAR_PRODUCT_PRO,
    env.POLAR_PRODUCT_PATRON,
  ].filter((id): id is string => Boolean(id?.trim()));
}
