"use client";

import { Button } from "@reentwise/ui/src/components/button";
import { IconFilterOff } from "@tabler/icons-react";
import { useExpensesFilters } from "@/modules/expenses/store/use-expenses-filters";
import { useProperties } from "@/modules/properties/hooks/use-properties";
import { ExpenseCategoryFilter } from "@/modules/expenses/components/filters/expense-category-filter";
import { ExpensePropertyFilter } from "@/modules/expenses/components/filters/expense-property-filter";
import { ExpensePeriodFilter } from "@/modules/expenses/components/filters/expense-period-filter";

export function ExpensesFilters() {
  const {
    category,
    propertyId,
    year,
    month,
    setCategory,
    setPropertyId,
    setYear,
    setMonth,
    resetFilters,
  } = useExpensesFilters();

  const propertiesQuery = useProperties();
  const properties = (propertiesQuery.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
  }));

  const hasActiveFilters = !!category || !!propertyId || !!year || !!month;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        <ExpenseCategoryFilter value={category} onValueChange={setCategory} />

        <ExpensePropertyFilter
          value={propertyId}
          onValueChange={setPropertyId}
          properties={properties}
          isLoading={propertiesQuery.isPending}
        />

        <ExpensePeriodFilter
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
        />
      </div>

      {hasActiveFilters && (
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
      )}
    </div>
  );
}
