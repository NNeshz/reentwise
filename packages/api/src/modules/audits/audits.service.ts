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

/** Maps Meta/Kapso error codes and HTTP statuses to readable Spanish messages. */
function normalizeWaError(error: unknown): string {
  if (!(error instanceof Error)) return "Error desconocido en WhatsApp";
  const msg = error.message;

  const codeMatch = msg.match(/"code":(\d+)/);
  const code = codeMatch?.[1] != null ? parseInt(codeMatch[1], 10) : null;

  if (code != null) {
    switch (code) {
      case 132000: return "Plantilla de WhatsApp no encontrada";
      case 132001: return "Parámetros incorrectos en la plantilla";
      case 131030: return "Número no autorizado en modo de prueba";
      case 131047: return "Ventana de conversación de 24h expiró";
      case 131048: return "Plantilla pausada o deshabilitada por Meta";
      case 133010: return "Número requiere re-registro en WhatsApp";
      case 368:    return "Cuenta de WhatsApp restringida por Meta";
      case 80007:  return "Límite de envíos de WhatsApp alcanzado";
      case 100:
      case 190:    return "Clave de API de WhatsApp inválida o expirada";
    }
  }

  if (msg.includes("(401)")) return "Clave de API de WhatsApp inválida";
  if (msg.includes("(429)")) return "Límite de envíos alcanzado (intenta más tarde)";
  if (msg.includes("(500)") || msg.includes("(502)") || msg.includes("(503)") || msg.includes("(504)"))
    return "Error temporal del servidor de WhatsApp";
  if (msg.includes("(400)")) return "Solicitud inválida a WhatsApp";
  if (msg.includes("(404)")) return "Recurso no encontrado en WhatsApp";

  return msg.slice(0, 120);
}

/** Maps Resend response error codes to readable Spanish messages. */
function normalizeResendResponseError(message: string | null | undefined): string {
  const msg = message ?? "";
  if (!msg) return "Error al enviar correo";
  if (msg.includes("validation_error") || msg.toLowerCase().includes("invalid email"))
    return "Dirección de correo inválida";
  if (msg.includes("rate_limit")) return "Límite de envíos de correo alcanzado";
  if (msg.includes("missing_required")) return "Falta configuración del remitente";
  if (msg.includes("not_found")) return "Dominio de correo no verificado";
  return msg.slice(0, 120);
}

/** Maps network/exception errors on email send to readable Spanish messages. */
function normalizeEmailError(error: unknown): string {
  if (!(error instanceof Error)) return "Error desconocido al enviar correo";
  const msg = error.message;
  if (msg.includes("rate_limit")) return "Límite de envíos de correo alcanzado";
  if (msg.includes("ECONNREFUSED") || msg.includes("fetch")) return "No se pudo conectar con el servidor de correo";
  return msg.slice(0, 120);
}

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

  /** Creates a failed audit directly (e.g. missing phone, pre-send validation). */
  async createFailedAudit(ctx: {
    tenantId: string;
    tenantName: string;
    channel: AuditChannel;
    note: string;
  }): Promise<void> {
    try {
      await this.create({ ...ctx, status: "failed" });
    } catch (e) {
      console.error("[Audits] createFailedAudit failed", e);
    }
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
        const msg = normalizeResendResponseError(response.error.message);
        await this.updateResult(row.id, { status: "failed", note: msg });
        logError(response.error);
      } else {
        await this.updateStatus(row.id, "sent");
      }
    } catch (error) {
      if (row?.id) {
        await this.updateResult(row.id, { status: "failed", note: normalizeEmailError(error) });
      }
      logError(error);
    }
  }

  /** WhatsApp send wrapper: sending → sent/failed. */
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
        await this.updateResult(row.id, { status: "failed", note: normalizeWaError(error) });
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

    const rowsQuery = db
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

    const countQuery = db
      .select({ total: count() })
      .from(audits)
      .innerJoin(tenants, eq(audits.tenantId, tenants.id))
      .leftJoin(rooms, eq(tenants.roomId, rooms.id))
      .leftJoin(properties, eq(rooms.propertyId, properties.id))
      .where(whereClause);

    const failedCountQuery = db
      .select({ total: count() })
      .from(audits)
      .innerJoin(tenants, eq(audits.tenantId, tenants.id))
      .leftJoin(rooms, eq(tenants.roomId, rooms.id))
      .leftJoin(properties, eq(rooms.propertyId, properties.id))
      .where(and(ownerScope, eq(audits.status, "failed")));

    const [[countRow], [failedRow], rows] = await Promise.all([
      countQuery,
      failedCountQuery,
      rowsQuery,
    ]);

    const totalItems = Number(countRow?.total ?? 0);

    return {
      audits: rows,
      count: rows.length,
      pagination: buildListPagination(page, limit, totalItems),
      failedCount: Number(failedRow?.total ?? 0),
    };
  }
}

export const auditsService = new AuditsService();
