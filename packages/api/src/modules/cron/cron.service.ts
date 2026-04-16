import { db, eq, and, isNull } from "@reentwise/database";
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
  formatWhatsappForKapso,
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
import { dateYmdUtc } from "@reentwise/api/src/modules/cron/utils/date-ymd";
import { buildReminderTriggersForDay } from "@reentwise/api/src/modules/cron/lib/reminder-triggers";
import { backfillRentPaymentsForTenant } from "@reentwise/api/src/modules/cron/lib/backfill-rent-payments";
import { enforceRoomLimitsForOwners } from "@reentwise/api/src/modules/cron/lib/enforce-room-limits";
import { reactivateRoomsForOwners } from "@reentwise/api/src/modules/cron/lib/reactivate-room-limits";
import {
  enforcePropertyLimitsForOwners,
  reactivatePropertiesForOwners,
} from "@reentwise/api/src/modules/cron/lib/enforce-property-limits";
import { dispatchCronReminderAudits } from "@reentwise/api/src/modules/cron/lib/dispatch-reminder-audits";
import {
  ownerWallClockTz,
  wallYmdForOwner,
} from "@reentwise/api/src/modules/cron/utils/cron-calendar";

export class CronService {
  async runDailyTasks() {
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
      .where(and(eq(rooms.status, "occupied"), isNull(rooms.archivedAt)));

    const ownerIds = [...new Set(activeRows.map((r) => r.property.ownerId))];
    const limitsByOwner = await planLimitsService.getLimitsContexts(ownerIds);

    // 1. Downgrade: archiva propiedades en exceso (vacantes o con menos cuartos primero)
    await enforcePropertyLimitsForOwners(ownerIds, logs);
    // 2. Downgrade: archiva cuartos en exceso (vacantes antes que ocupados)
    await enforceRoomLimitsForOwners(ownerIds, limitsByOwner, logs);
    // 3. Upgrade / re-pago: reactiva propiedades y cuartos si el plan tiene espacio
    await reactivatePropertiesForOwners(logs);
    await reactivateRoomsForOwners(logs);

    for (const { tenant, room, owner } of activeRows) {
      const tz = ownerWallClockTz(owner.timezone);
      const todayWall = wallYmdForOwner(new Date(), owner.timezone);
      await backfillRentPaymentsForTenant(
        tenant,
        room,
        todayWall,
        logs,
        tz,
      );
    }

    for (const { tenant, room, property, owner } of activeRows) {
      const limitsCtx = limitsByOwner.get(property.ownerId);
      if (!limitsCtx) {
        logs.push(`[skip] sin contexto de plan owner=${property.ownerId}`);
        continue;
      }

      const todayWall = wallYmdForOwner(new Date(), owner.timezone);
      const triggers = buildReminderTriggersForDay(todayWall, tenant.paymentDay);
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
    const targetMonth = targetDate.getUTCMonth() + 1;
    const targetYear = targetDate.getUTCFullYear();
    const ymd = dateYmdUtc(targetDate);
    const noteBase = cronReminderNotePrefix(kind, ymd, tenant.id);
    const { limits } = limitsCtx;

    if (kind === "t7" && !limits.allowReminderT7) return;
    if (kind === "t3" && !limits.allowReminderT3) return;

    let existingPayment = await db.query.payments.findFirst({
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

    /**
     * Cobro visible en /payment desde el primer recordatorio (T-7 / T-3), no solo el día de vencimiento.
     * Se hace antes del corte por avisos ya enviados, para no dejar huecos si el correo salió y el pago no existía.
     */
    if (
      (kind === "t7" || kind === "t3") &&
      !paidOrAnnulled &&
      !existingPayment
    ) {
      await db.insert(payments).values({
        tenantId: tenant.id,
        amount: room.price.toString(),
        month: targetMonth,
        year: targetYear,
        status: "pending",
      });
      logs.push(
        `[${kind.toUpperCase()}] Cobro pendiente ${targetMonth}/${targetYear} para ${tenant.name} (anticipado con recordatorio)`,
      );
      existingPayment = await db.query.payments.findFirst({
        where: and(
          eq(payments.tenantId, tenant.id),
          eq(payments.month, targetMonth),
          eq(payments.year, targetYear),
        ),
      });
    }

    const kapsoDigits = formatWhatsappForKapso(tenant.whatsapp);
    const waComplete =
      !kapsoDigits ||
      (await auditsService.hasCronReminderChannelSent(
        tenant.id,
        noteBase,
        "whatsapp",
      ));
    const emailComplete =
      !tenant.email?.trim() ||
      (await auditsService.hasCronReminderChannelSent(
        tenant.id,
        noteBase,
        "email",
      ));
    if (waComplete && emailComplete) return;

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
        kapsoTo: kapsoDigits,
        sendKapso: (to) =>
          sendKapsoTemplate({
            to,
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

      if (!limits.allowReminderToday) {
        logs.push(
          `[T0] Cobro generado para ${tenant.name} (${targetMonth}/${targetYear}; sin WhatsApp/correo: plan ${limitsCtx.effectiveTier})`,
        );
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
        kapsoTo: kapsoDigits,
        sendKapso: (to) =>
          sendKapsoTemplate({
            to,
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

    // late: +2d mora; mismo permiso que "hoy" solo para avisos (el estado mora aplica igual)
    if (kind === "late" && existingPayment) {
      if (
        existingPayment.status === "pending" ||
        existingPayment.status === "partial"
      ) {
        await db
          .update(payments)
          .set({ status: "late", updatedAt: new Date() })
          .where(eq(payments.id, existingPayment.id));
      }

      if (
        existingPayment.status === "paid" ||
        existingPayment.status === "annulled"
      ) {
        return;
      }

      if (!limits.allowReminderToday) {
        logs.push(
          `[LATE] Mora aplicada ${tenant.name} (sin aviso: plan ${limitsCtx.effectiveTier})`,
        );
        return;
      }

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
        kapsoTo: kapsoDigits,
        sendKapso: (to) =>
          sendKapsoTemplate({
            to,
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
