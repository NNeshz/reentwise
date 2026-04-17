"use client";

export function ContractsListEmpty() {
  return (
    <div className="rounded-xl border border-dashed py-16 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        No se encontraron contratos
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Los contratos se crean al asignar un inquilino a una habitación
      </p>
    </div>
  );
}
