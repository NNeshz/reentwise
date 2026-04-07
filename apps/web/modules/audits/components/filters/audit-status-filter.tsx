"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import type { AuditStatus } from "@/modules/audits/types/audits.types";

type Props = {
  value: AuditStatus | undefined;
  onValueChange: (status: AuditStatus | undefined) => void;
};

export function AuditStatusFilter({ value, onValueChange }: Props) {
  return (
    <Select
      value={value ?? "all"}
      onValueChange={(v) =>
        onValueChange(
          v === "all" ? undefined : (v as AuditStatus),
        )
      }
    >
      <SelectTrigger className="w-full min-w-[140px] sm:w-[160px]">
        <SelectValue placeholder="Estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los estados</SelectItem>
        <SelectItem value="pending">Pendiente</SelectItem>
        <SelectItem value="sending">Enviando</SelectItem>
        <SelectItem value="sent">Enviado</SelectItem>
        <SelectItem value="failed">Fallido</SelectItem>
      </SelectContent>
    </Select>
  );
}
