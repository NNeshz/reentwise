import { db, eq, and, inArray } from "@reentwise/database";
import { payments, tenants, rooms } from "@reentwise/database";
import { getPaymentDateForMonth } from "@reentwise/api/src/modules/tenants/tenants.service";
import {
  type WallYmd,
  calendarDaysBetween,
  cronTimezone,
  wallYmdInCronTz,
} from "@reentwise/api/src/modules/cron/utils/cron-calendar";

/** No escanear más meses hacia atrás (evita bucles enormes si hay datos raros). */
const MAX_MONTHS_LOOKBACK = 60;

function periodKey(year: number, month: number): string {
  return `${year}-${month}`;
}

function wallYmdFromDateField(d: Date, tz: string): WallYmd {
  try {
    return wallYmdInCronTz(d, tz);
  } catch {
    return wallYmdInCronTz(d, cronTimezone());
  }
}

/**
 * Si el cron no corrió el día de cobro, crea el `payment` pendiente/mora.
 * Si ya existe pendiente o parcial y ya pasaron ≥2 días del vencimiento, marca `late` (sin reenviar avisos).
 */
export async function backfillRentPaymentsForTenant(
  tenant: typeof tenants.$inferSelect,
  room: typeof rooms.$inferSelect,
  todayWall: WallYmd,
  logs: string[],
  wallClockTz: string,
): Promise<void> {
  const startWall = tenant.startDate
    ? wallYmdFromDateField(new Date(tenant.startDate), wallClockTz)
    : wallYmdFromDateField(new Date(tenant.createdAt ?? Date.now()), wallClockTz);

  const capFirst = new Date(
    todayWall.y,
    todayWall.m - 1 - MAX_MONTHS_LOOKBACK,
    1,
  );
  const contractFirst = new Date(startWall.y, startWall.m - 1, 1);
  let iter =
    contractFirst.getTime() > capFirst.getTime() ? contractFirst : capFirst;

  const lastIncludedMonthStart = new Date(
    todayWall.y,
    todayWall.m - 1,
    1,
  ).getTime();

  const periodsToCheck: { year: number; month: number; dueWall: WallYmd }[] =
    [];
  while (iter.getTime() <= lastIncludedMonthStart) {
    const year = iter.getFullYear();
    const month = iter.getMonth() + 1;
    const dueDay = getPaymentDateForMonth(year, month, tenant.paymentDay);
    const dueWall: WallYmd = { y: year, m: month, d: dueDay };

    const dueVsStart = calendarDaysBetween(startWall, dueWall);
    /** Días desde el vencimiento hasta hoy; > 0 si el cobro ya debió existir (venció antes que hoy). */
    const daysSinceDue = calendarDaysBetween(dueWall, todayWall);
    if (dueVsStart >= 0 && daysSinceDue > 0) {
      periodsToCheck.push({ year, month, dueWall });
    }

    iter.setMonth(iter.getMonth() + 1);
  }

  if (periodsToCheck.length === 0) return;

  const years = [...new Set(periodsToCheck.map((p) => p.year))];
  const existingRows = await db.query.payments.findMany({
    where: and(
      eq(payments.tenantId, tenant.id),
      inArray(payments.year, years),
    ),
  });
  const byPeriod = new Map(
    existingRows.map((row) => [periodKey(row.year, row.month), row]),
  );

  for (const { year, month, dueWall } of periodsToCheck) {
    const daysPastDue = calendarDaysBetween(dueWall, todayWall);
    const shouldBeLate = daysPastDue >= 2;
    const existing = byPeriod.get(periodKey(year, month));

    if (!existing) {
      await db.insert(payments).values({
        tenantId: tenant.id,
        amount: room.price.toString(),
        month,
        year,
        status: shouldBeLate ? "late" : "pending",
      });
      logs.push(
        `[BACKFILL] Cobro ${month}/${year} para ${tenant.name} (${shouldBeLate ? "mora" : "pendiente"})`,
      );
    } else if (
      shouldBeLate &&
      (existing.status === "pending" || existing.status === "partial")
    ) {
      await db
        .update(payments)
        .set({ status: "late", updatedAt: new Date() })
        .where(eq(payments.id, existing.id));
      logs.push(
        `[BACKFILL] Mora ${month}/${year} para ${tenant.name} (pendiente/parcial → late)`,
      );
    }
  }
}
