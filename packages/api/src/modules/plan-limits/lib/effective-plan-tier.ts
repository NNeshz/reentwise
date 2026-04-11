import type { PlanTier } from "@reentwise/database";
import type { EffectivePlanUserRow } from "@reentwise/api/src/modules/plan-limits/types/plan-limits.types";

const PAID_TIERS: PlanTier[] = ["basico", "pro", "patron"];

function isPaidProductTier(tier: PlanTier): boolean {
  return PAID_TIERS.includes(tier);
}

/**
 * Tier used for limits and messaging.
 * During Polar (or other) trials, limits follow the **product** being trialed
 * (pro, patron, basico), not the generic `plan_limits.trial` row — checkout/webhooks
 * set `plan_tier` from `product_id`. If still `freemium` while trialing, fall back
 * to `trial`.
 *
 * Keeps paid tier until `subscription_current_period_end` when status is `canceled`
 * (grace if webhooks lag).
 */
export function getEffectivePlanTier(row: EffectivePlanUserRow): PlanTier {
  if (row.subscriptionStatus === "trialing") {
    if (isPaidProductTier(row.planTier)) {
      return row.planTier;
    }
    return "trial";
  }
  if (
    row.subscriptionStatus === "active" ||
    row.subscriptionStatus === "past_due"
  ) {
    return row.planTier;
  }
  const end = row.subscriptionCurrentPeriodEnd;
  if (
    row.subscriptionStatus === "canceled" &&
    end &&
    end.getTime() > Date.now() &&
    isPaidProductTier(row.planTier)
  ) {
    return row.planTier;
  }
  return "freemium";
}
