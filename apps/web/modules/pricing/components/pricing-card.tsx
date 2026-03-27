"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { IconCheck, IconMinus } from "@tabler/icons-react";
import { Button } from "@reentwise/ui/src/components/button";
import { cn } from "@reentwise/ui/src/lib/utils";
import { toast } from "sonner";
import type { PricingPlan } from "../data";
import { getStripePriceIdForPlan, pricingPlansCta } from "../data";
import { startStripeCheckout } from "../service/pricing-checkout";

const priceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

type PricingCardProps = {
  plan: PricingPlan;
  index: number;
};

export function PricingCard({ plan, index }: PricingCardProps) {
  const featured = Boolean(plan.recommended);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const priceId = getStripePriceIdForPlan(plan.id);

  async function handleCheckout() {
    if (!priceId) {
      toast.error(
        "Falta configurar los price IDs de Stripe (NEXT_PUBLIC_STRIPE_PRICE_* en .env).",
      );
      return;
    }
    setCheckoutLoading(true);
    try {
      await startStripeCheckout(priceId);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "No se pudo iniciar el checkout",
      );
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.06 }}
      className={cn(
        "relative flex flex-col rounded-2xl border p-8 shadow-sm",
        featured
          ? "border-primary bg-card ring-2 ring-primary/35 md:scale-[1.02] z-10"
          : "border-border/60 bg-card/80",
      )}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-block rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
            Recomendado
          </span>
        </div>
      )}

      <div className="mb-5 space-y-2 pt-1">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          {plan.scope}
        </p>
        <h3 className="text-xl font-host-grotesk font-medium text-foreground">
          Plan {plan.name}
        </h3>
        <p className="text-sm leading-snug text-muted-foreground">{plan.tagline}</p>
        <p className="text-xs text-muted-foreground/90">{plan.limitsLine}</p>
      </div>

      <div className="mb-6 flex flex-col gap-1 border-b border-border/50 pb-6">
        <span className="text-4xl md:text-5xl font-host-grotesk font-medium tracking-tight text-foreground tabular-nums">
          {priceFormatter.format(plan.priceMonthly)}
        </span>
        <span className="text-sm text-muted-foreground">al mes</span>
      </div>

      <div className="flex flex-1 flex-col gap-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground">
            Incluye
          </p>
          <ul className="space-y-3">
            {plan.features.map((line) => (
              <li key={line} className="flex gap-2.5 text-sm leading-snug text-muted-foreground">
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

        {plan.exclusions && plan.exclusions.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              No incluye en este plan
            </p>
            <ul className="space-y-2.5">
              {plan.exclusions.map((line) => (
                <li
                  key={line}
                  className="flex gap-2.5 text-xs leading-snug text-muted-foreground"
                >
                  <IconMinus className="mt-0.5 size-3.5 shrink-0 opacity-70" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button
          type="button"
          className={cn(
            "h-11 w-full rounded-full font-semibold",
            featured && "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
          variant={featured ? "default" : "outline"}
          disabled={checkoutLoading || !priceId}
          title={
            !priceId
              ? "Configura NEXT_PUBLIC_STRIPE_PRICE_BASICO, PRO y PATRON en .env"
              : undefined
          }
          onClick={handleCheckout}
        >
          {checkoutLoading ? "Redirigiendo…" : pricingPlansCta.label}
        </Button>
      </div>
    </m.div>
  );
}
