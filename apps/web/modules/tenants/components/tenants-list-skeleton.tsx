"use client";

import { Card } from "@reentwise/ui/src/components/card";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { TENANTS_LIST_STACK_CLASS } from "@/modules/tenants/lib/tenant-display";

const ROWS = 5;

export function TenantsListSkeleton() {
  return (
    <div className={TENANTS_LIST_STACK_CLASS} aria-busy="true">
      {Array.from({ length: ROWS }, (_, i) => (
        <Card key={i} className="p-0">
          <div className="flex items-center gap-4 p-4">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="size-8 rounded-md" />
          </div>
        </Card>
      ))}
    </div>
  );
}
