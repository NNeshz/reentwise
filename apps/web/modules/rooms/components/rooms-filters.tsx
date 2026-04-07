"use client";

import { Button } from "@reentwise/ui/src/components/button";
import { IconFilterOff } from "@tabler/icons-react";
import { useRoomsFiltersForProperty } from "@/modules/rooms/store/use-rooms-filters";
import { RoomSearchFilter } from "@/modules/rooms/components/filters/room-search-filter";
import { RoomSortFilter } from "@/modules/rooms/components/filters/room-sort-filter";

export function RoomsFilters({ propertyId }: { propertyId: string }) {
  const { search, sortBy, setSearch, setSortBy, resetFilters } =
    useRoomsFiltersForProperty(propertyId);

  const hasActiveFilters =
    search.trim() !== "" || sortBy !== "roomNumber_asc";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        <RoomSearchFilter value={search} onChange={setSearch} />
        <RoomSortFilter value={sortBy} onValueChange={setSortBy} />
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
