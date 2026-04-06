import {
  db,
  eq,
  and,
  or,
  ilike,
  isNull,
  payments,
  tenants,
  rooms,
  properties,
  user,
} from "@reentwise/database";
import { emailService } from "@reentwise/api/src/modules/email/email.service";
import { auditsService } from "@reentwise/api/src/modules/audits/audits.service";
import { planLimitsService } from "@reentwise/api/src/modules/plan-limits/plan-limits.service";
import { getPaymentDateForMonth } from "@reentwise/api/src/modules/tenants/tenants.service";
import {
  sendKapsoTemplate,
  normalizeKapsoRecipient,
  formatKapsoPropertyLabel,
  formatKapsoCurrencyMx,
  formatKapsoDayMonthSpanish,
  formatKapsoMonthNameSpanish,
  formatKapsoDateShortSpanish,
  kapsoBodyAbonoRecived,
  kapsoBodyPaymentCompleted,
  kapsoTemplateName,
} from "@reentwise/api/src/modules/kapso/kapso.service";
import {
  emailAbonoReceived,
  emailPaymentCompleted,
} from "@reentwise/api/src/modules/messaging/kapso-aligned-emails";

type PaymentStatusFilter = "pending" | "partial" | "paid";

export class PaymentsService {
  constructor() {}

