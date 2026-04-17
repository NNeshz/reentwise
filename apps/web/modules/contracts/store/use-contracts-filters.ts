import { create } from "zustand";

interface ContractsFiltersStore {
  search?: string;
  page: number;
}

interface ContractsFiltersActions {
  setSearch: (search?: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const initial: ContractsFiltersStore = {
  search: undefined,
  page: 1,
};

export const useContractsFilters = create<
  ContractsFiltersStore & ContractsFiltersActions
>((set) => ({
  ...initial,
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ ...initial }),
}));
