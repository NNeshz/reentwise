import {
  db,
  eq,
  or,
  gt,
  gte,
  tenants,
  contracts,
  audits,
  and,
  rooms,
  properties,
  payments,
  ilike,
  count,
  isNotNull,
  isNull,
  desc,
} from "@reentwise/database";
import { emailService } from "@reentwise/api/src/modules/email/email.service";
import { auditsService } from "@reentwise/api/src/modules/audits/audits.service";
import {
  sendKapsoTemplate,
  formatWhatsappForKapso,
  formatKapsoPropertyLabel,
  formatKapsoCurrencyMx,
  formatKapsoPaymentCutoffDay,
  kapsoBodyReminderConfirmation,
  kapsoTemplateName,
} from "@reentwise/api/src/modules/kapso/kapso.service";
import { emailWelcomeConfirmation } from "@reentwise/api/src/modules/email/lib/kapso-aligned-html";
import { RoomNotFoundError } from "@reentwise/api/src/modules/rooms/lib/room-not-found-error";
import { getPaymentDateForMonth } from "@reentwise/api/src/modules/tenants/lib/get-payment-date-for-month";
import {
  TenantForbiddenError,
  TenantNotFoundError,
  TenantValidationError,
} from "@reentwise/api/src/modules/tenants/lib/tenant-errors";
import {
  firstBillableYearMonth,
  tenantReachedBillingPeriod,
} from "@reentwise/api/src/modules/tenants/lib/tenant-first-billable";

export { getPaymentDateForMonth } from "@reentwise/api/src/modules/tenants/lib/get-payment-date-for-month";

const PAYMENT_DAY_ERROR =
  "paymentDay debe ser 0 (final de mes) o 1-31 (día del mes).";

function assertPaymentDayRange(paymentDay: number) {
  if (paymentDay < 0 || paymentDay > 31) {
    throw new TenantValidationError(PAYMENT_DAY_ERROR);
  }
}

export class TenantsService {
  /** Verifica que el cuarto pertenece al owner autenticado; lanza RoomNotFoundError si no. */
  private async requireRoomOwnership(
    roomId: string,
    ownerId: string,
  ): Promise<void> {
    const [row] = await db
      .select({ id: rooms.id })
      .from(rooms)
      .innerJoin(properties, eq(rooms.propertyId, properties.id))
      .where(and(eq(rooms.id, roomId), eq(properties.ownerId, ownerId)))
      .limit(1);
    if (!row) throw new RoomNotFoundError("Cuarto no encontrado");
  }

  private async sendTenantCreatedEmailSafe(input: {
    tenantId: string;
    tenantEmail: string;
    tenantName: string;
    paymentDay: number;
    propertyName?: string | null;
    roomNumber?: string | null;
    monthlyRentFormatted: string;
  }) {
    const propertyLabel = formatKapsoPropertyLabel({
      propertyName: input.propertyName,
      roomNumber: input.roomNumber?.trim() || "—",
    });
    const { subject, html, text } = emailWelcomeConfirmation({
      tenantName: input.tenantName,
      propertyLabel,
      monthlyRentFormatted: input.monthlyRentFormatted,
      paymentCutoffDayLabel: formatKapsoPaymentCutoffDay(input.paymentDay),
    });

    await auditsService.withEmailAudit(
      {
        tenantId: input.tenantId,
        tenantName: input.tenantName,
        note: "Bienvenido a Reentwise",
      },
      () =>
        emailService.sendHtml({
          to: input.tenantEmail,
          subject,
          html,
          text,
          tags: [
            { name: "type", value: "tenant_created" },
            { name: "module", value: "tenants" },
          ],
          idempotencyKey: `welcome-email-${input.tenantId}`,
        }),
      (err) =>
        console.error("[Email][Tenants] Error sending welcome email:", err),
    );
  }

