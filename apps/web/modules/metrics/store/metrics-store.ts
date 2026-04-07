import { create } from "zustand";
import type { MetricsCardsQuery } from "@reentwise/api/src/modules/metrics/types/metrics.types";

/**
 * Filtro de periodo aplicado al instante (Zustand): al cambiar preset o rango,
 * TanStack Query vuelve a pedir las tarjetas (`useMetricsCards`).
 *
 * `query` → GET /metrics/owner/cards:
 * - `{ preset }` rangos rápidos, o
 * - `{ from, to }` (YYYY-MM-DD) rango custom — nunca ambos.
 */
type MetricsStore = {
  query: MetricsCardsQuery;
  setQuery: (query: MetricsCardsQuery) => void;
};

export const useMetricsStore = create<MetricsStore>((set) => ({
  query: { preset: "last_7_days" },
  setQuery: (query) => set({ query }),
}));
