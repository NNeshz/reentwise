import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { cn } from "@reentwise/ui/src/lib/utils";
import {
  AUDITS_TABLE_GRID_CLASS,
  auditsTableHeaderRowClassName,
} from "@/modules/audits/lib/audit-display";
import { AuditsListFrame } from "@/modules/audits/components/audits-list-frame";

const ROW_PLACEHOLDERS = 8;

export function AuditsListSkeleton() {
  return (
    <AuditsListFrame>
      <div className={cn(auditsTableHeaderRowClassName("px-3"))}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <ul className="flex flex-col gap-1" role="list" aria-busy="true">
        {Array.from({ length: ROW_PLACEHOLDERS }, (_, i) => (
          <li key={i} className="px-3 py-3">
            <div className={AUDITS_TABLE_GRID_CLASS}>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
          </li>
        ))}
      </ul>
    </AuditsListFrame>
  );
}