  async getTenants(
    ownerId: string,
    query: {
      search?: string;
      status?: "pending" | "partial" | "paid" | "late" | "annulled";
      propertyId?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const limit = Math.min(query.limit ?? 50, 500);
    const page = query.page ?? 1;
    const offset = (page - 1) * limit;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const conditions = [
      or(eq(tenants.ownerId, ownerId), eq(properties.ownerId, ownerId)),
      tenantReachedBillingPeriod(currentYear, currentMonth),
    ];

    if (query.search?.trim()) {
      conditions.push(
        or(
          ilike(tenants.name, `%${query.search.trim()}%`),
          ilike(tenants.whatsapp, `%${query.search.trim()}%`),
        )!,
      );
    }

    if (query.status) {
      if (query.status === "pending") {
        conditions.push(
          or(eq(payments.status, "pending"), isNull(payments.id))!,
        );
      } else {
        conditions.push(eq(payments.status, query.status));
      }
    }

    if (query.propertyId?.trim()) {
      conditions.push(eq(properties.id, query.propertyId.trim()));
    }

    const baseQuery = db
      .select({
        id: tenants.id,
        name: tenants.name,
        whatsapp: tenants.whatsapp,
        email: tenants.email,
        paymentDay: tenants.paymentDay,
        notes: tenants.notes,
        roomId: tenants.roomId,
        ownerId: tenants.ownerId,
        deposit: tenants.deposit,
        startDate: tenants.startDate,
        createdAt: tenants.createdAt,
        updatedAt: tenants.updatedAt,
        room: {
          id: rooms.id,
          roomNumber: rooms.roomNumber,
        },
      })
      .from(tenants)
      .leftJoin(rooms, eq(tenants.roomId, rooms.id))
      .leftJoin(properties, eq(rooms.propertyId, properties.id))
      .leftJoin(
        payments,
        and(
          eq(payments.tenantId, tenants.id),
          eq(payments.month, currentMonth),
          eq(payments.year, currentYear),
          eq(payments.isAnnulled, false),
          eq(payments.reason, "rent"),
        ),
      )
      .where(and(...conditions));

    const [tenantsResult, totalResult] = await Promise.all([
      baseQuery.limit(limit).offset(offset),
      db
        .select({ count: count() })
        .from(tenants)
        .leftJoin(rooms, eq(tenants.roomId, rooms.id))
        .leftJoin(properties, eq(rooms.propertyId, properties.id))
        .leftJoin(
          payments,
          and(
            eq(payments.tenantId, tenants.id),
            eq(payments.month, currentMonth),
            eq(payments.year, currentYear),
            eq(payments.isAnnulled, false),
          ),
        )
        .where(and(...conditions)),
    ]);

    const totalProducts = Number(totalResult[0]?.count ?? 0);
    const totalPages = Math.ceil(totalProducts / limit);
    return {
      tenants: tenantsResult,
      count: tenantsResult.length,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        productsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      },
    };
  }

  async getRoomTenants(roomId: string, ownerId: string) {
    await this.requireRoomOwnership(roomId, ownerId);
    const tenantsResult = await db.query.tenants.findMany({
      where: eq(tenants.roomId, roomId),
    });
    return { tenantsFound: tenantsResult ?? [] };
  }

