"use client";

export function ExpensesListEmpty() {
  return (
    <div className="rounded-xl border border-dashed py-16 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        Aún no has registrado ningún gasto
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Usa el botón &quot;Nuevo gasto&quot; para agregar el primero
      </p>
    </div>
  );
}
