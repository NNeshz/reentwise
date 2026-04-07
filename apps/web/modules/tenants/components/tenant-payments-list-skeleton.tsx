"use client";

import { Skeleton } from "@reentwise/ui/src/components/skeleton";

const ROWS = 4;

export function TenantPaymentsListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: ROWS }, (_, i) => (
        <div key={i} className="rounded-lg border p-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}
