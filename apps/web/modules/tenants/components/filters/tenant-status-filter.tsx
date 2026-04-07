"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import type { TenantPaymentFilterStatus } from "@/modules/tenants/types/tenants.types";

type Props = {
  value: TenantPaymentFilterStatus | "all";
  onValueChange: (value: TenantPaymentFilterStatus | undefined) => void;
};

export function TenantStatusFilter({ value, onValueChange }: Props) {
  return (
    <Select
      value={value}
      onValueChange={(v) =>
        onValueChange(
          v === "all" ? undefined : (v as TenantPaymentFilterStatus),
        )
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Estado de pago" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="pending">Pendiente</SelectItem>
        <SelectItem value="partial">Parcial</SelectItem>
        <SelectItem value="paid">Pagado</SelectItem>
        <SelectItem value="late">Vencido</SelectItem>
        <SelectItem value="annulled">Anulado</SelectItem>
      </SelectContent>
    </Select>
  );
}
