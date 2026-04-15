import { apiClient } from "@/utils/api-connection";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import type {
  CreateExpenseInput,
  ExpenseListRow,
  UpdateExpenseInput,
} from "@/modules/expenses/types/expenses.types";
import { parseExpensesList } from "@/modules/expenses/lib/validate-expense-payload";

function toServiceError(value: unknown, fallback: string): Error {
  return new Error(errorMessageFromUnknown(value, fallback));
}

function unwrapEnvelopeData(raw: unknown): unknown {
  if (raw === null || typeof raw !== "object") return raw;
  const o = raw as Record<string, unknown>;
  if (o.success === false && typeof o.message === "string") {
    throw new Error(o.message);
  }
  if ("data" in o) return o.data;
  return raw;
}

type DynamicExpenseEndpoint = (params: { expenseId: string }) => {
  get: () => Promise<{ data: unknown; error: { value: unknown } | null }>;
  patch: (
    body: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { value: unknown } | null }>;
  delete: (
    opts?: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { value: unknown } | null }>;
};

class ExpensesService {
  async getExpenses(): Promise<ExpenseListRow[]> {
    const response = await apiClient.expenses.owner.get();

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudieron cargar los gastos",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseExpensesList(unwrapped);
  }

  async createExpense(data: CreateExpenseInput): Promise<unknown> {
    const response = await apiClient.expenses.owner.post(data);

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo registrar el gasto",
      );
    }

    return unwrapEnvelopeData(response.data);
  }

  async updateExpense(
    expenseId: string,
    data: UpdateExpenseInput,
  ): Promise<unknown> {
    const byId = apiClient.expenses.owner as unknown as DynamicExpenseEndpoint;
    const response = await byId({ expenseId }).patch(
      data as Record<string, unknown>,
    );

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo actualizar el gasto",
      );
    }

    return unwrapEnvelopeData(response.data);
  }

  async deleteExpense(expenseId: string): Promise<unknown> {
    const byId = apiClient.expenses.owner as unknown as DynamicExpenseEndpoint;
    const response = await byId({ expenseId }).delete({});

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo eliminar el gasto",
      );
    }

    return unwrapEnvelopeData(response.data);
  }
}

export const expensesService = new ExpensesService();
