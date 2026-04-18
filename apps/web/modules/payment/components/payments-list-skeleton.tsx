import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { cn } from "@reentwise/ui/src/lib/utils";
import {
  PAYMENTS_TABLE_GRID_CLASS,
  paymentsTableHeaderRowClassName,
} from "@/modules/payment/lib/payment-display";
import { PaymentsListFrame } from "@/modules/payment/components/payments-list-frame";

const ROW_PLACEHOLDERS = 8;

export function PaymentsListSkeleton() {
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
