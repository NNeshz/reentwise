import type { MetricCard } from "@reentwise/api/src/modules/metrics/types/metrics.types";

export function formatMetricCurrency(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatMetricPercent(n: number): string {
  return `${new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(n)}%`;
}

/** API / cliente pueden deserializar bordes de rango como `Date`. */
export function formatMetricRangeEdge(value: string | Date | unknown): string {
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (typeof value === "string") return value;
  return String(value ?? "");
}

export function formatMetricMainValue(card: MetricCard): string {
  const n = Number(card.value);
  if (!Number.isFinite(n)) return "—";
  if (card.format === "currency") return formatMetricCurrency(n);
  return formatMetricPercent(n);
}

export type MetricChangeMeta = {
  label: string;
  showUp: boolean | null;
  tone: "positive" | "negative" | "neutral";
};

export function metricChangeMeta(
  card: MetricCard,
  options: { inverseTrend?: boolean },
): MetricChangeMeta {
  const { inverseTrend = false } = options;
  if (card.changePercent === null) {
    return { label: "—", showUp: null, tone: "neutral" };
  }
  const v = card.changePercent;
  const label = `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
  const rawUp = v > 0;
  const rawDown = v < 0;
  const good = inverseTrend ? rawDown : rawUp;
  const bad = inverseTrend ? rawUp : rawDown;
  return {
    label,
    showUp: v > 0 ? true : v < 0 ? false : null,
    tone: good ? "positive" : bad ? "negative" : "neutral",
  };
}

export function metricFooterCopy(
  id: MetricCard["id"],
  card: MetricCard,
  options: { inverseTrend?: boolean },
): { headline: string; sub: string } {
  const { inverseTrend = false } = options;
  if (card.changePercent === null) {
    if (id === "occupancyRate") {
      return {
        headline: "Snapshot actual",
        sub: "Sin comparación con periodo anterior en el sistema.",
      };
    }
    return {
      headline: "Sin variación calculable",
      sub: "vs. periodo anterior",
    };
  }
  const v = card.changePercent;
  const improved = inverseTrend ? v < 0 : v > 0;
  const worsened = inverseTrend ? v > 0 : v < 0;
  if (improved) {
    return {
      headline: inverseTrend
        ? "Mejoró vs. el periodo anterior"
        : "Mejor que el periodo anterior",
      sub: "vs. periodo anterior",
    };
  }
  if (worsened) {
    return {
      headline: inverseTrend
        ? "Empeoró vs. el periodo anterior"
        : "Por debajo del periodo anterior",
      sub: "vs. periodo anterior",
    };
  }
  return {
    headline: "Sin cambio vs. periodo anterior",
    sub: "vs. periodo anterior",
  };
}

export const METRIC_CARD_META: Record<
  MetricCard["id"],
  { title: string; inverseTrend?: boolean }
> = {
  totalCollected: { title: "Ingresos cobrados" },
  collectionRate: { title: "Tasa de cobro" },
  occupancyRate: { title: "Ocupación" },
  outstandingBalance: { title: "Saldo pendiente", inverseTrend: true },
};
