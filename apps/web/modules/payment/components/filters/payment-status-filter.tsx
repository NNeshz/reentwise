"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import type { PaymentStatusFilter } from "@/modules/payment/types/payment.types";

type Props = {
  value: PaymentStatusFilter | "all";
  onValueChange: (value: PaymentStatusFilter | undefined) => void;
};

export function PaymentStatusFilter({ value, onValueChange }: Props) {
  return (
    <Select
      value={value}
      onValueChange={(v) =>
        onValueChange(v === "all" ? undefined : (v as PaymentStatusFilter))
      }
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="pending">Pendientes</SelectItem>
        <SelectItem value="partial">Abono parcial</SelectItem>
        <SelectItem value="paid">Al corriente</SelectItem>
      </SelectContent>
    </Select>
  );
}
