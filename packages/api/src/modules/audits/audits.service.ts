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

export type CreateAuditInput = {
  tenantId: string;
  tenantName: string;
  channel: AuditChannel;
  status: AuditStatus;
  note: string;
  loggedAt?: Date;
};

type ResendLikeResponse = {
  error?: { message?: string | null } | null;
};

/** Prefijo estable para idempotencia de recordatorios cron (note ≤ 160). */
export function cronReminderNotePrefix(
  kind: "t7" | "t3" | "t0" | "late",
  targetDateYmd: string,
  tenantId: string,
): string {
  return `cron|${kind}|${targetDateYmd}|${tenantId}`;
}

export class AuditsService {
  /**
   * Evita doble envío si el job diario se ejecuta más de una vez para el mismo ciclo.
   */
  async hasCronReminderForDate(
    tenantId: string,
    kind: "t7" | "t3" | "t0" | "late",
    targetDateYmd: string,
  ): Promise<boolean> {
    const prefix = cronReminderNotePrefix(kind, targetDateYmd, tenantId);
    const [row] = await db
      .select({ c: count() })
      .from(audits)
      .where(
        and(eq(audits.tenantId, tenantId), like(audits.note, `${prefix}%`)),
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
   * Registra sending → sent/failed para correo (Resend).
   * No relanza errores del envío; solo consola como antes.
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

  /**
   * Registra sending → sent/failed para WhatsApp (integración futura o stub).
   */
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
   * Lista auditorías visibles para el dueño: inquilinos con `ownerId` directo
   * o asignados a un cuarto de una propiedad suya (misma regla que `getTenants`).
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
    const totalPages =
      totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

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
      message: "Audits retrieved successfully",
      status: 200,
      audits: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}

export const auditsService = new AuditsService();
