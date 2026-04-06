import type { CronReminderKind } from "@reentwise/api/src/modules/audits/lib/cron-reminder-prefix";
import { getPaymentDateForMonth } from "@reentwise/api/src/modules/tenants/tenants.service";
import { calendarDaysUntil } from "@reentwise/api/src/modules/cron/utils/calendar-days";

export type ReminderTrigger = {
  targetDate: Date;
  kind: CronReminderKind;
};

/** Which reminder windows apply for this tenant on `today` (payment-day rules). */
export function buildReminderTriggersForDay(
  today: Date,
  paymentDay: number,
): ReminderTrigger[] {
  const y = today.getFullYear();
  const m = today.getMonth();

  const thisMonthDay = getPaymentDateForMonth(y, m + 1, paymentDay);
  const thisMonthDate = new Date(y, m, thisMonthDay);

  const nextMonth = m + 1;
  const nextMonthYear = nextMonth > 11 ? y + 1 : y;
  const nextMonthIndex = nextMonth > 11 ? 0 : nextMonth;
  const nextMonthDay = getPaymentDateForMonth(
    nextMonthYear,
    nextMonthIndex + 1,
    paymentDay,
  );
  const nextMonthDate = new Date(nextMonthYear, nextMonthIndex, nextMonthDay);

  const diffThisMonth = calendarDaysUntil(today, thisMonthDate);
  const diffNextMonth = calendarDaysUntil(today, nextMonthDate);

  const triggers: ReminderTrigger[] = [];
  if (diffThisMonth === 7) triggers.push({ targetDate: thisMonthDate, kind: "t7" });
  if (diffNextMonth === 7) triggers.push({ targetDate: nextMonthDate, kind: "t7" });
  if (diffThisMonth === 3) triggers.push({ targetDate: thisMonthDate, kind: "t3" });
  if (diffNextMonth === 3) triggers.push({ targetDate: nextMonthDate, kind: "t3" });
  if (diffThisMonth === 0) triggers.push({ targetDate: thisMonthDate, kind: "t0" });
  if (diffThisMonth === -2) triggers.push({ targetDate: thisMonthDate, kind: "late" });

  return triggers;
}
