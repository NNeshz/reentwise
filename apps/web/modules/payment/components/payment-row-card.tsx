"use client";

import {
  IconBuildingSkyscraper,
  IconBrandWhatsapp,
  IconCash,
} from "@tabler/icons-react";
import { Card } from "@reentwise/ui/src/components/card";
import { Button } from "@reentwise/ui/src/components/button";
import type { PaymentListRow } from "@/modules/payment/types/payment.types";
import { paymentRowHasPendingDebt } from "@/modules/payment/lib/payment-display";
import { PaymentListStatusBadge } from "@/modules/payment/components/payment-list-status-badge";

type Props = {
  row: PaymentListRow;
  month: number;
  year: number;
  onRegisterPayment: (row: PaymentListRow) => void;
};

export function PaymentRowCard({
  row,
  month,
  year,
  onRegisterPayment,
}: Props) {
  const { tenant, room, payment } = row;
  const hasPendingDebt = paymentRowHasPendingDebt(row);

  return (
    <Card className="overflow-hidden p-0 transition-colors">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {tenant.name}
            </span>
            <PaymentListStatusBadge
              payment={payment}
              tenant={tenant}
              month={month}
              year={year}
            />
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
        </div>

        {hasPendingDebt ? (
          <Button
            size="sm"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onRegisterPayment(row)}
          >
            <IconCash className="size-4" />
            Registrar pago
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
