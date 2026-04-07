"use client";

import { Button } from "@reentwise/ui/src/components/button";
import { IconFilterOff } from "@tabler/icons-react";
import { usePropertiesFilters } from "@/modules/properties/store/use-properties-filters";
import { PropertySearchFilter } from "@/modules/properties/components/filters/property-search-filter";
import { PropertySortFilter } from "@/modules/properties/components/filters/property-sort-filter";

export function PropertiesFilters() {
  const { search, sortBy, setSearch, setSortBy, resetFilters } =
    usePropertiesFilters();

  const hasActiveFilters = search.trim() !== "" || sortBy !== "name_asc";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        <PropertySearchFilter value={search} onChange={setSearch} />
        <PropertySortFilter value={sortBy} onValueChange={setSortBy} />
      </div>
      {hasActiveFilters ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => resetFilters()}
        >
          <IconFilterOff className="size-4" />
          Limpiar filtros
        </Button>
      ) : null}
    </div>
  );
}
