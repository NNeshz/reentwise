import { sql } from "@reentwise/database";
import { tenants } from "@reentwise/database";

export type TenantAnchorDates = {
  startDate: Date | null;
  createdAt: Date | null;
};

/** Primer mes de cobro: mes calendario de `startDate`, o de `createdAt` si no hay inicio explícito. */
export function firstBillableYearMonth(row: TenantAnchorDates): {
  year: number;
  month: number;
} {
  const anchor = row.startDate ?? row.createdAt;
  if (!anchor) {
    return { year: 1970, month: 1 };
  }
  const d = anchor instanceof Date ? anchor : new Date(anchor);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

/**
 * SQL: el periodo `year`/`month` es >= mes de alta (COALESCE start_date, created_at).
 * Usar en queries que ya tienen `tenants` en el FROM.
 */
export function tenantReachedBillingPeriod(year: number, month: number) {
  const periodKey = year * 100 + month;
  return sql`(${sql.raw(String(periodKey))} >= (EXTRACT(YEAR FROM COALESCE(${tenants.startDate}, ${tenants.createdAt}))::int * 100 + EXTRACT(MONTH FROM COALESCE(${tenants.startDate}, ${tenants.createdAt}))::int))`;
}
