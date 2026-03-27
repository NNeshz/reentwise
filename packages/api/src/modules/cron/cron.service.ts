import { db, eq, and } from "@reentwise/database";
import { tenants, payments, rooms } from "@reentwise/database";
import { getPaymentDateForMonth } from "../tenants/tenants.service";
import { emailService } from "@reentwise/api/src/modules/email/email.service";
import { auditsService } from "@reentwise/api/src/modules/audits/audits.service";

export class CronService {
  private async sendCronEmailSafe(input: {
    tenantId: string;
    tenantEmail: string;
    tenantName: string;
    subject: string;
    message: string;
    emailType: "cron_reminder_t5" | "cron_due_today" | "cron_late_t2";
  }) {
    await auditsService.withEmailAudit(
      {
        tenantId: input.tenantId,
        tenantName: input.tenantName,
        note: input.subject,
      },
      () =>
        emailService.sendHtml({
          to: input.tenantEmail,
          subject: input.subject,
          html: `
          <h2>Hola ${input.tenantName}</h2>
          <p>${input.message}</p>
          <p>Mensaje automatico enviado por Reentwise.</p>
        `,
          text: `Hola ${input.tenantName}. ${input.message}`,
          tags: [
            { name: "type", value: input.emailType },
            { name: "module", value: "cron" },
          ],
        }),
      (err) =>
        console.error("[Email][Cron] Error sending cron email:", err),
    );
  }
  
