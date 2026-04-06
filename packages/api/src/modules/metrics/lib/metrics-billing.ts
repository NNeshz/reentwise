import { and, eq, or, payments, sql } from "@reentwise/database";

/** Billing months (year/month) overlapping the inclusive UTC date range. */
export function monthsOverlappingRange(
  from: Date,
  to: Date,
): { year: number; month: number }[] {
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

export function billingMonthsCondition(
  months: { year: number; month: number }[],
) {
  if (months.length === 0) {
    return sql`false`;
  }
  return or(
    ...months.map((mo) =>
      and(eq(payments.year, mo.year), eq(payments.month, mo.month)),
    ),
  )!;
}
