import { z } from "zod";
import type { ExpenseListRow, ExpensesListResponse } from "@/modules/expenses/types/expenses.types";

const expenseRowSchema = z.object({
  expense: z.object({
    id: z.string(),
    ownerId: z.string(),
    propertyId: z.string().nullable(),
    roomId: z.string().nullable(),
    category: z.string(),
    amount: z.string(),
    description: z.string().nullable(),
    vendor: z.string().nullable(),
    receiptUrl: z.string().nullable(),
    incurredAt: z.coerce.string().nullable(),
    createdAt: z.coerce.string().nullable(),
    updatedAt: z.coerce.string().nullable(),
  }),
  property: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  room: z
    .object({
      id: z.string(),
      roomNumber: z.string(),
    })
    .nullable(),
});

export function parseExpensesList(data: unknown): ExpenseListRow[] {
  const arr = z.array(expenseRowSchema).parse(data);
  return arr as ExpenseListRow[];
}

const paginationSchema = z.object({
  currentPage: z.number().default(1),
  totalPages: z.number().default(0),
  totalItems: z.number().default(0),
  itemsPerPage: z.number().default(50),
  hasNextPage: z.boolean().default(false),
  hasPreviousPage: z.boolean().default(false),
  nextPage: z.number().nullable().default(null),
  previousPage: z.number().nullable().default(null),
});

const expensesListResponseSchema = z.object({
  expenses: z.array(expenseRowSchema),
  pagination: paginationSchema,
});

export function parseExpensesListResponse(data: unknown): ExpensesListResponse {
  const result = expensesListResponseSchema.parse(data);
  return result as ExpensesListResponse;
}
