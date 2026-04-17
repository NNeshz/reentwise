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
import { env } from "@reentwise/api/src/utils/envs";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Shared email shell: header with logo + accent bar, body card, footer.
 * `accentColor` defaults to brand lime; pass `#E05252` for destructive emails.
 */
function emailLayout(
  bodyHtml: string,
  accentColor = "#D4F04A",
): string {
  const frontendUrl =
    env.NEXT_PUBLIC_FRONTEND_URL ?? "https://reentwise.com";
  const logoUrl = `${frontendUrl}/logo.png`;
  const siteUrl = env.NEXT_PUBLIC_FRONTEND_WWW ?? frontendUrl;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reentwise</title>
</head>
<body style="margin:0;padding:0;background-color:#F2F2F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F2F2;padding:32px 16px;">
    <tr>
      <td align="center">
        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

          <!-- Accent top bar -->
          <tr>
            <td style="background-color:${accentColor};height:5px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header: logo -->
          <tr>
            <td align="center" style="padding:28px 40px 20px;">
              <img src="${logoUrl}" alt="Reentwise" width="40" height="40" style="display:block;width:40px;height:40px;object-fit:contain;" />
              <p style="margin:8px 0 0;font-size:17px;font-weight:700;color:#111111;letter-spacing:-0.3px;">Reentwise</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background-color:#EBEBEB;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px 24px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background-color:#EBEBEB;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px 40px 28px;">
              <p style="margin:0;font-size:12px;color:#999999;">
                Este es un mensaje automático de
                <a href="${siteUrl}" style="color:#999999;text-decoration:underline;">Reentwise</a>.
                Por favor no respondas directamente a este correo.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Renders a labeled detail row inside the info card. */
function detailRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:8px 0;border-bottom:1px solid #F0F0F0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px;color:#888888;width:45%;">${label}</td>
          <td style="font-size:14px;color:#111111;font-weight:600;text-align:right;">${value}</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

/** Info card wrapper (renders a bordered section with detail rows). */
function detailCard(rows: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F8F8;border-radius:8px;padding:4px 16px;margin:20px 0 0;">
    ${rows}
  </table>`;
}

// ---------------------------------------------------------------------------
// Email templates
// ---------------------------------------------------------------------------

export function emailWelcomeConfirmation(p: KapsoReminderConfirmationParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Bienvenido a Reentwise 🎉";
  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">¡Bienvenido, ${esc(p.tenantName)}!</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.6;">
      Tu registro como inquilino ha sido creado exitosamente en Reentwise.
      Aquí tienes los detalles de tu unidad:
    </p>
    ${detailCard(`
      ${detailRow("Unidad", esc(p.propertyLabel))}
      ${detailRow("Renta mensual", esc(p.monthlyRentFormatted))}
      ${detailRow("Día de pago", esc(p.paymentCutoffDayLabel) + " de cada mes")}
    `)}
    <p style="margin:24px 0 0;font-size:14px;color:#666666;line-height:1.6;">
      Si tienes alguna duda, puedes responder a este correo o contactar a tu arrendador directamente.
    </p>`;

  const html = emailLayout(body);
  const text = `Hola ${p.tenantName}. Bienvenido a Reentwise. ${p.propertyLabel}. Renta: ${p.monthlyRentFormatted}. Día de pago: ${p.paymentCutoffDayLabel}.`;
  return { subject, html, text };
}

export function emailReminder7d(p: KapsoReminder7dParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Tu renta vence en 7 días";
  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Recordatorio de pago</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.6;">
      Hola <strong>${esc(p.tenantName)}</strong>, te recordamos que tu pago de renta
      vence en <strong>7 días</strong>.
    </p>
    ${detailCard(`
      ${detailRow("Unidad", esc(p.propertyLabel))}
      ${detailRow("Fecha límite", esc(p.dueDateLabel))}
      ${detailRow("Monto", esc(p.amountFormatted))}
    `)}
    <p style="margin:24px 0 0;font-size:13px;color:#888888;">
      Enviado por ${esc(p.ownerName)} a través de Reentwise.
    </p>`;

  const html = emailLayout(body);
  const text = `Hola ${p.tenantName}. ${p.ownerName} recuerda tu renta. ${p.propertyLabel}. Vence: ${p.dueDateLabel}. Monto: ${p.amountFormatted}.`;
  return { subject, html, text };
}

export function emailReminder3d(p: KapsoReminder7dParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Tu renta vence en 3 días";
  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Recordatorio de pago</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.6;">
      Hola <strong>${esc(p.tenantName)}</strong>, te recordamos que tu pago de renta
      vence en <strong>3 días</strong>.
    </p>
    ${detailCard(`
      ${detailRow("Unidad", esc(p.propertyLabel))}
      ${detailRow("Fecha límite", esc(p.dueDateLabel))}
      ${detailRow("Monto", esc(p.amountFormatted))}
    `)}
    <p style="margin:24px 0 0;font-size:13px;color:#888888;">
      Enviado por ${esc(p.ownerName)} a través de Reentwise.
    </p>`;

  const html = emailLayout(body);
  const text = `Hola ${p.tenantName}. En 3 días vence tu renta. ${p.propertyLabel}. ${p.dueDateLabel}. ${p.amountFormatted}.`;
  return { subject, html, text };
}

export function emailReminderToday(p: KapsoReminderTodayParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Hoy vence tu pago de renta";
  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Hoy es tu fecha de pago</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.6;">
      Hola <strong>${esc(p.tenantName)}</strong>, hoy es el último día para realizar
      tu pago de renta sin recargos.
    </p>
    ${detailCard(`
      ${detailRow("Unidad", esc(p.propertyLabel))}
      ${detailRow("Monto", esc(p.amountFormatted))}
    `)}
    <p style="margin:24px 0 0;font-size:13px;color:#888888;">
      Enviado por ${esc(p.ownerName)} a través de Reentwise.
    </p>`;

  const html = emailLayout(body);
  const text = `Hola ${p.tenantName}. Hoy vence tu renta. ${p.propertyLabel}. ${p.amountFormatted}.`;
  return { subject, html, text };
}

export function emailAbonoReceived(p: KapsoAbonoRecivedParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Abono registrado en tu renta";
  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Abono recibido</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.6;">
      Hola <strong>${esc(p.tenantName)}</strong>, tu arrendador registró un abono
      a tu renta. Aquí el resumen:
    </p>
    ${detailCard(`
      ${detailRow("Unidad", esc(p.propertyLabel))}
      ${detailRow("Abono registrado", esc(p.amountReceivedFormatted))}
      ${detailRow("Saldo pendiente", esc(p.outstandingFormatted))}
      ${detailRow("Regularizar antes de", esc(p.fullPaymentDeadlineLabel))}
    `)}
    <p style="margin:24px 0 0;font-size:13px;color:#888888;">
      Enviado por ${esc(p.ownerName)} a través de Reentwise.
    </p>`;

  const html = emailLayout(body);
  const text = `Hola ${p.tenantName}. Abono: ${p.amountReceivedFormatted}. Pendiente: ${p.outstandingFormatted}. Fecha límite: ${p.fullPaymentDeadlineLabel}.`;
  return { subject, html, text };
}

export function emailExpirationNotice(p: KapsoExpirationNoticeParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Aviso de renta vencida";
  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#C0392B;">Renta vencida</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.6;">
      Hola <strong>${esc(p.tenantName)}</strong>, tu renta no fue cubierta en la
      fecha acordada. Te pedimos regularizar tu situación a la brevedad.
    </p>
    ${detailCard(`
      ${detailRow("Unidad", esc(p.propertyLabel))}
      ${detailRow("Fecha de vencimiento", esc(p.dueDateLabel))}
      ${detailRow("Días de atraso", esc(p.daysElapsedLabel))}
      ${detailRow("Monto original", esc(p.originalAmountFormatted))}
      ${detailRow("Recargos", esc(p.lateFeeFormatted))}
      ${detailRow("Total pendiente", esc(p.totalPendingFormatted))}
    `)}
    <p style="margin:24px 0 0;font-size:13px;color:#888888;">
      Enviado por ${esc(p.ownerName)} a través de Reentwise.
    </p>`;

  const html = emailLayout(body, "#FADADD");
  const text = `Hola ${p.tenantName}. Aviso de mora. ${p.propertyLabel}. ${p.dueDateLabel}. Atraso: ${p.daysElapsedLabel} días. Pendiente: ${p.totalPendingFormatted}.`;
  return { subject, html, text };
}

export function emailPaymentCompleted(p: KapsoPaymentCompletedParams): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Pago de renta confirmado ✓";
  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Pago confirmado</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.6;">
      Hola <strong>${esc(p.tenantName)}</strong>, tu pago de renta ha sido registrado
      exitosamente. ¡Gracias!
    </p>
    ${detailCard(`
      ${detailRow("Unidad", esc(p.propertyLabel))}
      ${detailRow("Monto pagado", esc(p.amountReceivedFormatted))}
      ${detailRow("Fecha de registro", esc(p.paymentRegisteredDateLabel))}
      ${detailRow("Período cubierto", esc(p.coveredPeriodMonthName))}
      ${detailRow("Próximo cobro", esc(p.nextChargeDateLabel))}
    `)}
    <p style="margin:24px 0 0;font-size:13px;color:#888888;">
      Enviado por ${esc(p.ownerName)} a través de Reentwise.
    </p>`;

  const html = emailLayout(body, "#D4EDDA");
  const text = `Hola ${p.tenantName}. Pago completado ${p.paymentRegisteredDateLabel}. Período: ${p.coveredPeriodMonthName}. Próximo cobro: ${p.nextChargeDateLabel}.`;
  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// Owner cron summary
// ---------------------------------------------------------------------------

export type OwnerCronSummaryItem = {
  tenantName: string;
  amountFormatted: string;
  kindLabel: string;
};

export function emailOwnerCronSummary(p: {
  ownerName: string;
  date: string;
  items: OwnerCronSummaryItem[];
  auditsUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = `Reentwise – Resumen de notificaciones del ${p.date}`;

  const tenantRows = p.items
    .map(
      (it) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #F0F0F0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0;font-size:14px;font-weight:600;color:#111111;">${esc(it.tenantName)}</p>
                <p style="margin:2px 0 0;font-size:12px;color:#888888;">${esc(it.kindLabel)}</p>
              </td>
              <td align="right" style="font-size:14px;font-weight:700;color:#111111;white-space:nowrap;">
                ${esc(it.amountFormatted)}
              </td>
            </tr>
          </table>
        </td>
      </tr>`,
    )
    .join("\n");

  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Resumen de notificaciones</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#444444;line-height:1.6;">
      Hola <strong>${esc(p.ownerName)}</strong>, el día <strong>${esc(p.date)}</strong> se notificó
      correctamente a <strong>${p.items.length} inquilino${p.items.length !== 1 ? "s" : ""}</strong>:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F8F8;border-radius:8px;padding:0 16px;">
      ${tenantRows}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr>
        <td align="center">
          <a href="${esc(p.auditsUrl)}"
             style="display:inline-block;background-color:#D4F04A;color:#111111;font-size:14px;font-weight:700;
                    text-decoration:none;padding:12px 28px;border-radius:8px;">
            Ver detalle en Auditoría
          </a>
        </td>
      </tr>
    </table>`;

  const textRows = p.items
    .map((it) => `- ${it.tenantName} (${it.kindLabel}: ${it.amountFormatted})`)
    .join("\n");
  const text = `Hola ${p.ownerName}. Se notificó a ${p.items.length} inquilino(s) el ${p.date}:\n${textRows}\n\nDetalle: ${p.auditsUrl}`;
  return { subject, html: emailLayout(body), text };
}
