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
}

interface PaymentsFiltersActions {
  setSearch: (search: string) => void;
  setStatus: (status?: PaymentStatusFilter) => void;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  resetFilters: () => void;
}

const calendarNow: PaymentsFiltersState = {
  search: "",
  status: undefined,
  month: now.getMonth() + 1,
  year: now.getFullYear(),
};

export const usePaymentsFilters = create<
  PaymentsFiltersState & PaymentsFiltersActions
>((set) => ({
  ...calendarNow,
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  setMonth: (month) => set({ month }),
  setYear: (year) => set({ year }),
  resetFilters: () => set({ ...calendarNow }),
}));
