"use client";

/**
 * Compact range calendar: fixed width, start-aligned, no flex-grow gaps.
 * Interaction: 1st click → start, 2nd → end (swap if needed), 3rd → new start.
 */
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@reentwise/ui/src/components/button";
import { cn } from "@reentwise/ui/src/lib/utils";

import {
  compareDay,
  isSameDay,
  localToday,
} from "@/modules/metrics/lib/metrics-date-range";

const WEEKDAYS = ["do", "lu", "ma", "mi", "ju", "vi", "sá"] as const;

export type CalendarDateRange = {
  from?: Date;
  to?: Date;
};

type Cell = { date: Date; inCurrentMonth: boolean };

function buildMonthCells(viewYear: number, viewMonth: number): Cell[] {
  const first = new Date(viewYear, viewMonth, 1);
  const startOffset = first.getDay();
  const start = new Date(viewYear, viewMonth, 1 - startOffset);
  const cells: Cell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({
      date: d,
      inCurrentMonth:
        d.getMonth() === viewMonth && d.getFullYear() === viewYear,
    });
  }
  return cells;
}

function monthTitle(year: number, month: number): string {
  const d = new Date(year, month, 1);
  return new Intl.DateTimeFormat("es", {
    month: "long",
    year: "numeric",
  })
    .format(d)
    .replace(/^\w/, (c) => c.toLowerCase());
}

type MetricsRangeCalendarProps = {
  value: CalendarDateRange;
  onChange: (next: CalendarDateRange) => void;
  /** When the committed range changes (preset / parent), focus this month. */
  focusToken?: string;
  className?: string;
};

export function MetricsRangeCalendar({
  value,
  onChange,
  focusToken,
  className,
}: MetricsRangeCalendarProps) {
  const anchor = value.from ?? value.to ?? new Date();
  const [viewYear, setViewYear] = React.useState(() => anchor.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(() => anchor.getMonth());

  React.useEffect(() => {
    if (!focusToken) return;
    const a = value.from ?? value.to ?? new Date();
    setViewYear(a.getFullYear());
    setViewMonth(a.getMonth());
    // Intentionally only when focusToken changes (open / committed query / preset), not while dragging range
  }, [focusToken]);

  const cells = React.useMemo(
    () => buildMonthCells(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  function inSelectedRange(d: Date): boolean {
    const { from, to } = value;
    if (!from) return false;
    if (!to) return isSameDay(d, from);
    const lo = compareDay(from, to) <= 0 ? from : to;
    const hi = compareDay(from, to) <= 0 ? to : from;
    return compareDay(d, lo) >= 0 && compareDay(d, hi) <= 0;
  }

  function isRangeStart(d: Date): boolean {
    const { from, to } = value;
    if (!from) return false;
    if (!to) return isSameDay(d, from);
    const lo = compareDay(from, to) <= 0 ? from : to;
    return isSameDay(d, lo);
  }

  function isRangeEnd(d: Date): boolean {
    const { from, to } = value;
    if (!from || !to) return false;
    const hi = compareDay(from, to) <= 0 ? to : from;
    return isSameDay(d, hi);
  }

  function handleDayClick(day: Date) {
    const { from, to } = value;
    if (!from || (from && to)) {
      onChange({ from: day, to: undefined });
      return;
    }
    if (compareDay(day, from) < 0) {
      onChange({ from: day, to: from });
    } else {
      onChange({ from, to: day });
    }
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  return (
    <div
      className={cn(
        "w-full select-none md:w-[288px] md:max-w-[288px] md:shrink-0",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2 px-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 rounded-full"
          onClick={prevMonth}
          aria-label="Mes anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-0 flex-1 text-center text-sm font-medium capitalize tracking-tight">
          {monthTitle(viewYear, viewMonth)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 rounded-full"
          onClick={nextMonth}
          aria-label="Mes siguiente"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid w-full grid-cols-7 gap-x-0 gap-y-1">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="flex min-w-0 items-center justify-center py-1 text-[0.65rem] font-medium text-muted-foreground"
          >
            {w}
          </div>
        ))}
        {cells.map((cell) => {
          const { date, inCurrentMonth } = cell;
          const inRange = inSelectedRange(date);
          const rs = isRangeStart(date);
          const re = isRangeEnd(date);
          const isToday = isSameDay(date, localToday());

          return (
            <div
              key={date.getTime()}
              className={cn(
                "relative flex min-h-10 min-w-0 items-center justify-center p-0",
                inRange && "bg-muted/60",
                rs && re && "rounded-full",
                rs && !re && "rounded-l-full",
                !rs && re && "rounded-r-full",
              )}
            >
              <button
                type="button"
                onClick={() => handleDayClick(date)}
                className={cn(
                  "relative z-1 mx-auto flex aspect-square w-full max-w-10 min-w-0 items-center justify-center rounded-full text-sm transition-colors",
                  !inCurrentMonth && "text-muted-foreground/50",
                  inCurrentMonth && "text-foreground",
                  inRange && !rs && !re && "bg-transparent",
                  (rs || re) &&
                    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                  !rs && !re && inRange && "hover:bg-muted/80",
                  isToday &&
                    !(rs || re) &&
                    "after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-foreground/70",
                )}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
