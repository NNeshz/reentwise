import type { PricingPlan } from "@/modules/pricing/types/pricing.types";
import {
  formatPriceMxnMonthly,
  PRICING_UI_LABELS,
} from "@/modules/pricing/lib/pricing-display";

type Props = {
  plan: PricingPlan;
};

export function PricingPlanPrice({ plan }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-1 border-b border-border/50 pb-6">
      <span className="font-host-grotesk text-4xl font-medium tracking-tight text-foreground tabular-nums md:text-5xl">
        {formatPriceMxnMonthly(plan.priceMonthly)}
      </span>
      <span className="text-sm text-muted-foreground">
        {PRICING_UI_LABELS.perMonth}
      </span>
    </div>
  );
}
