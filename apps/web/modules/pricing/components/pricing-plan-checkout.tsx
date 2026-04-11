"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@reentwise/ui/src/components/alert";
import { Button } from "@reentwise/ui/src/components/button";
import { cn } from "@reentwise/ui/src/lib/utils";
import { IconInfoCircle } from "@tabler/icons-react";
import { usePricingCheckout } from "@/modules/pricing/hooks/use-pricing-checkout";
import { PRICING_UI_LABELS } from "@/modules/pricing/lib/pricing-display";
import { pricingPlansCta } from "@/modules/pricing/data";
import { PricingCheckoutError } from "./pricing-checkout-error";

type Props = {
  productId: string | undefined;
  featured: boolean;
};

export function PricingPlanCheckout({ productId, featured }: Props) {
  const { mutate, isPending, isError, error, reset } = usePricingCheckout();

  function handleCheckout() {
    if (!productId) return;
    reset();
    mutate(productId);
  }

  return (
    <div className="mt-8 space-y-3">
      {!productId && (
        <Alert>
          <IconInfoCircle className="size-4" aria-hidden />
          <AlertTitle>{PRICING_UI_LABELS.missingProductIdsTitle}</AlertTitle>
          <AlertDescription>
            {PRICING_UI_LABELS.missingProductIdsDescription}
          </AlertDescription>
        </Alert>
      )}

      {isError && (
        <PricingCheckoutError
          error={error}
          onRetry={handleCheckout}
          isRetrying={isPending}
        />
      )}

      <Button
        type="button"
        className={cn(
          "h-11 w-full rounded-full font-semibold",
          featured && "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
        variant={featured ? "default" : "outline"}
        disabled={isPending || !productId}
        onClick={handleCheckout}
      >
        {isPending
          ? PRICING_UI_LABELS.checkoutRedirecting
          : pricingPlansCta.label}
      </Button>
    </div>
  );
}
