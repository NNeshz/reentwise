import { create } from "zustand";

interface PaymentsFiltersState {
  search: string;
  status?: "pending" | "partial" | "paid";
  month: number;
  year: number;
}

interface PaymentsFiltersActions {
  setSearch: (search: string) => void;
  setStatus: (status?: "pending" | "partial" | "paid") => void;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
}

const now = new Date();

export const usePaymentsFilters = create<
  PaymentsFiltersState & PaymentsFiltersActions
>((set) => ({
  search: "",
  status: undefined,
  month: now.getMonth() + 1,
  year: now.getFullYear(),
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  setMonth: (month) => set({ month }),
  setYear: (year) => set({ year }),
}));
