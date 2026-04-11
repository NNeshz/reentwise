/**
 * Plantillas Meta/WhatsApp (Kapso) — parámetros del cuerpo alineados con los nombres
 * aprobados en Kapso (`reentwise_*`; excepción: `reentwis_reminder_7d`). El nombre real
 * del envío viene de `kapsoTemplateName()` / variables `KAPSO_TEMPLATE_*`.
 */
import { env } from "@reentwise/api/src/utils/envs";
import { kapsoBodyParametersFromStrings, type TemplateComponent } from "./kapso.meta";

// ——— Nombres por defecto en Meta (sobrescribibles vía env) ———

export const KAPSO_DEFAULT_TEMPLATE_NAMES = {
  /** En Kapso el nombre aprobado es `reentwis_*` (typo Meta). */
  reminder_7d: "reentwis_reminder_7d",
  reminder_3d: "reentwise_reminder_3d",
  reminder_today: "reentwise_reminder_today",
  /** Alta de inquilino — nombre en dashboard: `reentwise_confirmation` */
  reminder_confirmation: "reentwise_confirmation",
  /** Ojo: Meta conserva el typo "recived" en el nombre interno */
  abono_recived: "reentwise_abono_recived",
  payment_completed: "reentwise_payment_completed",
  expiration_notice: "reentwise_expiration_notice",
} as const;

export type KapsoLogicalTemplateKey = keyof typeof KAPSO_DEFAULT_TEMPLATE_NAMES;

const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

