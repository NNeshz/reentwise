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
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { cn } from "@reentwise/ui/src/lib/utils";

import type { MetricCard } from "@reentwise/api/src/modules/metrics/types/metrics.types";
import { useMetricsCards } from "@/modules/metrics/hooks/use-metrics";

const currency = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(n);

const pct = (n: number) =>
  `${new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(n)}%`;

/** API / client may deserialize range edges as `Date`; React cannot render Date as text. */
function formatRangeEdge(value: string | Date | unknown): string {
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (typeof value === "string") return value;
  return String(value ?? "");
}

function formatMainValue(card: MetricCard): string {
  const n = Number(card.value);
  if (!Number.isFinite(n)) return "—";
  if (card.format === "currency") return currency(n);
  return pct(n);
}

function changeMeta(
  card: MetricCard,
  options: { inverseTrend?: boolean },
): {
  label: string;
  showUp: boolean | null;
  tone: "positive" | "negative" | "neutral";
} {
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

function footerCopy(
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

const CARD_META: Record<
  MetricCard["id"],
  { title: string; inverseTrend?: boolean }
> = {
  totalCollected: { title: "Ingresos cobrados" },
  collectionRate: { title: "Tasa de cobro" },
  occupancyRate: { title: "Ocupación" },
  outstandingBalance: { title: "Saldo pendiente", inverseTrend: true },
};

function MetricCardView({
  meta,
  card,
}: {
  meta: { title: string; inverseTrend?: boolean };
  card: MetricCard;
}) {
  const inverse = Boolean(meta.inverseTrend);
  const ch = changeMeta(card, { inverseTrend: inverse });
  const foot = footerCopy(card.id, card, { inverseTrend: inverse });
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
          {formatMainValue(card)}
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

function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="mb-4 h-9 w-36" />
          <Skeleton className="h-10 w-full" />
        </Card>
      ))}
    </div>
  );
}

export function MetricsCards() {
  const { data, isPending, isError, error, refetch } = useMetricsCards();

  if (isPending) {
    return <CardsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        <p className="font-medium">No se pudieron cargar las métricas.</p>
        <p className="mt-1 text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Intenta de nuevo más tarde."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 text-sm font-medium underline underline-offset-4"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const { cards } = data;

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <MetricCardView
        meta={CARD_META.totalCollected}
        card={cards.totalCollected}
      />
      <MetricCardView
        meta={CARD_META.collectionRate}
        card={cards.collectionRate}
      />
      <MetricCardView
        meta={CARD_META.occupancyRate}
        card={cards.occupancyRate}
      />
      <MetricCardView
        meta={CARD_META.outstandingBalance}
        card={cards.outstandingBalance}
      />
    </div>
  );
}
