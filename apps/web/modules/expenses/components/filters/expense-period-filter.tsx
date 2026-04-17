"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";

const MONTH_OPTIONS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

function getYearOptions(): number[] {
  const current = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => current - i);
}

type Props = {
  year: number | undefined;
  month: number | undefined;
  onYearChange: (year: number | undefined) => void;
  onMonthChange: (month: number | undefined) => void;
};

export function ExpensePeriodFilter({
  year,
  month,
  onYearChange,
  onMonthChange,
}: Props) {
  const years = getYearOptions();

  return (
    <div className="flex gap-2">
      <Select
        value={year != null ? String(year) : "all"}
        onValueChange={(v) => onYearChange(v === "all" ? undefined : parseInt(v, 10))}
      >
        <SelectTrigger className="w-full min-w-[90px] sm:w-[110px]">
          <SelectValue placeholder="Año" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los años</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={month != null ? String(month) : "all"}
        onValueChange={(v) => onMonthChange(v === "all" ? undefined : parseInt(v, 10))}
        disabled={year == null}
      >
        <SelectTrigger className="w-full min-w-[110px] sm:w-[130px]">
          <SelectValue placeholder="Mes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los meses</SelectItem>
          {MONTH_OPTIONS.map(({ value: v, label }) => (
            <SelectItem key={v} value={String(v)}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
