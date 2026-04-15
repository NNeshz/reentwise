"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@reentwise/ui/src/components/button";
import { IconPlus } from "@tabler/icons-react";

const ExpenseCreateSheet = dynamic(
  () =>
    import("@/modules/expenses/components/expense-create-sheet").then(
      (m) => m.ExpenseCreateSheet,
    ),
  { ssr: false },
);

export function ExpensesHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex w-full flex-col text-left md:w-auto md:gap-1">
          <h1 className="text-2xl font-bold">Gastos</h1>
          <p className="text-sm text-muted-foreground">
            Registra y gestiona los gastos de tus propiedades.
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
          <IconPlus className="size-4" />
          Nuevo gasto
        </Button>
      </div>
      {open && <ExpenseCreateSheet open={open} onOpenChange={setOpen} />}
    </>
  );
}
