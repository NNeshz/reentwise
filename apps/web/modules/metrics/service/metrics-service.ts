import { apiClient } from "@/utils/api-connection";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import type {
  MetricsCardsQuery,
  MetricsCardsResponse,
  MetricCard,
} from "@reentwise/api/src/modules/metrics/types/metrics.types";

function toServiceError(value: unknown, fallback: string): Error {
  return new Error(errorMessageFromUnknown(value, fallback));
}

function unwrapEnvelopeData(raw: unknown): unknown {
  if (raw === null || typeof raw !== "object") return raw;
  const o = raw as Record<string, unknown>;
  if (o.success === false && typeof o.message === "string") {
    throw new Error(o.message);
  }
  if ("data" in o) return o.data;
  return raw;
}

function isMetricCard(value: unknown): value is MetricCard {
  if (value === null || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    typeof c.value === "number" &&
    Number.isFinite(c.value) &&
    (c.format === "currency" || c.format === "percent") &&
    (c.previousValue === null || typeof c.previousValue === "number") &&
    (c.changePercent === null || typeof c.changePercent === "number")
  );
}

function isMetricsCardsResponse(data: unknown): data is MetricsCardsResponse {
  if (data === null || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (!d.cards || typeof d.cards !== "object") return false;
  const cards = d.cards as Record<string, unknown>;
  return (
    isMetricCard(cards.totalCollected) &&
    isMetricCard(cards.collectionRate) &&
    isMetricCard(cards.occupancyRate) &&
    isMetricCard(cards.outstandingBalance) &&
    typeof d.daysInPeriod === "number" &&
    d.currentRange !== null &&
    typeof d.currentRange === "object" &&
    d.previousRange !== null &&
    typeof d.previousRange === "object"
  );
}

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
      throw toServiceError(
        response.error.value,
        "No se pudieron cargar las métricas",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    if (!isMetricsCardsResponse(unwrapped)) {
      throw new Error("Respuesta inválida del servidor");
    }
    return unwrapped;
  }
}

export const metricsService = new MetricsService();
