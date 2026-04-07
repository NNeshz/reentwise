"use client";

import { Badge } from "@reentwise/ui/src/components/badge";

type Props = {
  status: string | null;
};

export function TenantPaymentStatusBadge({ status }: Props) {
  switch (status) {
    case "paid":
      return (
        <Badge className="border border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-400">
          Pagado
        </Badge>
      );
    case "partial":
      return (
        <Badge className="border border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
          Parcial
        </Badge>
      );
    case "annulled":
      return (
        <Badge className="line-through border border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
          Anulado
        </Badge>
      );
    default:
      return (
        <Badge className="border border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-400">
          Pendiente
        </Badge>
      );
  }
}
