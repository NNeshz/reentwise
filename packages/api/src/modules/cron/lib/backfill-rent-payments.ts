import { db, eq, and, inArray } from "@reentwise/database";
import { payments, tenants, rooms } from "@reentwise/database";
import { getPaymentDateForMonth } from "@reentwise/api/src/modules/tenants/tenants.service";
import { calendarDaysUntil } from "@reentwise/api/src/modules/cron/utils/calendar-days";

/** No escanear más meses hacia atrás (evita bucles enormes si hay datos raros). */
const MAX_MONTHS_LOOKBACK = 60;

function localDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function periodKey(year: number, month: number): string {
  return `${year}-${month}`;
}

/**
 * Si el cron no corrió el día de cobro, crea el `payment` pendiente/mora.
 * Si ya existe pendiente o parcial y ya pasaron ≥2 días del vencimiento, marca `late` (sin reenviar avisos).
 */
export async function backfillRentPaymentsForTenant(
  tenant: typeof tenants.$inferSelect,
  room: typeof rooms.$inferSelect,
  today: Date,
  logs: string[],
): Promise<void> {
  const todayDate = localDateOnly(today);
  const startTs = tenant.startDate
    ? localDateOnly(tenant.startDate)
    : localDateOnly(tenant.createdAt ?? today);

  const capFirstOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() - MAX_MONTHS_LOOKBACK,
    1,
  );
  const contractFirstOfMonth = new Date(
    startTs.getFullYear(),
    startTs.getMonth(),
    1,
  );
  let iter =
    contractFirstOfMonth > capFirstOfMonth
      ? contractFirstOfMonth
      : capFirstOfMonth;

  const endY = today.getFullYear();
  const endMo = today.getMonth();
  const lastIncludedMonthStart = new Date(endY, endMo, 1).getTime();

  const periodsToCheck: { year: number; month: number; dueDate: Date }[] = [];
  while (iter.getTime() <= lastIncludedMonthStart) {
    const year = iter.getFullYear();
    const month = iter.getMonth() + 1;
    const dueDay = getPaymentDateForMonth(year, month, tenant.paymentDay);
    const dueDate = new Date(year, month - 1, dueDay);

    if (dueDate >= startTs && dueDate < todayDate) {
      periodsToCheck.push({ year, month, dueDate });
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

  for (const { year, month, dueDate } of periodsToCheck) {
    const daysPastDue = calendarDaysUntil(dueDate, todayDate);
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
