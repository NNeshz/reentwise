"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import type { PropertyListItem } from "@/modules/properties/types/properties.types";

type Props = {
  properties: PropertyListItem[];
  value: string | undefined;
  onValueChange: (propertyId: string | undefined) => void;
};

export function TenantPropertyFilter({
  properties,
  value,
  onValueChange,
}: Props) {
  const selectValue = value ?? "all";

  return (
    <Select
      value={selectValue}
      onValueChange={(v) => onValueChange(v === "all" ? undefined : v)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Por propiedad" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas</SelectItem>
        {properties.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
