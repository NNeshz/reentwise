import { db, eq, and } from "@reentwise/database";
import {
  tenants,
  payments,
  rooms,
  properties,
  user,
} from "@reentwise/database";
import { getPaymentDateForMonth } from "../tenants/tenants.service";
import { emailService } from "@reentwise/api/src/modules/email/email.service";
import {
  auditsService,
  cronReminderNotePrefix,
} from "@reentwise/api/src/modules/audits/audits.service";
import { planLimitsService } from "@reentwise/api/src/modules/plan-limits/plan-limits.service";
import {
  sendKapsoTemplate,
  normalizeKapsoRecipient,
  formatKapsoPropertyLabel,
  formatKapsoCurrencyMx,
  formatKapsoDayMonthSpanish,
  kapsoBodyReminder7d,
  kapsoBodyReminder3d,
  kapsoBodyReminderToday,
  kapsoBodyExpirationNotice,
  kapsoTemplateName,
} from "@reentwise/api/src/modules/kapso/kapso.service";
import {
  emailReminder7d,
  emailReminder3d,
  emailReminderToday,
  emailExpirationNotice,
} from "@reentwise/api/src/modules/messaging/kapso-aligned-emails";

function dateYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export class CronService {
  private getDaysDiff(targetDate: Date, today: Date): number {
    const _target = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
    );
    const _today = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const diffTime = _target.getTime() - _today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async runDailyTasks() {
    const today = new Date();
    const logs: string[] = [];

    const activeRows = await db
      .select({
        tenant: tenants,
        room: rooms,
        property: properties,
        owner: user,
      })
      .from(tenants)
      .innerJoin(rooms, eq(tenants.roomId, rooms.id))
      .innerJoin(properties, eq(rooms.propertyId, properties.id))
      .innerJoin(user, eq(properties.ownerId, user.id))
      .where(eq(rooms.status, "occupied"));

    for (const { tenant, room, property, owner } of activeRows) {
      const thisMonthDay = getPaymentDateForMonth(
        today.getFullYear(),
        today.getMonth() + 1,
        tenant.paymentDay,
      );
      const thisMonthDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        thisMonthDay,
      );

      const nextMonth = today.getMonth() + 1;
      const nextMonthYear = nextMonth > 11 ? today.getFullYear() + 1 : today.getFullYear();
      const nextMonthIndex = nextMonth > 11 ? 0 : nextMonth;
      const nextMonthDay = getPaymentDateForMonth(
        nextMonthYear,
        nextMonthIndex + 1,
        tenant.paymentDay,
      );
      const nextMonthDate = new Date(nextMonthYear, nextMonthIndex, nextMonthDay);

      const diffThisMonth = this.getDaysDiff(thisMonthDate, today);
      const diffNextMonth = this.getDaysDiff(nextMonthDate, today);

      const triggers: { targetDate: Date; kind: "t7" | "t3" | "t0" | "late" }[] =
        [];
      if (diffThisMonth === 7) triggers.push({ targetDate: thisMonthDate, kind: "t7" });
      if (diffNextMonth === 7) triggers.push({ targetDate: nextMonthDate, kind: "t7" });
      if (diffThisMonth === 3) triggers.push({ targetDate: thisMonthDate, kind: "t3" });
      if (diffNextMonth === 3) triggers.push({ targetDate: nextMonthDate, kind: "t3" });
      if (diffThisMonth === 0) triggers.push({ targetDate: thisMonthDate, kind: "t0" });
      if (diffThisMonth === -2) triggers.push({ targetDate: thisMonthDate, kind: "late" });

      for (const t of triggers) {
        await this.processTenant(
          tenant,
          room,
          property,
          owner,
          t.targetDate,
          t.kind,
          logs,
        );
      }
    }

    return logs;
  }

  private async processTenant(
    tenant: typeof tenants.$inferSelect,
    room: typeof rooms.$inferSelect,
    property: typeof properties.$inferSelect,
    owner: typeof user.$inferSelect,
    targetDate: Date,
    kind: "t7" | "t3" | "t0" | "late",
    logs: string[],
  ) {
    const targetMonth = targetDate.getMonth() + 1;
    const targetYear = targetDate.getFullYear();
    const ymd = dateYmd(targetDate);

    const limitsCtx = await planLimitsService.getLimitsContext(property.ownerId);
    if (!limitsCtx) {
      logs.push(`[skip] sin contexto de plan owner=${property.ownerId}`);
      return;
    }
    const { limits } = limitsCtx;

    if (kind === "t7" && !limits.allowReminderT7) return;
    if (kind === "t3" && !limits.allowReminderT3) return;
    if (kind === "t0" && !limits.allowReminderToday) return;
    if (kind === "late" && !limits.allowReminderToday) return;

    if (await auditsService.hasCronReminderForDate(tenant.id, kind, ymd)) {
      return;
    }

    const existingPayment = await db.query.payments.findFirst({
      where: and(
        eq(payments.tenantId, tenant.id),
        eq(payments.month, targetMonth),
        eq(payments.year, targetYear),
      ),
    });

    const paidOrAnnulled =
      existingPayment &&
      (existingPayment.status === "paid" || existingPayment.status === "annulled");

    const propertyLabel = formatKapsoPropertyLabel({
      propertyName: property.name,
      roomNumber: room.roomNumber,
    });
    const dueDay = getPaymentDateForMonth(
      targetYear,
      targetMonth,
      tenant.paymentDay,
    );
    const dueDateLabel = formatKapsoDayMonthSpanish(dueDay, targetMonth);
    const amountFormatted = formatKapsoCurrencyMx(room.price);
    const baseParams = {
      ownerName: owner.name,
      tenantName: tenant.name,
      propertyLabel,
      dueDateLabel,
      amountFormatted,
    };

    const notePrefix = cronReminderNotePrefix(kind, ymd, tenant.id);

    if (kind === "t7" || kind === "t3") {
      if (paidOrAnnulled) return;

      const body =
        kind === "t7"
          ? kapsoBodyReminder7d(baseParams)
          : kapsoBodyReminder3d(baseParams);
      const templateKey = kind === "t7" ? "reminder_7d" : "reminder_3d";
      const emailFn = kind === "t7" ? emailReminder7d : emailReminder3d;

      await auditsService.withWhatsAppAudit(
        {
          tenantId: tenant.id,
          tenantName: tenant.name,
          note: `${notePrefix}|wa`,
        },
        () =>
          sendKapsoTemplate({
            to: normalizeKapsoRecipient(tenant.whatsapp),
            templateName: kapsoTemplateName(templateKey),
            components: body,
          }),
        (err) =>
          console.error(`[Cron][WA][${kind}] ${tenant.name}:`, err),
      );

      if (tenant.email) {
        const { subject, html, text } = emailFn(baseParams);
        await auditsService.withEmailAudit(
          {
            tenantId: tenant.id,
            tenantName: tenant.name,
            note: `${notePrefix}|email`,
          },
          () =>
            emailService.sendHtml({
              to: tenant.email,
              subject,
              html,
              text,
              tags: [
                { name: "type", value: `cron_reminder_${kind}` },
                { name: "module", value: "cron" },
              ],
              idempotencyKey: `${notePrefix}|email`,
            }),
          (err) =>
            console.error(`[Cron][Email][${kind}] ${tenant.name}:`, err),
        );
      }

      logs.push(`[${kind.toUpperCase()}] Recordatorio a ${tenant.name}`);
      return;
    }

    if (kind === "t0") {
      if (!existingPayment) {
        await db.insert(payments).values({
          tenantId: tenant.id,
          amount: room.price.toString(),
          month: targetMonth,
          year: targetYear,
          status: "pending",
        });
      } else if (paidOrAnnulled) {
        return;
      }

      const todayParams = {
        ownerName: owner.name,
        tenantName: tenant.name,
        propertyLabel,
        amountFormatted,
      };

      await auditsService.withWhatsAppAudit(
        {
          tenantId: tenant.id,
          tenantName: tenant.name,
          note: `${notePrefix}|wa`,
        },
        () =>
          sendKapsoTemplate({
            to: normalizeKapsoRecipient(tenant.whatsapp),
            templateName: kapsoTemplateName("reminder_today"),
            components: kapsoBodyReminderToday(todayParams),
          }),
        (err) =>
          console.error(`[Cron][WA][t0] ${tenant.name}:`, err),
      );

      if (tenant.email) {
        const { subject, html, text } = emailReminderToday(todayParams);
        await auditsService.withEmailAudit(
          {
            tenantId: tenant.id,
            tenantName: tenant.name,
            note: `${notePrefix}|email`,
          },
          () =>
            emailService.sendHtml({
              to: tenant.email,
              subject,
              html,
              text,
              tags: [
                { name: "type", value: "cron_reminder_t0" },
                { name: "module", value: "cron" },
              ],
              idempotencyKey: `${notePrefix}|email`,
            }),
          (err) =>
            console.error(`[Cron][Email][t0] ${tenant.name}:`, err),
        );
      }

      logs.push(`[T0] Día de pago / cobro generado para ${tenant.name}`);
      return;
    }

    // late (mora): solo planes con cadencia de pago completa (mismo flag que "hoy")
    if (
      existingPayment &&
      (existingPayment.status === "pending" ||
        existingPayment.status === "partial")
    ) {
      await db
        .update(payments)
        .set({ status: "late", updatedAt: new Date() })
        .where(eq(payments.id, existingPayment.id));

      const amountNum = Number(room.price);
      const expParams = {
        ownerName: owner.name,
        tenantName: tenant.name,
        propertyLabel,
        dueDateLabel,
        daysElapsedLabel: "2",
        originalAmountFormatted: formatKapsoCurrencyMx(amountNum),
        lateFeeFormatted: formatKapsoCurrencyMx(0),
        totalPendingFormatted: formatKapsoCurrencyMx(
          amountNum - Number(existingPayment.amountPaid || 0),
        ),
      };

      await auditsService.withWhatsAppAudit(
        {
          tenantId: tenant.id,
          tenantName: tenant.name,
          note: `${notePrefix}|wa`,
        },
        () =>
          sendKapsoTemplate({
            to: normalizeKapsoRecipient(tenant.whatsapp),
            templateName: kapsoTemplateName("expiration_notice"),
            components: kapsoBodyExpirationNotice(expParams),
          }),
        (err) =>
          console.error(`[Cron][WA][late] ${tenant.name}:`, err),
      );

      if (tenant.email) {
        const { subject, html, text } = emailExpirationNotice(expParams);
        await auditsService.withEmailAudit(
          {
            tenantId: tenant.id,
            tenantName: tenant.name,
            note: `${notePrefix}|email`,
          },
          () =>
            emailService.sendHtml({
              to: tenant.email,
              subject,
              html,
              text,
              tags: [
                { name: "type", value: "cron_expiration_late" },
                { name: "module", value: "cron" },
              ],
              idempotencyKey: `${notePrefix}|email`,
            }),
          (err) =>
            console.error(`[Cron][Email][late] ${tenant.name}:`, err),
        );
      }

      logs.push(`[LATE] Aviso mora a ${tenant.name}`);
    }
  }
}

export const cronService = new CronService();
