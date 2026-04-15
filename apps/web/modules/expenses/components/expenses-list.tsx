"use client";

import { useState } from "react";
import { useExpenses } from "@/modules/expenses/hooks/use-expenses";
import type { ExpenseListRow } from "@/modules/expenses/types/expenses.types";
import { EXPENSES_LIST_STACK_CLASS } from "@/modules/expenses/lib/expense-display";
import {
  ExpenseRowCard,
  type ExpenseRowAction,
} from "@/modules/expenses/components/expense-row-card";
import { ExpenseEditSheet } from "@/modules/expenses/components/expense-edit-sheet";
import { ExpenseDeleteDialog } from "@/modules/expenses/components/expense-delete-dialog";
import { ExpensesListSkeleton } from "@/modules/expenses/components/expenses-list-skeleton";
import { ExpensesListEmpty } from "@/modules/expenses/components/expenses-list-empty";
import { ExpensesListError } from "@/modules/expenses/components/expenses-list-error";

type DialogTarget = {
  expense: ExpenseListRow;
  action: ExpenseRowAction;
};

export function ExpensesList() {
  const { data, isPending, error, refetch, isRefetching } = useExpenses();

  const [dialogTarget, setDialogTarget] = useState<DialogTarget | null>(null);

  const expenses = data ?? [];
  const activeExpense = dialogTarget?.expense ?? null;

  function closeDialog() {
    setDialogTarget(null);
  }

  if (isPending) {
    return <ExpensesListSkeleton />;
  }

  if (error) {
    return (
      <ExpensesListError
        error={error}
        onRetry={() => void refetch()}
        isRetrying={isRefetching}
      />
    );
  }

  if (expenses.length === 0) {
    return <ExpensesListEmpty />;
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        {expenses.length} gasto{expenses.length !== 1 ? "s" : ""} registrado
        {expenses.length !== 1 ? "s" : ""}
      </p>

      <ul className={EXPENSES_LIST_STACK_CLASS} role="list">
        {expenses.map((row) => (
          <li key={row.expense.id}>
            <ExpenseRowCard row={row} onAction={setDialogTarget} />
          </li>
        ))}
      </ul>

      <ExpenseEditSheet
        row={activeExpense}
        open={dialogTarget?.action === "edit"}
        onOpenChange={(v: boolean) => {
          if (!v) closeDialog();
        }}
      />

      <ExpenseDeleteDialog
        expenseId={activeExpense?.expense.id ?? null}
        description={
          activeExpense?.expense.description ??
          activeExpense?.expense.category ??
          ""
        }
        open={dialogTarget?.action === "delete"}
        onOpenChange={(v: boolean) => {
          if (!v) closeDialog();
        }}
      />
    </div>
  );
}
