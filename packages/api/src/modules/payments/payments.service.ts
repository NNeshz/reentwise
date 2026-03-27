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
} from "@reentwise/database";
import { emailService } from "@reentwise/api/src/modules/email/email.service";

type PaymentStatusFilter = "pending" | "partial" | "paid";

export class PaymentsService {
  constructor() {}

  private async sendPaymentRegisteredEmailSafe(input: {
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
    try {
      const response = await emailService.sendHtml({
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
      });
      if (response.error) {
        console.error("[Email][Payments] Error sending payment email:", response.error);
      }
    } catch (error) {
      console.error("[Email][Payments] Unexpected error sending payment email:", error);
    }
  }

  async getPayments(
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

  async payPayment(
    paymentId: string,
    paymentAmount: number,
    method: "cash" | "transfer" | "deposit",
  ) {
    // 1. Get current payment
    const [currentPayment] = await db
      .select({ payment: payments, tenant: tenants })
      .from(payments)
      .innerJoin(tenants, eq(payments.tenantId, tenants.id))
      .where(eq(payments.id, paymentId));

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

    // 2. WhatsApp Evolution API call
    try {
      const tenantOwnerId = currentPayment.tenant.ownerId;
      
      console.log("WhatsApp call" + tenantOwnerId);
    } catch (waError) {
      console.error("[WhatsApp] Error sending receipt:", waError);
    }

    if (currentPayment.tenant.email) {
      await this.sendPaymentRegisteredEmailSafe({
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

  async annulPayment(paymentId: string) {
    const [currentPayment] = await db
      .select({ payment: payments, tenant: tenants })
      .from(payments)
      .innerJoin(tenants, eq(payments.tenantId, tenants.id))
      .where(eq(payments.id, paymentId));

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

    // WhatsApp call
    try {
      const tenantOwnerId = currentPayment.tenant.ownerId;
      
      console.log("WhatsApp call" + tenantOwnerId);
    } catch (waError) {
      console.error("[WhatsApp] Error sending annulment notice:", waError);
    }

    return annulledPayment;
  }


}

export const paymentsService = new PaymentsService();
