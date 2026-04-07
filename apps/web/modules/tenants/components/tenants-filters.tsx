"use client";

import { useCallback } from "react";
import { Button } from "@reentwise/ui/src/components/button";
import { IconFilterOff } from "@tabler/icons-react";
import { useTenantsFilters } from "@/modules/tenants/store/use-tenants-filters";
import { useProperties } from "@/modules/properties/hooks/use-properties";
import { TenantSearchFilter } from "@/modules/tenants/components/filters/tenant-search-filter";
import { TenantStatusFilter } from "@/modules/tenants/components/filters/tenant-status-filter";
import { TenantPropertyFilter } from "@/modules/tenants/components/filters/tenant-property-filter";

export function TenantsFilters() {
  const {
    search,
    status,
    propertyId,
    setSearch,
    setStatus,
    setPropertyId,
    resetFilters,
  } = useTenantsFilters();

  const { data: properties = [] } = useProperties();

  const onDebouncedSearch = useCallback(
    (v: string | undefined) => {
      setSearch(v);
    },
    [setSearch],
  );

  const hasActiveFilters =
    (search != null && search.trim() !== "") ||
    status != null ||
    (propertyId != null && propertyId !== "");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        <TenantSearchFilter
          committedSearch={search}
          onDebouncedChange={onDebouncedSearch}
        />
        <TenantStatusFilter
          value={status ?? "all"}
          onValueChange={setStatus}
        />
        <TenantPropertyFilter
          properties={properties}
          value={propertyId}
          onValueChange={setPropertyId}
        />
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
