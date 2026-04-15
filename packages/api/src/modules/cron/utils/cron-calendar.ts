import { env } from "@reentwise/api/src/utils/envs";

export type WallYmd = { y: number; m: number; d: number };

const DEFAULT_TZ = "America/Mexico_City";

/** TZ usada para “hoy” del cron (vencimientos y recordatorios). */
export function cronTimezone(): string {
  return env.CRON_TIMEZONE?.trim() || DEFAULT_TZ;
}

/** IANA del dueño si está en perfil; si no, misma TZ que el resto del cron (`CRON_TIMEZONE`). */
export function ownerWallClockTz(
  ownerTimezone: string | null | undefined,
): string {
  const t = ownerTimezone?.trim();
  if (t) return t;
  return cronTimezone();
}

/**
 * Fecha civil “hoy” para el dueño. Si `user.timezone` no es IANA válida, se usa `cronTimezone()`.
 */
export function wallYmdForOwner(
  instant: Date,
  ownerTimezone: string | null | undefined,
): WallYmd {
  const tz = ownerWallClockTz(ownerTimezone);
  try {
    return wallYmdInCronTz(instant, tz);
  } catch {
    return wallYmdInCronTz(instant, cronTimezone());
  }
}

/**
 * Fecha civil (año-mes-día) en la zona del cron, a partir de un instante.
 * Evita que un servidor en UTC dispare recordatorios un día antes/después.
 */
export function wallYmdInCronTz(instant: Date, tz = cronTimezone()): WallYmd {
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = dtf.formatToParts(instant);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");
  return { y: get("year"), m: get("month"), d: get("day") };
}

/** Días de calendario de `from` a `to` (solo fecha civil; positivo si `to` es después). */
export function calendarDaysBetween(from: WallYmd, to: WallYmd): number {
  const t1 = Date.UTC(from.y, from.m - 1, from.d);
  const t2 = Date.UTC(to.y, to.m - 1, to.d);
  return Math.round((t2 - t1) / 86_400_000);
}

/**
 * `Date` con medianoche UTC en el día civil dado; usar solo con getters UTC * (`getUTCFullYear`, etc.) para mes/año/día de vencimiento.
 */
export function utcNoonForWallYmd(y: number, m: number, d: number): Date {
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}
