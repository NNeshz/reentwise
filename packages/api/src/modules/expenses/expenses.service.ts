import {
  db,
  eq,
  and,
  desc,
  expenses,
  properties,
  rooms,
} from "@reentwise/database";

export class ExpensesService {
  async getExpensesByOwner(ownerId: string) {
    return db
      .select({
        expense: expenses,
        property: properties,
        room: rooms,
      })
      .from(expenses)
      .leftJoin(properties, eq(expenses.propertyId, properties.id))
      .leftJoin(rooms, eq(expenses.roomId, rooms.id))
      .where(eq(expenses.ownerId, ownerId))
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
