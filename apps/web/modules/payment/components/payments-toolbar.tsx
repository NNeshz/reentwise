"use client";

import { useCallback, useRef } from "react";
import { IconSearch } from "@tabler/icons-react";
import { Input } from "@reentwise/ui/src/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import { usePaymentsFilters } from "@/modules/payment/store/use-payments-filters";

export function PaymentsToolbar() {
  const { search, status, setSearch, setStatus } = usePaymentsFilters();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSearch(value);
      }, 300);
    },
    [setSearch],
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          defaultValue={search}
          onChange={handleSearchChange}
          placeholder="Buscar nombre o WhatsApp..."
          className="pl-9"
        />
      </div>
      <Select
        value={status ?? "all"}
        onValueChange={(value) =>
          setStatus(
            value === "all"
              ? undefined
              : (value as "pending" | "partial" | "paid"),
          )
        }
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pending">Pendientes</SelectItem>
          <SelectItem value="partial">Abono parcial</SelectItem>
          <SelectItem value="paid">Al corriente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
