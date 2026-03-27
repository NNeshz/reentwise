"use client";

import { Badge } from "@reentwise/ui/src/components/badge";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { Separator } from "@reentwise/ui/src/components/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@reentwise/ui/src/components/sheet";
import { useTenantPayments } from "@/modules/tenants/hooks/use-tenants";

type Payment = {
  id: string;
  amount: string;
  amountPaid: string | null;
  method: string | null;
  status: string | null;
  month: number;
  year: number;
  paidAt: string | null;
  isAnnulled: boolean | null;
};

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const METHOD_LABELS: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  deposit: "Depósito",
};

function formatCurrency(value: string | number | null) {
  const num = Number(value ?? 0);
  return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

function StatusBadge({ status }: { status: string | null }) {
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
        <Badge className="border border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 line-through">
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

function PaymentRow({ payment }: { payment: Payment }) {
  const period = `${MONTH_NAMES[payment.month - 1]} ${payment.year}`;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{period}</span>
          <StatusBadge status={payment.status} />
        </div>
        <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
          <span>Total: {formatCurrency(payment.amount)}</span>
          <span>Pagado: {formatCurrency(payment.amountPaid)}</span>
          {payment.method && (
            <span>{METHOD_LABELS[payment.method] ?? payment.method}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function TenantPaymentsSheet({
  tenantId,
  tenantName,
  open,
  onOpenChange,
}: {
  tenantId: string | null;
  tenantName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, isLoading } = useTenantPayments(open ? tenantId : null);
  const payments = (data?.payments ?? []) as Payment[];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Pagos de {tenantName}</SheetTitle>
          <SheetDescription>
            Historial completo de pagos registrados
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="space-y-3 px-4 pb-4">
          {isLoading &&
            Array.from({ length: 4 }, (_, i) => `payment-sk-${i}`).map(
              (key) => (
                <div key={key} className="rounded-lg border p-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ),
            )}

          {!isLoading && payments.length === 0 && (
            <div className="rounded-xl border border-dashed py-12 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No hay pagos registrados
              </p>
            </div>
          )}

          {!isLoading &&
            payments.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
