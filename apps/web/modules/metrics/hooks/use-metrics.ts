import { useQuery } from "@tanstack/react-query";
import { metricsService } from "@/modules/metrics/service/metrics-service";
import { useMetricsStore } from "@/modules/metrics/store/metrics-store";

export const METRICS_CARDS_QUERY_KEY = ["metrics", "cards"] as const;

/**
 * Loads dashboard metric cards for the current filter (`useMetricsStore`).
 * Refetches automatically when the store query changes.
 */
export function useMetricsCards() {
  const query = useMetricsStore((s) => s.query);

  return useQuery({
    queryKey: [
      ...METRICS_CARDS_QUERY_KEY,
      query.from ?? "",
      query.to ?? "",
      query.preset ?? "",
    ] as const,
    queryFn: () => metricsService.getCardsMetrics(query),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
