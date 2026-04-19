"use client";

import { Separator } from "@reentwise/ui/src/components/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@reentwise/ui/src/components/sheet";
import { useTenantPayments } from "@/modules/tenants/hooks/use-tenants";
import { TenantPaymentRow } from "@/modules/tenants/components/tenant-payment-row";
import { TenantPaymentsListSkeleton } from "@/modules/tenants/components/tenant-payments-list-skeleton";
import { TenantPaymentsListEmpty } from "@/modules/tenants/components/tenant-payments-list-empty";
import { TenantPaymentsSheetError } from "@/modules/tenants/components/tenant-payments-sheet-error";

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

        <div className="space-y-3 px-4 pt-4 pb-4">
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
