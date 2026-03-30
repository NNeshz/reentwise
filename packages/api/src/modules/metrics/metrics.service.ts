import {
  and,
  count,
  db,
  eq,
  inArray,
  or,
  payments,
  properties,
  rooms,
  sql,
  sum,
  tenants,
} from "@reentwise/database";
import type {
  MetricsCardsPreset,
  MetricsCardsQuery,
  MetricsCardsResponse,
  MetricsDateRange,
} from "@reentwise/api/src/modules/metrics/types/metrics.types";

function utcToday(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function addDaysUTC(d: Date, delta: number): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + delta),
  );
}

/** Inclusive calendar days between two UTC date-only instants. */
function diffDaysInclusive(from: Date, to: Date): number {
  const a = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  const b = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
  return Math.floor((b - a) / 86_400_000) + 1;
}

function isoDateUTC(d: Date): string {
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  const da = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}

function parseIsoDateOnly(s: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) throw new MetricsQueryError("from/to must be YYYY-MM-DD");
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) throw new MetricsQueryError("Invalid from/to date");
  return new Date(Date.UTC(y, mo - 1, d));
}

function previousPeriodRange(from: Date, to: Date): { from: Date; to: Date } {
  const days = diffDaysInclusive(from, to);
  const prevTo = addDaysUTC(from, -1);
  const prevFrom = addDaysUTC(prevTo, -(days - 1));
  return { from: prevFrom, to: prevTo };
}

function presetToRange(preset: MetricsCardsPreset): { from: Date; to: Date } {
  const today = utcToday();
  switch (preset) {
    case "today":
      return { from: today, to: today };
    case "yesterday": {
      const y = addDaysUTC(today, -1);
      return { from: y, to: y };
    }
    case "last_3_days":
      return { from: addDaysUTC(today, -2), to: today };
    case "last_7_days":
      return { from: addDaysUTC(today, -6), to: today };
    case "last_15_days":
      return { from: addDaysUTC(today, -14), to: today };
    case "last_30_days":
      return { from: addDaysUTC(today, -29), to: today };
    case "last_60_days":
      return { from: addDaysUTC(today, -59), to: today };
    default: {
      const _exhaustive: never = preset;
      return _exhaustive;
    }
  }
}

export class MetricsQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MetricsQueryError";
  }
}

function resolveRanges(query: MetricsCardsQuery): {
  currentFrom: Date;
  currentTo: Date;
  previousFrom: Date;
  previousTo: Date;
  preset: MetricsCardsPreset | null;
} {
  const hasFrom = Boolean(query.from);
  const hasTo = Boolean(query.to);
  if (hasFrom !== hasTo) {
    throw new MetricsQueryError("from and to must be provided together");
  }

  if (query.from && query.to) {
    const currentFrom = parseIsoDateOnly(query.from);
    const currentTo = parseIsoDateOnly(query.to);
    if (currentFrom > currentTo) {
      throw new MetricsQueryError("from must be on or before to");
    }
    const { from: previousFrom, to: previousTo } = previousPeriodRange(
      currentFrom,
      currentTo,
    );
    return {
      currentFrom,
      currentTo,
      previousFrom,
      previousTo,
      preset: null,
    };
  }

  const preset: MetricsCardsPreset = query.preset ?? "last_7_days";
  const { from: currentFrom, to: currentTo } = presetToRange(preset);
  const { from: previousFrom, to: previousTo } = previousPeriodRange(
    currentFrom,
    currentTo,
  );
  return {
    currentFrom,
    currentTo,
    previousFrom,
    previousTo,
    preset,
  };
}

