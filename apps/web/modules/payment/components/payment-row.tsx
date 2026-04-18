"use client";

import { IconDotsVertical, IconEye, IconCash } from "@tabler/icons-react";
import { Button } from "@reentwise/ui/src/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reentwise/ui/src/components/dropdown-menu";
import type { PaymentListRow } from "@/modules/payment/types/payment.types";
import {
  PAYMENTS_TABLE_GRID_CLASS,
  formatPaymentCurrency,
  paymentRowHasPendingDebt,
} from "@/modules/payment/lib/payment-display";
import { PaymentListStatusBadge } from "@/modules/payment/components/payment-list-status-badge";

type Props = {
  row: PaymentListRow;
  month: number;
  year: number;
  onRegisterPayment: (row: PaymentListRow) => void;
  onViewPayments: (row: PaymentListRow) => void;
};

export function PaymentRow({
  row,
  month,
  year,
  onRegisterPayment,
  onViewPayments,
}: Props) {
  const { tenant, room, payment } = row;
  const hasPendingDebt = paymentRowHasPendingDebt(row);

  return (
    <li className="py-1 text-sm">
      <div className={PAYMENTS_TABLE_GRID_CLASS}>
        {/* Inquilino */}
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{tenant.name}</p>
          <p className="truncate text-xs text-muted-foreground">{tenant.whatsapp}</p>
        </div>

        {/* Habitación */}
        <span className="text-xs text-muted-foreground">
          {room ? `Hab. ${room.roomNumber}` : "—"}
        </span>

        {/* Estado */}
        <div>
          <PaymentListStatusBadge
            payment={payment}
            tenant={tenant}
            month={month}
            year={year}
          />
        </div>

        {/* Total */}
        <span className="tabular-nums text-xs text-foreground">
          {payment ? formatPaymentCurrency(payment.amount) : "—"}
        </span>

        {/* Pagado */}
        <span className="tabular-nums text-xs text-muted-foreground">
          {payment ? formatPaymentCurrency(payment.amountPaid ?? 0) : "—"}
        </span>

        {/* Acciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground"
            >
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => onViewPayments(row)}>
                <IconEye className="size-4" />
                Ver pagos y detalles
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {hasPendingDebt && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={() => onRegisterPayment(row)}>
                    <IconCash className="size-4" />
                    Registrar pago
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}