  private nextDueDateLabel(
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

  /** Fila de pago + inquilino + unidad + dueño (para Kapso / plan). */
  private async getPaymentRowWithMessaging(ownerId: string, paymentId: string) {
    const [row] = await db
      .select({
        payment: payments,
        tenant: tenants,
        room: rooms,
        property: properties,
        owner: user,
      })
      .from(payments)
      .innerJoin(tenants, eq(payments.tenantId, tenants.id))
      .leftJoin(rooms, eq(tenants.roomId, rooms.id))
      .leftJoin(properties, eq(rooms.propertyId, properties.id))
      .innerJoin(user, eq(properties.ownerId, user.id))
      .where(
        and(
          eq(payments.id, paymentId),
          or(eq(tenants.ownerId, ownerId), eq(properties.ownerId, ownerId)),
        ),
      )
      .limit(1);
    return row ?? null;
  }

  async getPayments(
    ownerId: string,
    month: number,
    year: number,
    search?: string,
    status?: PaymentStatusFilter,
  ) {
    return db
      .select({
        tenant: tenants,
        room: rooms,
        payment: payments,
      })
      .from(tenants)
      .leftJoin(rooms, eq(tenants.roomId, rooms.id))
      .leftJoin(properties, eq(rooms.propertyId, properties.id))
      .leftJoin(
        payments,
        and(
          eq(payments.tenantId, tenants.id),
          eq(payments.month, month),
          eq(payments.year, year),
          eq(payments.isAnnulled, false),
        ),
      )
      .where(
        and(
          or(eq(tenants.ownerId, ownerId), eq(properties.ownerId, ownerId)),
          search
            ? or(
                ilike(tenants.name, `%${search}%`),
                ilike(tenants.whatsapp, `%${search}%`),
              )
            : undefined,
          status === "pending"
            ? or(eq(payments.status, "pending"), isNull(payments.id))
            : undefined,
          status === "partial" ? eq(payments.status, "partial") : undefined,
          status === "paid" ? eq(payments.status, "paid") : undefined,
        ),
      );
  }

  /** Pago perteneciente a un inquilino bajo el alcance del dueño (directo o vía propiedad). */
  private async getPaymentRowForOwner(ownerId: string, paymentId: string) {
    const [row] = await db
      .select({ payment: payments, tenant: tenants })
      .from(payments)
      .innerJoin(tenants, eq(payments.tenantId, tenants.id))
      .leftJoin(rooms, eq(tenants.roomId, rooms.id))
      .leftJoin(properties, eq(rooms.propertyId, properties.id))
      .where(
        and(
          eq(payments.id, paymentId),
          or(eq(tenants.ownerId, ownerId), eq(properties.ownerId, ownerId)),
        ),
      );
    return row ?? null;
  }

  async payPayment(
    ownerId: string,
    paymentId: string,
    paymentAmount: number,
    method: "cash" | "transfer" | "deposit",
  ) {
    const currentPayment = await this.getPaymentRowForOwner(
      ownerId,
      paymentId,
    );
    if (!currentPayment) throw new Error("Payment not found");

    const amount = Number(currentPayment.payment.amount);
    const newAmountPaid =
      Number(currentPayment.payment.amountPaid || 0) + Number(paymentAmount);

    let newStatus: "pending" | "partial" | "paid" | "late" | "annulled" =
      "partial";
    let paidAt = currentPayment.payment.paidAt;

    if (newAmountPaid >= amount) {
      newStatus = "paid";
      paidAt = new Date();
    }

    const [updatedPayment] = await db
      .update(payments)
      .set({
        amountPaid: newAmountPaid.toString(),
        status: newStatus,
        method: method,
        paidAt,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, paymentId))
      .returning();

    if (!updatedPayment) throw new Error("Failed to update payment");

    const msgRow = await this.getPaymentRowWithMessaging(ownerId, paymentId);
    if (msgRow?.room && msgRow.property) {
      const planCtx = await planLimitsService.getLimitsContext(
        msgRow.owner.id,
      );
      const limits = planCtx?.limits;
      const propertyLabel = formatKapsoPropertyLabel({
        propertyName: msgRow.property.name,
        roomNumber: msgRow.room.roomNumber,
      });
      const dueDay = getPaymentDateForMonth(
        updatedPayment.year,
        updatedPayment.month,
        msgRow.tenant.paymentDay,
      );
      const fullPaymentDeadlineLabel = formatKapsoDayMonthSpanish(
        dueDay,
        updatedPayment.month,
      );
      const outstanding = Math.max(0, amount - newAmountPaid);

      if (limits?.allowWhatsappPaymentReceipt) {
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
            (err) =>
              console.error("[WhatsApp][Payments] Error abono:", err),
          );
        } else if (newStatus === "paid") {
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
                  paymentRegisteredDateLabel:
                    formatKapsoDateShortSpanish(new Date()),
                  coveredPeriodMonthName: formatKapsoMonthNameSpanish(
                    updatedPayment.month,
                  ),
                  nextChargeDateLabel: this.nextDueDateLabel(
                    updatedPayment.month,
                    updatedPayment.year,
                    msgRow.tenant.paymentDay,
                  ),
                }),
              }),
            (err) =>
              console.error("[WhatsApp][Payments] Error completado:", err),
          );
        }
      }

      if (limits?.allowEmailPaymentRegistered && msgRow.tenant.email) {
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
                to: msgRow.tenant.email,
                subject,
                html,
                text,
                tags: [
                  { name: "type", value: "payment_abono" },
                  { name: "module", value: "payments" },
                ],
                idempotencyKey: `pay-abono-${paymentId}-${newAmountPaid}`,
              }),
            (err) =>
              console.error("[Email][Payments] Error abono:", err),
          );
        } else if (newStatus === "paid") {
          const { subject, html, text } = emailPaymentCompleted({
            ownerName: msgRow.owner.name,
            tenantName: msgRow.tenant.name,
            propertyLabel,
            amountReceivedFormatted: formatKapsoCurrencyMx(amount),
            paymentRegisteredDateLabel:
              formatKapsoDateShortSpanish(new Date()),
            coveredPeriodMonthName: formatKapsoMonthNameSpanish(
              updatedPayment.month,
            ),
            nextChargeDateLabel: this.nextDueDateLabel(
              updatedPayment.month,
              updatedPayment.year,
              msgRow.tenant.paymentDay,
            ),
          });
          await auditsService.withEmailAudit(
            {
              tenantId: msgRow.tenant.id,
              tenantName: msgRow.tenant.name,
              note: `Pago completado email ${updatedPayment.month}/${updatedPayment.year}`,
            },
            () =>
              emailService.sendHtml({
                to: msgRow.tenant.email,
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

    return updatedPayment;
  }

  async annulPayment(ownerId: string, paymentId: string) {
    const currentPayment = await this.getPaymentRowForOwner(
      ownerId,
      paymentId,
    );
    if (!currentPayment) throw new Error("Payment not found");

    const [annulledPayment] = await db
      .update(payments)
      .set({
        isAnnulled: true,
        status: "annulled",
        annulledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(payments.id, paymentId))
      .returning();

    if (annulledPayment) {
      await auditsService.withWhatsAppAudit(
        {
          tenantId: currentPayment.tenant.id,
          tenantName: currentPayment.tenant.name,
          note: "Aviso anulación de pago",
        },
        async () => {
          const tenantOwnerId = currentPayment.tenant.ownerId;
          console.log("WhatsApp call" + tenantOwnerId);
        },
        (err) =>
          console.error("[WhatsApp] Error sending annulment notice:", err),
      );
    }

    return annulledPayment;
  }


}

export const paymentsService = new PaymentsService();
