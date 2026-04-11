import { useMutation } from "@tanstack/react-query";
import { pricingService } from "@/modules/pricing/service/pricing-service";

/**
 * Checkout con envío explícito → `useMutation` (TanStack Query).
 * Los planes son datos estáticos en `data.ts`; no hay filtros instantáneos → sin Zustand.
 */
export function usePricingCheckout() {
  return useMutation({
    mutationFn: (productId: string) => pricingService.startBillingCheckout(productId),
  });
}
