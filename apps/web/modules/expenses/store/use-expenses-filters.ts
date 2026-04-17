import { create } from "zustand";
import type { ExpenseCategory } from "@/modules/expenses/types/expenses.types";

interface ExpensesFiltersStore {
  category?: ExpenseCategory;
  propertyId?: string;
  year?: number;
  month?: number;
}

interface ExpensesFiltersActions {
  setCategory: (category?: ExpenseCategory) => void;
  setPropertyId: (propertyId?: string) => void;
  setYear: (year?: number) => void;
  setMonth: (month?: number) => void;
  resetFilters: () => void;
}

const initial: ExpensesFiltersStore = {
  category: undefined,
  propertyId: undefined,
  year: undefined,
  month: undefined,
};

export const useExpensesFilters = create<
  ExpensesFiltersStore & ExpensesFiltersActions
>((set) => ({
  ...initial,
  setCategory: (category) => set({ category }),
  setPropertyId: (propertyId) => set({ propertyId }),
  setYear: (year) => set({ year, month: undefined }),
  setMonth: (month) => set({ month }),
  resetFilters: () => set({ ...initial }),
}));
