/** Calendar day of month for rent due date (`0` = last day of month). */
export function getPaymentDateForMonth(
  year: number,
  month: number,
  paymentDay: number,
): number {
  if (paymentDay < 0 || paymentDay > 31) return 1;
  const lastDay = new Date(year, month, 0).getDate();
  if (paymentDay === 0) return lastDay;
  return Math.min(paymentDay, lastDay);
}
