/** Quick ranges for the date picker (aligned with UI presets). */
export type MetricsCardsPreset =
  | "today"
  | "yesterday"
  | "last_3_days"
  | "last_7_days"
  | "last_15_days"
  | "last_30_days"
  | "last_60_days";

/**
 * Query params for GET /metrics/owner/cards
 *
 * - **Custom range:** pass both `from` and `to` as `YYYY-MM-DD` (inclusive, UTC calendar dates).
 *   `preset` is ignored.
 * - **Preset:** pass `preset` (omit `from`/`to`). Defaults to `last_7_days` if nothing is sent.
 */
export type MetricsCardsQuery = {
  preset?: MetricsCardsPreset;
  /** Inclusive start, `YYYY-MM-DD` (UTC date). */
  from?: string;
  /** Inclusive end, `YYYY-MM-DD` (UTC date). */
  to?: string;
};

export type MetricCardFormat = "currency" | "percent";

export type MetricCard = {
  id:
    | "totalCollected"
    | "collectionRate"
    | "occupancyRate"
    | "outstandingBalance";
  value: number;
  previousValue: number | null;
  changePercent: number | null;
  format: MetricCardFormat;
};

/** Inclusive calendar range as ISO date-only strings. */
export type MetricsDateRange = {
  from: string;
  to: string;
};

export type MetricsCardsResponse = {
  /** Preset applied, or `null` when the range was custom (`from`/`to`). */
  preset: MetricsCardsPreset | null;
  /** Resolved current range (after preset expansion). */
  currentRange: MetricsDateRange;
  /** Same length in days as `currentRange`, ending the day before `currentRange.from`. */
  previousRange: MetricsDateRange;
  /** Inclusive day count for `currentRange`. */
  daysInPeriod: number;
  cards: {
    totalCollected: MetricCard;
    collectionRate: MetricCard;
    occupancyRate: MetricCard;
    outstandingBalance: MetricCard;
  };
};

/** GET /metrics/owner/cards — success envelope. */
export type MetricsCardsApiSuccess = {
  success: true;
  status: 200;
  message: string;
  data: MetricsCardsResponse;
};
