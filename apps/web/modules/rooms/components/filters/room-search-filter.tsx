"use client";

import { Input } from "@reentwise/ui/src/components/input";
import { IconSearch } from "@tabler/icons-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function RoomSearchFilter({ value, onChange }: Props) {
  return (
    <div className="relative min-w-[180px] max-w-sm flex-1">
      <IconSearch
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        placeholder="Buscar número o notas"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
        autoComplete="off"
      />
    </div>
  );
}
