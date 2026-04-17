import { create } from "zustand";

interface ContractsFiltersStore {
  search?: string;
}

interface ContractsFiltersActions {
  setSearch: (search?: string) => void;
  resetFilters: () => void;
}

const initial: ContractsFiltersStore = {
  search: undefined,
};

export const useContractsFilters = create<
  ContractsFiltersStore & ContractsFiltersActions
>((set) => ({
  ...initial,
  setSearch: (search) => set({ search }),
  resetFilters: () => set({ ...initial }),
}));
