"use client";

import { Card } from "@reentwise/ui/src/components/card";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";

const ROWS = 4;

export function TenantsAsignListSkeleton() {
  return (
    <div className="mt-4 space-y-3" aria-busy="true">
      {Array.from({ length: ROWS }, (_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="size-10 shrink-0 rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}
