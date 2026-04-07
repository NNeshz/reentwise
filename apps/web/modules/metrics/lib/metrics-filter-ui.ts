import type { MetricsCardsPreset } from "@reentwise/api/src/modules/metrics/types/metrics.types";
import {
  formatDateOnlyLocal,
  getLocalPresetRange,
  parseDateOnlyLocal,
} from "@/modules/metrics/lib/metrics-date-range";
import { METRICS_FILTER_PRESETS } from "@/modules/metrics/data/metrics-filter-presets";

export type MetricsCalendarDraft = {
  from?: Date;
  to?: Date;
};

export function formatMetricsRangeLabelShort(from: Date, to: Date): string {
  const fmt = new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: from.getFullYear() !== to.getFullYear() ? "numeric" : undefined,
  });
  return `${fmt.format(from)} – ${fmt.format(to)}`;
}

export function metricsFilterTriggerLabel(query: {
  preset?: MetricsCardsPreset;
  from?: string;
  to?: string;
}): string {
  if (query.from && query.to) {
    return formatMetricsRangeLabelShort(
      parseDateOnlyLocal(query.from),
      parseDateOnlyLocal(query.to),
    );
  }
  const preset = query.preset ?? "last_7_days";
  return METRICS_FILTER_PRESETS.find((p) => p.id === preset)?.label ?? "Periodo";
}

export function metricsFilterActivePresetId(query: {
  preset?: MetricsCardsPreset;
  from?: string;
  to?: string;
}): MetricsCardsPreset | null {
  if (query.from && query.to) return null;
  return query.preset ?? "last_7_days";
}

export function metricsRangesMatchCommitted(
  draft: MetricsCalendarDraft,
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
