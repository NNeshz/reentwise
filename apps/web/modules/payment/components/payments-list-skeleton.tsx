import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { Card } from "@reentwise/ui/src/components/card";
import { cn } from "@reentwise/ui/src/lib/utils";
import {
  PAYMENTS_TABLE_GRID_CLASS,
  paymentsTableHeaderRowClassName,
} from "@/modules/payment/lib/payment-display";
import { PaymentsListFrame } from "@/modules/payment/components/payments-list-frame";
import type { PaymentsViewMode } from "@/modules/payment/components/payments-result-summary";

const ROW_PLACEHOLDERS = 8;

function ListSkeleton() {
  return (
    <PaymentsListFrame>
      <div className={cn(paymentsTableHeaderRowClassName("px-3"))}>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-14" />
      </div>
      <ul className="flex flex-col gap-1" role="list" aria-busy="true">
        {Array.from({ length: ROW_PLACEHOLDERS }, (_, i) => (
          <li key={i} className="px-3 py-1.5">
            <div className={PAYMENTS_TABLE_GRID_CLASS}>
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="size-7 rounded-md" />
            </div>
          </li>
        ))}
      </ul>
    </PaymentsListFrame>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: ROW_PLACEHOLDERS }, (_, i) => (
        <Card key={i} className="overflow-hidden p-0">
          <div className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1 rounded-md" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

type Props = { view?: PaymentsViewMode };

export function PaymentsListSkeleton({ view = "list" }: Props) {
  return view === "grid" ? <GridSkeleton /> : <ListSkeleton />;
}