function capitalizeSpanishMonthWord(lower: string): string {
  if (!lower) return lower;
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

const MXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

/** Monto en MXN para variables de tipo monto ({{5}}, {{4}}, etc.). */
export function formatKapsoCurrencyMx(amount: string | number): string {
  const n = Number(amount);
  return MXN.format(Number.isFinite(n) ? n : 0);
}

/**
 * Fecha legible tipo "1 de Abril" (día del mes + mes; month 1–12).
 * Útil para vencimientos y próximo cobro.
 */
export function formatKapsoDayMonthSpanish(
  day: number,
  month1to12: number,
): string {
  const idx = month1to12 - 1;
  const monthLower = MONTHS_ES[idx] ?? "mes";
  return `${day} de ${capitalizeSpanishMonthWord(monthLower)}`;
}

/** Solo nombre del mes capitalizado ("Marzo", "Abril") para período cubierto. */
export function formatKapsoMonthNameSpanish(month1to12: number): string {
  const idx = month1to12 - 1;
  const monthLower = MONTHS_ES[idx] ?? "";
  return capitalizeSpanishMonthWord(monthLower);
}

/**
 * Etiqueta de unidad alquilada, p. ej. "Edificio Centro — Habitación A-101".
 * `unitLabel` por defecto "Habitación"; usa "Local" u otro si aplica.
 */
export function formatKapsoPropertyLabel(input: {
  propertyName?: string | null;
  roomNumber: string;
  unitLabel?: string;
}): string {
  const unit = input.unitLabel?.trim() || "Habitación";
  const num = input.roomNumber.trim() || "—";
  const room = `${unit} ${num}`.trim();
  const pn = input.propertyName?.trim();
  if (pn) return `${pn} — ${room}`;
  return room;
}

/**
 * Día de corte para textos tipo "{{4}} de cada mes" — "1"…"31" o "último" si paymentDay === 0.
 */
export function formatKapsoPaymentCutoffDay(paymentDay: number): string {
  if (paymentDay === 0) return "último";
  return String(paymentDay);
}

function assertBodyCount(
  template: string,
  got: readonly string[],
  expected: number,
): void {
  if (got.length !== expected) {
    throw new Error(
      `[Kapso] Plantilla "${template}": se esperaban ${expected} variables de cuerpo, hay ${got.length}.`,
    );
  }
}

function toBody(
  template: string,
  params: readonly string[],
  expected: number,
): TemplateComponent[] {
  assertBodyCount(template, params, expected);
  return kapsoBodyParametersFromStrings([...params]);
}

// ——— Parámetros por plantilla (documentación = orden {{1}}, {{2}}, …) ———

export type KapsoReminder7dParams = {
  ownerName: string;
  tenantName: string;
  propertyLabel: string;
  dueDateLabel: string;
  amountFormatted: string;
};

/** reentwis_reminder_7d (nombre Meta) — 5 variables */
export function kapsoParamsReminder7d(
  p: KapsoReminder7dParams,
): [string, string, string, string, string] {
  return [
    p.ownerName,
    p.tenantName,
    p.propertyLabel,
    p.dueDateLabel,
    p.amountFormatted,
  ];
}

export function kapsoBodyReminder7d(p: KapsoReminder7dParams): TemplateComponent[] {
  return toBody("reentwis_reminder_7d", kapsoParamsReminder7d(p), 5);
}

export type KapsoReminder3dParams = KapsoReminder7dParams;

/** reentwise_reminder_3d — 5 variables (misma forma que 7d) */
export function kapsoParamsReminder3d(
  p: KapsoReminder3dParams,
): [string, string, string, string, string] {
  return kapsoParamsReminder7d(p);
}

export function kapsoBodyReminder3d(p: KapsoReminder3dParams): TemplateComponent[] {
  return toBody("reentwise_reminder_3d", kapsoParamsReminder3d(p), 5);
}

export type KapsoReminderTodayParams = {
  ownerName: string;
  tenantName: string;
  propertyLabel: string;
  amountFormatted: string;
};

/** reentwise_reminder_today — 4 variables */
export function kapsoParamsReminderToday(
  p: KapsoReminderTodayParams,
): [string, string, string, string] {
  return [
    p.ownerName,
    p.tenantName,
    p.propertyLabel,
    p.amountFormatted,
  ];
}

export function kapsoBodyReminderToday(
  p: KapsoReminderTodayParams,
): TemplateComponent[] {
  return toBody("reentwise_reminder_today", kapsoParamsReminderToday(p), 4);
}

export type KapsoReminderConfirmationParams = {
  tenantName: string;
  propertyLabel: string;
  monthlyRentFormatted: string;
  /** Texto para "día X de cada mes" — usar formatKapsoPaymentCutoffDay */
  paymentCutoffDayLabel: string;
};

/** reentwise_confirmation — 4 variables (bienvenida / contrato) */
export function kapsoParamsReminderConfirmation(
  p: KapsoReminderConfirmationParams,
): [string, string, string, string] {
  return [
    p.tenantName,
    p.propertyLabel,
    p.monthlyRentFormatted,
    p.paymentCutoffDayLabel,
  ];
}

export function kapsoBodyReminderConfirmation(
  p: KapsoReminderConfirmationParams,
): TemplateComponent[] {
  return toBody(
    "reentwise_confirmation",
    kapsoParamsReminderConfirmation(p),
    4,
  );
}

export type KapsoAbonoRecivedParams = {
  ownerName: string;
  tenantName: string;
  propertyLabel: string;
  amountReceivedFormatted: string;
  outstandingFormatted: string;
  fullPaymentDeadlineLabel: string;
};

/** reentwise_abono_recived — 6 variables */
export function kapsoParamsAbonoRecived(
  p: KapsoAbonoRecivedParams,
): [string, string, string, string, string, string] {
  return [
    p.ownerName,
    p.tenantName,
    p.propertyLabel,
    p.amountReceivedFormatted,
    p.outstandingFormatted,
    p.fullPaymentDeadlineLabel,
  ];
}

export function kapsoBodyAbonoRecived(
  p: KapsoAbonoRecivedParams,
): TemplateComponent[] {
  return toBody("reentwise_abono_recived", kapsoParamsAbonoRecived(p), 6);
}

export type KapsoPaymentCompletedParams = {
  ownerName: string;
  tenantName: string;
  propertyLabel: string;
  amountReceivedFormatted: string;
  paymentRegisteredDateLabel: string;
  coveredPeriodMonthName: string;
  nextChargeDateLabel: string;
};

/** reentwise_payment_completed — 7 variables */
export function kapsoParamsPaymentCompleted(
  p: KapsoPaymentCompletedParams,
): [string, string, string, string, string, string, string] {
  return [
    p.ownerName,
    p.tenantName,
    p.propertyLabel,
    p.amountReceivedFormatted,
    p.paymentRegisteredDateLabel,
    p.coveredPeriodMonthName,
    p.nextChargeDateLabel,
  ];
}

export function kapsoBodyPaymentCompleted(
  p: KapsoPaymentCompletedParams,
): TemplateComponent[] {
  return toBody(
    "reentwise_payment_completed",
    kapsoParamsPaymentCompleted(p),
    7,
  );
}

export type KapsoExpirationNoticeParams = {
  ownerName: string;
  tenantName: string;
  propertyLabel: string;
  dueDateLabel: string;
  daysElapsedLabel: string;
  originalAmountFormatted: string;
  lateFeeFormatted: string;
  totalPendingFormatted: string;
};

/** reentwise_expiration_notice — 8 variables */
export function kapsoParamsExpirationNotice(
  p: KapsoExpirationNoticeParams,
): [string, string, string, string, string, string, string, string] {
  return [
    p.ownerName,
    p.tenantName,
    p.propertyLabel,
    p.dueDateLabel,
    p.daysElapsedLabel,
    p.originalAmountFormatted,
    p.lateFeeFormatted,
    p.totalPendingFormatted,
  ];
}

export function kapsoBodyExpirationNotice(
  p: KapsoExpirationNoticeParams,
): TemplateComponent[] {
  return toBody(
    "reentwise_expiration_notice",
    kapsoParamsExpirationNotice(p),
    8,
  );
}

/** Fecha corta para "hoy" u otra fecha de registro (zona local). */
export function formatKapsoDateShortSpanish(date: Date): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Nombre del template en Meta según clave lógica.
 * `reminder_confirmation` usa `KAPSO_WELCOME_TEMPLATE_NAME` (historial / .env).
 */
export function kapsoTemplateName(key: KapsoLogicalTemplateKey): string {
  switch (key) {
    case "reminder_7d":
      return env.KAPSO_TEMPLATE_REMINDER_7D;
    case "reminder_3d":
      return env.KAPSO_TEMPLATE_REMINDER_3D;
    case "reminder_today":
      return env.KAPSO_TEMPLATE_REMINDER_TODAY;
    case "reminder_confirmation":
      return env.KAPSO_WELCOME_TEMPLATE_NAME;
    case "abono_recived":
      return env.KAPSO_TEMPLATE_ABONO_RECIVED;
    case "payment_completed":
      return env.KAPSO_TEMPLATE_PAYMENT_COMPLETED;
    case "expiration_notice":
      return env.KAPSO_TEMPLATE_EXPIRATION_NOTICE;
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}
