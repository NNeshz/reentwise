"use client";

import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { PROPERTIES_GRID_CLASS } from "@/modules/properties/lib/property-display";

const CARD_COUNT = 6;

export function PropertiesListSkeleton() {
  return (
    <div className={PROPERTIES_GRID_CLASS} aria-busy="true">
      {Array.from({ length: CARD_COUNT }, (_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-[55%] max-w-[200px]" />
              <Skeleton className="h-3 w-full max-w-[280px]" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}
