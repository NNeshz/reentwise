"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import type { AuditChannel } from "@/modules/audits/types/audits.types";

type Props = {
  value: AuditChannel | undefined;
  onValueChange: (channel: AuditChannel | undefined) => void;
};

export function AuditChannelFilter({ value, onValueChange }: Props) {
  return (
    <Select
      value={value ?? "all"}
      onValueChange={(v) =>
        onValueChange(
          v === "all" ? undefined : (v as AuditChannel),
        )
      }
    >
      <SelectTrigger className="w-full min-w-[140px] sm:w-[160px]">
        <SelectValue placeholder="Canal" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los canales</SelectItem>
        <SelectItem value="email">Correo</SelectItem>
        <SelectItem value="whatsapp">WhatsApp</SelectItem>
      </SelectContent>
    </Select>
  );
}
