import { auditsService } from "@reentwise/api/src/modules/audits/audits.service";
import { emailService } from "@reentwise/api/src/modules/email/email.service";
import {
  emailAbonoReceived,
  emailPaymentCompleted,
} from "@reentwise/api/src/modules/email/lib/kapso-aligned-html";
import {
  sendKapsoTemplate,
  normalizeKapsoRecipient,
  formatKapsoCurrencyMx,
  formatKapsoMonthNameSpanish,
  formatKapsoDateShortSpanish,
  kapsoBodyAbonoRecived,
  kapsoBodyPaymentCompleted,
  kapsoTemplateName,
} from "@reentwise/api/src/modules/kapso/kapso.service";
import type {
  PayReceiptMsgRow,
  PlanLimitsRow,
  UpdatedPaymentRow,
} from "@reentwise/api/src/modules/payments/types/payments.types";

/** WhatsApp + email receipts after a pay mutation (partial or paid). */
export async function sendPayReceiptNotifications(
  limits: PlanLimitsRow | null | undefined,
  newStatus: "partial" | "paid",
  msgRow: PayReceiptMsgRow,
  updatedPayment: UpdatedPaymentRow,
  input: {
    paymentId: string;
    paymentAmount: number;
    newAmountPaid: number;
    amount: number;
    propertyLabel: string;
    fullPaymentDeadlineLabel: string;
    nextDueDateLabel: string;
  },
): Promise<void> {
  const {
    paymentId,
    paymentAmount,
    newAmountPaid,
    amount,
    propertyLabel,
    fullPaymentDeadlineLabel,
    nextDueDateLabel,
  } = input;

  const outstanding = Math.max(0, amount - newAmountPaid);

  const sendWaPartial = limits?.allowWhatsappPaymentReceipt && limits?.allowWhatsappAbonoReceipt;
  const sendWaFull = limits?.allowWhatsappPaymentReceipt;

  if (newStatus === "partial" ? sendWaPartial : sendWaFull) {
    if (newStatus === "partial") {
      await auditsService.withWhatsAppAudit(
        {
          tenantId: msgRow.tenant.id,
          tenantName: msgRow.tenant.name,
          note: `Abono ${updatedPayment.month}/${updatedPayment.year}`,
        },
        () =>
          sendKapsoTemplate({
            to: normalizeKapsoRecipient(msgRow.tenant.whatsapp),
            templateName: kapsoTemplateName("abono_recived"),
            components: kapsoBodyAbonoRecived({
              ownerName: msgRow.owner.name,
              tenantName: msgRow.tenant.name,
              propertyLabel,
              amountReceivedFormatted: formatKapsoCurrencyMx(paymentAmount),
              outstandingFormatted: formatKapsoCurrencyMx(outstanding),
              fullPaymentDeadlineLabel,
            }),
          }),
        (err) => console.error("[WhatsApp][Payments] Error abono:", err),
      );
    } else {
      await auditsService.withWhatsAppAudit(
        {
          tenantId: msgRow.tenant.id,
          tenantName: msgRow.tenant.name,
          note: `Pago completado ${updatedPayment.month}/${updatedPayment.year}`,
        },
        () =>
          sendKapsoTemplate({
            to: normalizeKapsoRecipient(msgRow.tenant.whatsapp),
            templateName: kapsoTemplateName("payment_completed"),
            components: kapsoBodyPaymentCompleted({
              ownerName: msgRow.owner.name,
              tenantName: msgRow.tenant.name,
              propertyLabel,
              amountReceivedFormatted: formatKapsoCurrencyMx(amount),
              paymentRegisteredDateLabel: formatKapsoDateShortSpanish(
                new Date(),
              ),
              coveredPeriodMonthName: formatKapsoMonthNameSpanish(
                updatedPayment.month,
              ),
              nextChargeDateLabel: nextDueDateLabel,
            }),
          }),
        (err) =>
          console.error("[WhatsApp][Payments] Error completado:", err),
      );
    }
  }

  const emailTo = msgRow.tenant.email;
  if (limits?.allowEmailPaymentRegistered && emailTo) {
    if (newStatus === "partial") {
      const { subject, html, text } = emailAbonoReceived({
        ownerName: msgRow.owner.name,
        tenantName: msgRow.tenant.name,
        propertyLabel,
        amountReceivedFormatted: formatKapsoCurrencyMx(paymentAmount),
        outstandingFormatted: formatKapsoCurrencyMx(outstanding),
        fullPaymentDeadlineLabel,
      });
      await auditsService.withEmailAudit(
        {
          tenantId: msgRow.tenant.id,
          tenantName: msgRow.tenant.name,
          note: `Abono email ${updatedPayment.month}/${updatedPayment.year}`,
        },
        () =>
          emailService.sendHtml({
            to: emailTo,
            subject,
            html,
            text,
            tags: [
              { name: "type", value: "payment_abono" },
              { name: "module", value: "payments" },
            ],
            idempotencyKey: `pay-abono-${paymentId}-${newAmountPaid}`,
          }),
        (err) => console.error("[Email][Payments] Error abono:", err),
      );
    } else {
      const { subject, html, text } = emailPaymentCompleted({
        ownerName: msgRow.owner.name,
        tenantName: msgRow.tenant.name,
        propertyLabel,
        amountReceivedFormatted: formatKapsoCurrencyMx(amount),
        paymentRegisteredDateLabel: formatKapsoDateShortSpanish(new Date()),
        coveredPeriodMonthName: formatKapsoMonthNameSpanish(
          updatedPayment.month,
        ),
        nextChargeDateLabel: nextDueDateLabel,
      });
      await auditsService.withEmailAudit(
        {
          tenantId: msgRow.tenant.id,
          tenantName: msgRow.tenant.name,
          note: `Pago completado email ${updatedPayment.month}/${updatedPayment.year}`,
        },
        () =>
          emailService.sendHtml({
            to: emailTo,
            subject,
            html,
            text,
            tags: [
              { name: "type", value: "payment_completed" },
              { name: "module", value: "payments" },
            ],
            idempotencyKey: `pay-done-${paymentId}`,
          }),
        (err) =>
          console.error("[Email][Payments] Error completado:", err),
      );
    }
  }
}
