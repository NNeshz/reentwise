"use client";

import { Badge } from "@reentwise/ui/src/components/badge";
import type {
  PaymentMonthRow,
  PaymentTenantRow,
} from "@/modules/payment/types/payment.types";
import {
  formatPaymentCurrency,
  nextCollectionBadgeLabel,
} from "@/modules/payment/lib/payment-display";

type Props = {
  payment: PaymentMonthRow | null;
  tenant: PaymentTenantRow;
  month: number;
  year: number;
};

export function PaymentListStatusBadge({
  payment,
  tenant,
  month,
  year,
}: Props) {
  if (!payment) {
    return (
      <Badge className="border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
        {nextCollectionBadgeLabel(tenant, month, year)}
      </Badge>
    );
  }

  const amount = Number(payment.amount);
  const amountPaid = Number(payment.amountPaid ?? 0);

  if (payment.status === "paid") {
    return (
      <Badge className="border border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-400">
        Pagado
      </Badge>
    );
  }

  if (payment.status === "partial") {
    return (
      <Badge className="border border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
        Abono {formatPaymentCurrency(amountPaid)} /{" "}
        {formatPaymentCurrency(amount)}
      </Badge>
    );
  }

  return (
    <Badge className="border border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-400">
      Debe {formatPaymentCurrency(amount)}
    </Badge>
  );
}
