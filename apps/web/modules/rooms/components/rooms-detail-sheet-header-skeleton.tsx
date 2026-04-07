"use client";

import { Skeleton } from "@reentwise/ui/src/components/skeleton";

export function RoomsDetailSheetHeaderSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="size-9 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-6 w-40 max-w-full" />
        <Skeleton className="h-4 w-56 max-w-full" />
      </div>
    </div>
  );
}
