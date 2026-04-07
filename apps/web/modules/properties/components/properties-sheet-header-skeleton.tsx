"use client";

import { Skeleton } from "@reentwise/ui/src/components/skeleton";

export function PropertiesSheetHeaderSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="size-9 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-48 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xs" />
      </div>
    </div>
  );
}
