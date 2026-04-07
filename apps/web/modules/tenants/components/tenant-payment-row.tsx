"use client";

import type { TenantPaymentRecord } from "@/modules/tenants/types/tenants.types";
import {
  formatTenantPaymentCurrency,
  tenantPaymentPeriodLabel,
  TENANT_PAYMENT_METHOD_LABELS,
} from "@/modules/tenants/lib/tenant-display";
import { TenantPaymentStatusBadge } from "@/modules/tenants/components/tenant-payment-status-badge";

type Props = {
  payment: TenantPaymentRecord;
};

export function TenantPaymentRow({ payment }: Props) {
  const period = tenantPaymentPeriodLabel(payment);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{period}</span>
          <TenantPaymentStatusBadge status={payment.status} />
        </div>
        <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
          <span>Total: {formatTenantPaymentCurrency(payment.amount)}</span>
          <span>Pagado: {formatTenantPaymentCurrency(payment.amountPaid)}</span>
          {payment.method ? (
            <span>
              {TENANT_PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
