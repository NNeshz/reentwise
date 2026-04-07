"use client";

export function TenantsListEmpty() {
  return (
    <div className="rounded-xl border border-dashed py-16 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        No hay inquilinos que coincidan con los filtros
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Prueba ajustar la búsqueda o los filtros
      </p>
    </div>
  );
}
