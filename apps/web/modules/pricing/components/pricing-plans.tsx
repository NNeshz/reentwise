"use client";

import { pricingPlans } from "../data";
import { PricingCard } from "./pricing-card";

export function PricingPlans() {
  return (
    <section className="w-full px-4 pb-24 pt-8 md:pt-12">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch md:gap-5">
        {pricingPlans.map((plan, index) => (
          <PricingCard key={plan.id} plan={plan} index={index} />
        ))}
      </div>
    </section>
  );
}
