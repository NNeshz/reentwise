import {
  db,
  eq,
  or,
  tenants,
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
  normalizeKapsoRecipient,
  kapsoBodyParametersFromStrings,
} from "@reentwise/api/src/modules/kapso/kapso.service";
import { env } from "@reentwise/api/src/utils/envs";

export function getPaymentDateForMonth(
  year: number,
  month: number,
  paymentDay: number,
): number {
  if (paymentDay < 0 || paymentDay > 31) return 1;
  const lastDay = new Date(year, month, 0).getDate();
  if (paymentDay === 0) return lastDay;
  return Math.min(paymentDay, lastDay);
}

/** Parámetros {{1}}–{{4}} del template de bienvenida WhatsApp (Kapso). */
function buildTenantWelcomeTemplateParameters(input: {
  tenantName: string;
  roomNumber: string;
  monthlyRent: string | number;
  paymentDay: number;
}): string[] {
  const roomLabel = `Cuarto ${input.roomNumber}`;
  const amount = Number(input.monthlyRent);
  const rentFormatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number.isFinite(amount) ? amount : 0);
  const paymentDayText =
    input.paymentDay === 0 ? "el último día" : String(input.paymentDay);
  return [input.tenantName, roomLabel, rentFormatted, paymentDayText];
}

export class TenantsService {
  private async sendTenantCreatedEmailSafe(input: {
    tenantId: string;
    tenantEmail: string;
    tenantName: string;
    paymentDay: number;
    roomNumber?: string | null;
  }) {
    const paymentDayLabel =
      input.paymentDay === 0 ? "ultimo dia de cada mes" : `dia ${input.paymentDay} de cada mes`;
    const roomLabel = input.roomNumber ? `Cuarto ${input.roomNumber}` : "sin cuarto asignado";

    await auditsService.withEmailAudit(
      {
        tenantId: input.tenantId,
        tenantName: input.tenantName,
        note: "Bienvenido a Reentwise",
      },
      () =>
        emailService.sendHtml({
          to: input.tenantEmail,
          subject: "Bienvenido a Reentwise",
          html: `
          <h2>Hola ${input.tenantName}, bienvenido(a) a Reentwise</h2>
          <p>Tu registro fue creado correctamente por el owner.</p>
          <p><strong>Cuarto:</strong> ${roomLabel}</p>
          <p><strong>Fecha de pago:</strong> ${paymentDayLabel}</p>
          <p>Si tienes dudas sobre tu pago, responde a este correo.</p>
        `,
          text: `Hola ${input.tenantName}, tu registro en Reentwise fue creado. ${roomLabel}. Fecha de pago: ${paymentDayLabel}.`,
          tags: [
            { name: "type", value: "tenant_created" },
            { name: "module", value: "tenants" },
          ],
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
    },
  ) {
    try {
      const limit = 50;
      const page = query.page ?? 1;
      const offset = (page - 1) * limit;
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const conditions = [
        or(eq(tenants.ownerId, ownerId), eq(properties.ownerId, ownerId)),
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
        message: "Tenants retrieved successfully",
        status: 200,
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
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async getRoomTenants(roomId: string) {
    try {
      const tenantsResult = await db.query.tenants.findMany({
        where: eq(tenants.roomId, roomId),
      });

      if (!tenantsResult) {
        throw new Error("Tenants not found");
      }

      return {
        tenantsFound: tenantsResult,
      };
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async createTenant(
    roomId: string,
    body: {
      name: string;
      whatsapp: string;
      email: string;
      paymentDay: number;
      notes?: string;
    },
  ) {
    try {
      if (body.paymentDay < 0 || body.paymentDay > 31) {
        throw new Error(
          "paymentDay debe ser 0 (final de mes) o 1-31 (día del mes).",
        );
      }

      const roomOwnerRes = await db
        .select({
          ownerId: properties.ownerId,
          roomNumber: rooms.roomNumber,
          price: rooms.price,
        })
        .from(rooms)
        .leftJoin(properties, eq(rooms.propertyId, properties.id))
        .where(eq(rooms.id, roomId));
      const roomRow = roomOwnerRes[0];
      if (!roomRow) {
        throw new Error("Room not found");
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
      if (createdTenant.email) {
        await this.sendTenantCreatedEmailSafe({
          tenantId: createdTenant.id,
          tenantEmail: createdTenant.email,
          tenantName: createdTenant.name,
          paymentDay: createdTenant.paymentDay,
          roomNumber: roomRow.roomNumber,
        });
      }

      const templateParams = buildTenantWelcomeTemplateParameters({
        tenantName: createdTenant.name,
        roomNumber: roomRow.roomNumber,
        monthlyRent: roomRow.price,
        paymentDay: createdTenant.paymentDay,
      });

      await auditsService.withWhatsAppAudit(
        {
          tenantId: createdTenant.id,
          tenantName: createdTenant.name,
          note: "Bienvenida inquilino nuevo",
        },
        () =>
          sendKapsoTemplate({
            to: normalizeKapsoRecipient(body.whatsapp),
            templateName: env.KAPSO_WELCOME_TEMPLATE_NAME,
            components: kapsoBodyParametersFromStrings(templateParams),
          }),
        (err) =>
          console.error("[WhatsApp][Tenants] Error enviando bienvenida:", err),
      );

      return tenantResult;
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async createAndAssignTenant(
    roomId: string,
    body: {
      name: string;
      whatsapp: string;
      email: string;
      paymentDay: number;
      notes?: string;
      firstMonthRent?: number;
      deposit?: number; 
    },
  ) {
    try {
      if (body.paymentDay < 0 || body.paymentDay > 31) {
        throw new Error(
          "paymentDay debe ser 0 (final de mes) o 1-31 (día del mes).",
        );
      }

      const result = await db.transaction(async (tx) => {
        const roomData = await tx
          .select({
            ownerId: properties.ownerId,
            price: rooms.price,
            roomNumber: rooms.roomNumber,
          })
          .from(rooms)
          .leftJoin(properties, eq(rooms.propertyId, properties.id))
          .where(eq(rooms.id, roomId));

        const room = roomData[0];
        if (!room) {
          throw new Error("Room not found");
        }

        const tenantOwnerId = room.ownerId;
        const roomPrice = Number(room.price);

        const [newTenant] = await tx
          .insert(tenants)
          .values({
            ownerId: tenantOwnerId,
            roomId,
            name: body.name,
            whatsapp: body.whatsapp,
            email: body.email,
            paymentDay: body.paymentDay,
            deposit: body.deposit?.toString() ?? "0.00",
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

        if (body.firstMonthRent !== undefined) {
          const currentDate = new Date();
          await tx.insert(payments).values({
            tenantId: newTenant.id,
            amount: body.firstMonthRent.toString(),
            month: currentDate.getMonth() + 1, 
            year: currentDate.getFullYear(),
            status: "pending",
          });
        }

        return { newTenant };
      });

      if (!result) {
        throw new Error("Transaction failed");
      }

      const { newTenant: resultTenant } = result;

      const roomForWelcome = await db.query.rooms.findFirst({
        where: eq(rooms.id, roomId),
      });
      const welcomeRoomNumber = roomForWelcome?.roomNumber ?? "";
      const welcomeRent = roomForWelcome?.price ?? "0";

      const templateParams = buildTenantWelcomeTemplateParameters({
        tenantName: resultTenant.name,
        roomNumber: welcomeRoomNumber || "—",
        monthlyRent: welcomeRent,
        paymentDay: resultTenant.paymentDay,
      });

      await auditsService.withWhatsAppAudit(
        {
          tenantId: resultTenant.id,
          tenantName: resultTenant.name,
          note: "Bienvenida inquilino nuevo",
        },
        () =>
          sendKapsoTemplate({
            to: normalizeKapsoRecipient(resultTenant.whatsapp),
            templateName: env.KAPSO_WELCOME_TEMPLATE_NAME,
            components: kapsoBodyParametersFromStrings(templateParams),
          }),
        (err) =>
          console.error("[WhatsApp] Error sending welcome message:", err),
      );

      if (resultTenant?.email) {
        await this.sendTenantCreatedEmailSafe({
          tenantId: resultTenant.id,
          tenantEmail: resultTenant.email,
          tenantName: resultTenant.name,
          paymentDay: resultTenant.paymentDay,
          roomNumber: roomForWelcome?.roomNumber ?? null,
        });
      }

      return resultTenant;
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }



  async reassignTenant(
    roomId: string,
    tenantId: string,
    body?: { paymentDay?: number },
  ) {
    try {
      if (
        body?.paymentDay != null &&
        (body.paymentDay < 0 || body.paymentDay > 31)
      ) {
        throw new Error(
          "paymentDay debe ser 0 (final de mes) o 1-31 (día del mes).",
        );
      }

      const tenantRecord = await db.query.tenants.findFirst({
        where: eq(tenants.id, tenantId),
      });

      if (!tenantRecord) {
        throw new Error("Tenant not found");
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

      if (!tenantResult || tenantResult.length === 0) {
        throw new Error("Failed to reassign tenant");
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

      return tenantResult[0];
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async updateTenant(
    roomId: string,
    tenantId: string,
    body: {
      name?: string;
      whatsapp?: string;
      email?: string;
      paymentDay?: number;
      notes?: string;
    },
  ) {
    try {
      if (
        body.paymentDay != null &&
        (body.paymentDay < 0 || body.paymentDay > 31)
      ) {
        throw new Error(
          "paymentDay debe ser 0 (final de mes) o 1-31 (día del mes).",
        );
      }
      const tenantResult = await db
        .update(tenants)
        .set({
          name: body.name,
          whatsapp: body.whatsapp,
          email: body.email,
          paymentDay: body.paymentDay,
          notes: body.notes,
        })
        .where(and(eq(tenants.id, tenantId), eq(tenants.roomId, roomId)));

      if (!tenantResult) {
        throw new Error("Failed to update tenant");
      }

      return tenantResult;
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async deleteTenant(roomId: string, tenantId: string) {
    try {
      const tenantResult = await db
        .delete(tenants)
        .where(and(eq(tenants.id, tenantId), eq(tenants.roomId, roomId)))
        .returning();

      if (!tenantResult || tenantResult.length === 0) {
        throw new Error("Failed to delete tenant");
      }

      await db
        .update(rooms)
        .set({ status: "vacant" })
        .where(eq(rooms.id, roomId));

      return tenantResult[0];
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async unassignTenant(roomId: string, tenantId: string) {
    try {
      const roomOwnerRes = await db
        .select({ ownerId: properties.ownerId })
        .from(rooms)
        .leftJoin(properties, eq(rooms.propertyId, properties.id))
        .where(eq(rooms.id, roomId));
      const tenantOwnerId = roomOwnerRes[0]?.ownerId || null;

      const tenantResult = await db
        .update(tenants)
        .set({
          roomId: null,
          ownerId: tenantOwnerId,
        })
        .where(and(eq(tenants.id, tenantId), eq(tenants.roomId, roomId)))
        .returning();

      if (!tenantResult || tenantResult.length === 0) {
        throw new Error("Failed to unassign tenant");
      }

      await db
        .update(rooms)
        .set({ status: "vacant" })
        .where(eq(rooms.id, roomId))
        .returning();

      return tenantResult;
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async deleteTenantById(tenantId: string, ownerId: string) {
    try {
      const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.id, tenantId),
      });

      if (!tenant) {
        throw new Error("Tenant not found");
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
          throw new Error("Not authorized to delete this tenant");
        }
      }

      const [deleted] = await db
        .delete(tenants)
        .where(eq(tenants.id, tenantId))
        .returning();

      if (!deleted) {
        throw new Error("Failed to delete tenant");
      }

      if (tenant.roomId) {
        await db
          .update(rooms)
          .set({ status: "vacant" })
          .where(eq(rooms.id, tenant.roomId));
      }

      return deleted;
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async getPaymentsByTenant(tenantId: string, ownerId: string) {
    try {
      const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.id, tenantId),
      });

      if (!tenant) {
        throw new Error("Tenant not found");
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
          throw new Error("Not authorized to view this tenant's payments");
        }
      }

      const result = await db
        .select()
        .from(payments)
        .where(eq(payments.tenantId, tenantId))
        .orderBy(desc(payments.year), desc(payments.month));

      return { payments: result };
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
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
    try {
      const now = new Date();
      const month = params.month ?? now.getMonth() + 1;
      const year = params.year ?? now.getFullYear();
      const search = params.search?.trim();
      const statusFilter = params.status;

      const conditions = [
        or(eq(tenants.ownerId, ownerId), eq(properties.ownerId, ownerId)),
        isNotNull(tenants.roomId),
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
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }
}

export const tenantsService = new TenantsService();
