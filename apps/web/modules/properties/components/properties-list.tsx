"use client";

import * as React from "react";
import { useProperties } from "@/modules/properties/hooks/use-properties";
import { usePropertiesFilters } from "@/modules/properties/store/use-properties-filters";
import type { PropertyListItem } from "@/modules/properties/types/properties.types";
import { PROPERTIES_GRID_CLASS } from "@/modules/properties/lib/property-display";
import { PropertiesCard } from "@/modules/properties/components/properties-card";
import { PropertiesRooms } from "@/modules/properties/components/properties-rooms";
import { PropertiesListSkeleton } from "@/modules/properties/components/properties-list-skeleton";
import { PropertiesListEmpty } from "@/modules/properties/components/properties-list-empty";
import { PropertiesListError } from "@/modules/properties/components/properties-list-error";

function useFilteredSortedProperties(items: PropertyListItem[]) {
  const { search, sortBy } = usePropertiesFilters();

  return React.useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items;
    if (q) {
      list = items.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const addr = p.address?.toLowerCase() ?? "";
        const addrMatch = addr.includes(q);
        return nameMatch || addrMatch;
      });
    }
    const next = [...list];
    if (sortBy === "name_asc") {
      next.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );
    } else {
      next.sort((a, b) => {
        const ra =
          a.totalRooms > 0 ? a.occupiedRooms / a.totalRooms : 0;
        const rb =
          b.totalRooms > 0 ? b.occupiedRooms / b.totalRooms : 0;
        if (rb !== ra) return rb - ra;
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      });
    }
    return next;
  }, [items, search, sortBy]);
}

export function PropertiesList() {
  const [selectedPropertyId, setSelectedPropertyId] = React.useState<
    string | null
  >(null);

  const { data: properties = [], isPending, error, refetch, isRefetching } =
    useProperties();

  const visible = useFilteredSortedProperties(properties);

  if (isPending) {
    return <PropertiesListSkeleton />;
  }

  if (error) {
    return (
      <PropertiesListError
        error={error}
        onRetry={() => void refetch()}
        isRetrying={isRefetching}
      />
    );
  }

  if (properties.length === 0) {
    return <PropertiesListEmpty variant="no-data" />;
  }

  if (visible.length === 0) {
    return <PropertiesListEmpty variant="no-matches" />;
  }

  return (
    <>
      <div className={PROPERTIES_GRID_CLASS}>
        {visible.map((property) => (
          <PropertiesCard
            key={property.id}
            property={property}
            onSelect={(p) => setSelectedPropertyId(p.id)}
          />
        ))}
      </div>
      {selectedPropertyId ? (
        <PropertiesRooms
          propertyId={selectedPropertyId}
          open
          onOpenChange={(open) => !open && setSelectedPropertyId(null)}
        />
      ) : null}
    </>
  );
}
