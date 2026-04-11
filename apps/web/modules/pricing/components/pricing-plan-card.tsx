"use client";

import { m } from "framer-motion";
import { cn } from "@reentwise/ui/src/lib/utils";
import type { PricingPlan } from "@/modules/pricing/types/pricing.types";
import { getPolarProductIdForPlan } from "@/modules/pricing/data";
import { pricingPlanCardClassName } from "@/modules/pricing/lib/pricing-display";
import { PricingPlanRecommendedBadge } from "./pricing-plan-recommended-badge";
import { PricingPlanHeader } from "./pricing-plan-header";
import { PricingPlanPrice } from "./pricing-plan-price";
import { PricingPlanFeatures } from "./pricing-plan-features";
import { PricingPlanExclusions } from "./pricing-plan-exclusions";
import { PricingPlanCheckout } from "./pricing-plan-checkout";

type Props = {
  plan: PricingPlan;
  index: number;
};

export function PricingPlanCard({ plan, index }: Props) {
  const featured = Boolean(plan.recommended);
  const productId = getPolarProductIdForPlan(plan.id);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.06 }}
      className={cn(pricingPlanCardClassName(featured))}
    >
      {featured && <PricingPlanRecommendedBadge />}

      <PricingPlanHeader plan={plan} />
      <PricingPlanPrice plan={plan} />

      <div className="flex flex-1 flex-col gap-6">
        <PricingPlanFeatures plan={plan} />
        <PricingPlanExclusions plan={plan} />
      </div>

      <PricingPlanCheckout productId={productId} featured={featured} />
    </m.div>
  );
}

/** Alias estable para exports públicos. */
export { PricingPlanCard as PricingCard };
