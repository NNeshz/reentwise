import { expensesTableHeaderRowClassName } from "@/modules/expenses/lib/expense-display";

export function ExpensesTableHeader() {
  return (
    <div className={expensesTableHeaderRowClassName()}>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Fecha
      </div>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Categoría
      </div>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Ubicación
      </div>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Descripción / Proveedor
      </div>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground text-right">
        Importe
      </div>
      <div />
    </div>
  );
}
