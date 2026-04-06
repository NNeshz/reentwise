/** Stable note prefix for cron reminder idempotency (note max 160 chars). */
export type CronReminderKind = "t7" | "t3" | "t0" | "late";

export function cronReminderNotePrefix(
  kind: CronReminderKind,
  targetDateYmd: string,
  tenantId: string,
): string {
  return `cron|${kind}|${targetDateYmd}|${tenantId}`;
}
