import { Badge } from "@reentwise/ui/src/components/badge";
import { cn } from "@reentwise/ui/src/lib/utils";
import type {
  PaymentMonthRow,
  PaymentTenantRow,
} from "@/modules/payment/types/payment.types";
import {
  formatPaymentCurrency,
  nextCollectionBadgeLabel,
} from "@/modules/payment/lib/payment-display";

function statusClassName(status: string | null): string {
  switch (status) {
    case "paid":
      return "border-emerald-500/60 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300";
    case "partial":
      return "border-amber-500/60 bg-amber-500/10 text-amber-900 dark:text-amber-200";
    case "late":
      return "border-red-500/60 bg-red-500/10 text-red-800 dark:text-red-300";
    case "pending":
      return "border-orange-500/60 bg-orange-500/10 text-orange-900 dark:text-orange-300";
    default:
      return "border-slate-400/50 bg-slate-500/10 text-slate-800 dark:text-slate-300";
  }
}

type Props = {
  payment: PaymentMonthRow | null;
  tenant: PaymentTenantRow;
  month: number;
  year: number;
};

export function PaymentListStatusBadge({ payment, tenant, month, year }: Props) {
  if (!payment) {
    return (
      <Badge variant="outline" className={cn("w-fit font-medium", statusClassName(null))}>
        {nextCollectionBadgeLabel(tenant, month, year)}
      </Badge>
    );
  }

  const amount = Number(payment.amount);
  const amountPaid = Number(payment.amountPaid ?? 0);

  if (payment.status === "paid") {
    return (
      <Badge variant="outline" className={cn("w-fit font-medium", statusClassName("paid"))}>
        Pagado
      </Badge>
    );
  }

  if (payment.status === "partial") {
    return (
      <Badge variant="outline" className={cn("w-fit font-medium", statusClassName("partial"))}>
        Abono {formatPaymentCurrency(amountPaid)} / {formatPaymentCurrency(amount)}
      </Badge>
    );
  }

  if (payment.status === "late") {
    return (
      <Badge variant="outline" className={cn("w-fit font-medium", statusClassName("late"))}>
        Mora
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={cn("w-fit font-medium", statusClassName("pending"))}>
      Pendiente
    </Badge>
  );
}
