"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import type { RoomListSortOption } from "@/modules/rooms/types/rooms.types";

type Props = {
  value: RoomListSortOption;
  onValueChange: (value: RoomListSortOption) => void;
};

const OPTIONS: { value: RoomListSortOption; label: string }[] = [
  { value: "roomNumber_asc", label: "Número (A–Z)" },
  { value: "price_asc", label: "Precio (menor primero)" },
  { value: "price_desc", label: "Precio (mayor primero)" },
  { value: "status", label: "Estado" },
];

export function RoomSortFilter({ value, onValueChange }: Props) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onValueChange(v as RoomListSortOption)}
    >
      <SelectTrigger className="w-[200px] shrink-0">
        <SelectValue placeholder="Ordenar" />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
