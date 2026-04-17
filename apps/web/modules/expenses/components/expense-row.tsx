"use client";

import { Button } from "@reentwise/ui/src/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reentwise/ui/src/components/dropdown-menu";
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react";
import type { ExpenseListRow } from "@/modules/expenses/types/expenses.types";
import {
  EXPENSES_TABLE_GRID_CLASS,
  EXPENSE_CATEGORY_LABELS,
  formatExpenseCurrency,
  formatExpenseDate,
} from "@/modules/expenses/lib/expense-display";

export type ExpenseRowAction = "edit" | "delete";

type DialogTarget = {
  expense: ExpenseListRow;
  action: ExpenseRowAction;
};

type Props = {
  row: ExpenseListRow;
  onAction: (target: DialogTarget) => void;
};

export function ExpenseRow({ row, onAction }: Props) {
  const { expense, property, room } = row;
  const categoryLabel = EXPENSE_CATEGORY_LABELS[expense.category] ?? expense.category;

  const locationParts: string[] = [];
  if (property) locationParts.push(property.name);
  if (room) locationParts.push(`Cuarto ${room.roomNumber}`);
  const locationText = locationParts.length > 0 ? locationParts.join(" · ") : "—";

  return (
    <li className="py-1 text-sm">
      <div className={`${EXPENSES_TABLE_GRID_CLASS} items-center`}>
        <span className="font-mono text-xs text-muted-foreground">
          {formatExpenseDate(expense.incurredAt)}
        </span>

        <span className="text-sm text-foreground">
          {categoryLabel}
        </span>

        <span className="min-w-0 text-xs text-muted-foreground">
          <span className="line-clamp-2">{locationText}</span>
        </span>

        <span className="min-w-0">
          <span className="line-clamp-1 font-medium text-foreground">
            {expense.description || categoryLabel}
          </span>
          {expense.vendor && (
            <span className="line-clamp-1 text-xs text-muted-foreground">
              {expense.vendor}
            </span>
          )}
        </span>

        <span className="text-right font-semibold tabular-nums text-foreground">
          {formatExpenseCurrency(expense.amount)}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground"
            >
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => onAction({ expense: row, action: "edit" })}
              >
                <IconPencil className="size-4" />
                Editar
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => onAction({ expense: row, action: "delete" })}
              >
                <IconTrash className="size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}