  async createTenant(
    roomId: string,
    ownerId: string,
    body: {
      name: string;
      whatsapp: string;
      email: string;
      paymentDay: number;
      notes?: string;
    },
  ) {
    assertPaymentDayRange(body.paymentDay);

    const roomOwnerRes = await db
      .select({
        ownerId: properties.ownerId,
        roomNumber: rooms.roomNumber,
        price: rooms.price,
        propertyName: properties.name,
      })
      .from(rooms)
      .leftJoin(properties, eq(rooms.propertyId, properties.id))
      .where(and(eq(rooms.id, roomId), eq(properties.ownerId, ownerId)));
    const roomRow = roomOwnerRes[0];
    if (!roomRow) {
      throw new RoomNotFoundError();
    }
    const tenantOwnerId = roomRow.ownerId || null;

    const tenantResult = await db
      .insert(tenants)
      .values({
        ownerId: tenantOwnerId,
        roomId,
        name: body.name,
        whatsapp: body.whatsapp,
        email: body.email,
        paymentDay: body.paymentDay,
        notes: body.notes,
      })
      .returning();

    if (!tenantResult?.length) {
      throw new Error("Failed to create tenant");
    }

    const createdTenant = tenantResult[0]!;

    const propertyLabel = formatKapsoPropertyLabel({
      propertyName: roomRow.propertyName,
      roomNumber: roomRow.roomNumber,
    });
    const welcomeComponents = kapsoBodyReminderConfirmation({
      tenantName: createdTenant.name,
      propertyLabel,
      monthlyRentFormatted: formatKapsoCurrencyMx(roomRow.price),
      paymentCutoffDayLabel: formatKapsoPaymentCutoffDay(
        createdTenant.paymentDay,
      ),
    });

    if (createdTenant.email) {
      void this.sendTenantCreatedEmailSafe({
        tenantId: createdTenant.id,
        tenantEmail: createdTenant.email,
        tenantName: createdTenant.name,
        paymentDay: createdTenant.paymentDay,
        propertyName: roomRow.propertyName,
        roomNumber: roomRow.roomNumber,
        monthlyRentFormatted: formatKapsoCurrencyMx(roomRow.price),
      });
    }

    const waTo = formatWhatsappForKapso(body.whatsapp);
    if (waTo) {
      void auditsService.withWhatsAppAudit(
        {
          tenantId: createdTenant.id,
          tenantName: createdTenant.name,
          note: "Bienvenida inquilino nuevo",
        },
        () =>
          sendKapsoTemplate({
            to: waTo,
            templateName: kapsoTemplateName("reminder_confirmation"),
            components: welcomeComponents,
          }),
        (err) =>
          console.error("[WhatsApp][Tenants] Error enviando bienvenida:", err),
      );
    } else {
      void auditsService.createFailedAudit({
        tenantId: createdTenant.id,
        tenantName: createdTenant.name,
        channel: "whatsapp",
        note: "Sin número de WhatsApp válido · Bienvenida",
      });
    }

    return createdTenant;
  }

