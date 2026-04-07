"use client";

import { useMetricsCards } from "@/modules/metrics/hooks/use-metrics";
import { METRIC_CARD_META } from "@/modules/metrics/lib/metrics-display";
import { MetricCardView } from "./metric-card-view";
import { MetricsCardsSkeleton } from "./metrics-cards-skeleton";
import { MetricsCardsError } from "./metrics-cards-error";

export function MetricsCards() {
  const { data, isPending, isError, error, refetch, isRefetching } =
    useMetricsCards();

  if (isPending) {
    return <MetricsCardsSkeleton />;
  }

  if (isError || !data) {
    return (
      <MetricsCardsError
        error={error}
        onRetry={() => refetch()}
        isRetrying={isRefetching}
      />
    );
  }

  const { cards } = data;

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <MetricCardView meta={METRIC_CARD_META.totalCollected} card={cards.totalCollected} />
      <MetricCardView meta={METRIC_CARD_META.collectionRate} card={cards.collectionRate} />
      <MetricCardView meta={METRIC_CARD_META.occupancyRate} card={cards.occupancyRate} />
      <MetricCardView
        meta={METRIC_CARD_META.outstandingBalance}
        card={cards.outstandingBalance}
      />
    </div>
  );
}
