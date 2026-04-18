import type { CronReminderKind } from "@reentwise/api/src/modules/audits/lib/cron-reminder-prefix";
import { getPaymentDateForMonth } from "@reentwise/api/src/modules/tenants/tenants.service";
import {
  type WallYmd,
  calendarDaysBetween,
  utcNoonForWallYmd,
} from "@reentwise/api/src/modules/cron/utils/cron-calendar";

export type ReminderTrigger = {
  targetDate: Date;
  kind: CronReminderKind;
};

/**
 * Ventanas de recordatorio (si el cron no corrió el día exacto, aún se envía una vez):
 * - T-7: entre 7 y 4 días antes del vencimiento
 * - T-3: entre 3 y 1 días antes
 * - Hoy: día de vencimiento
 * - Mora: +graceDays civiles después del vencimiento (default 2)
 */
export function buildReminderTriggersForDay(
  today: WallYmd,
  paymentDay: number,
  graceDays = 2,
): ReminderTrigger[] {
  const y = today.y;
  const m = today.m;

  const thisMonthDueD = getPaymentDateForMonth(y, m, paymentDay);
  const thisDue: WallYmd = { y, m, d: thisMonthDueD };
  const diffThisMonth = calendarDaysBetween(today, thisDue);

  const nextM = m === 12 ? 1 : m + 1;
  const nextY = m === 12 ? y + 1 : y;
  const nextMonthDueD = getPaymentDateForMonth(nextY, nextM, paymentDay);
  const nextDue: WallYmd = { y: nextY, m: nextM, d: nextMonthDueD };
  const diffNextMonth = calendarDaysBetween(today, nextDue);

  const triggers: ReminderTrigger[] = [];

  const pushT7 = (due: WallYmd) =>
    triggers.push({
      targetDate: utcNoonForWallYmd(due.y, due.m, due.d),
      kind: "t7",
    });
  const pushT3 = (due: WallYmd) =>
    triggers.push({
      targetDate: utcNoonForWallYmd(due.y, due.m, due.d),
      kind: "t3",
    });

  // T-7: 7..4 días antes (p. ej. vence 16 → corre del 9 al 12)
  if (diffThisMonth >= 4 && diffThisMonth <= 7) pushT7(thisDue);
  if (diffNextMonth >= 4 && diffNextMonth <= 7) pushT7(nextDue);

  // T-3: 3..1 días antes
  if (diffThisMonth >= 1 && diffThisMonth <= 3) pushT3(thisDue);
  if (diffNextMonth >= 1 && diffNextMonth <= 3) pushT3(nextDue);

  if (diffThisMonth === 0) {
    triggers.push({
      targetDate: utcNoonForWallYmd(thisDue.y, thisDue.m, thisDue.d),
      kind: "t0",
    });
  }

  // +graceDays de mora respecto al vencimiento de este mes
  if (diffThisMonth === -graceDays) {
    triggers.push({
      targetDate: utcNoonForWallYmd(thisDue.y, thisDue.m, thisDue.d),
      kind: "late",
    });
  }

  return triggers;
}
