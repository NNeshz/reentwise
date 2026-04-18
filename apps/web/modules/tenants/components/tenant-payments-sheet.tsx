"use client";

import { Badge } from "@reentwise/ui/src/components/badge";
import { Separator } from "@reentwise/ui/src/components/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@reentwise/ui/src/components/sheet";
import { IconShieldCheck, IconCircleDashed } from "@tabler/icons-react";
import { useTenantPayments } from "@/modules/tenants/hooks/use-tenants";
import { TenantPaymentRow } from "@/modules/tenants/components/tenant-payment-row";
import { TenantPaymentsListSkeleton } from "@/modules/tenants/components/tenant-payments-list-skeleton";
import { TenantPaymentsListEmpty } from "@/modules/tenants/components/tenant-payments-list-empty";
import { TenantPaymentsSheetError } from "@/modules/tenants/components/tenant-payments-sheet-error";
import type { TenantPaymentsContract } from "@/modules/tenants/types/tenants.types";

function DepositRow({ contract }: { contract: TenantPaymentsContract }) {
  if (!contract.deposit || Number(contract.deposit) === 0) return null;

  const amount = Number(contract.deposit).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const collected = !!contract.depositCollectedAt;
  const collectedAmount = contract.depositAmountCollected
    ? Number(contract.depositAmountCollected).toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
      })
    : null;

  const collectedDate = contract.depositCollectedAt
    ? new Date(contract.depositCollectedAt).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900/40">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {collected ? (
            <IconShieldCheck className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <IconCircleDashed className="size-3.5 shrink-0 text-muted-foreground" />
          )}
          <p className="text-sm font-medium text-foreground">Depósito en garantía</p>
          <Badge
            variant="outline"
            className={
              collected
                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                : "border-slate-400/50 bg-slate-500/10 text-slate-700 dark:text-slate-300"
            }
          >
            {collected ? "Cobrado" : "Pendiente"}
          </Badge>
        </div>
        {collectedDate && (
          <p className="mt-0.5 text-xs text-muted-foreground">{collectedDate}</p>
        )}
      </div>
      <div className="text-right tabular-nums">
        <p className="text-sm font-semibold text-foreground">
          {collectedAmount ?? amount}
        </p>
        {collectedAmount && collectedAmount !== amount && (
          <p className="text-xs text-muted-foreground">de {amount}</p>
        )}
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
  const effectiveId = open ? tenantId : null;
  const { data, isPending, error, refetch, isRefetching } =
    useTenantPayments(effectiveId);

  const payments = data?.payments ?? [];
  const contract = data?.contract ?? null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!block overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Pagos de {tenantName}</SheetTitle>
          <SheetDescription>
            Cobros desde el mes de alta del inquilino (fecha de inicio o registro).
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="space-y-3 px-4 pb-4">
          {!isPending && !error && contract && <DepositRow contract={contract} />}

          {isPending ? <TenantPaymentsListSkeleton /> : null}

          {!isPending && error ? (
            <TenantPaymentsSheetError
              error={error}
              onRetry={() => void refetch()}
              isRetrying={isRefetching}
            />
          ) : null}

          {!isPending && !error && payments.length === 0 ? (
            <TenantPaymentsListEmpty />
          ) : null}

          {!isPending && !error
            ? payments.map((payment) => (
                <TenantPaymentRow key={payment.id} payment={payment} />
              ))
            : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
