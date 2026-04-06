/**
 * HTML/text subjects for Resend — same field meanings as WhatsApp body params in
 * `kapso/kapso.templates.ts` ({{1}}…{{n}} order).
 */
import type {
  KapsoReminder7dParams,
  KapsoReminderTodayParams,
  KapsoReminderConfirmationParams,
  KapsoAbonoRecivedParams,
  KapsoPaymentCompletedParams,
  KapsoExpirationNoticeParams,
} from "@reentwise/api/src/modules/kapso/kapso.templates";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function emailWelcomeConfirmation(p: KapsoReminderConfirmationParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Bienvenido a Reentwise";
  const html = `
<p>Hola ${esc(p.tenantName)},</p>
<p>Tu registro como inquilino quedó creado en Reentwise.</p>
<p><strong>Unidad:</strong> ${esc(p.propertyLabel)}</p>
<p><strong>Renta mensual:</strong> ${esc(p.monthlyRentFormatted)}</p>
<p><strong>Día de pago:</strong> ${esc(p.paymentCutoffDayLabel)} de cada mes</p>
<p>Si tienes dudas, responde a este correo.</p>`.trim();
  const text = `Hola ${p.tenantName}. Bienvenido a Reentwise. ${p.propertyLabel}. Renta: ${p.monthlyRentFormatted}. Día de pago: ${p.paymentCutoffDayLabel}.`;
  return { subject, html, text };
}

export function emailReminder7d(p: KapsoReminder7dParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Recordatorio: tu renta vence en 7 días";
  const html = `
<p>Hola ${esc(p.tenantName)},</p>
<p>${esc(p.ownerName)} te recuerda el pago de renta.</p>
<p><strong>Unidad:</strong> ${esc(p.propertyLabel)}</p>
<p><strong>Fecha límite:</strong> ${esc(p.dueDateLabel)}</p>
<p><strong>Monto:</strong> ${esc(p.amountFormatted)}</p>
<p>Mensaje automático de Reentwise.</p>`.trim();
  const text = `Hola ${p.tenantName}. ${p.ownerName} recuerda tu renta. ${p.propertyLabel}. Vence: ${p.dueDateLabel}. Monto: ${p.amountFormatted}.`;
  return { subject, html, text };
}

export function emailReminder3d(p: KapsoReminder7dParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Recordatorio: tu renta vence en 3 días";
  const html = `
<p>Hola ${esc(p.tenantName)},</p>
<p>${esc(p.ownerName)} te recuerda que en 3 días vence tu renta.</p>
<p><strong>Unidad:</strong> ${esc(p.propertyLabel)}</p>
<p><strong>Fecha límite:</strong> ${esc(p.dueDateLabel)}</p>
<p><strong>Monto:</strong> ${esc(p.amountFormatted)}</p>
<p>Mensaje automático de Reentwise.</p>`.trim();
  const text = `Hola ${p.tenantName}. En 3 días vence tu renta. ${p.propertyLabel}. ${p.dueDateLabel}. ${p.amountFormatted}.`;
  return { subject, html, text };
}

export function emailReminderToday(p: KapsoReminderTodayParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Hoy es la fecha límite de tu renta";
  const html = `
<p>Hola ${esc(p.tenantName)},</p>
<p>${esc(p.ownerName)} te informa que <strong>hoy</strong> vence tu pago de renta.</p>
<p><strong>Unidad:</strong> ${esc(p.propertyLabel)}</p>
<p><strong>Monto:</strong> ${esc(p.amountFormatted)}</p>
<p>Mensaje automático de Reentwise.</p>`.trim();
  const text = `Hola ${p.tenantName}. Hoy vence tu renta. ${p.propertyLabel}. ${p.amountFormatted}.`;
  return { subject, html, text };
}

export function emailAbonoReceived(p: KapsoAbonoRecivedParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Abono registrado en tu renta";
  const html = `
<p>Hola ${esc(p.tenantName)},</p>
<p>${esc(p.ownerName)} registró un abono a tu renta.</p>
<p><strong>Unidad:</strong> ${esc(p.propertyLabel)}</p>
<p><strong>Abono:</strong> ${esc(p.amountReceivedFormatted)}</p>
<p><strong>Pendiente:</strong> ${esc(p.outstandingFormatted)}</p>
<p><strong>Regularizar antes de:</strong> ${esc(p.fullPaymentDeadlineLabel)}</p>
<p>Mensaje automático de Reentwise.</p>`.trim();
  const text = `Hola ${p.tenantName}. Abono: ${p.amountReceivedFormatted}. Pendiente: ${p.outstandingFormatted}. Fecha límite: ${p.fullPaymentDeadlineLabel}.`;
  return { subject, html, text };
}

export function emailExpirationNotice(p: KapsoExpirationNoticeParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Aviso: renta vencida";
  const html = `
<p>Hola ${esc(p.tenantName)},</p>
<p>${esc(p.ownerName)} te informa sobre un atraso en tu renta.</p>
<p><strong>Unidad:</strong> ${esc(p.propertyLabel)}</p>
<p><strong>Vencimiento:</strong> ${esc(p.dueDateLabel)}</p>
<p><strong>Días de atraso:</strong> ${esc(p.daysElapsedLabel)}</p>
<p><strong>Monto original:</strong> ${esc(p.originalAmountFormatted)}</p>
<p><strong>Recargos:</strong> ${esc(p.lateFeeFormatted)}</p>
<p><strong>Total pendiente:</strong> ${esc(p.totalPendingFormatted)}</p>
<p>Mensaje automático de Reentwise.</p>`.trim();
  const text = `Hola ${p.tenantName}. Aviso de mora. ${p.propertyLabel}. ${p.dueDateLabel}. Atraso: ${p.daysElapsedLabel} días. Pendiente: ${p.totalPendingFormatted}.`;
  return { subject, html, text };
}

export function emailPaymentCompleted(p: KapsoPaymentCompletedParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Pago de renta completado";
  const html = `
<p>Hola ${esc(p.tenantName)},</p>
<p>${esc(p.ownerName)} confirmó el pago de tu renta.</p>
<p><strong>Unidad:</strong> ${esc(p.propertyLabel)}</p>
<p><strong>Monto:</strong> ${esc(p.amountReceivedFormatted)}</p>
<p><strong>Registrado:</strong> ${esc(p.paymentRegisteredDateLabel)}</p>
<p><strong>Período cubierto:</strong> ${esc(p.coveredPeriodMonthName)}</p>
<p><strong>Próximo cobro:</strong> ${esc(p.nextChargeDateLabel)}</p>
<p>Mensaje automático de Reentwise.</p>`.trim();
  const text = `Hola ${p.tenantName}. Pago completado ${p.paymentRegisteredDateLabel}. Período: ${p.coveredPeriodMonthName}. Próximo cobro: ${p.nextChargeDateLabel}.`;
  return { subject, html, text };
}
