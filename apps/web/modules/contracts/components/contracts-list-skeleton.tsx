"use client";

import { Card } from "@reentwise/ui/src/components/card";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { CONTRACTS_LIST_STACK_CLASS } from "@/modules/contracts/lib/contract-display";

const ROWS = 5;

export function ContractsListSkeleton() {
  return (
    <div className={CONTRACTS_LIST_STACK_CLASS} aria-busy="true">
      {Array.from({ length: ROWS }, (_, i) => (
        <Card key={i} className="p-0">
          <div className="flex items-center gap-4 p-4">
            <Skeleton className="size-10 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-5 w-24 shrink-0" />
            <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
          </div>
        </Card>
      ))}
    </div>
  );
}
