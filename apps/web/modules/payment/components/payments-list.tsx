"use client";

import * as React from "react";
import {
  IconBuildingSkyscraper,
  IconBrandWhatsapp,
  IconCash,
} from "@tabler/icons-react";
import { Card } from "@reentwise/ui/src/components/card";
import { Badge } from "@reentwise/ui/src/components/badge";
import { Button } from "@reentwise/ui/src/components/button";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { usePayments } from "@/modules/payment/hooks/use-payments";
import { PaymentModal } from "@/modules/payment/components/payment-modal";
import { usePaymentsFilters } from "@/modules/payment/store/use-payments-filters";

function formatCurrency(value: string | number | null) {
  const num = Number(value ?? 0);
  return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

type PaymentRow = {
  tenant: {
    id: string;
    name: string;
    whatsapp: string;
    roomId: string | null;
    paymentDay: number;
  };
  room: { roomNumber: string } | null;
  payment: {
    id: string;
    amount: string;
    amountPaid: string | null;
    status: string | null;
  } | null;
};

function StatusBadge({
  payment,
  tenant,
  month,
  year,
}: {
  payment: PaymentRow["payment"];
  tenant: PaymentRow["tenant"];
  month: number;
  year: number;
}) {
  if (!payment) {
    const paymentDay = tenant.paymentDay;
    const nextMonthDate = new Date(
      year,
      month,
      paymentDay === 0 ? 0 : paymentDay,
    );
    if (paymentDay === 0) {
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      nextMonthDate.setDate(0);
    }

    const formattedDate = new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "long",
    }).format(nextMonthDate);

    return (
      <Badge className="border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
        Próximo cobro: {formattedDate}
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
        Abono {formatCurrency(amountPaid)} / {formatCurrency(amount)}
      </Badge>
    );
  }

  return (
    <Badge className="border border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-400">
      Debe {formatCurrency(amount)}
    </Badge>
  );
}

function PaymentCard({
  row,
  month,
  year,
  onRegisterPayment,
}: {
  row: PaymentRow;
  month: number;
  year: number;
  onRegisterPayment: (row: PaymentRow) => void;
}) {
  const { tenant, room, payment } = row;
  const hasPendingDebt =
    payment && payment.status !== "paid" && payment.status !== "annulled";

  return (
    <Card className="overflow-hidden p-0 transition-colors">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {tenant.name}
            </span>
            <StatusBadge
              payment={payment}
              tenant={tenant}
              month={month}
              year={year}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {room && (
              <span className="flex items-center gap-1">
                <IconBuildingSkyscraper className="size-3.5" />
                Hab. {room.roomNumber}
              </span>
            )}
            <span className="flex items-center gap-1">
              <IconBrandWhatsapp className="size-3.5" />
              {tenant.whatsapp}
            </span>
          </div>
        </div>

        {hasPendingDebt && (
          <Button
            size="sm"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onRegisterPayment(row)}
          >
            <IconCash className="size-4" />
            Registrar Pago
          </Button>
        )}
      </div>
    </Card>
  );
}

function PaymentCardSkeleton() {
  return (
    <Card className="p-0">
      <div className="flex items-center justify-between p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
        <Skeleton className="h-8 w-28" />
      </div>
    </Card>
  );
}

export function PaymentsList() {
  const { data, isLoading, isError, refetch } = usePayments();
  const { month, year } = usePaymentsFilters();
  const [selectedRow, setSelectedRow] = React.useState<PaymentRow | null>(null);

  const rows = (Array.isArray(data) ? data : []) as PaymentRow[];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <PaymentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">
          Error al cargar los pagos
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Intenta de nuevo más tarde
        </p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No hay pagos que coincidan con los filtros
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Prueba ajustar la búsqueda o los filtros
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {rows.length} inquilino{rows.length !== 1 ? "s" : ""}
        </span>
      </div>
      <ul className="space-y-3" role="list">
        {rows.map((row) => (
          <li key={row.tenant.id}>
            <PaymentCard
              row={row}
              month={month}
              year={year}
              onRegisterPayment={setSelectedRow}
            />
          </li>
        ))}
      </ul>

      {selectedRow?.payment && (
        <PaymentModal
          isOpen={!!selectedRow}
          onClose={() => setSelectedRow(null)}
          onSuccess={() => refetch()}
          paymentId={selectedRow.payment.id}
          tenantName={selectedRow.tenant.name}
          totalAmount={Number(selectedRow.payment.amount)}
          amountPaid={Number(selectedRow.payment.amountPaid ?? 0)}
        />
      )}
    </div>
  );
}
