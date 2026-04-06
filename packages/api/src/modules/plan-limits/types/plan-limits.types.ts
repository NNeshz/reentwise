import type { PlanTier, planLimits, user } from "@reentwise/database";

/** Subset of `user` row needed to resolve billing tier. */
export type EffectivePlanUserRow = {
  subscriptionStatus: string | null;
  planTier: PlanTier;
  subscriptionCurrentPeriodEnd?: Date | null;
};

/** Owner row + resolved tier + matching `plan_limits` row. */
export type OwnerPlanLimitsContext = {
  user: typeof user.$inferSelect;
  effectiveTier: PlanTier;
  limits: typeof planLimits.$inferSelect;
};
