"use client";

import { IconCheck } from "@tabler/icons-react";
import { Button } from "@reentwise/ui/src/components/button";
import { cn } from "@reentwise/ui/src/lib/utils";
import type { MetricsCardsPreset } from "@reentwise/api/src/modules/metrics/types/metrics.types";
import { METRICS_FILTER_PRESETS } from "@/modules/metrics/data/metrics-filter-presets";
import {
  metricsFilterActivePresetId,
  metricsRangesMatchCommitted,
} from "@/modules/metrics/lib/metrics-filter-ui";
import {
  MetricsRangeCalendar,
  type CalendarDateRange,
} from "./metrics-range-calendar";

export type MetricsFilterPanelProps = {
  query: { preset?: MetricsCardsPreset; from?: string; to?: string };
  onPreset: (preset: MetricsCardsPreset) => void;
  onDraftChange: (draft: CalendarDateRange) => void;
  onApplyCustom: () => void;
  onClose: () => void;
  draftRange: CalendarDateRange;
  focusToken: string;
  className?: string;
};

export function MetricsFilterPanel({
  query,
  onPreset,
  onDraftChange,
  onApplyCustom,
  onClose,
  draftRange,
  focusToken,
  className,
}: MetricsFilterPanelProps) {
  const selectedPreset = metricsFilterActivePresetId(query);
  const draftMatchesQuery = metricsRangesMatchCommitted(draftRange, query);
  const canApplyCustom =
    Boolean(draftRange.from && draftRange.to) && !draftMatchesQuery;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-popover text-popover-foreground shadow-xl",
        "md:max-h-[min(92vh,560px)] md:flex-row md:items-stretch",
        className,
      )}
    >
      <nav
        className={cn(
          "flex shrink-0 flex-col gap-0.5 border-border p-2 md:w-[200px] md:border-r md:py-3",
          "max-md:border-b max-md:pb-2",
        )}
        aria-label="Rangos rápidos"
      >
        {METRICS_FILTER_PRESETS.map((p) => {
          const isActive = selectedPreset === p.id && draftMatchesQuery;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPreset(p.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                "hover:bg-muted/80",
                isActive && "bg-primary font-medium text-primary-foreground",
              )}
            >
              <span>{p.label}</span>
              {isActive ? (
                <IconCheck className="size-4 shrink-0 opacity-90" aria-hidden />
              ) : (
                <span className="size-4 shrink-0" aria-hidden />
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex min-w-0 flex-1 flex-col gap-0 p-3 md:items-start md:pl-4">
        <div className="w-full md:flex md:justify-start">
          <MetricsRangeCalendar
            value={draftRange}
            onChange={onDraftChange}
            focusToken={focusToken}
          />
        </div>

        <p className="mt-3 w-full text-[11px] leading-snug text-muted-foreground md:max-w-[288px]">
          <span className="text-foreground/80">Aplicar rango</span> guarda el
          periodo personalizado.
        </p>

        <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row sm:justify-end md:max-w-[288px]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={onClose}
          >
            Cerrar
          </Button>
          <Button
            type="button"
            size="sm"
            className="rounded-full"
            disabled={!canApplyCustom}
            onClick={onApplyCustom}
          >
            Aplicar rango
          </Button>
        </div>
      </div>
    </div>
  );
}
