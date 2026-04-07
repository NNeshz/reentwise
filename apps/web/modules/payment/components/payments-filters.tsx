"use client";

import { useCallback } from "react";
import { Button } from "@reentwise/ui/src/components/button";
import { IconFilterOff } from "@tabler/icons-react";
import { usePaymentsFilters } from "@/modules/payment/store/use-payments-filters";
import { PaymentSearchFilter } from "@/modules/payment/components/filters/payment-search-filter";
import { PaymentStatusFilter } from "@/modules/payment/components/filters/payment-status-filter";
import { PaymentMonthYearPicker } from "@/modules/payment/components/filters/payment-month-year-picker";

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
    resetFilters,
  } = usePaymentsFilters();

  const onDebouncedSearch = useCallback(
    (v: string) => {
      setSearch(v);
    },
    [setSearch],
  );

  const n = new Date();
  const isDefaultPeriod =
    month === n.getMonth() + 1 && year === n.getFullYear();
  const hasActiveFilters =
    search.trim() !== "" || status != null || !isDefaultPeriod;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        <PaymentSearchFilter
          committedSearch={search}
          onDebouncedChange={onDebouncedSearch}
        />
        <PaymentStatusFilter
          value={status ?? "all"}
          onValueChange={setStatus}
        />
        <PaymentMonthYearPicker
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>
      {hasActiveFilters ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => resetFilters()}
        >
          <IconFilterOff className="size-4" />
          Limpiar filtros
        </Button>
      ) : null}
    </div>
  );
}
