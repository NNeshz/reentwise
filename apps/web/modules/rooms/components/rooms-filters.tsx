"use client";

import { Button } from "@reentwise/ui/src/components/button";
import { IconFilterOff } from "@tabler/icons-react";
import { useRoomsFiltersForProperty } from "@/modules/rooms/store/use-rooms-filters";
import { RoomSearchFilter } from "@/modules/rooms/components/filters/room-search-filter";

export function RoomsFilters({ propertyId }: { propertyId: string }) {
  const { search, setSearch, resetFilters } =
    useRoomsFiltersForProperty(propertyId);

  const hasActiveFilters = search.trim() !== "";

  return (
    <div className="flex items-center gap-2">
      <RoomSearchFilter value={search} onChange={setSearch} />
      {hasActiveFilters ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => resetFilters()}
        >
          <IconFilterOff className="size-4" />
          Limpiar
        </Button>
      ) : null}
    </div>
  );
}
