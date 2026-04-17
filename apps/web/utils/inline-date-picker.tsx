"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IconCalendar } from "@tabler/icons-react";
import { Button } from "@reentwise/ui/src/components/button";
import { Calendar } from "@reentwise/ui/src/components/calendar";

/** Parsea YYYY-MM-DD evitando el desplazamiento de zona horaria. */
export function parseDateString(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const parts = value.slice(0, 10).split("-").map(Number);
  if (parts.length < 3 || parts.some((n) => isNaN(n))) return undefined;
  const [y, m, d] = parts as [number, number, number];
  const date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) return undefined;
  return date;
}

/** Retorna la fecha local de hoy como YYYY-MM-DD (sin desvío UTC). */
export function todayLocalDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Convierte cualquier string de fecha (ISO, Date.toString(), etc.) a YYYY-MM-DD
 * usando la fecha local para evitar desvíos de zona horaria.
 */
export function isoToDateInput(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  // Si ya viene en formato YYYY-MM-DD (con o sin hora ISO), extrae directo
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.slice(0, 10);
  // Fallback: parsea el string (ej. Date.toString()) y usa la hora local
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Convierte YYYY-MM-DD a un ISO string usando la medianoche local
 * para que la fecha elegida coincida en cualquier zona horaria.
 */
export function dateInputToIso(dateStr: string): string {
  const d = parseDateString(dateStr);
  if (!d) return new Date(dateStr).toISOString();
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

type Props = {
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  placeholder: string;
};

/** Selector de fecha inline: botón con toggle de calendario. */
export function InlineDatePicker({ value, onChange, placeholder }: Props) {
  const [open, setOpen] = React.useState(false);
  const selected = parseDateString(value);

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start font-normal"
        onClick={() => setOpen((o) => !o)}
      >
        <IconCalendar className="mr-2 size-4 shrink-0 text-muted-foreground" />
        {selected ? (
          format(selected, "d 'de' MMMM, yyyy", { locale: es })
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </Button>
      {open && (
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(day) => {
            if (day) {
              const y = day.getFullYear();
              const m = String(day.getMonth() + 1).padStart(2, "0");
              const d = String(day.getDate()).padStart(2, "0");
              onChange(`${y}-${m}-${d}`);
            } else {
              onChange(undefined);
            }
            setOpen(false);
          }}
          locale={es}
          className="rounded-md border"
        />
      )}
    </div>
  );
}
