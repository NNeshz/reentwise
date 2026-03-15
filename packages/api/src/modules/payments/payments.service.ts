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

type PaymentStatusFilter = "pending" | "partial" | "paid";

export class PaymentsService {
  constructor() {}

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

    // 2. WhatsApp Evolution API call
    try {
      const tenantOwnerId = currentPayment.tenant.ownerId;
      
      console.log("WhatsApp call" + tenantOwnerId);
    } catch (waError) {
      console.error("[WhatsApp] Error sending receipt:", waError);
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
