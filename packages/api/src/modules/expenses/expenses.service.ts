import {
  db,
  eq,
  and,
  gte,
  lte,
  desc,
  count,
  expenses,
  properties,
  rooms,
} from "@reentwise/database";

export type ExpensesListFilters = {
  from?: string;
  to?: string;
  year?: number;
  month?: number;
  propertyId?: string;
  category?: typeof expenses.$inferSelect["category"];
  page?: number;
  limit?: number;
};

export class ExpensesService {
  async getExpensesByOwner(ownerId: string, filters: ExpensesListFilters = {}) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 50;
    const offset = (page - 1) * limit;

    const conditions: ReturnType<typeof and>[] = [eq(expenses.ownerId, ownerId)];

    if (filters.from) {
      conditions.push(gte(expenses.incurredAt, new Date(filters.from)));
    }
    if (filters.to) {
      const toEnd = new Date(filters.to);
      toEnd.setUTCHours(23, 59, 59, 999);
      conditions.push(lte(expenses.incurredAt, toEnd));
    }

    if (!filters.from && !filters.to && filters.year) {
      const y = filters.year;
      const m = filters.month;
      if (m && m >= 1 && m <= 12) {
        const start = new Date(Date.UTC(y, m - 1, 1));
        const end = new Date(Date.UTC(y, m, 1));
        conditions.push(gte(expenses.incurredAt, start));
        conditions.push(lte(expenses.incurredAt, new Date(end.getTime() - 1)));
      } else {
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

    const whereClause = and(...conditions);

    const [rows, totalResult] = await Promise.all([
      db
        .select({ expense: expenses, property: properties, room: rooms })
        .from(expenses)
        .leftJoin(properties, eq(expenses.propertyId, properties.id))
        .leftJoin(rooms, eq(expenses.roomId, rooms.id))
        .where(whereClause)
        .orderBy(desc(expenses.incurredAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(expenses)
        .where(whereClause),
    ]);

    const total = Number(totalResult[0]?.count ?? 0);
    const totalPages = Math.ceil(total / limit);

    return {
      expenses: rows,
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
