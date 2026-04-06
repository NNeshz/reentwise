import {
  and,
  count,
  db,
  eq,
  inArray,
  payments,
  properties,
  rooms,
  sql,
  sum,
  tenants,
} from "@reentwise/database";
import type {
  MetricsCardsQuery,
  MetricsCardsResponse,
} from "@reentwise/api/src/modules/metrics/types/metrics.types";
import { billingMonthsCondition, monthsOverlappingRange } from "@reentwise/api/src/modules/metrics/lib/metrics-billing";
import { ownerPaymentScope } from "@reentwise/api/src/modules/metrics/lib/metrics-owner-scope";
import {
  computeChangePercent,
  parseDecimal,
  round2,
} from "@reentwise/api/src/modules/metrics/lib/metrics-math";
import {
  resolveMetricsRanges,
  toMetricsDateRange,
} from "@reentwise/api/src/modules/metrics/lib/metrics-range";
import { diffDaysInclusive } from "@reentwise/api/src/modules/metrics/utils/metrics-date-utc";

export { MetricsQueryError } from "@reentwise/api/src/modules/metrics/lib/metrics-query-error";

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

  /** Owner dashboard cards: collections, rates, occupancy snapshot, outstanding. */
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
    } = resolveMetricsRanges(query);

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
