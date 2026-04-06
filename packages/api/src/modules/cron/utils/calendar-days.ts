/**
 * Whole calendar days from `from` to `until` (local midnight to midnight).
 * Positive = `until` is after `from`.
 */
export function calendarDaysUntil(from: Date, until: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(until.getFullYear(), until.getMonth(), until.getDate());
  return Math.ceil((b.getTime() - a.getTime()) / 86_400_000);
}
