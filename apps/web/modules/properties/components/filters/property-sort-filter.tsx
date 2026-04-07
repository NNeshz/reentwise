"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import type { PropertySortOption } from "@/modules/properties/types/properties.types";

type Props = {
  value: PropertySortOption;
  onValueChange: (value: PropertySortOption) => void;
};

const OPTIONS: { value: PropertySortOption; label: string }[] = [
  { value: "name_asc", label: "Nombre (A–Z)" },
  { value: "occupancy_desc", label: "Ocupación (mayor primero)" },
];

export function PropertySortFilter({ value, onValueChange }: Props) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as PropertySortOption)}>
      <SelectTrigger className="w-[220px] shrink-0">
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
