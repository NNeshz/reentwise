"use client";

export function TenantPaymentsListEmpty() {
  return (
    <div className="rounded-xl border border-dashed py-12 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        No hay pagos registrados
      </p>
    </div>
  );
}
