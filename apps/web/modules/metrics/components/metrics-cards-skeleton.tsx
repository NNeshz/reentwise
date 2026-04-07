import {
  Card,
} from "@reentwise/ui/src/components/card";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";

export function MetricsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="mb-4 h-9 w-36" />
          <Skeleton className="h-10 w-full" />
        </Card>
      ))}
    </div>
  );
}
