"use client";

type Variant = "no-data" | "no-matches";

const COPY: Record<
  Variant,
  { title: string; hint: string }
> = {
  "no-data": {
    title: "No hay propiedades todavía",
    hint: "Agrega una propiedad para empezar a gestionar cuartos e inquilinos.",
  },
  "no-matches": {
    title: "Ninguna propiedad coincide con la búsqueda",
    hint: "Prueba otro término o limpia los filtros.",
  },
};

export function PropertiesListEmpty({ variant }: { variant: Variant }) {
  const { title, hint } = COPY[variant];

  return (
    <div className="rounded-xl border border-dashed py-16 text-center">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
