import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { PRICING_PLANS_GRID_CLASS } from "@/modules/pricing/lib/pricing-display";

function PricingPlanCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border/60 bg-card/80 p-8 shadow-sm">
      <Skeleton className="mb-2 h-3 w-24" />
      <Skeleton className="mb-2 h-7 w-40" />
      <Skeleton className="mb-4 h-4 w-full max-w-[280px]" />
      <Skeleton className="mb-6 h-12 w-36" />
      <Skeleton className="mb-3 h-3 w-20" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[85%]" />
      </div>
      <Skeleton className="mt-8 h-11 w-full rounded-full" />
    </div>
  );
}

/**
 * Placeholder si en el futuro los planes vienen de red (p. ej. `useQuery`).
 * Hoy la página usa datos estáticos y no monta este componente.
 */
export function PricingPlansSkeleton() {
  return (
    <section className="w-full px-4 pb-24 pt-8 md:pt-12" aria-hidden>
      <div className={PRICING_PLANS_GRID_CLASS}>
        <PricingPlanCardSkeleton />
        <PricingPlanCardSkeleton />
        <PricingPlanCardSkeleton />
      </div>
    </section>
  );
}
