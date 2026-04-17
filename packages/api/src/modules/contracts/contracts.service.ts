import {
  db,
  eq,
  and,
  ilike,
  count,
  contracts,
  tenants,
  rooms,
  properties,
} from "@reentwise/database";

export class ContractsService {
  async getContractsByOwner(
    ownerId: string,
    filters: { search?: string; page?: number; limit?: number } = {},
  ) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 50;
    const offset = (page - 1) * limit;

    const conditions = [eq(contracts.ownerId, ownerId)];
    if (filters.search?.trim()) {
      conditions.push(ilike(tenants.name, `%${filters.search.trim()}%`));
    }
    const whereClause = and(...conditions);

    const [rows, totalResult] = await Promise.all([
      db
        .select({
          contract: contracts,
          tenant: { id: tenants.id, name: tenants.name, whatsapp: tenants.whatsapp, email: tenants.email },
          room: { id: rooms.id, roomNumber: rooms.roomNumber },
          property: { id: properties.id, name: properties.name },
        })
        .from(contracts)
        .innerJoin(tenants, eq(contracts.tenantId, tenants.id))
        .innerJoin(rooms, eq(contracts.roomId, rooms.id))
        .innerJoin(properties, eq(rooms.propertyId, properties.id))
        .where(whereClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(contracts)
        .innerJoin(tenants, eq(contracts.tenantId, tenants.id))
        .innerJoin(rooms, eq(contracts.roomId, rooms.id))
        .innerJoin(properties, eq(rooms.propertyId, properties.id))
        .where(whereClause),
    ]);

    const total = Number(totalResult[0]?.count ?? 0);
    const totalPages = Math.ceil(total / limit);

    return {
      contracts: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      },
    };
  }

  async updateContract(
    contractId: string,
    ownerId: string,
    patch: {
      rentAmount?: string;
      paymentDay?: number;
      deposit?: string;
      endsAt?: string | null;
      notes?: string | null;
    },
  ) {
    const updatePayload: Record<string, unknown> = { updatedAt: new Date() };
    if (patch.rentAmount !== undefined) updatePayload.rentAmount = patch.rentAmount;
    if (patch.paymentDay !== undefined) updatePayload.paymentDay = patch.paymentDay;
    if (patch.deposit !== undefined) updatePayload.deposit = patch.deposit;
    if ("endsAt" in patch) updatePayload.endsAt = patch.endsAt ? new Date(patch.endsAt) : null;
    if ("notes" in patch) updatePayload.notes = patch.notes ?? null;

    const [updated] = await db
      .update(contracts)
      .set(updatePayload)
      .where(and(eq(contracts.id, contractId), eq(contracts.ownerId, ownerId)))
      .returning();
    return updated ?? null;
  }

  async getContractById(contractId: string, ownerId: string) {
    const [row] = await db
      .select()
      .from(contracts)
      .where(and(eq(contracts.id, contractId), eq(contracts.ownerId, ownerId)));
    return row ?? null;
  }

  async createContract(
    ownerId: string,
    body: {
      tenantId: string;
      roomId: string;
      rentAmount: string;
      paymentDay: number;
      deposit?: string;
      startsAt: Date;
      endsAt?: Date;
      notes?: string;
    },
  ) {
    const [created] = await db
      .insert(contracts)
      .values({
        ownerId,
        tenantId: body.tenantId,
        roomId: body.roomId,
        rentAmount: body.rentAmount,
        paymentDay: body.paymentDay,
        deposit: body.deposit ?? "0.00",
        startsAt: body.startsAt,
        endsAt: body.endsAt ?? null,
        notes: body.notes,
        status: "draft",
      })
      .returning();
    return created!;
  }

  async activateContract(contractId: string, ownerId: string) {
    const [updated] = await db
      .update(contracts)
      .set({ status: "active", signedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(contracts.id, contractId), eq(contracts.ownerId, ownerId)))
      .returning();
    return updated ?? null;
  }

  async terminateContract(contractId: string, ownerId: string) {
    const [updated] = await db
      .update(contracts)
      .set({
        status: "terminated",
        terminatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(contracts.id, contractId), eq(contracts.ownerId, ownerId)))
      .returning();
    return updated ?? null;
  }

  async setPdfUrl(contractId: string, ownerId: string, pdfUrl: string) {
    const [updated] = await db
      .update(contracts)
      .set({ pdfUrl, updatedAt: new Date() })
      .where(and(eq(contracts.id, contractId), eq(contracts.ownerId, ownerId)))
      .returning();
    return updated ?? null;
  }
}

export const contractsService = new ContractsService();
