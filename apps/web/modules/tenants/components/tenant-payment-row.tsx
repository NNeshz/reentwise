"use client";

import { Badge } from "@reentwise/ui/src/components/badge";
import { IconShieldCheck, IconReceipt } from "@tabler/icons-react";
import type { TenantPaymentRecord } from "@/modules/tenants/types/tenants.types";
import {
  formatTenantPaymentCurrency,
  tenantPaymentPeriodLabel,
  TENANT_PAYMENT_METHOD_LABELS,
} from "@/modules/tenants/lib/tenant-display";
import { TenantPaymentStatusBadge } from "@/modules/tenants/components/tenant-payment-status-badge";

const REASON_META: Record<string, { icon: typeof IconReceipt; className: string }> = {
  deposit: {
    icon: IconShieldCheck,
    className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  extra: {
    icon: IconReceipt,
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

type Props = {
  payment: TenantPaymentRecord;
};

export function TenantPaymentRow({ payment }: Props) {
  const period = tenantPaymentPeriodLabel(payment);
  const reasonMeta = payment.reason ? REASON_META[payment.reason] : null;
  const ReasonIcon = reasonMeta?.icon;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{period}</span>
          <TenantPaymentStatusBadge status={payment.status} />
          {reasonMeta && (
            <Badge variant="outline" className={`flex items-center gap-1 text-[10px] ${reasonMeta.className}`}>
              {ReasonIcon && <ReasonIcon className="size-3" />}
              {payment.reason === "deposit" ? "Depósito" : "Extra"}
            </Badge>
          )}
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
