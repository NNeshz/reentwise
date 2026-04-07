"use client";

import {
  Card,
  CardHeader,
} from "@reentwise/ui/src/components/card";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { ROOMS_LIST_STACK_CLASS } from "@/modules/rooms/lib/room-display";

const ROW_COUNT = 3;

export function RoomsListSkeleton() {
  return (
    <div className={ROOMS_LIST_STACK_CLASS} aria-busy="true">
      {Array.from({ length: ROW_COUNT }, (_, i) => (
        <Card key={i} className="rounded-xl border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
