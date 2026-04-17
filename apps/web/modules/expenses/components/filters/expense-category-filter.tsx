"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import type { ExpenseCategory } from "@/modules/expenses/types/expenses.types";
import { EXPENSE_CATEGORY_OPTIONS } from "@/modules/expenses/lib/expense-display";

type Props = {
  value: ExpenseCategory | undefined;
  onValueChange: (category: ExpenseCategory | undefined) => void;
};

export function ExpenseCategoryFilter({ value, onValueChange }: Props) {
  return (
    <Select
      value={value ?? "all"}
      onValueChange={(v) =>
        onValueChange(v === "all" ? undefined : (v as ExpenseCategory))
      }
    >
      <SelectTrigger className="w-full min-w-[140px] sm:w-[160px]">
        <SelectValue placeholder="Categoría" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas las categorías</SelectItem>
        {EXPENSE_CATEGORY_OPTIONS.map(({ value: v, label }) => (
          <SelectItem key={v} value={v}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
