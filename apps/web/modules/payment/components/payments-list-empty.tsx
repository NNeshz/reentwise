export function PaymentsListEmpty() {
  return (
    <div className="rounded-xl bg-muted/10 py-16 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        No hay pagos que coincidan con los filtros
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Prueba ajustar el mes, el año o los filtros
      </p>
    </div>
  );
}
