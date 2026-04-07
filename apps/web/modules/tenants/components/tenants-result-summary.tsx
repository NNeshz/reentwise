"use client";

import { tenantCountLabel } from "@/modules/tenants/lib/tenant-display";

type Props = {
  totalProducts: number;
  isFetching?: boolean;
};

export function TenantsResultSummary({
  totalProducts,
  isFetching,
}: Props) {
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>{tenantCountLabel(totalProducts)}</span>
      {isFetching ? (
        <span className="text-muted-foreground/80">Actualizando…</span>
      ) : null}
    </div>
  );
}
