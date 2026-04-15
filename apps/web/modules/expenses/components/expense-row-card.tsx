"use client";

import { Card } from "@reentwise/ui/src/components/card";
import { Badge } from "@reentwise/ui/src/components/badge";
import { Button } from "@reentwise/ui/src/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reentwise/ui/src/components/dropdown-menu";
import {
  IconDotsVertical,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import type { ExpenseListRow } from "@/modules/expenses/types/expenses.types";
import {
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

export function ExpenseRowCard({ row, onAction }: Props) {
  const { expense, property, room } = row;
  const categoryLabel =
    EXPENSE_CATEGORY_LABELS[expense.category] ?? expense.category;

  const locationParts: string[] = [];
  if (property) locationParts.push(property.name);
  if (room) locationParts.push(`Cuarto ${room.roomNumber}`);
  const locationText = locationParts.length > 0 ? locationParts.join(" · ") : null;

  return (
    <Card className="overflow-hidden p-0 transition-colors">
      <div className="flex items-center gap-4 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
          {categoryLabel.slice(0, 3).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {expense.description || categoryLabel}
            </p>
            <Badge variant="outline" className="shrink-0 text-[10px]">
              {categoryLabel}
            </Badge>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
            <span>{formatExpenseDate(expense.incurredAt)}</span>
            {locationText && <span className="truncate">{locationText}</span>}
            {expense.vendor && (
              <span className="truncate">{expense.vendor}</span>
            )}
          </div>
        </div>

        <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
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
    </Card>
  );
}
