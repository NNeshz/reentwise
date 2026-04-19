"use client";

import {
  IconBuildingSkyscraper,
  IconBrandWhatsapp,
  IconCash,
  IconEye,
} from "@tabler/icons-react";
import { Card } from "@reentwise/ui/src/components/card";
import { Button } from "@reentwise/ui/src/components/button";
import { Badge } from "@reentwise/ui/src/components/badge";
import type { PaymentListRow } from "@/modules/payment/types/payment.types";
import {
  paymentRowHasPendingDebt,
  formatPaymentCurrency,
} from "@/modules/payment/lib/payment-display";
import { PaymentListStatusBadge } from "@/modules/payment/components/payment-list-status-badge";
import { REASON_META } from "@/modules/payment/components/payment-row";

type Props = {
  row: PaymentListRow;
  month: number;
  year: number;
  onRegisterPayment: (row: PaymentListRow) => void;
  onViewPayments: (row: PaymentListRow) => void;
};

export function PaymentRowCard({
  row,
  month,
  year,
  onRegisterPayment,
  onViewPayments,
}: Props) {
  const { tenant, room, payment } = row;
  const hasPendingDebt = paymentRowHasPendingDebt(row);
  const reason = payment?.reason ?? "rent";
  const meta = REASON_META[reason];
  const ReasonIcon = meta.icon;

  return (
    <Card className="overflow-hidden p-0 transition-colors">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-foreground">
              {tenant.name}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <PaymentListStatusBadge
                payment={payment}
                tenant={tenant}
                month={month}
                year={year}
              />
              <Badge
                variant="outline"
                className={`flex items-center gap-1 text-[10px] ${meta.className}`}
              >
                <ReasonIcon className="size-3" />
                {meta.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {room ? (
            <span className="flex items-center gap-1">
              <IconBuildingSkyscraper className="size-3.5" />
              Hab. {room.roomNumber}
            </span>
          ) : null}
          <span className="flex items-center gap-1">
            <IconBrandWhatsapp className="size-3.5" />
            {tenant.whatsapp}
          </span>
        </div>

        {payment && (
          <div className="flex gap-6 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Total</span>
              <span className="tabular-nums font-medium text-foreground">
                {formatPaymentCurrency(payment.amount)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Pagado</span>
              <span className="tabular-nums text-muted-foreground">
                {formatPaymentCurrency(payment.amountPaid ?? 0)}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onViewPayments(row)}
          >
            <IconEye className="size-4" />
            Ver detalles
          </Button>
          {hasPendingDebt && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onRegisterPayment(row)}
            >
              <IconCash className="size-4" />
              Registrar pago
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