  async createAndAssignTenant(
    roomId: string,
    ownerId: string,
    body: {
      name: string;
      whatsapp: string;
      email: string;
      paymentDay: number;
      notes?: string;
      firstMonthRent?: number;
      deposit?: number;
      graceDays?: number;
      contractStartsAt?: string;
      contractEndsAt?: string;
    },
  ) {
    assertPaymentDayRange(body.paymentDay);

    const result = await db.transaction(async (tx) => {
      const roomData = await tx
        .select({
          ownerId: properties.ownerId,
          price: rooms.price,
          roomNumber: rooms.roomNumber,
          propertyName: properties.name,
        })
        .from(rooms)
        .leftJoin(properties, eq(rooms.propertyId, properties.id))
        .where(and(eq(rooms.id, roomId), eq(properties.ownerId, ownerId)));

      const room = roomData[0];
      if (!room) {
        throw new RoomNotFoundError();
      }

      const tenantOwnerId = room.ownerId;

      const [newTenant] = await tx
        .insert(tenants)
        .values({
          ownerId: tenantOwnerId,
          roomId,
          name: body.name,
          whatsapp: body.whatsapp,
          email: body.email,
          paymentDay: body.paymentDay,
          notes: body.notes,
        })
        .returning();

      if (!newTenant) {
        throw new Error("Failed to create tenant");
      }

      await tx
        .update(rooms)
        .set({ status: "occupied", updatedAt: new Date() })
        .where(eq(rooms.id, roomId));

      const startsAt = body.contractStartsAt
        ? new Date(body.contractStartsAt)
        : new Date();

      // Determine first billing month: same month if pay day >= start day, else next month
      const startYear = startsAt.getFullYear();
      const startMonth = startsAt.getMonth() + 1;
      const startDay = startsAt.getDate();
      const firstDueDay = getPaymentDateForMonth(startYear, startMonth, body.paymentDay);
      let firstPayMonth = startMonth;
      let firstPayYear = startYear;
      if (firstDueDay < startDay) {
        firstPayMonth = startMonth === 12 ? 1 : startMonth + 1;
        firstPayYear = startMonth === 12 ? startYear + 1 : startYear;
      }

      // First payment: prorated amount if adjustFirstMonth, else full rent
      await tx.insert(payments).values({
        tenantId: newTenant.id,
        tenantName: newTenant.name,
        reason: "rent",
        amount:
          body.firstMonthRent !== undefined
            ? body.firstMonthRent.toString()
            : room.price.toString(),
        month: firstPayMonth,
        year: firstPayYear,
        status: "pending",
      });

      await tx
        .update(tenants)
        .set({ startDate: startsAt })
        .where(eq(tenants.id, newTenant.id));

      const [contract] = await tx
        .insert(contracts)
        .values({
          ownerId: tenantOwnerId!,
          tenantId: newTenant.id,
          roomId,
          rentAmount: room.price.toString(),
          paymentDay: body.paymentDay,
          deposit: body.deposit?.toString() ?? "0.00",
          graceDays: body.graceDays ?? 2,
          startsAt,
          endsAt: body.contractEndsAt ? new Date(body.contractEndsAt) : null,
          status: "active",
          signedAt: startsAt,
        })
        .returning();

      if (body.deposit && body.deposit > 0 && contract) {
        await tx.insert(payments).values({
          tenantId: newTenant.id,
          contractId: contract.id,
          tenantName: newTenant.name,
          reason: "deposit",
          amount: body.deposit.toString(),
          month: startMonth,
          year: startYear,
          status: "pending",
        });
      }

      return {
        newTenant,
        contract,
        welcomePropertyName: room.propertyName,
        welcomeRoomNumber: room.roomNumber,
        welcomeRent: room.price,
      };
    });

    const {
      newTenant: resultTenant,
      welcomePropertyName,
      welcomeRoomNumber,
      welcomeRent,
    } = result;

    const propertyLabel = formatKapsoPropertyLabel({
      propertyName: welcomePropertyName,
      roomNumber: welcomeRoomNumber || "—",
    });
    const welcomeComponents = kapsoBodyReminderConfirmation({
      tenantName: resultTenant.name,
      propertyLabel,
      monthlyRentFormatted: formatKapsoCurrencyMx(welcomeRent),
      paymentCutoffDayLabel: formatKapsoPaymentCutoffDay(
        resultTenant.paymentDay,
      ),
    });

    const waToAssign = formatWhatsappForKapso(resultTenant.whatsapp);
    if (waToAssign) {
      void auditsService.withWhatsAppAudit(
        {
          tenantId: resultTenant.id,
          tenantName: resultTenant.name,
          note: "Bienvenida inquilino nuevo",
        },
        () =>
          sendKapsoTemplate({
            to: waToAssign,
            templateName: kapsoTemplateName("reminder_confirmation"),
            components: welcomeComponents,
          }),
        (err) => console.error("[WhatsApp] Error sending welcome message:", err),
      );
    } else {
      void auditsService.createFailedAudit({
        tenantId: resultTenant.id,
        tenantName: resultTenant.name,
        channel: "whatsapp",
        note: "Sin número de WhatsApp válido · Bienvenida",
      });
    }

    if (resultTenant?.email) {
      void this.sendTenantCreatedEmailSafe({
        tenantId: resultTenant.id,
        tenantEmail: resultTenant.email,
        tenantName: resultTenant.name,
        paymentDay: resultTenant.paymentDay,
        propertyName: welcomePropertyName,
        roomNumber: welcomeRoomNumber ?? null,
        monthlyRentFormatted: formatKapsoCurrencyMx(welcomeRent),
      });
    }

    return resultTenant;
  }

