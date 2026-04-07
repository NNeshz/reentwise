import { create } from "zustand";
import type { TenantPaymentFilterStatus } from "@/modules/tenants/types/tenants.types";

/**
 * Filtros del listado owner: Zustand + cambio al instante (búsqueda con debounce
 * en el control de UI). Alta/edición de inquilinos usa React Hook Form en sus pantallas.
 */

interface TenantsFiltersStore {
  search?: string;
  status?: TenantPaymentFilterStatus;
  propertyId?: string;
  page: number;
}

interface TenantsFiltersActions {
  setSearch: (search?: string) => void;
  setStatus: (status?: TenantPaymentFilterStatus) => void;
  setPropertyId: (propertyId?: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const initial: TenantsFiltersStore = {
  search: undefined,
  status: undefined,
  propertyId: undefined,
  page: 1,
};

export const useTenantsFilters = create<
  TenantsFiltersStore & TenantsFiltersActions
>((set) => ({
  ...initial,
  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setPropertyId: (propertyId) => set({ propertyId, page: 1 }),
  setPage: (page) => set({ page: Math.max(1, page) }),
  resetFilters: () => set({ ...initial }),
}));
