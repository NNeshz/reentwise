"use client";

import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { EXPENSES_TABLE_GRID_CLASS } from "@/modules/expenses/lib/expense-display";

const ROWS = 6;

export function ExpensesListSkeleton() {
  return (
    <div className="overflow-x-auto" aria-busy="true">
      <div className="flex flex-col gap-1">
        {Array.from({ length: ROWS }, (_, i) => (
          <div key={i} className={`${EXPENSES_TABLE_GRID_CLASS} items-center py-2`}>
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="ml-auto h-4 w-16" />
            <Skeleton className="size-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
