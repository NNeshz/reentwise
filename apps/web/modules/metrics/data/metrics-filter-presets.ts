import type { MetricsCardsPreset } from "@reentwise/api/src/modules/metrics/types/metrics.types";

/**
 * Presets del filtro de fechas (Zustand aplica al instante al elegir rango).
 */
export const METRICS_FILTER_PRESETS: { id: MetricsCardsPreset; label: string }[] =
  [
    { id: "today", label: "Hoy" },
    { id: "yesterday", label: "Ayer" },
    { id: "last_3_days", label: "Últimos 3 días" },
    { id: "last_7_days", label: "Últimos 7 días" },
    { id: "last_15_days", label: "Últimos 15 días" },
    { id: "last_30_days", label: "Últimos 30 días" },
    { id: "last_60_days", label: "Últimos 60 días" },
  ];
