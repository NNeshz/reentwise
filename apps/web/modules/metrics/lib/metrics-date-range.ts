import type {
  MetricsCardsPreset,
  MetricsCardsQuery,
} from "@reentwise/api/src/modules/metrics/types/metrics.types";

export function formatDateOnlyLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateOnlyLocal(s: string): Date {
  const parts = s.split("-").map(Number);
  const y = parts[0]!;
  const mo = parts[1]!;
  const d = parts[2]!;
  return new Date(y, mo - 1, d);
}

/** Local “today” at midnight (same rules as the API presets, but in local TZ). */
export function localToday(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export function addDaysLocal(d: Date, delta: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + delta);
  return x;
}

/** Inclusive range for each preset (mirrors backend intent using local calendar dates). */
export function getLocalPresetRange(preset: MetricsCardsPreset): {
  from: Date;
  to: Date;
} {
  const today = localToday();
  switch (preset) {
    case "today":
      return { from: today, to: today };
    case "yesterday": {
      const y = addDaysLocal(today, -1);
      return { from: y, to: y };
    }
    case "last_3_days":
      return { from: addDaysLocal(today, -2), to: today };
    case "last_7_days":
      return { from: addDaysLocal(today, -6), to: today };
    case "last_15_days":
      return { from: addDaysLocal(today, -14), to: today };
    case "last_30_days":
      return { from: addDaysLocal(today, -29), to: today };
    case "last_60_days":
      return { from: addDaysLocal(today, -59), to: today };
    default: {
      const _exhaustive: never = preset;
      return _exhaustive;
    }
  }
}

/** Resolved range for the calendar + labels (preset expands to concrete dates). */
export function rangeFromQuery(query: MetricsCardsQuery): {
  from: Date;
  to: Date;
} {
  if (query.from && query.to) {
    return {
      from: parseDateOnlyLocal(query.from),
      to: parseDateOnlyLocal(query.to),
    };
  }
  const preset = query.preset ?? "last_7_days";
  return getLocalPresetRange(preset);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function compareDay(a: Date, b: Date): number {
  const x = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const y = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return x - y;
}
