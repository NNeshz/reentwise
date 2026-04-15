import {
  db,
  eq,
  and,
  contracts,
  tenants,
  rooms,
  properties,
} from "@reentwise/database";

export class ContractsService {
  async getContractsByOwner(ownerId: string) {
    return db
      .select({
        contract: contracts,
        tenant: tenants,
        room: rooms,
        property: properties,
      })
      .from(contracts)
      .innerJoin(tenants, eq(contracts.tenantId, tenants.id))
      .innerJoin(rooms, eq(contracts.roomId, rooms.id))
      .innerJoin(properties, eq(rooms.propertyId, properties.id))
      .where(eq(contracts.ownerId, ownerId));
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