/** Billing months (year/month) that overlap the inclusive UTC date range. */
function monthsOverlappingRange(from: Date, to: Date): { year: number; month: number }[] {
  const result: { year: number; month: number }[] = [];
  let y = from.getUTCFullYear();
  let m = from.getUTCMonth() + 1;
  const endKey = to.getUTCFullYear() * 100 + to.getUTCMonth() + 1;
  for (;;) {
    const key = y * 100 + m;
    if (key > endKey) break;
    result.push({ year: y, month: m });
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return result;
}

function billingMonthsCondition(months: { year: number; month: number }[]) {
  if (months.length === 0) {
    return sql`false`;
  }
  return or(
    ...months.map((mo) =>
      and(eq(payments.year, mo.year), eq(payments.month, mo.month)),
    ),
  )!;
}

function ownerPaymentScope(ownerId: string) {
  return or(eq(tenants.ownerId, ownerId), eq(properties.ownerId, ownerId));
}

function parseDecimal(value: string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function computeChangePercent(
  value: number,
  previousValue: number | null,
): number | null {
  if (previousValue === null) return null;
  if (previousValue === 0) {
    if (value === 0) return 0;
    return null;
  }
  return round2(((value - previousValue) / Math.abs(previousValue)) * 100);
}

function toMetricsDateRange(from: Date, to: Date): MetricsDateRange {
  return { from: isoDateUTC(from), to: isoDateUTC(to) };
}

export class MetricsService {
  private async sumPaymentsForBillingMonths(
    ownerId: string,
    months: { year: number; month: number }[],
  ): Promise<{ totalCollected: number; totalDue: number }> {
    if (months.length === 0) {
      return { totalCollected: 0, totalDue: 0 };
    }

    const [row] = await db
      .select({
        totalCollected: sum(payments.amountPaid),
        totalDue: sum(payments.amount),
      })
      .from(payments)
      .innerJoin(tenants, eq(payments.tenantId, tenants.id))
      .leftJoin(rooms, eq(tenants.roomId, rooms.id))
      .leftJoin(properties, eq(rooms.propertyId, properties.id))
      .where(
        and(
          eq(payments.isAnnulled, false),
          ownerPaymentScope(ownerId),
          billingMonthsCondition(months),
        ),
      );

    return {
      totalCollected: parseDecimal(row?.totalCollected ?? undefined),
      totalDue: parseDecimal(row?.totalDue ?? undefined),
    };
  }

  private async sumOutstandingForBillingMonths(
    ownerId: string,
    months: { year: number; month: number }[],
  ): Promise<number> {
    if (months.length === 0) {
      return 0;
    }

    const [row] = await db
      .select({
        total: sql<string>`coalesce(
          sum((${payments.amount}::numeric - ${payments.amountPaid}::numeric)),
          0
        )`,
      })
      .from(payments)
      .innerJoin(tenants, eq(payments.tenantId, tenants.id))
      .leftJoin(rooms, eq(tenants.roomId, rooms.id))
      .leftJoin(properties, eq(rooms.propertyId, properties.id))
      .where(
        and(
          eq(payments.isAnnulled, false),
          ownerPaymentScope(ownerId),
          billingMonthsCondition(months),
          inArray(payments.status, ["pending", "partial", "late"]),
        ),
      );

    return round2(parseDecimal(row?.total));
  }

  private async occupancySnapshot(ownerId: string): Promise<{
    ratePercent: number;
    occupiedRooms: number;
    totalRooms: number;
  }> {
    const [tot] = await db
      .select({ n: count() })
      .from(rooms)
      .innerJoin(properties, eq(rooms.propertyId, properties.id))
      .where(eq(properties.ownerId, ownerId));

    const [occ] = await db
      .select({ n: count() })
      .from(rooms)
      .innerJoin(properties, eq(rooms.propertyId, properties.id))
      .where(
        and(
          eq(properties.ownerId, ownerId),
          inArray(rooms.status, ["occupied", "reserved"]),
        ),
      );

    const totalRooms = Number(tot?.n ?? 0);
    const occupiedRooms = Number(occ?.n ?? 0);
    const ratePercent =
      totalRooms === 0 ? 0 : round2((occupiedRooms / totalRooms) * 100);

    return { ratePercent, occupiedRooms, totalRooms };
  }

  async getCardsMetrics(
    ownerId: string,
    query: MetricsCardsQuery,
  ): Promise<MetricsCardsResponse> {
    const {
      currentFrom,
      currentTo,
      previousFrom,
      previousTo,
      preset,
    } = resolveRanges(query);

    const currentMonths = monthsOverlappingRange(currentFrom, currentTo);
    const previousMonths = monthsOverlappingRange(previousFrom, previousTo);

    const [curPay, prevPay, curOutstanding, prevOutstanding, occ] =
      await Promise.all([
        this.sumPaymentsForBillingMonths(ownerId, currentMonths),
        this.sumPaymentsForBillingMonths(ownerId, previousMonths),
        this.sumOutstandingForBillingMonths(ownerId, currentMonths),
        this.sumOutstandingForBillingMonths(ownerId, previousMonths),
        this.occupancySnapshot(ownerId),
      ]);

    const collectionRateCurrent =
      curPay.totalDue === 0
        ? 0
        : round2((curPay.totalCollected / curPay.totalDue) * 100);
    const collectionRatePrevious =
      prevPay.totalDue === 0
        ? 0
        : round2((prevPay.totalCollected / prevPay.totalDue) * 100);

    const daysInPeriod = diffDaysInclusive(currentFrom, currentTo);

    const totalCollectedCard = {
      id: "totalCollected" as const,
      value: round2(curPay.totalCollected),
      previousValue: round2(prevPay.totalCollected),
      changePercent: computeChangePercent(
        round2(curPay.totalCollected),
        round2(prevPay.totalCollected),
      ),
      format: "currency" as const,
    };

    const collectionRateCard = {
      id: "collectionRate" as const,
      value: collectionRateCurrent,
      previousValue: collectionRatePrevious,
      changePercent: computeChangePercent(
        collectionRateCurrent,
        collectionRatePrevious,
      ),
      format: "percent" as const,
    };

    const occupancyRateCard = {
      id: "occupancyRate" as const,
      value: occ.ratePercent,
      previousValue: null,
      changePercent: null,
      format: "percent" as const,
    };

    const outstandingCard = {
      id: "outstandingBalance" as const,
      value: round2(curOutstanding),
      previousValue: round2(prevOutstanding),
      changePercent: computeChangePercent(
        round2(curOutstanding),
        round2(prevOutstanding),
      ),
      format: "currency" as const,
    };

    return {
      preset,
      currentRange: toMetricsDateRange(currentFrom, currentTo),
      previousRange: toMetricsDateRange(previousFrom, previousTo),
      daysInPeriod,
      cards: {
        totalCollected: totalCollectedCard,
        collectionRate: collectionRateCard,
        occupancyRate: occupancyRateCard,
        outstandingBalance: outstandingCard,
      },
    };
  }
}

export const metricsService = new MetricsService();
