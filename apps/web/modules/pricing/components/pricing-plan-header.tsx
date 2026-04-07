import type { PricingPlan } from "@/modules/pricing/types/pricing.types";
import { PRICING_UI_LABELS } from "@/modules/pricing/lib/pricing-display";

type Props = {
  plan: PricingPlan;
};

export function PricingPlanHeader({ plan }: Props) {
  return (
    <div className="mb-5 space-y-2 pt-1">
      <p className="text-xs font-medium uppercase tracking-wide text-primary">
        {plan.scope}
      </p>
      <h3 className="font-host-grotesk text-xl font-medium text-foreground">
        {PRICING_UI_LABELS.planPrefix} {plan.name}
      </h3>
      <p className="text-sm leading-snug text-muted-foreground">{plan.tagline}</p>
      <p className="text-xs text-muted-foreground/90">{plan.limitsLine}</p>
    </div>
  );
}
