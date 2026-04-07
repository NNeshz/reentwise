"use client";

import { tenantCountLabel } from "@/modules/payment/lib/payment-display";

type Props = {
  count: number;
  isFetching?: boolean;
};

export function PaymentsResultSummary({ count, isFetching }: Props) {
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>{tenantCountLabel(count)}</span>
      {isFetching ? (
        <span className="text-muted-foreground/80">Actualizando…</span>
      ) : null}
    </div>
  );
}
