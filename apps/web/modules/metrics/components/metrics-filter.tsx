"use client";

/**
 * Fechas locales → `YYYY-MM-DD` para la API.
 * El popover permanece abierto al elegir rango; solo "Aplicar rango" confirma y cierra.
 */
import * as React from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
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
import type { MetricsCardsPreset } from "@reentwise/api/src/modules/metrics/types/metrics.types";
import { useMetricsStore } from "@/modules/metrics/store/metrics-store";
import {
  formatDateOnlyLocal,
  getLocalPresetRange,
  rangeFromQuery,
} from "@/modules/metrics/lib/metrics-date-range";
import { metricsFilterTriggerLabel } from "@/modules/metrics/lib/metrics-filter-ui";
import { MetricsFilterPanel } from "./metrics-filter-panel";
import type { CalendarDateRange } from "./metrics-range-calendar";

export function MetricsFilter() {
  const query = useMetricsStore((s) => s.query);
  const setQuery = useMetricsStore((s) => s.setQuery);
  const [open, setOpen] = React.useState(false);
  const [draftRange, setDraftRange] = React.useState<CalendarDateRange>({});
  const isMobile = useIsMobile();

  const focusToken = open
    ? `${query.preset ?? ""}-${query.from ?? ""}-${query.to ?? ""}`
    : "";

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      setOpen(next);
      if (next) {
        const r = rangeFromQuery(query);
        setDraftRange({ from: r.from, to: r.to });
      }
    },
    [query],
  );

  const label = metricsFilterTriggerLabel(query);

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
      <Drawer open={open} onOpenChange={handleOpenChange}>
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
    <Popover modal={false} open={open} onOpenChange={handleOpenChange}>
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
