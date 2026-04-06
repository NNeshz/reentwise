import { getPaymentDateForMonth } from "@reentwise/api/src/modules/tenants/tenants.service";
import { formatKapsoDayMonthSpanish } from "@reentwise/api/src/modules/kapso/kapso.service";

/** Next billing period due date label after `month`/`year` (for “completed” template). */
export function nextPaymentDueDateLabel(
  month: number,
  year: number,
  paymentDay: number,
): string {
  let nm = month + 1;
  let ny = year;
  if (nm > 12) {
    nm = 1;
    ny += 1;
  }
  const d = getPaymentDateForMonth(ny, nm, paymentDay);
  return formatKapsoDayMonthSpanish(d, nm);
}
