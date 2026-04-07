"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "lucide-react";
import { Button } from "@reentwise/ui/src/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@reentwise/ui/src/components/popover";
import { cn } from "@reentwise/ui/src/lib/utils";
import {
  PAYMENT_MONTH_LABELS_LONG,
  PAYMENT_MONTH_LABELS_SHORT,
} from "@/modules/payment/lib/payment-display";

type Props = {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
};

export function PaymentMonthYearPicker({
  month,
  year,
  onMonthChange,
  onYearChange,
}: Props) {
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

  const label = `${PAYMENT_MONTH_LABELS_LONG[month - 1]} ${year}`;

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
          {PAYMENT_MONTH_LABELS_SHORT.map((shortLabel, i) => {
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
                {shortLabel}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
