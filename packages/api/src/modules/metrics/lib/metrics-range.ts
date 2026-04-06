import type {
  MetricsCardsPreset,
  MetricsCardsQuery,
  MetricsDateRange,
} from "@reentwise/api/src/modules/metrics/types/metrics.types";
import { MetricsQueryError } from "@reentwise/api/src/modules/metrics/lib/metrics-query-error";
import {
  addDaysUTC,
  diffDaysInclusive,
  isoDateUTC,
  utcToday,
} from "@reentwise/api/src/modules/metrics/utils/metrics-date-utc";

export function parseIsoDateOnly(s: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) throw new MetricsQueryError("from/to must be YYYY-MM-DD");
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) {
    throw new MetricsQueryError("Invalid from/to date");
  }
  return new Date(Date.UTC(y, mo - 1, d));
}

function previousPeriodRange(from: Date, to: Date): { from: Date; to: Date } {
  const days = diffDaysInclusive(from, to);
  const prevTo = addDaysUTC(from, -1);
  const prevFrom = addDaysUTC(prevTo, -(days - 1));
  return { from: prevFrom, to: prevTo };
}

function presetToRange(preset: MetricsCardsPreset): { from: Date; to: Date } {
  const today = utcToday();
  switch (preset) {
    case "today":
      return { from: today, to: today };
    case "yesterday": {
      const y = addDaysUTC(today, -1);
      return { from: y, to: y };
    }
    case "last_3_days":
      return { from: addDaysUTC(today, -2), to: today };
    case "last_7_days":
      return { from: addDaysUTC(today, -6), to: today };
    case "last_15_days":
      return { from: addDaysUTC(today, -14), to: today };
    case "last_30_days":
      return { from: addDaysUTC(today, -29), to: today };
    case "last_60_days":
      return { from: addDaysUTC(today, -59), to: today };
    default: {
      const _exhaustive: never = preset;
      return _exhaustive;
    }
  }
}

export function resolveMetricsRanges(query: MetricsCardsQuery): {
  currentFrom: Date;
  currentTo: Date;
  previousFrom: Date;
  previousTo: Date;
  preset: MetricsCardsPreset | null;
} {
  const hasFrom = Boolean(query.from);
  const hasTo = Boolean(query.to);
  if (hasFrom !== hasTo) {
    throw new MetricsQueryError("from and to must be provided together");
  }

  if (query.from && query.to) {
    const currentFrom = parseIsoDateOnly(query.from);
    const currentTo = parseIsoDateOnly(query.to);
    if (currentFrom > currentTo) {
      throw new MetricsQueryError("from must be on or before to");
    }
    const { from: previousFrom, to: previousTo } = previousPeriodRange(
      currentFrom,
      currentTo,
    );
    return {
      currentFrom,
      currentTo,
      previousFrom,
      previousTo,
      preset: null,
    };
  }

  const preset: MetricsCardsPreset = query.preset ?? "last_7_days";
  const { from: currentFrom, to: currentTo } = presetToRange(preset);
  const { from: previousFrom, to: previousTo } = previousPeriodRange(
    currentFrom,
    currentTo,
  );
  return {
    currentFrom,
    currentTo,
    previousFrom,
    previousTo,
    preset,
  };
}

export function toMetricsDateRange(from: Date, to: Date): MetricsDateRange {
  return { from: isoDateUTC(from), to: isoDateUTC(to) };
}
