"use client";

import { IconLayoutList, IconLayoutGrid } from "@tabler/icons-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@reentwise/ui/src/components/tabs";

export type PaymentsViewMode = "list" | "grid";

type Props = {
  count: number;
  isFetching?: boolean;
  view: PaymentsViewMode;
  onViewChange: (v: PaymentsViewMode) => void;
};

export function PaymentsResultSummary({
  count,
  isFetching,
  view,
  onViewChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
      <span>
        {count} inquilino{count !== 1 ? "s" : ""}
        {isFetching ? " · actualizando…" : ""}
      </span>
      <Tabs
        value={view}
        onValueChange={(v) => onViewChange(v as PaymentsViewMode)}
      >
        <TabsList>
          <TabsTrigger value="list" aria-label="Vista tabla">
            <IconLayoutList className="size-4" />
          </TabsTrigger>
          <TabsTrigger value="grid" aria-label="Vista tarjetas">
            <IconLayoutGrid className="size-4" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
