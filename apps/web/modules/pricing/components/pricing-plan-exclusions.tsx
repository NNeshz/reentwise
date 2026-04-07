import { IconMinus } from "@tabler/icons-react";
import type { PricingPlan } from "@/modules/pricing/types/pricing.types";
import { PRICING_UI_LABELS } from "@/modules/pricing/lib/pricing-display";

type Props = {
  plan: PricingPlan;
};

export function PricingPlanExclusions({ plan }: Props) {
  if (!plan.exclusions?.length) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {PRICING_UI_LABELS.exclusionsHeading}
      </p>
      <ul className="space-y-2.5">
        {plan.exclusions.map((line) => (
          <li
            key={line}
            className="flex gap-2.5 text-xs leading-snug text-muted-foreground"
          >
            <IconMinus
              className="mt-0.5 size-3.5 shrink-0 opacity-70"
              aria-hidden
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
