import { cn } from "@reentwise/ui/src/lib/utils";
import type { ExpenseCategory } from "@/modules/expenses/types/expenses.types";

export const EXPENSES_LIST_STACK_CLASS = "space-y-3";

/** Columnas alineadas entre cabecera y filas; scroll horizontal en pantallas angostas. */
export const EXPENSES_TABLE_GRID_CLASS =
  "grid w-full min-w-[640px] grid-cols-[9rem_8rem_minmax(8rem,14rem)_minmax(0,1fr)_7rem_2.5rem] gap-x-3";

export function expensesTableHeaderRowClassName(extra?: string): string {
  return cn(EXPENSES_TABLE_GRID_CLASS, "py-2.5", extra);
}

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  maintenance: "Mantenimiento",
  repair: "Reparación",
  tax: "Impuesto",
  insurance: "Seguro",
  utility: "Servicios",
  administration: "Administración",
  other: "Otro",
};

export const EXPENSE_CATEGORY_OPTIONS: {
  value: ExpenseCategory;
  label: string;
}[] = [
  { value: "maintenance", label: "Mantenimiento" },
  { value: "repair", label: "Reparación" },
  { value: "tax", label: "Impuesto" },
  { value: "insurance", label: "Seguro" },
  { value: "utility", label: "Servicios" },
  { value: "administration", label: "Administración" },
  { value: "other", label: "Otro" },
];

export function formatExpenseCurrency(value: string | number | null) {
  const num = Number(value ?? 0);
  return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export function formatExpenseDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
