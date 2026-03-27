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
} from "@reentwise/database";
import { emailService } from "@reentwise/api/src/modules/email/email.service";
import { auditsService } from "@reentwise/api/src/modules/audits/audits.service";

type PaymentStatusFilter = "pending" | "partial" | "paid";

export class PaymentsService {
  constructor() {}

  private async sendPaymentRegisteredEmailSafe(input: {
    tenantId: string;
    tenantEmail: string;
    tenantName: string;
    paymentId: string;
    paymentAmount: number;
    totalAmount: number;
    newAmountPaid: number;
    status: "pending" | "partial" | "paid" | "late" | "annulled";
    method: "cash" | "transfer" | "deposit";
    month: number;
    year: number;
  }) {
    const note = `Pago registrado · ${input.month}/${input.year}`;
    await auditsService.withEmailAudit(
      {
        tenantId: input.tenantId,
        tenantName: input.tenantName,
        note,
      },
      () =>
        emailService.sendHtml({
          to: input.tenantEmail,
          subject: "Pago registrado en Reentwise",
          html: `
          <h2>Hola ${input.tenantName}</h2>
          <p>Se registro un pago/abono en tu cuenta.</p>
          <p><strong>Periodo:</strong> ${input.month}/${input.year}</p>
          <p><strong>Monto abonado:</strong> $${input.paymentAmount.toFixed(2)}</p>
          <p><strong>Total pagado acumulado:</strong> $${input.newAmountPaid.toFixed(2)} / $${input.totalAmount.toFixed(2)}</p>
          <p><strong>Estatus:</strong> ${input.status}</p>
          <p><strong>Metodo:</strong> ${input.method}</p>
          <p><strong>Referencia:</strong> ${input.paymentId}</p>
        `,
          text: `Hola ${input.tenantName}. Se registro un pago/abono para ${input.month}/${input.year}. Abono: $${input.paymentAmount.toFixed(2)}. Acumulado: $${input.newAmountPaid.toFixed(2)} de $${input.totalAmount.toFixed(2)}. Estatus: ${input.status}. Metodo: ${input.method}. Ref: ${input.paymentId}.`,
          tags: [
            { name: "type", value: "payment_registered" },
            { name: "module", value: "payments" },
          ],
        }),
      (err) =>
        console.error("[Email][Payments] Error sending payment email:", err),
    );
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

    await auditsService.withWhatsAppAudit(
      {
        tenantId: currentPayment.tenant.id,
        tenantName: currentPayment.tenant.name,
        note: `Recibo de pago ${updatedPayment.month}/${updatedPayment.year}`,
      },
      async () => {
        const tenantOwnerId = currentPayment.tenant.ownerId;
        console.log("WhatsApp call" + tenantOwnerId);
      },
      (err) => console.error("[WhatsApp] Error sending receipt:", err),
    );

    if (currentPayment.tenant.email) {
      await this.sendPaymentRegisteredEmailSafe({
        tenantId: currentPayment.tenant.id,
        tenantEmail: currentPayment.tenant.email,
        tenantName: currentPayment.tenant.name,
        paymentId: updatedPayment.id,
        paymentAmount,
        totalAmount: amount,
        newAmountPaid,
        status: newStatus,
        method,
        month: updatedPayment.month,
        year: updatedPayment.year,
      });
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
