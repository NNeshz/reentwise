"use client";

/**
 * Modal de registro de pago: estado local + submit nativo (sin RHF por formulario corto).
 * Filtros del listado siguen en Zustand (`use-payments-filters`).
 */

import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@reentwise/ui/src/components/dialog";
import { Input } from "@reentwise/ui/src/components/input";
import { Label } from "@reentwise/ui/src/components/label";
import { Button } from "@reentwise/ui/src/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import { usePayPayment } from "@/modules/payment/hooks/use-payments";
import { formatPaymentCurrency } from "@/modules/payment/lib/payment-display";
import type { PaymentMethod } from "@/modules/payment/types/payment.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  paymentId: string;
  tenantName: string;
  totalAmount: number;
  amountPaid: number;
};

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  paymentId,
  tenantName,
  totalAmount,
  amountPaid,
}: Props) {
  const remaining = totalAmount - amountPaid;

  const [amount, setAmount] = useState(String(remaining));
  const [method, setMethod] = useState<PaymentMethod>("cash");

  const { mutate, isPending } = usePayPayment();

  const parsedAmount = Number(amount);
  const isValid =
    !Number.isNaN(parsedAmount) &&
    parsedAmount > 0 &&
    parsedAmount <= remaining;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    mutate(
      { paymentId, paymentAmount: parsedAmount, method },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      },
    );
  }

  function handleOpenChange(open: boolean) {
    if (!open && !isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Registrar pago de {tenantName}</DialogTitle>
            <DialogDescription>
              Deuda total: {formatPaymentCurrency(totalAmount)}. Restante:{" "}
              {formatPaymentCurrency(remaining)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pay-amount">Monto a pagar hoy ($)</Label>
              <Input
                id="pay-amount"
                type="number"
                min={1}
                max={remaining}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Método de pago</Label>
              <Select
                value={method}
                onValueChange={(v) => setMethod(v as PaymentMethod)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Efectivo</SelectItem>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                  <SelectItem value="deposit">Depósito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || isPending}>
              {isPending ? "Procesando..." : "Confirmar pago"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
