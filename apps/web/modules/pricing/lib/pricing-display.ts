import { cn } from "@reentwise/ui/src/lib/utils";

/** Grid de tarjetas en la página de precios (reutilizable / consistente). */
export const PRICING_PLANS_GRID_CLASS =
  "mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch md:gap-5";

const priceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export function formatPriceMxnMonthly(amount: number): string {
  return priceFormatter.format(amount);
}

export function pricingPlanCardClassName(featured: boolean): string {
  return cn(
    "relative flex flex-col rounded-2xl border p-8 shadow-sm",
    featured
      ? "z-10 border-primary bg-card ring-2 ring-primary/35 md:scale-[1.02]"
      : "border-border/60 bg-card/80",
  );
}

/** Textos de UI fijos del módulo pricing (evita strings mágicos en componentes). */
export const PRICING_UI_LABELS = {
  recommendedBadge: "Recomendado",
  includesHeading: "Incluye",
  exclusionsHeading: "No incluye en este plan",
  perMonth: "al mes",
  planPrefix: "Plan",
  checkoutRedirecting: "Redirigiendo…",
  missingPriceIdsTitle: "Checkout no disponible",
  missingPriceIdsDescription:
    "Configura NEXT_PUBLIC_STRIPE_PRICE_BASICO, PRO y PATRON en el entorno.",
} as const;
