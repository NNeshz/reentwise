import { PRICING_UI_LABELS } from "@/modules/pricing/lib/pricing-display";

export function PricingPlanRecommendedBadge() {
  return (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
      <span className="inline-block rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
        {PRICING_UI_LABELS.recommendedBadge}
      </span>
    </div>
  );
}
