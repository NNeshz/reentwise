"use client";

/**
 * Local wall-clock dates → `YYYY-MM-DD` for the API.
 * Popover stays open while choosing a range; only "Aplicar rango" commits & closes.
 */
import * as React from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { IconCheck } from "@tabler/icons-react";

import { Button } from "@reentwise/ui/src/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@reentwise/ui/src/components/popover";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@reentwise/ui/src/components/drawer";
import { useIsMobile } from "@reentwise/ui/src/hooks/use-mobile";
import { cn } from "@reentwise/ui/src/lib/utils";

import type { MetricsCardsPreset } from "@reentwise/api/src/modules/metrics/types/metrics.types";
import { useMetricsStore } from "@/modules/metrics/store/metrics-store";
import {
  formatDateOnlyLocal,
  getLocalPresetRange,
  parseDateOnlyLocal,
  rangeFromQuery,
} from "@/modules/metrics/lib/metrics-date-range";
import {
  MetricsRangeCalendar,
  type CalendarDateRange,
} from "@/modules/metrics/components/metrics-range-calendar";

const PRESETS: { id: MetricsCardsPreset; label: string }[] = [
  { id: "today", label: "Hoy" },
  { id: "yesterday", label: "Ayer" },
  { id: "last_3_days", label: "Últimos 3 días" },
  { id: "last_7_days", label: "Últimos 7 días" },
  { id: "last_15_days", label: "Últimos 15 días" },
  { id: "last_30_days", label: "Últimos 30 días" },
  { id: "last_60_days", label: "Últimos 60 días" },
];

function formatRangeLabelShort(from: Date, to: Date): string {
  const fmt = new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: from.getFullYear() !== to.getFullYear() ? "numeric" : undefined,
  });
  return `${fmt.format(from)} – ${fmt.format(to)}`;
}

function triggerLabel(query: {
  preset?: MetricsCardsPreset;
  from?: string;
  to?: string;
}): string {
  if (query.from && query.to) {
    return formatRangeLabelShort(
      parseDateOnlyLocal(query.from),
      parseDateOnlyLocal(query.to),
    );
  }
  const preset = query.preset ?? "last_7_days";
  return PRESETS.find((p) => p.id === preset)?.label ?? "Periodo";
}

function activePresetId(query: {
  preset?: MetricsCardsPreset;
  from?: string;
  to?: string;
}): MetricsCardsPreset | null {
  if (query.from && query.to) return null;
  return query.preset ?? "last_7_days";
}

function rangesMatchCommitted(
  draft: CalendarDateRange,
  query: { preset?: MetricsCardsPreset; from?: string; to?: string },
): boolean {
  if (!draft.from || !draft.to) return false;
  if (query.from && query.to) {
    return (
      formatDateOnlyLocal(draft.from) === query.from &&
      formatDateOnlyLocal(draft.to) === query.to
    );
  }
  const preset = query.preset ?? "last_7_days";
  const expected = getLocalPresetRange(preset);
  return (
    formatDateOnlyLocal(draft.from) === formatDateOnlyLocal(expected.from) &&
    formatDateOnlyLocal(draft.to) === formatDateOnlyLocal(expected.to)
  );
}

type PanelProps = {
  query: { preset?: MetricsCardsPreset; from?: string; to?: string };
  onPreset: (preset: MetricsCardsPreset) => void;
  onDraftChange: (draft: CalendarDateRange) => void;
  onApplyCustom: () => void;
  onClose: () => void;
  draftRange: CalendarDateRange;
  focusToken: string;
  className?: string;
};

function MetricsFilterPanel({
  query,
  onPreset,
  onDraftChange,
  onApplyCustom,
  onClose,
  draftRange,
  focusToken,
  className,
}: PanelProps) {
  const selectedPreset = activePresetId(query);
  const draftMatchesQuery = rangesMatchCommitted(draftRange, query);
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
        {PRESETS.map((p) => {
          const isActive = selectedPreset === p.id && draftMatchesQuery;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPreset(p.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                "hover:bg-muted/80",
                isActive && "bg-primary text-primary-foreground font-medium",
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

export function MetricsFilter() {
  const query = useMetricsStore((s) => s.query);
  const setQuery = useMetricsStore((s) => s.setQuery);
  const [open, setOpen] = React.useState(false);
  const [draftRange, setDraftRange] = React.useState<CalendarDateRange>({});
  const isMobile = useIsMobile();

  const focusToken = open
    ? `${query.preset ?? ""}-${query.from ?? ""}-${query.to ?? ""}`
    : "";

  React.useEffect(() => {
    if (!open) return;
    const r = rangeFromQuery(query);
    setDraftRange({ from: r.from, to: r.to });
  }, [open, query]);

  const label = triggerLabel(query);

  const handlePreset = React.useCallback(
    (preset: MetricsCardsPreset) => {
      setQuery({ preset });
      const r = getLocalPresetRange(preset);
      setDraftRange({ from: r.from, to: r.to });
    },
    [setQuery],
  );

  const handleApplyCustom = React.useCallback(() => {
    if (!draftRange.from || !draftRange.to) return;
    setQuery({
      from: formatDateOnlyLocal(draftRange.from),
      to: formatDateOnlyLocal(draftRange.to),
    });
    setOpen(false);
  }, [draftRange.from, draftRange.to, setQuery]);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const panel = (
    <MetricsFilterPanel
      query={query}
      onPreset={handlePreset}
      onDraftChange={setDraftRange}
      onApplyCustom={handleApplyCustom}
      onClose={handleClose}
      draftRange={draftRange}
      focusToken={focusToken}
    />
  );

  const trigger = (
    <Button
      type="button"
      variant="outline"
      className="h-10 w-full justify-between gap-2 rounded-full border-border px-4 font-normal sm:w-auto sm:min-w-[220px]"
      aria-expanded={open}
      aria-haspopup="dialog"
    >
      <span className="flex min-w-0 items-center gap-2">
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{label}</span>
      </span>
      <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent
          className="max-h-[92vh]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DrawerHeader className="border-b border-border pb-2 text-left">
            <DrawerTitle className="text-base">Periodo de métricas</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-3 pb-6">{panel}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-auto max-w-[min(calc(100vw-1rem),640px)] border-border bg-transparent p-0 shadow-none"
        collisionPadding={12}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {panel}
      </PopoverContent>
    </Popover>
  );
}