  async reassignTenant(
    roomId: string,
    tenantId: string,
    ownerId: string,
    body?: { paymentDay?: number },
  ) {
    if (
      body?.paymentDay != null &&
      (body.paymentDay < 0 || body.paymentDay > 31)
    ) {
      throw new TenantValidationError(PAYMENT_DAY_ERROR);
    }

    // Verifica que el cuarto destino pertenece al owner
    await this.requireRoomOwnership(roomId, ownerId);

    const tenantRecord = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId),
    });

    if (!tenantRecord) {
      throw new TenantNotFoundError();
    }

    // Verifica que el inquilino también pertenece al owner
    if (tenantRecord.ownerId !== ownerId) {
      throw new RoomNotFoundError("Inquilino no encontrado");
    }

    const oldRoomId = tenantRecord.roomId;

    const updatePayload: Partial<typeof tenants.$inferInsert> = {
      roomId,
    };
    if (body?.paymentDay != null) {
      updatePayload.paymentDay = body.paymentDay;
    }

    const tenantResult = await db
      .update(tenants)
      .set(updatePayload)
      .where(eq(tenants.id, tenantId))
      .returning();

    if (!tenantResult?.length) {
      throw new TenantNotFoundError("Failed to reassign tenant");
    }

    await db
      .update(rooms)
      .set({ status: "occupied" })
      .where(eq(rooms.id, roomId));

    if (oldRoomId && oldRoomId !== roomId) {
      await db
        .update(rooms)
        .set({ status: "vacant" })
        .where(eq(rooms.id, oldRoomId));
    }

    return tenantResult[0]!;
  }

  async updateTenant(
    tenantId: string,
    ownerId: string,
    body: {
      name?: string;
      whatsapp?: string;
      email?: string;
      notes?: string;
    },
  ) {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId),
    });

    if (!tenant) {
      throw new TenantNotFoundError();
    }

    if (tenant.ownerId !== ownerId) {
      const roomOwner = tenant.roomId
        ? await db
            .select({ ownerId: properties.ownerId })
            .from(rooms)
            .leftJoin(properties, eq(rooms.propertyId, properties.id))
            .where(eq(rooms.id, tenant.roomId))
        : [];
      if (roomOwner[0]?.ownerId !== ownerId) {
        throw new TenantForbiddenError(
          "Not authorized to update this tenant",
        );
      }
    }

    const patch: Partial<typeof tenants.$inferInsert> = {};
    if (body.name !== undefined) patch.name = body.name;
    if (body.whatsapp !== undefined) patch.whatsapp = body.whatsapp;
    if (body.email !== undefined) patch.email = body.email;
    if (body.notes !== undefined) patch.notes = body.notes;

    if (Object.keys(patch).length === 0) {
      throw new TenantValidationError(
        "Envía al menos un campo para actualizar.",
      );
    }

    const updated = await db
      .update(tenants)
      .set(patch)
      .where(eq(tenants.id, tenantId))
      .returning();

    if (!updated.length) {
      throw new TenantNotFoundError("Failed to update tenant");
    }

    return updated[0]!;
  }

  async deleteTenant(roomId: string, tenantId: string, ownerId: string) {
    await this.requireRoomOwnership(roomId, ownerId);

    // Borrar audits y contratos primero (payments se preservan vía FK SET NULL)
    await db.delete(audits).where(eq(audits.tenantId, tenantId));
    await db.delete(contracts).where(eq(contracts.tenantId, tenantId));

    const tenantResult = await db
      .delete(tenants)
      .where(and(eq(tenants.id, tenantId), eq(tenants.roomId, roomId)))
      .returning();

    if (!tenantResult.length) {
      throw new TenantNotFoundError("Failed to delete tenant");
    }

    await db
      .update(rooms)
      .set({ status: "vacant" })
      .where(eq(rooms.id, roomId));

    return tenantResult[0]!;
  }

  /**
   * `roomIdFromRoute` debe coincidir con el cuarto real del inquilino si se envía;
   * si viene vacío o el cliente solo conoce `tenantId`, se usa `tenant.roomId` en BD.
   */
  async unassignTenant(
    roomIdFromRoute: string,
    tenantId: string,
    ownerId: string,
  ) {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId),
    });

    if (!tenant) {
      throw new TenantNotFoundError("Inquilino no encontrado");
    }

    const actualRoomId = tenant.roomId;
    if (!actualRoomId) {
      throw new TenantValidationError(
        "El inquilino no tiene un cuarto asignado.",
      );
    }

    const claimedRoomId = roomIdFromRoute?.trim() || null;
    if (claimedRoomId && claimedRoomId !== actualRoomId) {
      throw new TenantValidationError(
        "Este inquilino no está asignado al cuarto indicado.",
      );
    }

    const roomOwnerRes = await db
      .select({ ownerId: properties.ownerId })
      .from(rooms)
      .innerJoin(properties, eq(rooms.propertyId, properties.id))
      .where(eq(rooms.id, actualRoomId));

    const propertyOwnerId = roomOwnerRes[0]?.ownerId;
    if (!propertyOwnerId) {
      throw new RoomNotFoundError();
    }

    if (propertyOwnerId !== ownerId) {
      throw new TenantForbiddenError(
        "No autorizado para desvincular este inquilino",
      );
    }

    const tenantResult = await db
      .update(tenants)
      .set({
        roomId: null,
        ownerId: propertyOwnerId,
        updatedAt: new Date(),
      })
      .where(
        and(eq(tenants.id, tenantId), eq(tenants.roomId, actualRoomId)),
      )
      .returning();

    if (!tenantResult.length) {
      throw new TenantNotFoundError("No se pudo desvincular el inquilino");
    }

    await db
      .update(rooms)
      .set({ status: "vacant", updatedAt: new Date() })
      .where(eq(rooms.id, actualRoomId));

    return tenantResult[0]!;
  }

  async deleteTenantById(tenantId: string, ownerId: string) {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId),
    });

    if (!tenant) {
      throw new TenantNotFoundError();
    }

    if (tenant.ownerId !== ownerId) {
      const roomOwner = tenant.roomId
        ? await db
            .select({ ownerId: properties.ownerId })
            .from(rooms)
            .leftJoin(properties, eq(rooms.propertyId, properties.id))
            .where(eq(rooms.id, tenant.roomId))
        : [];
      if (roomOwner[0]?.ownerId !== ownerId) {
        throw new TenantForbiddenError(
          "Not authorized to delete this tenant",
        );
      }
    }

    const deleted = await db.transaction(async (tx) => {
      await tx.delete(audits).where(eq(audits.tenantId, tenantId));
      // payments NO se borran — el FK SET NULL preserva el historial de cobros
      await tx.delete(contracts).where(eq(contracts.tenantId, tenantId));

      const [row] = await tx
        .delete(tenants)
        .where(eq(tenants.id, tenantId))
        .returning();

      if (!row) throw new TenantNotFoundError("Failed to delete tenant");

      if (tenant.roomId) {
        await tx
          .update(rooms)
          .set({ status: "vacant" })
          .where(eq(rooms.id, tenant.roomId));
      }

      return row;
    });

    return deleted;
  }

  async getTenantById(tenantId: string, ownerId: string) {
    const [row] = await db
      .select({
        tenant: tenants,
        roomId: rooms.id,
        roomNumber: rooms.roomNumber,
        roomStatus: rooms.status,
        propertyId: properties.id,
        propertyName: properties.name,
        propertyOwnerId: properties.ownerId,
      })
      .from(tenants)
      .leftJoin(rooms, eq(tenants.roomId, rooms.id))
      .leftJoin(properties, eq(rooms.propertyId, properties.id))
      .where(eq(tenants.id, tenantId))
      .limit(1);

    if (!row) throw new TenantNotFoundError();

    const isOwner =
      row.tenant.ownerId === ownerId || row.propertyOwnerId === ownerId;
    if (!isOwner)
      throw new TenantForbiddenError("Not authorized to view this tenant");

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const [contract, currentMonthPayment] = await Promise.all([
      db
        .select()
        .from(contracts)
        .where(eq(contracts.tenantId, tenantId))
        .orderBy(desc(contracts.createdAt))
        .limit(1)
        .then((r) => r[0] ?? null),
      db
        .select()
        .from(payments)
        .where(
          and(
            eq(payments.tenantId, tenantId),
            eq(payments.month, currentMonth),
            eq(payments.year, currentYear),
            eq(payments.isAnnulled, false),
          ),
        )
        .limit(1)
        .then((r) => r[0] ?? null),
    ]);

    return {
      tenant: row.tenant,
      room: row.roomId
        ? { id: row.roomId, roomNumber: row.roomNumber, status: row.roomStatus }
        : null,
      property: row.propertyId
        ? { id: row.propertyId, name: row.propertyName }
        : null,
      contract,
      currentMonthPayment,
    };
  }

  async getPaymentsByTenant(tenantId: string, ownerId: string) {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId),
    });

    if (!tenant) {
      throw new TenantNotFoundError();
    }

    if (tenant.ownerId !== ownerId) {
      const roomOwner = tenant.roomId
        ? await db
            .select({ ownerId: properties.ownerId })
            .from(rooms)
            .leftJoin(properties, eq(rooms.propertyId, properties.id))
            .where(eq(rooms.id, tenant.roomId))
        : [];
      if (roomOwner[0]?.ownerId !== ownerId) {
        throw new TenantForbiddenError(
          "Not authorized to view this tenant's payments",
        );
      }
    }

    const { year: fy, month: fm } = firstBillableYearMonth(tenant);

    const [result, activeContract] = await Promise.all([
      db
        .select()
        .from(payments)
        .where(
          and(
            eq(payments.tenantId, tenantId),
            or(
              gt(payments.year, fy),
              and(eq(payments.year, fy), gte(payments.month, fm)),
            ),
          ),
        )
        .orderBy(desc(payments.year), desc(payments.month)),
      db.query.contracts.findFirst({
        where: and(eq(contracts.tenantId, tenantId), eq(contracts.status, "active")),
        columns: {
          id: true,
          deposit: true,
          depositCollectedAt: true,
          depositAmountCollected: true,
        },
      }),
    ]);

    return { payments: result, contract: activeContract ?? null };
  }

  async getAccountStatus(
    ownerId: string,
    params: {
      month: number;
      year: number;
      search?: string;
      status?: "pending" | "partial" | "paid";
    },
  ) {
    const now = new Date();
    const month = params.month ?? now.getMonth() + 1;
    const year = params.year ?? now.getFullYear();
    const search = params.search?.trim();
    const statusFilter = params.status;

    const conditions = [
      or(eq(tenants.ownerId, ownerId), eq(properties.ownerId, ownerId)),
      isNotNull(tenants.roomId),
      tenantReachedBillingPeriod(year, month),
    ];

    if (search) {
      conditions.push(
        or(
          ilike(tenants.name, `%${search}%`),
          ilike(tenants.whatsapp, `%${search}%`),
        ),
      );
    }

    const baseQuery = db
      .select({
        tenantId: tenants.id,
        tenantName: tenants.name,
        tenantWhatsapp: tenants.whatsapp,
        roomId: rooms.id,
        roomNumber: rooms.roomNumber,
        roomPrice: rooms.price,
        paymentId: payments.id,
        paymentAmount: payments.amount,
        paymentAmountPaid: payments.amountPaid,
        paymentStatus: payments.status,
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
      .where(and(...conditions));

    const rows = await baseQuery;

    let filtered = rows;
    if (statusFilter === "pending") {
      filtered = rows.filter(
        (r) => !r.paymentId || r.paymentStatus === "pending",
      );
    } else if (statusFilter === "partial") {
      filtered = rows.filter((r) => r.paymentStatus === "partial");
    } else if (statusFilter === "paid") {
      filtered = rows.filter((r) => r.paymentStatus === "paid");
    }

    return {
      items: filtered.map((r) => {
        const amount = r.paymentAmount
          ? Number(r.paymentAmount)
          : r.roomPrice
            ? Number(r.roomPrice)
            : null;
        return {
          tenantId: r.tenantId,
          tenantName: r.tenantName,
          tenantWhatsapp: r.tenantWhatsapp,
          roomId: r.roomId,
          roomNumber: r.roomNumber,
          paymentId: r.paymentId,
          amount,
          amountPaid: r.paymentAmountPaid ? Number(r.paymentAmountPaid) : 0,
          status: r.paymentStatus ?? "pending",
        };
      }),
    };
  }
}

export const tenantsService = new TenantsService();
