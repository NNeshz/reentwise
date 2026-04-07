import { create } from "zustand";
import type { PropertySortOption } from "@/modules/properties/types/properties.types";

/**
 * Filtros de listado (búsqueda y orden): Zustand porque aplican al instante
 * sin envío explícito. Los formularios de crear/editar usan React Hook Form
 * por validación fuerte y acción única (submit).
 */

interface PropertiesFiltersStore {
  search: string;
  sortBy: PropertySortOption;
}

interface PropertiesFiltersActions {
  setSearch: (search: string) => void;
  setSortBy: (sortBy: PropertySortOption) => void;
  resetFilters: () => void;
}

const initial: PropertiesFiltersStore = {
  search: "",
  sortBy: "name_asc",
};

export const usePropertiesFilters = create<
  PropertiesFiltersStore & PropertiesFiltersActions
>((set) => ({
  ...initial,
  setSearch: (search) => set({ search }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set({ ...initial }),
}));
