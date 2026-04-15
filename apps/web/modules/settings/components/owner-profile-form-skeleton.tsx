import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { cn } from "@reentwise/ui/src/lib/utils";

export function OwnerProfileFormSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("w-full max-w-2xl space-y-6", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