  // Función auxiliar para saber cuántos días exactos de diferencia hay
  private getDaysDiff(targetDate: Date, today: Date): number {
    const _target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const _today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffTime = _target.getTime() - _today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async runDailyTasks() {
    const today = new Date();
    let logs: string[] = [];

    // 1. Obtener todos los inquilinos con cuarto asignado
    const activeTenants = await db
      .select({
        tenant: tenants,
        room: rooms,
      })
      .from(tenants)
      .innerJoin(rooms, eq(tenants.roomId, rooms.id))
      .where(eq(rooms.status, "occupied"));

    for (const { tenant, room } of activeTenants) {
      // 2. Calcular la fecha de pago de ESTE MES
      const thisMonthDay = getPaymentDateForMonth(today.getFullYear(), today.getMonth() + 1, tenant.paymentDay);
      const thisMonthDate = new Date(today.getFullYear(), today.getMonth(), thisMonthDay);

      // 3. Calcular la fecha de pago del PRÓXIMO MES (Para los que pagan los primeros días del mes y el aviso de 5 días cae en el mes actual)
      const nextMonth = today.getMonth() + 1;
      const nextMonthYear = nextMonth > 11 ? today.getFullYear() + 1 : today.getFullYear();
      const nextMonthIndex = nextMonth > 11 ? 0 : nextMonth;
      const nextMonthDay = getPaymentDateForMonth(nextMonthYear, nextMonthIndex + 1, tenant.paymentDay);
      const nextMonthDate = new Date(nextMonthYear, nextMonthIndex, nextMonthDay);

      const diffThisMonth = this.getDaysDiff(thisMonthDate, today);
      const diffNextMonth = this.getDaysDiff(nextMonthDate, today);

      // 4. Evaluar las 3 reglas de negocio de reentwise
      if (diffThisMonth === 5) {
        await this.processTenant(tenant, room, thisMonthDate, 5, logs);
      } else if (diffNextMonth === 5) {
        await this.processTenant(tenant, room, nextMonthDate, 5, logs);
      } else if (diffThisMonth === 0) {
        await this.processTenant(tenant, room, thisMonthDate, 0, logs);
      } else if (diffThisMonth === -2) {
        await this.processTenant(tenant, room, thisMonthDate, -2, logs);
      }
    }

    return logs;
  }

  // Lógica central para generar deudas o mandar los mensajes
  private async processTenant(tenant: any, room: any, targetDate: Date, diffDays: number, logs: string[]) {
    const targetMonth = targetDate.getMonth() + 1;
    const targetYear = targetDate.getFullYear();

    // Buscar si ya existe el registro de pago para este mes
    const existingPayment = await db.query.payments.findFirst({
      where: and(
        eq(payments.tenantId, tenant.id),
        eq(payments.month, targetMonth),
        eq(payments.year, targetYear)
      ),
    });

    // CASO 1: 5 días antes (Recordatorio preventivo)
    if (diffDays === 5) {
      // Solo mandamos el mensaje si NO han pagado por adelantado
      if (!existingPayment || (existingPayment.status !== "paid" && existingPayment.status !== "annulled")) {
        await this.sendWhatsAppSafe(
          tenant,
          `🗓️ *Aviso de reentwise:* Hola ${tenant.name}, te recordamos que en 5 días se vence tu pago de renta por $${room.price}.`,
        );
        if (tenant.email) {
          await this.sendCronEmailSafe({
            tenantId: tenant.id,
            tenantEmail: tenant.email,
            tenantName: tenant.name,
            subject: "Recordatorio de renta (faltan 5 dias)",
            message: `Te recordamos que en 5 dias vence tu pago de renta por $${room.price}.`,
            emailType: "cron_reminder_t5",
          });
        }
        logs.push(`[T-5] Recordatorio enviado a ${tenant.name}`);
      }
    }

    // CASO 2: HOY es el día (Generar cobro y avisar límite)
    else if (diffDays === 0) {
      if (!existingPayment) {
        // Generar la deuda oficialmente en el sistema
        await db.insert(payments).values({
          tenantId: tenant.id,
          amount: room.price.toString(),
          month: targetMonth,
          year: targetYear,
          status: "pending",
        });

        await this.sendWhatsAppSafe(
          tenant,
          `🚨 *Aviso de reentwise:* Hola ${tenant.name}, hoy es tu fecha límite para pagar tu renta de $${room.price}. Por favor, realiza tu pago para evitar recargos.`,
        );
        if (tenant.email) {
          await this.sendCronEmailSafe({
            tenantId: tenant.id,
            tenantEmail: tenant.email,
            tenantName: tenant.name,
            subject: "Tu renta vence hoy",
            message: `Hoy es tu fecha limite para pagar tu renta de $${room.price}. Por favor realiza tu pago para evitar recargos.`,
            emailType: "cron_due_today",
          });
        }
        logs.push(`[T=0] Cobro generado y límite enviado a ${tenant.name}`);
      }
    }

    // CASO 3: 2 días tarde (Cobranza activa)
    else if (diffDays === -2) {
      // Solo mandamos regaño si la deuda existe y no está pagada
      if (existingPayment && (existingPayment.status === "pending" || existingPayment.status === "partial")) {
        
        // Opcional: Actualizar el status a 'late' en la base de datos
        await db.update(payments)
          .set({ status: "late", updatedAt: new Date() })
          .where(eq(payments.id, existingPayment.id));

        await this.sendWhatsAppSafe(
          tenant,
          `⚠️ *Aviso Importante:* Hola ${tenant.name}, nuestro sistema detecta que tu pago de renta tiene 2 días de atraso. Por favor, regulariza tu situación lo antes posible.`,
        );
        if (tenant.email) {
          await this.sendCronEmailSafe({
            tenantId: tenant.id,
            tenantEmail: tenant.email,
            tenantName: tenant.name,
            subject: "Pago atrasado (2 dias)",
            message: "Detectamos que tu pago de renta tiene 2 dias de atraso. Por favor regulariza tu situacion lo antes posible.",
            emailType: "cron_late_t2",
          });
        }
        logs.push(`[T+2] Aviso de atraso enviado a ${tenant.name}`);
      }
    }
  }

  private async sendWhatsAppSafe(
    tenant: {
      id: string;
      name: string;
      ownerId: string | null;
      whatsapp: string;
    },
    message: string,
  ) {
    await auditsService.withWhatsAppAudit(
      {
        tenantId: tenant.id,
        tenantName: tenant.name,
        note: message.slice(0, 160),
      },
      async () => {
        console.log(
          "WhatsApp call" +
            tenant.ownerId +
            " to " +
            tenant.whatsapp +
            " with message " +
            message,
        );
      },
      (err) =>
        console.error(
          `[WhatsApp Cron] Error sending message to ${tenant.whatsapp}:`,
          err,
        ),
    );
  }
}

export const cronService = new CronService();