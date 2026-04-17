import { create } from "zustand";
import type { PaymentStatusFilter } from "@/modules/payment/types/payment.types";

/**
 * Mes/año y filtros de listado en Zustand (aplican al instante; búsqueda con debounce en UI).
 * Registrar pago: modal con estado local y submit explícito (sin RHF por simplicidad del flujo).
 */

const now = new Date();

interface PaymentsFiltersState {
  search: string;
  status?: PaymentStatusFilter;
  month: number;
  year: number;
  page: number;
}

interface PaymentsFiltersActions {
  setSearch: (search: string) => void;
  setStatus: (status?: PaymentStatusFilter) => void;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const calendarNow: PaymentsFiltersState = {
  search: "",
  status: undefined,
  month: now.getMonth() + 1,
  year: now.getFullYear(),
  page: 1,
};

export const usePaymentsFilters = create<
  PaymentsFiltersState & PaymentsFiltersActions
>((set) => ({
  ...calendarNow,
  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setMonth: (month) => set({ month, page: 1 }),
  setYear: (year) => set({ year, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ ...calendarNow }),
}));
