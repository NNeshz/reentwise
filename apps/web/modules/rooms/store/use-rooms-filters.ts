import { create } from "zustand";
import type { RoomListSortOption } from "@/modules/rooms/types/rooms.types";

/**
 * Filtros del listado por propiedad: búsqueda y orden al instante (por `propertyId`).
 * Los formularios de crear/editar usan React Hook Form por submit y validación.
 */

type FilterEntry = {
  search: string;
  sortBy: RoomListSortOption;
};

const defaultEntry = (): FilterEntry => ({
  search: "",
  sortBy: "roomNumber_asc",
});

interface RoomsFiltersState {
  byProperty: Record<string, FilterEntry>;
  setSearch: (propertyId: string, search: string) => void;
  setSortBy: (propertyId: string, sortBy: RoomListSortOption) => void;
  resetFilters: (propertyId: string) => void;
}

function entryFor(
  byProperty: Record<string, FilterEntry>,
  propertyId: string,
): FilterEntry {
  return byProperty[propertyId] ?? defaultEntry();
}

export const useRoomsFiltersStore = create<RoomsFiltersState>((set) => ({
  byProperty: {},
  setSearch: (propertyId, search) =>
    set((s) => ({
      byProperty: {
        ...s.byProperty,
        [propertyId]: { ...entryFor(s.byProperty, propertyId), search },
      },
    })),
  setSortBy: (propertyId, sortBy) =>
    set((s) => ({
      byProperty: {
        ...s.byProperty,
        [propertyId]: { ...entryFor(s.byProperty, propertyId), sortBy },
      },
    })),
  resetFilters: (propertyId) =>
    set((s) => {
      const next = { ...s.byProperty };
      delete next[propertyId];
      return { byProperty: next };
    }),
}));

export function useRoomsFiltersForProperty(propertyId: string) {
  const search = useRoomsFiltersStore(
    (s) => entryFor(s.byProperty, propertyId).search,
  );
  const sortBy = useRoomsFiltersStore(
    (s) => entryFor(s.byProperty, propertyId).sortBy,
  );
  const setSearch = useRoomsFiltersStore((s) => s.setSearch);
  const setSortBy = useRoomsFiltersStore((s) => s.setSortBy);
  const resetFilters = useRoomsFiltersStore((s) => s.resetFilters);

  return {
    search,
    sortBy,
    setSearch: (v: string) => setSearch(propertyId, v),
    setSortBy: (v: RoomListSortOption) => setSortBy(propertyId, v),
    resetFilters: () => resetFilters(propertyId),
  };
}
