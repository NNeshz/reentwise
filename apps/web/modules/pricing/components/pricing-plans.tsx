"use client";

import { pricingPlans } from "@/modules/pricing/data";
import { PRICING_PLANS_GRID_CLASS } from "@/modules/pricing/lib/pricing-display";
import { PricingPlanCard } from "./pricing-plan-card";

export function PricingPlans() {
  return (
    <section className="w-full px-4 pb-24 pt-8 md:pt-12">
      <div className={PRICING_PLANS_GRID_CLASS}>
        {pricingPlans.map((plan, index) => (
          <PricingPlanCard key={plan.id} plan={plan} index={index} />
        ))}
      </div>
    </section>
  );
}
