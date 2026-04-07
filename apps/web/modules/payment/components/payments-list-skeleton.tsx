"use client";

import { Card } from "@reentwise/ui/src/components/card";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { PAYMENTS_LIST_STACK_CLASS } from "@/modules/payment/lib/payment-display";

const ROWS = 5;

export function PaymentsListSkeleton() {
  return (
    <div className={PAYMENTS_LIST_STACK_CLASS} aria-busy="true">
      {Array.from({ length: ROWS }, (_, i) => (
        <Card key={i} className="p-0">
          <div className="flex items-center justify-between p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-8 w-28" />
          </div>
        </Card>
      ))}
    </div>
  );
}
