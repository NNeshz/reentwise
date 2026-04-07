import { IconCheck } from "@tabler/icons-react";
import type { PricingPlan } from "@/modules/pricing/types/pricing.types";
import { PRICING_UI_LABELS } from "@/modules/pricing/lib/pricing-display";

type Props = {
  plan: PricingPlan;
};

export function PricingPlanFeatures({ plan }: Props) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground">
        {PRICING_UI_LABELS.includesHeading}
      </p>
      <ul className="space-y-3">
        {plan.features.map((line) => (
          <li
            key={line}
            className="flex gap-2.5 text-sm leading-snug text-muted-foreground"
          >
            <IconCheck
              className="mt-0.5 size-4 shrink-0 text-primary"
              stroke={2}
              aria-hidden
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
