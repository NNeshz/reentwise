import {
  db,
  eq,
  and,
  gte,
  lte,
  desc,
  expenses,
  properties,
  rooms,
  sql,
} from "@reentwise/database";

export type ExpensesListFilters = {
  from?: string;
  to?: string;
  year?: number;
  month?: number;
  propertyId?: string;
  category?: typeof expenses.$inferSelect["category"];
};

export class ExpensesService {
  async getExpensesByOwner(ownerId: string, filters: ExpensesListFilters = {}) {
    const conditions: ReturnType<typeof and>[] = [eq(expenses.ownerId, ownerId)];

    // Rango explícito from/to (incluye el día completo en "to")
    if (filters.from) {
      conditions.push(gte(expenses.incurredAt, new Date(filters.from)));
    }
    if (filters.to) {
      const toEnd = new Date(filters.to);
      toEnd.setUTCHours(23, 59, 59, 999);
      conditions.push(lte(expenses.incurredAt, toEnd));
    }

    // Año / mes exacto (generado como rango si no se usó from/to)
    if (!filters.from && !filters.to && filters.year) {
      const y = filters.year;
      const m = filters.month;
      if (m && m >= 1 && m <= 12) {
        // Primer y último día del mes
        const start = new Date(Date.UTC(y, m - 1, 1));
        const end = new Date(Date.UTC(y, m, 1));
        conditions.push(gte(expenses.incurredAt, start));
        conditions.push(lte(expenses.incurredAt, new Date(end.getTime() - 1)));
      } else {
        // Todo el año
        const start = new Date(Date.UTC(y, 0, 1));
        const end = new Date(Date.UTC(y + 1, 0, 1));
        conditions.push(gte(expenses.incurredAt, start));
        conditions.push(lte(expenses.incurredAt, new Date(end.getTime() - 1)));
      }
    }

    if (filters.propertyId) {
      conditions.push(eq(expenses.propertyId, filters.propertyId));
    }
    if (filters.category) {
      conditions.push(eq(expenses.category, filters.category));
    }

    return db
      .select({
        expense: expenses,
        property: properties,
        room: rooms,
      })
      .from(expenses)
      .leftJoin(properties, eq(expenses.propertyId, properties.id))
      .leftJoin(rooms, eq(expenses.roomId, rooms.id))
      .where(and(...conditions))
      .orderBy(desc(expenses.incurredAt));
  }

  async getExpenseById(expenseId: string, ownerId: string) {
    const [row] = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.id, expenseId), eq(expenses.ownerId, ownerId)));
    return row ?? null;
  }

  async createExpense(
    ownerId: string,
    body: {
      propertyId?: string;
      roomId?: string;
      category: "maintenance" | "repair" | "tax" | "insurance" | "utility" | "administration" | "other";
      amount: string;
      description?: string;
      vendor?: string;
      receiptUrl?: string;
      incurredAt?: Date;
    },
  ) {
    const [created] = await db
      .insert(expenses)
      .values({
        ownerId,
        propertyId: body.propertyId ?? null,
        roomId: body.roomId ?? null,
        category: body.category,
        amount: body.amount,
        description: body.description,
        vendor: body.vendor,
        receiptUrl: body.receiptUrl,
        incurredAt: body.incurredAt ?? new Date(),
      })
      .returning();
    return created!;
  }

  async updateExpense(
    expenseId: string,
    ownerId: string,
    patch: Partial<{
      propertyId: string | null;
      roomId: string | null;
      category: "maintenance" | "repair" | "tax" | "insurance" | "utility" | "administration" | "other";
      amount: string;
      description: string | null;
      vendor: string | null;
      receiptUrl: string | null;
      incurredAt: Date;
    }>,
  ) {
    const [updated] = await db
      .update(expenses)
      .set({ ...patch, updatedAt: new Date() })
      .where(and(eq(expenses.id, expenseId), eq(expenses.ownerId, ownerId)))
      .returning();
    return updated ?? null;
  }

  async deleteExpense(expenseId: string, ownerId: string) {
    const [deleted] = await db
      .delete(expenses)
      .where(and(eq(expenses.id, expenseId), eq(expenses.ownerId, ownerId)))
      .returning();
    return deleted ?? null;
  }
}

export const expensesService = new ExpensesService();
