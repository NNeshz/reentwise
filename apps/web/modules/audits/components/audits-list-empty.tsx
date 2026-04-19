export function AuditsListEmpty() {
  return (
    <div className="rounded-xl border border-dashed py-16 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        No hay registros con estos filtros
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Prueba ampliar el rango o limpiar filtros
      </p>
    </div>
  );
}
