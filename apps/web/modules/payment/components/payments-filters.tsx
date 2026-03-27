"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "lucide-react";
import { Input } from "@reentwise/ui/src/components/input";
import { Button } from "@reentwise/ui/src/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@reentwise/ui/src/components/popover";
import { cn } from "@reentwise/ui/src/lib/utils";
import { usePaymentsFilters } from "@/modules/payment/store/use-payments-filters";
import { useDebounce } from "@/utils/use-debounce";

const SEARCH_DEBOUNCE_MS = 300;

const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const MONTH_LABELS_LONG = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function MonthYearPicker({
  month,
  year,
  onMonthChange,
  onYearChange,
}: {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [viewYearOverride, setViewYearOverride] = useState<number | null>(null);
  const viewYear = viewYearOverride ?? year;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) setViewYearOverride(null);
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const label = `${MONTH_LABELS_LONG[month - 1]} ${year}`;

  function handleSelect(m: number) {
    onMonthChange(m);
    onYearChange(viewYear);
    setOpen(false);
    setViewYearOverride(null);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start gap-2 font-normal">
          <CalendarIcon className="size-4 text-muted-foreground" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setViewYearOverride((viewYearOverride ?? year) - 1)}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <span className="text-sm font-semibold">{viewYear}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setViewYearOverride((viewYearOverride ?? year) + 1)}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {MONTH_LABELS.map((label, i) => {
            const m = i + 1;
            const isSelected = m === month && viewYear === year;
            const isCurrent = m === currentMonth && viewYear === currentYear;

            return (
              <Button
                key={m}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-9 text-xs",
                  isCurrent &&
                    !isSelected &&
                    "bg-accent font-medium text-accent-foreground",
                )}
                onClick={() => handleSelect(m)}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function PaymentsFilters() {
  const {
    search,
    status,
    month,
    year,
    setSearch,
    setStatus,
    setMonth,
    setYear,
  } = usePaymentsFilters();

  const [inputValue, setInputValue] = useState(search ?? "");
  const debouncedSearch = useDebounce(inputValue, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setSearch(debouncedSearch.trim());
  }, [debouncedSearch, setSearch]);

  useEffect(() => {
    if (!search) {
      setInputValue("");
    }
  }, [search]);

  return (
    <div className="flex flex-wrap gap-2">
      <Input
        placeholder="Buscar nombre o WhatsApp"
        className="w-full max-w-xs"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Select
        value={status ?? "all"}
        onValueChange={(value) =>
          setStatus(
            value === "all"
              ? undefined
              : (value as "pending" | "partial" | "paid"),
          )
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pending">Pendientes</SelectItem>
          <SelectItem value="partial">Abono parcial</SelectItem>
          <SelectItem value="paid">Al corriente</SelectItem>
        </SelectContent>
      </Select>
      <MonthYearPicker
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />
    </div>
  );
}
