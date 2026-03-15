import { create } from "zustand";

interface TenantsFiltersStore {
  search?: string;
  status?: "pending" | "partial" | "paid" | "late" | "annulled";
  propertyId?: string;
  page?: number;
}

interface TenantsFiltersActions {
  setSearch: (search?: string) => void;
  setStatus: (
    status?: "pending" | "partial" | "paid" | "late" | "annulled",
  ) => void;
  setPropertyId: (propertyId?: string) => void;
  setPage: (page?: number) => void;
}

export const useTenantsFilters = create<
  TenantsFiltersStore & TenantsFiltersActions
>((set) => ({
  search: "",
  status: undefined,
  propertyId: undefined,
  page: 1,
  setSearch: (search?: string) => set({ search }),
  setStatus: (
    status?: "pending" | "partial" | "paid" | "late" | "annulled",
  ) => set({ status }),
  setPropertyId: (propertyId?: string) => set({ propertyId }),
  setPage: (page?: number) => set({ page }),
}));
