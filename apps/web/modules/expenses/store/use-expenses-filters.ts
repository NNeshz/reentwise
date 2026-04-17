import { create } from "zustand";
import type { ExpenseCategory } from "@/modules/expenses/types/expenses.types";

interface ExpensesFiltersStore {
  category?: ExpenseCategory;
  propertyId?: string;
  year?: number;
  month?: number;
  page: number;
}

interface ExpensesFiltersActions {
  setCategory: (category?: ExpenseCategory) => void;
  setPropertyId: (propertyId?: string) => void;
  setYear: (year?: number) => void;
  setMonth: (month?: number) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const initial: ExpensesFiltersStore = {
  category: undefined,
  propertyId: undefined,
  year: undefined,
  month: undefined,
  page: 1,
};

export const useExpensesFilters = create<
  ExpensesFiltersStore & ExpensesFiltersActions
>((set) => ({
  ...initial,
  setCategory: (category) => set({ category, page: 1 }),
  setPropertyId: (propertyId) => set({ propertyId, page: 1 }),
  setYear: (year) => set({ year, month: undefined, page: 1 }),
  setMonth: (month) => set({ month, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ ...initial }),
}));
