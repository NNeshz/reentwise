import { db, eq, and } from "@reentwise/database";
import {
  tenants,
  payments,
  rooms,
  properties,
  user,
} from "@reentwise/database";
import { getPaymentDateForMonth } from "@reentwise/api/src/modules/tenants/tenants.service";
import {
  planLimitsService,
  type OwnerPlanLimitsContext,
} from "@reentwise/api/src/modules/plan-limits/plan-limits.service";
import {
  cronReminderNotePrefix,
  type CronReminderKind,
} from "@reentwise/api/src/modules/audits/lib/cron-reminder-prefix";
import { auditsService } from "@reentwise/api/src/modules/audits/audits.service";
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
} from "@reentwise/api/src/modules/email/lib/kapso-aligned-html";
import { dateYmd } from "@reentwise/api/src/modules/cron/utils/date-ymd";
import { buildReminderTriggersForDay } from "@reentwise/api/src/modules/cron/lib/reminder-triggers";
import { backfillRentPaymentsForTenant } from "@reentwise/api/src/modules/cron/lib/backfill-rent-payments";
import { dispatchCronReminderAudits } from "@reentwise/api/src/modules/cron/lib/dispatch-reminder-audits";

export class CronService {
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

    const limitsByOwner = await planLimitsService.getLimitsContexts(
      activeRows.map((r) => r.property.ownerId),
    );

    for (const { tenant, room } of activeRows) {
      await backfillRentPaymentsForTenant(tenant, room, today, logs);
    }

    for (const { tenant, room, property, owner } of activeRows) {
      const limitsCtx = limitsByOwner.get(property.ownerId);
      if (!limitsCtx) {
        logs.push(`[skip] sin contexto de plan owner=${property.ownerId}`);
        continue;
      }

      const triggers = buildReminderTriggersForDay(today, tenant.paymentDay);
      for (const t of triggers) {
        await this.processTenant(
          tenant,
          room,
          property,
          owner,
          limitsCtx,
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
    limitsCtx: OwnerPlanLimitsContext,
    targetDate: Date,
    kind: CronReminderKind,
    logs: string[],
  ) {
    const targetMonth = targetDate.getMonth() + 1;
    const targetYear = targetDate.getFullYear();
    const ymd = dateYmd(targetDate);
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
      (existingPayment.status === "paid" ||
        existingPayment.status === "annulled");

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

    const noteBase = cronReminderNotePrefix(kind, ymd, tenant.id);
    const tenantChannels = {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
    };

    if (kind === "t7" || kind === "t3") {
      if (paidOrAnnulled) return;

      const body =
        kind === "t7"
          ? kapsoBodyReminder7d(baseParams)
          : kapsoBodyReminder3d(baseParams);
      const templateKey = kind === "t7" ? "reminder_7d" : "reminder_3d";
      const emailFn = kind === "t7" ? emailReminder7d : emailReminder3d;

      await dispatchCronReminderAudits({
        tenant: tenantChannels,
        noteBase,
        sendKapso: () =>
          sendKapsoTemplate({
            to: normalizeKapsoRecipient(tenant.whatsapp),
            templateName: kapsoTemplateName(templateKey),
            components: body,
          }),
        email: {
          build: () => emailFn(baseParams),
          typeTag: `cron_reminder_${kind}`,
        },
        logKind: kind,
      });

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

      await dispatchCronReminderAudits({
        tenant: tenantChannels,
        noteBase,
        sendKapso: () =>
          sendKapsoTemplate({
            to: normalizeKapsoRecipient(tenant.whatsapp),
            templateName: kapsoTemplateName("reminder_today"),
            components: kapsoBodyReminderToday(todayParams),
          }),
        email: {
          build: () => emailReminderToday(todayParams),
          typeTag: "cron_reminder_t0",
        },
        logKind: "t0",
      });

      logs.push(`[T0] Día de pago / cobro generado para ${tenant.name}`);
      return;
    }

    // late: +2d mora; same cadence flag as "today"
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

      await dispatchCronReminderAudits({
        tenant: tenantChannels,
        noteBase,
        sendKapso: () =>
          sendKapsoTemplate({
            to: normalizeKapsoRecipient(tenant.whatsapp),
            templateName: kapsoTemplateName("expiration_notice"),
            components: kapsoBodyExpirationNotice(expParams),
          }),
        email: {
          build: () => emailExpirationNotice(expParams),
          typeTag: "cron_expiration_late",
        },
        logKind: "late",
      });

      logs.push(`[LATE] Aviso mora a ${tenant.name}`);
    }
  }
}

export const cronService = new CronService();
