"use client";

import { useEffect, useState } from "react";
import { Input } from "@reentwise/ui/src/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import { useTenantsFilters } from "@/modules/tenants/store/use-tenants-filte";
import { useProperties } from "@/modules/properties/hooks/use-properties";
import { useDebounce } from "@/utils/use-debounce";

const SEARCH_DEBOUNCE_MS = 300;

export function TenantsFilters() {
  const { search, status, propertyId, setSearch, setStatus, setPropertyId } =
    useTenantsFilters();
  const { data: propertiesData } = useProperties();
  const properties = Array.isArray(propertiesData) ? propertiesData : [];

  const [inputValue, setInputValue] = useState(search ?? "");
  const debouncedSearch = useDebounce(inputValue, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setSearch(debouncedSearch.trim() || undefined);
  }, [debouncedSearch, setSearch]);

  useEffect(() => {
    if (search === undefined || search === "") {
      setInputValue("");
    }
  }, [search]);

  return (
    <div className="flex flex-wrap gap-2">
      <Input
        placeholder="Buscar nombre o WhatsApp"
        className="w-full max-w-xs"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Select
        value={status ?? "all"}
        onValueChange={(value) =>
          setStatus(
            value === "all" ? undefined : (value as "pending" | "partial" | "paid" | "late" | "annulled"),
          )
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar estado" />
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
      <Select
        value={propertyId ?? "all"}
        onValueChange={(value) => setPropertyId(value === "all" ? undefined : value)}
      >
        <SelectTrigger>
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
    </div>
  )
}