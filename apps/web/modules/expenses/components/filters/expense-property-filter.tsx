"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";

type PropertyOption = { id: string; name: string };

type Props = {
  value: string | undefined;
  onValueChange: (propertyId: string | undefined) => void;
  properties: PropertyOption[];
  isLoading?: boolean;
};

export function ExpensePropertyFilter({
  value,
  onValueChange,
  properties,
  isLoading,
}: Props) {
  return (
    <Select
      value={value ?? "all"}
      onValueChange={(v) => onValueChange(v === "all" ? undefined : v)}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full min-w-[140px] sm:w-[180px]">
        <SelectValue placeholder="Propiedad" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas las propiedades</SelectItem>
        {properties.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
