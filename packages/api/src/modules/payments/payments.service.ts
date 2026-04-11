import {
  db,
  eq,
  and,
  or,
  ilike,
  isNull,
  isNotNull,
  exists,
  payments,
  tenants,
  rooms,
  properties,
  user,
} from "@reentwise/database";
import { auditsService } from "@reentwise/api/src/modules/audits/audits.service";
import { planLimitsService } from "@reentwise/api/src/modules/plan-limits/plan-limits.service";
import { getPaymentDateForMonth } from "@reentwise/api/src/modules/tenants/tenants.service";
import {
  formatKapsoPropertyLabel,
  formatKapsoDayMonthSpanish,
} from "@reentwise/api/src/modules/kapso/kapso.service";
import { PaymentNotFoundError } from "@reentwise/api/src/modules/payments/lib/payment-not-found-error";
import { nextPaymentDueDateLabel } from "@reentwise/api/src/modules/payments/lib/payment-due-label";
import { sendPayReceiptNotifications } from "@reentwise/api/src/modules/payments/lib/pay-payment-notifications";
import type { PaymentStatusFilter } from "@reentwise/api/src/modules/payments/types/payments.types";

export { PaymentNotFoundError } from "@reentwise/api/src/modules/payments/lib/payment-not-found-error";
export type { PaymentStatusFilter } from "@reentwise/api/src/modules/payments/types/payments.types";

export class PaymentsService {
  /** Row for Kapso/email context (joins owner, property, room). */
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
          or(
            isNotNull(tenants.roomId),
            exists(
              db
                .select({ id: payments.id })
                .from(payments)
                .where(
                  and(
                    eq(payments.tenantId, tenants.id),
                    or(
                      eq(payments.isAnnulled, false),
                      isNull(payments.isAnnulled),
                    ),
                  ),
                ),
            ),
          ),
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
    if (!currentPayment) throw new PaymentNotFoundError();

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
    if (
      msgRow?.room &&
      msgRow.property &&
      (newStatus === "partial" || newStatus === "paid")
    ) {
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
      const nextDue = nextPaymentDueDateLabel(
        updatedPayment.month,
        updatedPayment.year,
        msgRow.tenant.paymentDay,
      );

      await sendPayReceiptNotifications(
        limits,
        newStatus,
        {
          tenant: {
            id: msgRow.tenant.id,
            name: msgRow.tenant.name,
            whatsapp: msgRow.tenant.whatsapp,
            email: msgRow.tenant.email,
          },
          owner: { name: msgRow.owner.name },
          room: { roomNumber: msgRow.room.roomNumber },
          property: { name: msgRow.property.name },
        },
        updatedPayment,
        {
          paymentId,
          paymentAmount,
          newAmountPaid,
          amount,
          propertyLabel,
          fullPaymentDeadlineLabel,
          nextDueDateLabel: nextDue,
        },
      );
    }

    return updatedPayment;
  }

  async annulPayment(ownerId: string, paymentId: string) {
    const currentPayment = await this.getPaymentRowForOwner(
      ownerId,
      paymentId,
    );
    if (!currentPayment) throw new PaymentNotFoundError();

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
