"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@reentwise/ui/src/components/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@reentwise/ui/src/components/card";
import { cn } from "@reentwise/ui/src/lib/utils";
import type { MetricCard } from "@reentwise/api/src/modules/metrics/types/metrics.types";
import {
  formatMetricMainValue,
  metricChangeMeta,
  metricFooterCopy,
} from "@/modules/metrics/lib/metrics-display";

type Props = {
  meta: { title: string; inverseTrend?: boolean };
  card: MetricCard;
};

export function MetricCardView({ meta, card }: Props) {
  const inverse = Boolean(meta.inverseTrend);
  const ch = metricChangeMeta(card, { inverseTrend: inverse });
  const foot = metricFooterCopy(card.id, card, { inverseTrend: inverse });
  const TrendIcon =
    ch.showUp === true
      ? IconTrendingUp
      : ch.showUp === false
        ? IconTrendingDown
        : null;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{meta.title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formatMetricMainValue(card)}
        </CardTitle>
        <CardAction>
          <Badge
            variant="outline"
            className={cn(
              "gap-1 font-medium tabular-nums",
              ch.tone === "positive" &&
                "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
              ch.tone === "negative" &&
                "border-red-500/30 text-red-600 dark:text-red-400",
              ch.tone === "neutral" && "text-muted-foreground",
            )}
          >
            {ch.showUp === true && <IconTrendingUp className="size-3" />}
            {ch.showUp === false && <IconTrendingDown className="size-3" />}
            {ch.label}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 border-t-0 pt-0 text-sm">
        <div className="line-clamp-2 flex items-start gap-2 font-medium">
          <span>{foot.headline}</span>
          {TrendIcon ? (
            <TrendIcon
              className={cn(
                "mt-0.5 size-4 shrink-0",
                ch.tone === "positive" &&
                  "text-emerald-600 dark:text-emerald-400",
                ch.tone === "negative" && "text-red-600 dark:text-red-400",
              )}
            />
          ) : null}
        </div>
        <div className="text-muted-foreground">{foot.sub}</div>
      </CardFooter>
    </Card>
  );
}
