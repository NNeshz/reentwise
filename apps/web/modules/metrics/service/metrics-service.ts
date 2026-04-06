import { apiClient } from "@/utils/api-connection";
import type {
  MetricsCardsApiSuccess,
  MetricsCardsQuery,
  MetricsCardsResponse,
} from "@reentwise/api/src/modules/metrics/types/metrics.types";

function buildCardsQuery(
  query: MetricsCardsQuery,
): { from: string; to: string } | { preset: NonNullable<MetricsCardsQuery["preset"]> } {
  if (query.from && query.to) {
    return { from: query.from, to: query.to };
  }
  return { preset: query.preset ?? "last_7_days" };
}

class MetricsService {
  async getCardsMetrics(query: MetricsCardsQuery): Promise<MetricsCardsResponse> {
    const response = await apiClient.metrics.owner.cards.get({
      query: buildCardsQuery(query),
    });

    if (response.error) {
      throw response.error.value;
    }

    const body = response.data as MetricsCardsApiSuccess;
    return body.data;
  }
}

export const metricsService = new MetricsService();
