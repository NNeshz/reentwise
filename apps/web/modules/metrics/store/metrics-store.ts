import { create } from "zustand";
import type { MetricsCardsQuery } from "@reentwise/api/src/modules/metrics/types/metrics.types";

/**
 * `query` is sent to GET /metrics/owner/cards:
 * - `{ preset }` for quick ranges, or
 * - `{ from, to }` (YYYY-MM-DD) for a custom range — never both.
 */
type MetricsStore = {
  query: MetricsCardsQuery;
  setQuery: (query: MetricsCardsQuery) => void;
};

export const useMetricsStore = create<MetricsStore>((set) => ({
  query: { preset: "last_7_days" },
  setQuery: (query) => set({ query }),
}));
