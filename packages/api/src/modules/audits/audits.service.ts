import {
  db,
  eq,
  and,
  or,
  desc,
  count,
  like,
  audits,
  tenants,
  rooms,
  properties,
  type AuditChannel,
  type AuditStatus,
} from "@reentwise/database";
import type { ResendLikeResponse } from "@reentwise/api/src/modules/audits/lib/resend-types";
import { buildListPagination } from "@reentwise/api/src/modules/audits/utils/pagination";

export type { CronReminderKind } from "@reentwise/api/src/modules/audits/lib/cron-reminder-prefix";

export type CreateAuditInput = {
  tenantId: string;
  tenantName: string;
  channel: AuditChannel;
  status: AuditStatus;
  note: string;
  loggedAt?: Date;
};

export class AuditsService {
  /**
   * Solo envíos exitosos cuentan: si WhatsApp falló pero el correo no, el cron puede reintentar WA.
   */
  async hasCronReminderChannelSent(
    tenantId: string,
    noteBase: string,
    channel: AuditChannel,
  ): Promise<boolean> {
    const suffix = channel === "whatsapp" ? "|wa" : "|email";
    const [row] = await db
      .select({ c: count() })
      .from(audits)
      .where(
        and(
          eq(audits.tenantId, tenantId),
          eq(audits.channel, channel),
          eq(audits.status, "sent"),
          like(audits.note, `${noteBase}${suffix}%`),
        ),
      );
    return Number(row?.c ?? 0) > 0;
  }

  async create(input: CreateAuditInput) {
    const [row] = await db
      .insert(audits)
      .values({
        tenantId: input.tenantId,
        tenantName: input.tenantName.slice(0, 64),
        channel: input.channel,
        status: input.status,
        note: input.note.slice(0, 160),
        ...(input.loggedAt ? { loggedAt: input.loggedAt } : {}),
      })
      .returning();
    return row;
  }

  async updateStatus(id: string, status: AuditStatus) {
    const [row] = await db
      .update(audits)
      .set({ status })
      .where(eq(audits.id, id))
      .returning();
    return row;
  }

  async updateResult(
    id: string,
    patch: { status: AuditStatus; note?: string },
  ) {
    const [row] = await db
      .update(audits)
      .set({
        status: patch.status,
        ...(patch.note !== undefined
          ? { note: patch.note.slice(0, 160) }
          : {}),
      })
      .where(eq(audits.id, id))
      .returning();
    return row;
  }

  /**
   * Wraps email send: audit row goes sending → sent/failed (Resend).
   * Does not rethrow send errors; logs via `logError` like before.
   */
  async withEmailAudit(
    ctx: { tenantId: string; tenantName: string; note: string },
    send: () => Promise<ResendLikeResponse>,
    logError: (err: unknown) => void,
  ): Promise<void> {
    let row: Awaited<ReturnType<AuditsService["create"]>>;
    try {
      row = await this.create({
        ...ctx,
        channel: "email",
        status: "sending",
      });
    } catch (e) {
      console.error("[Audits] create failed (email)", e);
      try {
        await send();
      } catch (sendErr) {
        logError(sendErr);
      }
      return;
    }

    try {
      const response = await send();
      if (!row?.id) return;
      if (response.error) {
        const msg =
          response.error.message?.slice(0, 160) ?? "Error al enviar correo";
        await this.updateResult(row.id, { status: "failed", note: msg });
        logError(response.error);
      } else {
        await this.updateStatus(row.id, "sent");
      }
    } catch (error) {
      if (row?.id) {
        const msg =
          error instanceof Error ? error.message.slice(0, 160) : "Excepción";
        await this.updateResult(row.id, { status: "failed", note: msg });
      }
      logError(error);
    }
  }

  /** WhatsApp send wrapper: sending → sent/failed (future integration / stub). */
  async withWhatsAppAudit(
    ctx: { tenantId: string; tenantName: string; note: string },
    send: () => Promise<void>,
    logError: (err: unknown) => void,
  ): Promise<void> {
    let row: Awaited<ReturnType<AuditsService["create"]>>;
    try {
      row = await this.create({
        ...ctx,
        channel: "whatsapp",
        status: "sending",
      });
    } catch (e) {
      console.error("[Audits] create failed (whatsapp)", e);
      try {
        await send();
      } catch (sendErr) {
        logError(sendErr);
      }
      return;
    }

    try {
      await send();
      if (row?.id) await this.updateStatus(row.id, "sent");
    } catch (error) {
      if (row?.id) {
        const msg =
          error instanceof Error ? error.message.slice(0, 160) : "Excepción WA";
        await this.updateResult(row.id, { status: "failed", note: msg });
      }
      logError(error);
    }
  }

  async listByTenant(tenantId: string, limit = 50) {
    return db
      .select()
      .from(audits)
      .where(eq(audits.tenantId, tenantId))
      .orderBy(desc(audits.loggedAt))
      .limit(Math.min(limit, 200));
  }

  /**
   * Owner-visible audits: tenants with direct `ownerId` or room on owner property
   * (same scope rule as `getTenants`).
   */
  async getAuditsForOwner(
    ownerId: string,
    query: {
      page?: number;
      limit?: number;
      tenantId?: string;
      channel?: AuditChannel;
      status?: AuditStatus;
    },
  ) {
    const page = Math.max(1, Math.floor(query.page ?? 1));
    const limit = Math.min(Math.max(1, Math.floor(query.limit ?? 50)), 100);
    const offset = (page - 1) * limit;

    const ownerScope = or(
      eq(tenants.ownerId, ownerId),
      eq(properties.ownerId, ownerId),
    );

    const filters = [ownerScope];
    if (query.tenantId?.trim()) {
      filters.push(eq(audits.tenantId, query.tenantId.trim()));
    }
    if (query.channel) {
      filters.push(eq(audits.channel, query.channel));
    }
    if (query.status) {
      filters.push(eq(audits.status, query.status));
    }

    const whereClause = and(...filters);

    const [countRow] = await db
      .select({ total: count() })
      .from(audits)
      .innerJoin(tenants, eq(audits.tenantId, tenants.id))
      .leftJoin(rooms, eq(tenants.roomId, rooms.id))
      .leftJoin(properties, eq(rooms.propertyId, properties.id))
      .where(whereClause);

    const totalItems = Number(countRow?.total ?? 0);

    const rows = await db
      .select({
        id: audits.id,
        tenantId: audits.tenantId,
        tenantName: audits.tenantName,
        channel: audits.channel,
        status: audits.status,
        loggedAt: audits.loggedAt,
        note: audits.note,
      })
      .from(audits)
      .innerJoin(tenants, eq(audits.tenantId, tenants.id))
      .leftJoin(rooms, eq(tenants.roomId, rooms.id))
      .leftJoin(properties, eq(rooms.propertyId, properties.id))
      .where(whereClause)
      .orderBy(desc(audits.loggedAt))
      .limit(limit)
      .offset(offset);

    return {
      audits: rows,
      count: rows.length,
      pagination: buildListPagination(page, limit, totalItems),
    };
  }
}

export const auditsService = new AuditsService();
